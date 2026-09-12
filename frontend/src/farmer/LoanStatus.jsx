import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from './FarmerDashboard';

const statusConfig = {
  idle:           { label: 'No Application', color: '#64748b', bg: '#f8fafc',  shape: '○', step: 0 },
  applied:        { label: 'Application Submitted - Under Review', color: '#d97706', bg: '#fffbeb', shape: '▲', step: 1 },
  pending:        { label: 'Pending Review',  color: '#d97706', bg: '#fffbeb', shape: '▲', step: 1 },
  approved:       { label: 'Approved',        color: '#16a34a', bg: '#f0fdf4', shape: '●', step: 3 },
  restructuring:  { label: 'Protected Restructuring', color: '#dc2626', bg: '#fef2f2', shape: '■', step: 2 },
};

const TIMELINE_STEPS = [
  { label: 'Application Submitted',      icon: '📋' },
  { label: 'Waiting for Bank Review',    icon: '🏦' },
  { label: 'Decision / Restructuring',   icon: '⚖️' },
  { label: 'Disbursement',               icon: '💸' },
];

export default function LoanStatus() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const { loanStatus, loanRequest, trustScore, disclosedFields } = state;
  const status = statusConfig[loanStatus] || statusConfig.idle;

  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  useEffect(() => {
    if (loanStatus === 'applied' || loanStatus === 'pending') {
      setShowSuccessAnim(true);
      setTimeout(() => setShowSuccessAnim(false), 3000);
    }
  }, []);

  const sharedFields = disclosedFields ? Object.entries(disclosedFields).filter(([, v]) => v).map(([k]) => k) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="Loan Status" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Confetti-like confirmation animation */}
        {showSuccessAnim && (
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '32px', background: 'linear-gradient(135deg, #166534, #15803d)', borderRadius: '20px', color: '#fff' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px', animation: 'bounce 1s infinite' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Request Submitted!</h2>
            <p style={{ color: '#bbf7d0', fontSize: '13px', lineHeight: 1.6 }}>Your loan request has been packaged with your Trust Score and sent to the bank. We'll notify you when there's a decision.</p>
          </div>
        )}

        {/* Status Badge */}
        <div style={{ background: status.bg, border: `2px solid ${status.color}30`, borderRadius: '20px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '14px', background: status.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: status.color, fontWeight: 800, flexShrink: 0 }}>
            {status.shape}
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>CURRENT STATUS</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: status.color }}>{status.label}</div>
          </div>
        </div>

        {/* Loan Summary */}
        {loanRequest && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '18px', marginBottom: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#475569', marginBottom: '14px' }}>📄 Loan Application Summary</div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>₹{loanRequest.amount?.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Amount Requested</div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px' }}>🌱</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginTop: '2px' }}>{loanRequest.purpose}</div>
              </div>
              {trustScore && (
                <div style={{ flex: 1, background: '#f0fdf4', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#15803d' }}>{trustScore.score}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Trust Score</div>
                </div>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px' }}>
              <span style={{ fontWeight: 700 }}>Data shared with bank:</span> {sharedFields.join(', ').replace(/_/g, ' ')}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1.5px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '20px' }}>🗓️ Loan Journey</div>
          {TIMELINE_STEPS.map((step, i) => {
            const isDone = i < status.step;
            const isCurrent = i === status.step;
            return (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: i < 3 ? '20px' : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: isDone ? '#16a34a' : isCurrent ? status.color + '20' : '#f1f5f9', border: `2px solid ${isDone ? '#16a34a' : isCurrent ? status.color : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    {isDone ? <span style={{ color: '#fff', fontSize: '14px' }}>✓</span> : <span style={{ fontSize: '16px' }}>{step.icon}</span>}
                  </div>
                  {i < 3 && <div style={{ width: 2, flex: 1, minHeight: '20px', background: isDone ? '#16a34a' : '#e2e8f0', marginTop: '4px' }}></div>}
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: isDone ? '#0f172a' : isCurrent ? status.color : '#94a3b8' }}>{step.label}</div>
                  {isCurrent && <div style={{ fontSize: '11px', color: status.color, fontWeight: 600, marginTop: '2px' }}>← Current Status</div>}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => navigate('/farmer/dashboard')}
          style={{ width: '100%', height: '50px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
          Back to Dashboard
        </button>

        <style>{`@keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`}</style>
      </div>
    </div>
  );
}
