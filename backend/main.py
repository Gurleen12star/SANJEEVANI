import io
import os
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI(title="SANJEEVANI ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────
# Class labels — alphabetically ordered as ImageFolder would produce
# from the PlantVillage-style dataset used in training.
# These 15 names map exactly to the classifier.1 output neurons.
# ─────────────────────────────────────────────────────────────────
CLASS_LABELS = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy",
]

# Human-readable display names
DISPLAY_NAMES = {
    "Pepper__bell___Bacterial_spot":                    "Pepper – Bacterial Spot",
    "Pepper__bell___healthy":                           "Pepper – Healthy",
    "Potato___Early_blight":                            "Potato – Early Blight",
    "Potato___Late_blight":                             "Potato – Late Blight",
    "Potato___healthy":                                 "Potato – Healthy",
    "Tomato_Bacterial_spot":                            "Tomato – Bacterial Spot",
    "Tomato_Early_blight":                              "Tomato – Early Blight",
    "Tomato_Late_blight":                               "Tomato – Late Blight",
    "Tomato_Leaf_Mold":                                 "Tomato – Leaf Mold",
    "Tomato_Septoria_leaf_spot":                        "Tomato – Septoria Leaf Spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite":      "Tomato – Spider Mites",
    "Tomato__Target_Spot":                              "Tomato – Target Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":            "Tomato – Yellow Leaf Curl Virus",
    "Tomato__Tomato_mosaic_virus":                      "Tomato – Mosaic Virus",
    "Tomato_healthy":                                   "Tomato – Healthy",
}

# Healthy class indices (for computing health score as per the notebook fix)
HEALTHY_INDICES = [i for i, c in enumerate(CLASS_LABELS) if "healthy" in c.lower()]

# Severity config per class
SEVERITY = {
    "Pepper__bell___Bacterial_spot":                {"risk": "High",     "health_range": (30, 45)},
    "Pepper__bell___healthy":                       {"risk": "None",     "health_range": (85, 98)},
    "Potato___Early_blight":                        {"risk": "Medium",   "health_range": (48, 62)},
    "Potato___Late_blight":                         {"risk": "High",     "health_range": (28, 42)},
    "Potato___healthy":                             {"risk": "None",     "health_range": (85, 98)},
    "Tomato_Bacterial_spot":                        {"risk": "High",     "health_range": (32, 48)},
    "Tomato_Early_blight":                          {"risk": "Medium",   "health_range": (45, 60)},
    "Tomato_Late_blight":                           {"risk": "Critical", "health_range": (20, 38)},
    "Tomato_Leaf_Mold":                             {"risk": "Medium",   "health_range": (50, 65)},
    "Tomato_Septoria_leaf_spot":                    {"risk": "Medium",   "health_range": (45, 58)},
    "Tomato_Spider_mites_Two_spotted_spider_mite":  {"risk": "High",     "health_range": (35, 52)},
    "Tomato__Target_Spot":                          {"risk": "Medium",   "health_range": (42, 58)},
    "Tomato__Tomato_YellowLeaf__Curl_Virus":        {"risk": "Critical", "health_range": (18, 35)},
    "Tomato__Tomato_mosaic_virus":                  {"risk": "High",     "health_range": (28, 42)},
    "Tomato_healthy":                               {"risk": "None",     "health_range": (85, 98)},
}

# ─────────────────────────────────────────────────────────────────
# Load trained MobileNetV2 model at startup (not lazily)
# ─────────────────────────────────────────────────────────────────
import torch
import torchvision.models as models
from torchvision import transforms

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml_models", "sanjeevani_crop_health_model.pth")
DEVICE = torch.device("cpu")

def load_model():
    m = models.mobilenet_v2(weights=None)
    m.classifier[1] = torch.nn.Linear(m.last_channel, len(CLASS_LABELS))
    state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
    m.load_state_dict(state_dict)
    m.eval()
    return m

CROP_MODEL = load_model()
print(f"✅ Loaded sanjeevani_crop_health_model.pth — {len(CLASS_LABELS)} classes on {DEVICE}")

# Same transforms used during training
TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ─────────────────────────────────────────────────────────────────
# Anti-Fraud & XAI Helpers
# ─────────────────────────────────────────────────────────────────
import cv2

def analyze_image_authenticity(img_bytes, img_pil):
    """
    Simulates EXIF metadata & Error Level Analysis (ELA) for the demo.
    Flags screenshots, AI-generated images, and Google downloads.
    """
    reasons = []
    
    # 1. Check EXIF (Most phone cameras embed EXIF. Screenshots/web downloads strip it)
    exif = img_pil.getexif()
    has_exif = exif is not None and len(exif) > 0
    if not has_exif:
        reasons.append("Missing camera EXIF metadata (Possible screenshot or web download).")

    # 2. Check for AI Artifacts / Screenshot dimensions
    width, height = img_pil.size
    aspect = max(width, height) / min(width, height)
    # Exact screen aspect ratios (like 16:9, 19.5:9 phone screens) often indicate screenshots
    if aspect > 1.77 and not has_exif:
        reasons.append("Aspect ratio matches device screen rather than camera sensor.")
    
    # 3. Simulate ELA (Error Level Analysis) using variance of compression artifacts
    nparr = np.frombuffer(img_bytes, np.uint8)
    img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img_cv is not None:
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        if laplacian_var < 50:
            reasons.append("Abnormally low noise variance (AI-generated or heavily compressed).")

    is_authentic = len(reasons) == 0
    
    return {
        "is_authentic": is_authentic,
        "fraud_reasons": reasons
    }

# ─────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model": "MobileNetV2-15class", "classes": len(CLASS_LABELS)}


@app.post("/api/crop-health")
async def predict_crop_health(file: UploadFile = File(...)):
    """
    Real MobileNetV2 inference using the trained .pth model.
    Returns predicted_class, confidence, crop_health_score, risk_level, top-5 detections.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    contents = await file.read()
    img_pil_orig = Image.open(io.BytesIO(contents))
    
    # Run Anti-Fraud Check
    auth_report = analyze_image_authenticity(contents, img_pil_orig)

    img = img_pil_orig.convert("RGB")

    tensor = TRANSFORM(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = CROP_MODEL(tensor)
        probs = torch.softmax(logits, dim=1)[0].cpu().numpy()

    top_idx = int(np.argmax(probs))
    raw_class = CLASS_LABELS[top_idx]
    display_class = DISPLAY_NAMES[raw_class]
    confidence = float(probs[top_idx])

    # Health score: probability mass on healthy classes × 100 (notebook method)
    health_prob_sum = float(sum(probs[i] for i in HEALTHY_INDICES))
    # Scale: if top class is healthy, boost; if diseased, use severity range
    sev = SEVERITY[raw_class]
    lo, hi = sev["health_range"]
    if sev["risk"] == "None":
        crop_health_score = int(np.clip(health_prob_sum * 100, lo, hi))
    else:
        # Diseased: health_score inversely proportional to disease confidence
        crop_health_score = int(np.clip(lo + (1 - confidence) * (hi - lo), lo, hi))

    # Top-5 detections
    top5 = np.argsort(probs)[::-1][:5]
    all_detections = [
        {"class": DISPLAY_NAMES[CLASS_LABELS[i]], "probability": round(float(probs[i]), 3)}
        for i in top5
    ]

    return {
        "is_authentic": auth_report["is_authentic"],
        "fraud_reasons": auth_report["fraud_reasons"],
        "predicted_class": display_class,
        "confidence": round(confidence, 3),
        "crop_health_score": crop_health_score,
        "risk_level": sev["risk"],
        "model_used": "mobilenetv2_trained",
        "all_detections": all_detections,
    }
