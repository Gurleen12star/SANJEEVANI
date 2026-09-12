import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';

// Reusable nav bar component
export function FarmerNav({ title }) {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div style={{ width: 1, height: 20, background: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 32, height: 32, background: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>S</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{title || 'SANJEEVANI'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => document.body.classList.toggle('low-power-mode')}
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🔋 Saver
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 36, height: 36, background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#15803d', fontSize: '14px' }}>R</div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Ram Singh</span>
        </div>
      </div>
    </div>
  );
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { state } = useFarmer();
  const { cropScan, vouches, trustScore, loanStatus } = state;

  const isFirstLogin = !cropScan && vouches.length === 0 && !trustScore;

  // Animated trust score counter
  const [displayScore, setDisplayScore] = useState(0);
  const [showXAI, setShowXAI] = useState(false);
  useEffect(() => {
    if (!trustScore) return;
    let current = 0;
    const target = trustScore.score;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [trustScore]);

  const statusConfig = {
    idle: { label: 'No Loan Request', color: '#64748b', bg: '#f8fafc', icon: '○' },
    applied: { label: 'Application Submitted', color: '#d97706', bg: '#fffbeb', icon: '▲' },
    pending: { label: 'Pending Review', color: '#d97706', bg: '#fffbeb', icon: '▲' },
    approved: { label: 'Approved', color: '#16a34a', bg: '#f0fdf4', icon: '●' },
    restructuring: { label: 'Protected Restructuring', color: '#dc2626', bg: '#fef2f2', icon: '■' },
  };
  const status = statusConfig[loanStatus];

  const card = (onClick, icon, title, subtitle, color = '#16a34a') => (
    <button onClick={onClick} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
      <div style={{ width: 48, height: 48, borderRadius: '12px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{subtitle}</div>
      </div>
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#cbd5e1', marginLeft: 'auto', flexShrink: 0 }}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="Dashboard" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        {/* First Login — push to scanner */}
        {isFirstLogin && (
          <div style={{ background: 'linear-gradient(135deg, #166534, #15803d)', borderRadius: '20px', padding: '28px', marginBottom: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>👋</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Welcome, Ram Singh!</h2>
            <p style={{ fontSize: '13px', color: '#bbf7d0', lineHeight: 1.6, marginBottom: '20px' }}>Let's scan your first crop to start building your Trust Score and unlock credit access.</p>
            <button onClick={() => navigate('/farmer/scan')}
              style={{ background: '#fff', color: '#15803d', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
              📷 Scan My Crop Now →
            </button>
          </div>
        )}

        {/* Trust Score Card */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', marginBottom: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Sanjeevani Trust Score</div>
              </div>
              {trustScore ? (
                <>
                  <div style={{ fontSize: '64px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{displayScore}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>out of 100 · <span style={{ color: '#16a34a', fontWeight: 700 }}>{trustScore.risk_band}</span></div>
                </>
              ) : (
                <div style={{ fontSize: '42px', fontWeight: 900, color: '#e2e8f0' }}>—</div>
              )}
            </div>
            {/* Score ring */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#16a34a" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - (trustScore ? trustScore.score : 0) / 100)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#15803d' }}>
                {trustScore ? `${trustScore.score}%` : '?'}
              </div>
            </div>
          </div>

          {/* Vouches */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{vouches.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Vouches</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: cropScan ? '#16a34a' : '#94a3b8' }}>{cropScan ? cropScan.crop_health_score : '—'}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Crop Health</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: status.bg, borderRadius: '10px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: status.color }}>{status.icon}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{status.label}</div>
            </div>
          </div>
          </div>

          {/* Explainable AI (SHAP) Dropdown */}
          {trustScore && (
            <div style={{ marginTop: '16px' }}>
              <button onClick={() => setShowXAI(!showXAI)}
                style={{ width: '100%', background: showXAI ? '#f8fafc' : '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', fontSize: '12px', fontWeight: 700, color: '#475569', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                <span>{showXAI ? 'Hide Analysis' : '🧠 Why this score? (XAI)'}</span>
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'currentColor', transform: showXAI ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M7 10l5 5 5-5z"/></svg>
              </button>

              {showXAI && (
                <div style={{ marginTop: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', animation: 'slideDown 0.2s ease-out' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>AI Feature Impact (SHAP)</div>
                  
                  {/* Simulated SHAP Values */}
                  {[
                    { label: 'Crop Health Scan', value: cropScan ? cropScan.crop_health_score - 50 : -20, desc: cropScan ? 'Recent scan shows healthy crop' : 'Missing health data' },
                    { label: 'FPO Vouches', value: vouches.length * 5, desc: `${vouches.length} community members vouched` },
                    { label: 'Yield History', value: 12, desc: 'Consistent yield last 3 seasons' },
                    { label: 'Local Rainfall', value: -4, desc: 'Slightly below average in your region' },
                  ].map((feat, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{feat.label}</span>
                        <span style={{ fontWeight: 700, color: feat.value >= 0 ? '#16a34a' : '#dc2626' }}>
                          {feat.value >= 0 ? '+' : ''}{feat.value} pts
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 0, bottom: 0, 
                            left: feat.value >= 0 ? '50%' : `calc(50% - ${Math.abs(feat.value)}%)`, 
                            width: `${Math.abs(feat.value)}%`, 
                            background: feat.value >= 0 ? '#16a34a' : '#dc2626', 
                            borderRadius: '3px' }}></div>
                          {/* Center line */}
                          <div style={{ position: 'absolute', top: -2, bottom: -2, left: '50%', width: 2, background: '#cbd5e1' }}></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{feat.desc}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px', fontStyle: 'italic', textAlign: 'center' }}>
                    Sanjeevani uses explainable LightGBM models to ensure fairness.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* How to Improve Score (Dynamic Recommendations) */}
          {trustScore && trustScore.score < 75 && (
            <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '16px', padding: '16px', marginTop: '16px', animation: 'fadeIn 0.3s ease-in' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#b45309' }}>How to Improve Your Score</div>
              </div>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#92400e', fontSize: '12px', lineHeight: 1.6 }}>
                {vouches.length < 3 && <li style={{ marginBottom: '8px' }}><strong>Get more Community Vouches:</strong> Ask FPO members to vouch for you. Each vouch increases trust. (+15 pts)</li>}
                {(!cropScan || cropScan.crop_health_score < 70) && <li style={{ marginBottom: '8px' }}><strong>Update Crop Scan:</strong> Take a fresh, clear photo of your crops to prove current health. (+20 pts)</li>}
                <li style={{ marginBottom: '4px' }}><strong>Pre-Harvest Contract:</strong> Sign a supply contract with your FPO to guarantee market linkage. (+30 pts)</li>
              </ul>
            </div>
          )}

        {/* Loan Status Timeline (if active) */}
        {loanStatus !== 'idle' && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '16px' }}>Loan Status Timeline</div>
            {[
              { label: 'Application Submitted', done: true },
              { label: 'Bank Review', done: loanStatus === 'approved' || loanStatus === 'restructuring' },
              { label: loanStatus === 'restructuring' ? 'Protected Restructuring' : 'Decision', done: loanStatus === 'approved' || loanStatus === 'restructuring' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 2 ? '12px' : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.done ? '#16a34a' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.done ? <span style={{ color: '#fff', fontSize: '14px' }}>✓</span> : <span style={{ color: '#94a3b8', fontSize: '12px' }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: step.done ? '#0f172a' : '#94a3b8' }}>{step.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#475569', marginBottom: '4px' }}>Actions</div>
          {card(() => navigate('/farmer/scan'), '📷', 'Crop Health Scanner', cropScan ? `Last scan: ${cropScan.predicted_class}` : 'Scan your crop to build trust', '#16a34a')}
          {card(() => navigate('/farmer/vouch'), '🤝', 'FPO Vouching', `${vouches.length} community vouch${vouches.length !== 1 ? 'es' : ''} received`, '#7c3aed')}
          {card(() => navigate('/farmer/loan'), '💰', 'Request a Loan', trustScore ? 'Your score is ready — apply now' : 'Complete scan & vouching first', '#0ea5e9')}
          {card(() => navigate('/farmer/status'), '📋', 'Loan Status', `Current: ${status.label}`, '#f59e0b')}
        </div>

        {/* Edit profile note */}
        <div style={{ marginTop: '24px', padding: '14px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>✏️</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Your data is saved & editable</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>All entries are stored locally — tap any section to update</div>
          </div>
        </div>
      </div>
    </div>
  );
}
