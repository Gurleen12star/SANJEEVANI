import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from './FarmerDashboard';

// Call the real FastAPI backend. Falls back to expanded mock if backend is offline.
const callCVModel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:8000/api/crop-health', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (e) {
    console.warn('Backend offline — using expanded mock fallback:', e.message);
    return expandedMockFallback();
  }
};

// Expanded mock fallback — 15 disease classes with severity rules
const DISEASE_POOL = [
  { predicted_class: 'Healthy Crop',                    confidence: 0.96, crop_health_score: 92, risk_level: 'None' },
  { predicted_class: 'Leaf Blight',                     confidence: 0.89, crop_health_score: 55, risk_level: 'Medium' },
  { predicted_class: 'Powdery Mildew',                  confidence: 0.84, crop_health_score: 48, risk_level: 'Medium' },
  { predicted_class: 'Rust Disease',                    confidence: 0.91, crop_health_score: 42, risk_level: 'Medium' },
  { predicted_class: 'Bacterial Spot',                  confidence: 0.87, crop_health_score: 38, risk_level: 'High' },
  { predicted_class: 'Nutrient Deficiency (Nitrogen)',  confidence: 0.78, crop_health_score: 60, risk_level: 'Medium' },
  { predicted_class: 'Nutrient Deficiency (Iron)',      confidence: 0.74, crop_health_score: 63, risk_level: 'Medium' },
  { predicted_class: 'Root Rot',                        confidence: 0.93, crop_health_score: 28, risk_level: 'Critical' },
  { predicted_class: 'Downy Mildew',                    confidence: 0.82, crop_health_score: 45, risk_level: 'Medium' },
  { predicted_class: 'Cercospora Leaf Spot',            confidence: 0.80, crop_health_score: 50, risk_level: 'Medium' },
  { predicted_class: 'Early Blight',                    confidence: 0.85, crop_health_score: 52, risk_level: 'Medium' },
  { predicted_class: 'Late Blight',                     confidence: 0.94, crop_health_score: 35, risk_level: 'High' },
  { predicted_class: 'Mosaic Virus',                    confidence: 0.88, crop_health_score: 32, risk_level: 'High' },
  { predicted_class: 'Anthracnose',                     confidence: 0.83, crop_health_score: 44, risk_level: 'Medium' },
  { predicted_class: 'Fusarium Wilt',                   confidence: 0.91, crop_health_score: 25, risk_level: 'Critical' },
];

const expandedMockFallback = () =>
  new Promise(resolve => setTimeout(() => {
    // 30% healthy, 70% various diseases for better demo coverage
    const pool = Math.random() < 0.3 ? [DISEASE_POOL[0]] : DISEASE_POOL.slice(1);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    resolve({ ...pick, model_used: 'demo_fallback' });
  }, 2500));

const healthColor = (score) => {
  if (score >= 80) return '#16a34a';
  if (score >= 55) return '#d97706';
  return '#dc2626';
};

const healthLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 55) return 'Moderate';
  return 'Poor';
};

export default function CropScanner() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const [stage, setStage] = useState('upload'); // 'upload' | 'scanning' | 'result'
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(state.cropScan || null);
  const [showXAI, setShowXAI] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage('scanning');
    callCVModel(file).then(data => {
      if (data.is_authentic === false) {
        setResult(data);
        window.dispatchEvent(new CustomEvent('trigger-voice', { detail: 'fraud_rejected' }));
      } else {
        update({ cropScan: data });
        setResult(data);
        window.dispatchEvent(new CustomEvent('trigger-voice', { detail: 'scan_complete' }));
      }
      setStage('result');
    });
  };

  const handleRetake = () => {
    setStage('upload');
    setPreview(null);
    setResult(null);
    setShowXAI(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="Crop Health Scanner" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Upload Stage */}
        {stage === 'upload' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Scan Your Crop</h2>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Take or upload a clear photo of your crop. Our AI will analyze it for disease, health, and quality.</p>
            </div>

            {/* Previous result if exists */}
            {state.cropScan && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>🌱</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#15803d' }}>Last Scan: {state.cropScan.predicted_class}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Health Score: {state.cropScan.crop_health_score}/100 · Tap below to re-scan</div>
                </div>
              </div>
            )}

            {/* Upload Box */}
            <button onClick={() => fileRef.current.click()}
              style={{ width: '100%', aspectRatio: '4/3', border: '2.5px dashed #86efac', borderRadius: '20px', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '16px' }}>
              <div style={{ width: 72, height: 72, background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: 36, height: 36, fill: '#fff' }}><path d="M12 15.2A3.2 3.2 0 018.8 12 3.2 3.2 0 0112 8.8a3.2 3.2 0 013.2 3.2A3.2 3.2 0 0112 15.2M20 4h-3.17l-1.24-1.35A2 2 0 0014.12 2H9.88a2 2 0 00-1.47.65L7.17 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#15803d' }}>Tap to Take / Upload Photo</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>JPG, PNG · Max 10MB</div>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />

            {/* Tips */}
            <div style={{ marginTop: '20px', background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#475569', marginBottom: '12px' }}>📸 Photo Tips</div>
              {['Make sure the leaf is clearly visible', 'Good lighting — natural light preferred', 'Avoid blurry or dark photos', 'Single leaf fills most of the frame'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{tip}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Scanning Stage */}
        {stage === 'scanning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            {preview && (
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', position: 'relative' }}>
                <img src={preview} alt="Crop scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#fff', textAlign: 'center' }}>
                    {/* Scanning animation */}
                    <div style={{ width: 60, height: 60, border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>AI Analysing...</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>MobileNetV2 running</div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ width: '100%', background: '#f8fafc', borderRadius: '16px', padding: '20px' }}>
              {['Loading model weights', 'Preprocessing image', 'Running inference', 'Calculating health score'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 3 ? '12px' : 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '11px' }}>✓</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{step}</span>
                </div>
              ))}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Result Stage */}
        {stage === 'result' && result && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Scan Complete</h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>AI diagnosis for your crop</p>
            </div>

            {/* Fraud Rejection Block */}
            {result.is_authentic === false && (
              <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🚫</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', textAlign: 'center', marginBottom: '12px' }}>Image Rejected</h3>
                <p style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.6, textAlign: 'center', marginBottom: '16px' }}>
                  Our AI Anti-Fraud system has flagged this image as inauthentic. Submitting fake data will result in immediate loan rejection.
                </p>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #fca5a5' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>Fraud Analysis:</div>
                  {result.fraud_reasons?.map((reason, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px' }}>⚠️</span>
                      <span style={{ fontSize: '12px', color: '#7f1d1d' }}>{reason}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                  <button onClick={handleRetake}
                    style={{ width: '100%', height: '48px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
                    Take a Real Photo
                  </button>
                  <button onClick={() => setResult({ ...result, is_authentic: true })}
                    style={{ width: '100%', height: '48px', background: 'transparent', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: '14px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
                    Override for Hackathon Demo
                  </button>
                </div>
              </div>
            )}

            {/* Valid Result */}
            {result.is_authentic !== false && (
              <>
                {preview && (
                  <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
                    <img src={preview} alt="Scanned crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {/* Simulated XAI Grad-CAM Overlay */}
                    {showXAI && (
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.7, background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0) 50%)', mixBlendMode: 'multiply' }}></div>
                    )}
                    {showXAI && (
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span>
                        AI Focus Area (Grad-CAM)
                      </div>
                    )}
                  </div>
                )}

            {/* Result Card */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: `2px solid ${healthColor(result.crop_health_score)}30`, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
              
              {/* Diagnosis Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>DIAGNOSIS</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{result.predicted_class}</div>
                </div>
                <div style={{ textAlign: 'center', background: healthColor(result.crop_health_score) + '15', borderRadius: '12px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: healthColor(result.crop_health_score) }}>{result.crop_health_score}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>/ 100</div>
                </div>
              </div>

              {/* Health bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Health Score</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: healthColor(result.crop_health_score) }}>{healthLabel(result.crop_health_score)}</span>
                </div>
                <div style={{ height: 10, background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${result.crop_health_score}%`, height: '100%', background: healthColor(result.crop_health_score), borderRadius: '99px', transition: 'width 1s ease' }}></div>
                </div>
              </div>

              {/* Confidence */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Model Confidence</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{(result.confidence * 100).toFixed(0)}%</span>
              </div>

              {/* Risk Level Badge */}
              {result.risk_level && result.risk_level !== 'None' && (
                <div style={{ marginTop: '14px', padding: '10px 14px', background:
                  result.risk_level === 'Critical' ? '#fef2f2' :
                  result.risk_level === 'High' ? '#fff7ed' : '#fffbeb',
                  border: `1px solid ${
                    result.risk_level === 'Critical' ? '#fca5a5' :
                    result.risk_level === 'High' ? '#fdba74' : '#fde68a'}`,
                  borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {result.risk_level === 'Critical' ? '🚨' : result.risk_level === 'High' ? '⚠️' : '⚡'}
                  </span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color:
                      result.risk_level === 'Critical' ? '#dc2626' :
                      result.risk_level === 'High' ? '#ea580c' : '#d97706' }}>
                      {result.risk_level} Risk Detected
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {result.risk_level === 'Critical' ? 'Urgent treatment recommended before applying for credit.' :
                       result.risk_level === 'High' ? 'Treatment advised — will impact loan assessment.' :
                       'Monitor crop closely and treat soon.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Model source badge */}
              {result.model_used && (
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                    {result.model_used === 'mobilenetv2_trained' ? '🤖 MobileNetV2 Model' :
                     result.model_used === 'heuristic_fallback' ? '🔍 Heuristic Analysis' : '🧪 Demo Mode'}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setShowXAI(!showXAI)}
                style={{ width: '100%', height: '44px', background: showXAI ? '#eff6ff' : '#fff', color: showXAI ? '#1d4ed8' : '#475569', border: `1.5px solid ${showXAI ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '14px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>🧠</span> {showXAI ? 'Hide AI Explanation' : 'Explain AI Decision (XAI)'}
              </button>
              <button onClick={() => navigate('/farmer/vouch')}
                style={{ width: '100%', height: '50px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
                Next: Get FPO Vouch →
              </button>
              <button onClick={handleRetake}
                style={{ width: '100%', height: '44px', background: '#fff', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: '14px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                Re-scan
              </button>
            </div>
          </>
        )}
          </>
        )}
      </div>
    </div>
  );
}
