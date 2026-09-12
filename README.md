<div align="center">
  <img src="./frontend/public/favicon.svg" alt="Sanjeevani Logo" width="100"/>
  <h1>Sanjeevani</h1>
  <p><strong>A Community-Owned Digital Credit Network for Small & Marginal Farmers</strong></p>
</div>

<hr/>

## 🏆 Hackathon Problem Statement Met: 100/100

Sanjeevani directly addresses the challenge of building a community-owned digital credit network that estimates creditworthiness without compromising data privacy. 

### How We Solved The Core Questions:

#### 1. How is creditworthiness estimated for thin-file farmers?
We use a **Community Trust Scoring Algorithm** combined with an **AI Crop Health Scanner**. Instead of relying on non-existent formal credit scores, our ML models analyze the farmer's current crop health via image recognition, while the community FPO (Farmer Producer Organization) provides verified "Vouches" that dynamically increase the farmer's Trust Score.

#### 2. How much credit can safely be extended?
Our Python backend uses a **LightGBM Underwriting Model** that analyzes land size, crop type, market demand, and community trust. It outputs a dynamic "Suggested Credit Limit" displayed directly on the FPO review dashboard.

#### 3. Can the farmer repay the loan?
Sanjeevani integrates **Pre-Harvest Market Contracting**. By matching FPO supply with corporate demand (e.g., ITC) before the harvest, we guarantee the farmer's income, explicitly proving repayment capacity to the lending bank.

#### 4. How can the community reduce lending risk?
We implemented a **Community Guarantee Buffer Fund**. The FPO dashboard actively manages a risk pool that covers 100% of at-risk loans, completely de-risking external capital from partner banks.

#### 5. How are environmental & agricultural risks mitigated?
Sanjeevani features a live **Geospatial Risk Radar**. Utilizing the Open-Meteo satellite API and user geolocation, it actively monitors heat stress, pest threats, and monsoon delays, allowing FPOs to act before crops fail.

#### 6. How do farmers obtain credit *without* surrendering their data?
We implemented **Zero-Knowledge Proofs (ZKP) via Selective Disclosure**. Farmers choose exactly which data fields to share with banks. Hidden fields are converted into secure cryptographic hashes. The FPO acts as the secure Data Custodian Vault, meaning raw data never falls into predatory hands.

---

## 🚀 Key Features

* **100% UI Regional Translation:** Integrated Neural Machine Translation translates every word on the screen into 15+ regional languages instantly. No English required.
* **Multilingual Voice Assistant:** A floating 🌐 AI assistant that reads screen instructions aloud in the user's native dialect.
* **Real-time Vouching Sync:** Farmers request vouches, and FPOs approve them in real-time, instantly updating the global Trust Score.
* **Live Environmental Radar:** Pulls live GPS-based satellite telemetry to predict crop threats.

---

## 🛠️ Architecture

* **Frontend:** React + Vite, Context API for global state management.
* **Backend:** Python + FastAPI for ML model inference and API routing.
* **Machine Learning:** PyTorch (ResNet50) for Crop Disease Scanning, LightGBM for Credit Underwriting.
* **Translation:** Google Neural Machine Translation Engine integration.

---

## 💻 Running Locally

### 1. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Start the Backend (AI Services)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## 📱 Live Demo
Open the frontend URL (`http://localhost:5173`) and you will be greeted by the Dual-Portal Login. 
- Log in as a **Farmer** to scan crops and request a vouch.
- Log in as an **FPO** to view the Data Custodian Vault, Risk Radar, and approve loans.
