import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from './FarmerDashboard';

// Mock vouches available to request
const FPO_MEMBERS = [
  { id: 1, name: 'Priya Sharma', role: 'FPO Secretary', fpoId: 'FPO-001' },
  { id: 2, name: 'Deepak Verma', role: 'FPO Chairman', fpoId: 'FPO-001' },
  { id: 3, name: 'Kavitha Rao', role: 'FPO Member', fpoId: 'FPO-002' },
];

export default function FPOVouching() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const [vouches, setVouches] = useState(state.vouches || []);
  const [requesting, setRequesting] = useState(null); // id of pending request
  const [displayScore, setDisplayScore] = useState(state.trustScore?.score || 0);
  const [scoreFlash, setScoreFlash] = useState(false);

  // Animate trust score on new vouch
  const animateScoreTo = (target) => {
    const start = displayScore;
    const diff = target - start;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplayScore(Math.round(start + diff * (step / 20)));
      if (step >= 20) { clearInterval(timer); setDisplayScore(target); }
    }, 40);
    setScoreFlash(true);
    setTimeout(() => setScoreFlash(false), 1500);
  };

  const handleRequestVouch = (member) => {
    setRequesting(member.id);
    update({ pendingVouchRequest: true });
    
    // HACKATHON DEMO MODE: Auto-approve after 2.5s so they don't have to switch to the FPO portal
    setTimeout(() => {
      const newVouch = {
        name: member.name,
        fpoId: member.fpoId,
        date: new Date().toLocaleDateString('en-GB')
      };
      
      const newTrustScore = {
        score: Math.min(100, (state.trustScore?.score || 50) + 15),
        risk_band: 'Low',
        shap_features: [...(state.trustScore?.shap_features || []), 'FPO Vouch Confirmed (+15)']
      };

      update({ 
        vouches: [...state.vouches, newVouch],
        trustScore: newTrustScore,
        pendingVouchRequest: false 
      });
      setRequesting(null);
    }, 2500);
  };

  // Sync local vouches with global context and auto-stop 'requesting' if vouch is received
  useEffect(() => {
    if (state.vouches.length > vouches.length) {
      // A new vouch arrived from the FPO side!
      setVouches(state.vouches);
      animateScoreTo(state.trustScore?.score || displayScore);
      setRequesting(null);
    }
  }, [state.vouches, state.trustScore]);

  const alreadyVouched = (member) => vouches.some(v => v.fpoId === member.fpoId && v.name === member.name);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="FPO Vouching" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Community Vouching</h2>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Request vouches from trusted FPO members. Each vouch increases your Trust Score and strengthens your loan application.</p>
        </div>

        {/* Live Score Counter */}
        <div style={{ background: scoreFlash ? 'linear-gradient(135deg, #166534, #15803d)' : '#fff', borderRadius: '20px', padding: '24px', marginBottom: '20px', textAlign: 'center', border: '2px solid', borderColor: scoreFlash ? '#86efac' : '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', transition: 'all 0.4s ease' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: scoreFlash ? '#bbf7d0' : '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Trust Score</div>
          <div style={{ fontSize: '64px', fontWeight: 900, color: scoreFlash ? '#fff' : '#0f172a', lineHeight: 1, transition: 'all 0.3s' }}>{displayScore || '—'}</div>
          <div style={{ fontSize: '13px', color: scoreFlash ? '#86efac' : '#64748b', marginTop: '4px' }}>
            {vouches.length > 0 ? `Boosted by ${vouches.length} vouch${vouches.length > 1 ? 'es' : ''}` : 'Add vouches to increase your score'}
          </div>
        </div>

        {/* Received Vouches */}
        {vouches.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1.5px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '14px' }}>✅ Received Vouches</div>
            {vouches.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < vouches.length - 1 ? '12px' : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#15803d', fontSize: '16px' }}>
                  {v.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{v.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{v.fpoId} · {v.date}</div>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>Vouched</div>
              </div>
            ))}
          </div>
        )}

        {/* Request Vouches from Members */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1.5px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '14px' }}>🤝 Request from FPO Members</div>
          {FPO_MEMBERS.map(member => {
            const vouched = alreadyVouched(member);
            const isLoading = requesting === member.id;
            return (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#7c3aed20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#7c3aed', fontSize: '16px' }}>
                  {member.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{member.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{member.role}</div>
                </div>
                <button
                  onClick={() => !vouched && !isLoading && handleRequestVouch(member)}
                  disabled={vouched || isLoading}
                  style={{
                    padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: vouched || isLoading ? 'default' : 'pointer', border: 'none',
                    background: vouched ? '#f0fdf4' : isLoading ? '#fef3c7' : '#7c3aed',
                    color: vouched ? '#15803d' : isLoading ? '#d97706' : '#fff',
                    minWidth: '80px', transition: 'all 0.2s'
                  }}>
                  {vouched ? '✓ Vouched' : isLoading ? (state.pendingVouchRequest ? 'Waiting for FPO…' : 'Waiting…') : 'Request'}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => navigate('/farmer/loan')}
            style={{ width: '100%', height: '50px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
            Next: Request a Loan →
          </button>
          <button onClick={() => navigate('/farmer/dashboard')}
            style={{ width: '100%', height: '44px', background: '#fff', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: '14px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
