import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from './FarmerDashboard';

const PURPOSES = [
  { id: 'seeds', emoji: '🌱', label: 'Seeds & Saplings' },
  { id: 'equipment', emoji: '🚜', label: 'Farm Equipment' },
  { id: 'irrigation', emoji: '💧', label: 'Irrigation Setup' },
  { id: 'fertilizer', emoji: '🧪', label: 'Fertilizer & Pesticide' },
  { id: 'storage', emoji: '🏚️', label: 'Storage & Warehouse' },
  { id: 'other', emoji: '📦', label: 'Other' },
];

export default function LoanRequest() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const [amount, setAmount] = useState(state.loanRequest?.amount || '');
  const [purpose, setPurpose] = useState(state.loanRequest?.purpose || '');
  const [amountError, setAmountError] = useState('');

  const handleAmount = (e) => {
    const v = e.target.value.replace(/\D/g, '');
    setAmount(v);
    if (Number(v) < 5000) setAmountError('Minimum loan amount is ₹5,000');
    else if (Number(v) > 500000) setAmountError('Maximum loan amount is ₹5,00,000');
    else setAmountError('');
  };

  const handleNext = () => {
    if (!amount || amountError || !purpose) return;
    update({ loanRequest: { amount: Number(amount), purpose } });
    navigate('/farmer/disclose');
  };

  const isValid = amount && !amountError && purpose;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="Loan Request" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Request a Loan</h2>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Enter how much credit you need and what it's for. Keep it simple — we'll handle the rest.</p>
        </div>

        {/* Trust Score reminder */}
        {state.trustScore && (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '16px', flexShrink: 0 }}>
              {state.trustScore.score}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#15803d' }}>Your Trust Score: {state.trustScore.score}/100</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Risk band: {state.trustScore.risk_band}</div>
            </div>
          </div>
        )}

        {/* Loan Amount */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Loan Amount (₹)</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, fontSize: '18px', color: '#15803d' }}>₹</div>
            <input
              type="tel"
              value={amount ? Number(amount).toLocaleString('en-IN') : ''}
              onChange={handleAmount}
              placeholder="0"
              style={{ width: '100%', height: '60px', paddingLeft: '40px', paddingRight: '16px', border: `2px solid ${amountError ? '#dc2626' : '#e2e8f0'}`, borderRadius: '14px', fontSize: '24px', fontWeight: 800, color: '#0f172a', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {amountError && <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600, marginTop: '6px' }}>{amountError}</div>}
          {/* Quick amount chips */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            {[10000, 25000, 50000, 100000].map(v => (
              <button key={v} onClick={() => { setAmount(String(v)); setAmountError(''); }}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid #e2e8f0', background: amount == v ? '#f0fdf4' : '#fff', color: amount == v ? '#15803d' : '#64748b', fontWeight: 700, fontSize: '12px', cursor: 'pointer', borderColor: amount == v ? '#86efac' : '#e2e8f0' }}>
                ₹{(v/1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Loan Purpose</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {PURPOSES.map(p => (
              <button key={p.id} onClick={() => setPurpose(p.id)}
                style={{ padding: '14px', borderRadius: '14px', border: `2px solid ${purpose === p.id ? '#16a34a' : '#e2e8f0'}`, background: purpose === p.id ? '#f0fdf4' : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{p.emoji}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: purpose === p.id ? '#15803d' : '#475569' }}>{p.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleNext} disabled={!isValid}
          style={{ width: '100%', height: '52px', background: isValid ? '#16a34a' : '#e2e8f0', color: isValid ? '#fff' : '#94a3b8', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '15px', cursor: isValid ? 'pointer' : 'default', transition: 'all 0.2s' }}>
          Next: Choose What to Share →
        </button>
      </div>
    </div>
  );
}
