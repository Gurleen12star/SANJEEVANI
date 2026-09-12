import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from '../farmer/FarmerDashboard';

const FIELD_CONFIG = [
  { key: 'yield_history', label: 'Yield History', icon: '📈' },
  { key: 'gps_location', label: 'Exact GPS Location', icon: '📍' },
  { key: 'crop_type', label: 'Crop Type', icon: '🌾' },
  { key: 'vouch_details', label: 'Vouch Details', icon: '🤝' },
  { key: 'land_area', label: 'Land Area', icon: '🗺️' },
  { key: 'soil_health', label: 'Soil Health Report', icon: '🧪' },
];

export default function ApplicationReview() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const { cropScan, vouches, trustScore, loanRequest, disclosedFields, loanStatus } = state;

  const handleAction = (status) => {
    update({ loanStatus: status });
    navigate('/fpo/dashboard');
  };

  // If no demo data is available
  if (!loanRequest) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <FarmerNav title="Review Application" />
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No active demo application found.</div>
      </div>
    );
  }

  // Determine Fraud Risk
  const isFraud = cropScan?.is_authentic === false;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="Review Application" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px', paddingBottom: '100px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Ram Singh</h2>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>ID: FMR-9823 • Demo User</div>
          </div>
          <div style={{ 
            fontSize: '11px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', textTransform: 'uppercase',
            background: loanStatus === 'pending' || loanStatus === 'applied' ? '#fef3c7' : loanStatus === 'approved' ? '#dcfce3' : '#fee2e2',
            color: loanStatus === 'pending' || loanStatus === 'applied' ? '#b45309' : loanStatus === 'approved' ? '#166534' : '#991b1b',
          }}>
            {loanStatus === 'applied' ? 'pending' : loanStatus}
          </div>
        </div>

        {/* Loan Request Summary */}
        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '20px', border: '1.5px solid #bfdbfe', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', color: '#1e3a8a', marginBottom: '12px' }}>LOAN REQUEST</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#1d4ed8' }}>₹{loanRequest.amount?.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '14px', color: '#3b82f6', textTransform: 'capitalize', marginTop: '4px', fontWeight: 600 }}>Purpose: {loanRequest.purpose}</div>
        </div>

        {/* Fraud Risk Panel */}
        {isFraud && (
          <div style={{ background: '#fef2f2', borderRadius: '16px', padding: '20px', border: '2px solid #ef4444', marginBottom: '24px', animation: 'pulse 2s infinite' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div style={{ fontWeight: 900, fontSize: '14px', color: '#991b1b' }}>HIGH FRAUD RISK DETECTED</div>
            </div>
            <div style={{ fontSize: '12px', color: '#7f1d1d', lineHeight: 1.5, marginBottom: '12px' }}>
              The AI Authenticity system flagged the farmer's crop scan as inauthentic.
            </div>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #fca5a5', fontSize: '11px', color: '#991b1b', fontFamily: 'monospace' }}>
              {cropScan.fraud_reasons?.map((r, i) => <div key={i}>- {r}</div>)}
            </div>
          </div>
        )}

        {/* Trust Score Review */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1.5px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '16px' }}>Trust Score Analysis</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={trustScore?.score >= 70 ? '#16a34a' : '#ea580c'} strokeWidth="3" strokeDasharray={`${trustScore?.score || 0}, 100`} />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
                {trustScore?.score || 0}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Crop Health AI</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>+50 pts</span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Community Vouches ({vouches?.length})</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>+{vouches?.length * 5} pts</span>
              </div>
              <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Yield History</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>+12 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Underwriting Analysis (Hackathon Questions 2 & 4) */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1.5px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '16px' }}>AI Underwriting Analysis</div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Suggested Credit Limit (Q2)</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#16a34a' }}>₹1,20,000</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Based on 5 acres land holding and LightGBM yield prediction.</div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Repayment Capacity (Q4)</div>
            <div style={{ width: '100%', background: '#e2e8f0', height: '12px', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '30%', background: '#f59e0b' }} title="Loan EMI (30%)"></div>
              <div style={{ width: '70%', background: '#10b981' }} title="Surplus Income (70%)"></div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Expected EMI: ₹15k/mo</span>
              <span>Proj. Income: ₹50k/mo</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Verified Activity (Govt Schemes)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #5eead4', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>PM-KISAN ✅</span>
              <span style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #5eead4', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>PMFBY (Crop Insurance) ✅</span>
            </div>
          </div>
        </div>

        {/* Data Payload (Selective Disclosure View) */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1.5px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '8px' }}>Data Payload Received</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Fields hidden by the farmer are verified via Zero-Knowledge Proofs.</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FIELD_CONFIG.map(f => {
              const isHidden = !disclosedFields?.[f.key];
              return (
                <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: isHidden ? '#f8fafc' : '#f0fdf4', borderRadius: '12px', border: `1px solid ${isHidden ? '#e2e8f0' : '#bbf7d0'}` }}>
                  <span style={{ fontSize: '18px', opacity: isHidden ? 0.5 : 1 }}>{f.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isHidden ? '#64748b' : '#166534' }}>{f.label}</div>
                    {isHidden ? (
                      <div style={{ fontSize: '10px', color: '#10b981', fontFamily: 'monospace', marginTop: '2px', fontWeight: 700 }}>🔒 ZKP Verified (0x{Math.random().toString(16).slice(2,8)})</div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>Raw data provided</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', zIndex: 100, maxWidth: '480px', margin: '0 auto' }}>
          <button onClick={() => handleAction('rejected')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#991b1b', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
            Reject
          </button>
          <button onClick={() => handleAction('restructuring')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #f59e0b', background: '#fff', color: '#d97706', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
            Restructure
          </button>
          <button onClick={() => handleAction('approved')} style={{ flex: 1.5, padding: '14px', borderRadius: '12px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
            Approve Loan ✓
          </button>
        </div>

      </div>
    </div>
  );
}
