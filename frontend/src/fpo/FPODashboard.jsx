import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from '../farmer/FarmerDashboard';

export default function FPODashboard() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const { loanStatus, loanRequest, trustScore, pendingVouchRequest, cropScan } = state;

  const handleApproveVouch = () => {
    // 1. Add to vouches array
    const updatedVouches = [...(state.vouches || []), { name: 'FPO Chairman', fpoId: 'FPO-001', date: new Date().toLocaleDateString('en-IN') }];
    // 2. Increment score
    const currentScore = trustScore?.score || 55;
    const newScore = Math.min(currentScore + 15, 100);
    // 3. Clear pending flag and set toast
    update({
      vouches: updatedVouches,
      trustScore: { ...trustScore, score: newScore },
      pendingVouchRequest: false,
      latestToast: { message: 'Community Vouch Approved', amount: 15, reason: 'FPO confirmed farmer identity.', timestamp: Date.now() }
    });
  };

  // --- Live Data Integration ---
  const [contractState, setContractState] = useState('idle'); // idle | loading | secured
  const [weather, setWeather] = useState({ loading: true, temp: null, wind: null, error: null, risk: null });

  useEffect(() => {
    // 1. Get real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          // 2. Fetch live Open-Meteo weather (No API key needed)
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
            .then(res => res.json())
            .then(data => {
              const current = data.current_weather;
              let risk = 'Optimal Conditions ✅';
              if (current.temperature > 35) risk = 'Heat Stress Risk ⚠️';
              if (current.windspeed > 25) risk = 'Crop Damage Risk ⚠️';
              if (current.temperature < 10) risk = 'Frost Risk ⚠️';

              setWeather({
                loading: false,
                temp: current.temperature,
                wind: current.windspeed,
                risk: risk,
                error: null
              });
            })
            .catch(err => setWeather({ loading: false, error: 'Failed to load live data', risk: 'Unknown' }));
        },
        (err) => {
          setWeather({ loading: false, error: 'Location denied', risk: 'N/A' });
        }
      );
    } else {
      setWeather({ loading: false, error: 'No Geolocation', risk: 'N/A' });
    }
  }, []);

  const handleAcceptContract = () => {
    setContractState('loading');
    setTimeout(() => setContractState('secured'), 1500);
  };

  // Dynamic Dates for Ledger
  const getDynamicDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };
  const yesterday = getDynamicDate(1);
  const lastWeek = getDynamicDate(5);
  // ------------------------------

  const mockQueue = [
    { id: 'app-ram', name: 'Ram Singh', status: loanStatus, amount: loanRequest?.amount || 50000, score: trustScore?.score || 'N/A', isDemoUser: true },
    { id: 'app-102', name: 'Sunil Kumar', status: 'approved', amount: 35000, score: 72, isDemoUser: false },
    { id: 'app-103', name: 'Anita Devi', status: 'pending', amount: 80000, score: 88, isDemoUser: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="FPO Portal" />
      
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>FPO Dashboard</h2>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Review incoming applications and manage community trust metrics.</p>
        </div>

        {/* Secure Data Vault Banner (Stage 6) */}
        <div style={{ background: '#f0fdfa', border: '1px solid #5eead4', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#115e59' }}>Secure FPO Data Custodian Vault</div>
            <div style={{ fontSize: '11px', color: '#0f766e', marginTop: '2px' }}>Holding 100% encrypted datasets. ZKP sharing enabled.</div>
          </div>
        </div>

        {/* Pending Vouch Requests (Stage 3 & 4) */}
        {pendingVouchRequest && (
          <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '16px', padding: '16px', marginBottom: '24px', animation: 'pulse 2s infinite' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '12px' }}>Pending Vouch Request</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#b45309' }}>R</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400e' }}>Ram Singh</div>
                  <div style={{ fontSize: '12px', color: '#b45309' }}>Crop Health: {cropScan?.crop_health_score || 'N/A'}</div>
                </div>
              </div>
              <button onClick={handleApproveVouch} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
                Vouch (Yes)
              </button>
            </div>
          </div>
        )}

        {/* 1. Community Risk Pool (De-risking the Bank) */}
        <div style={{ background: '#1e293b', borderRadius: '20px', padding: '20px', color: '#fff', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, fontSize: '100px', opacity: 0.1 }}>🛡️</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Community Risk Buffer</div>
          <div style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px' }}>₹5,00,000</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
            <span>Fund Utilization</span>
            <span style={{ color: '#34d399' }}>Healthy (12%)</span>
          </div>
          <div style={{ width: '100%', background: '#334155', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '12%', background: '#34d399', height: '100%' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', lineHeight: 1.4 }}>
            This pool guarantees 100% of at-risk loans, completely de-risking external capital.
          </div>
        </div>

        {/* 2x2 Grid for Market & Env Risk */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          
          {/* 2. Market Linkage */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>🤝</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Market Demand</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>ITC (Wheat)</div>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>50 Tonnes Reqd.</div>
            <div style={{ flex: 1 }}></div>
            {contractState === 'secured' ? (
              <div style={{ background: '#dcfce3', color: '#166534', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textAlign: 'center', marginTop: '12px' }}>
                Contract Secured ✅
              </div>
            ) : (
              <button 
                onClick={handleAcceptContract}
                disabled={contractState === 'loading'}
                style={{ width: '100%', background: contractState === 'loading' ? '#94a3b8' : '#0f172a', color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, border: 'none', marginTop: '12px', cursor: 'pointer' }}>
                {contractState === 'loading' ? 'Securing...' : 'Accept Contract'}
              </button>
            )}
          </div>

          {/* 3. Env Risk Radar (Live API) */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>🛰️</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Live Risk Radar</div>
              {weather.loading && <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 700, animation: 'pulse 1s infinite' }}>Loading Satellite...</div>}
            </div>
            
            {weather.error && !weather.loading ? (
              <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>{weather.error} (Enable Location)</div>
            ) : (
              <>
                <div style={{ fontSize: '13px', fontWeight: 800, color: weather.risk?.includes('✅') ? '#16a34a' : '#b45309', marginTop: '4px' }}>
                  {weather.risk || 'Analyzing...'}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <div style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                    🌡️ {weather.temp !== null ? `${weather.temp}°C` : '--'}
                  </div>
                  <div style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                    💨 {weather.wind !== null ? `${weather.wind} km/h` : '--'}
                  </div>
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase' }}>Source: Open-Meteo Telemetry</div>
              </>
            )}
          </div>
          
        </div>

        {/* Application Queue */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>Application Queue</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '4px 8px', borderRadius: '6px' }}>3 Pending</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockQueue.map(app => {
              const isDemoActive = app.isDemoUser && app.status !== 'idle' && app.status !== undefined;
              if (app.isDemoUser && (app.status === 'idle' || !app.status)) return null; 

              return (
                <div key={app.id} 
                     onClick={() => app.isDemoUser ? navigate('/fpo/review/demo') : alert('Mock data for demo purposes.')}
                     style={{ 
                       background: isDemoActive ? '#f8fafc' : '#fff', 
                       border: `1.5px solid ${isDemoActive ? '#cbd5e1' : '#f1f5f9'}`, 
                       borderRadius: '14px', 
                       padding: '16px', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'space-between',
                       cursor: 'pointer',
                       transition: 'all 0.2s',
                       boxShadow: isDemoActive ? 'inset 4px 0 0 #3b82f6' : 'none'
                     }}>
                  
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {app.name} 
                      {app.isDemoUser && <span style={{ fontSize: '9px', background: '#1d4ed8', color: '#fff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Demo</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Req: ₹{app.amount?.toLocaleString('en-IN')} • Score: {app.score}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px',
                      background: app.status === 'pending' || app.status === 'applied' ? '#fef3c7' : app.status === 'approved' ? '#dcfce3' : '#fee2e2',
                      color: app.status === 'pending' || app.status === 'applied' ? '#b45309' : app.status === 'approved' ? '#166534' : '#991b1b',
                    }}>
                      {app.status === 'applied' ? 'pending' : app.status}
                    </div>
                  </div>

                </div>
              );
            })}

            {(!loanStatus || loanStatus === 'idle') && (
               <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                 Waiting for the farmer to submit their loan application...
               </div>
            )}
          </div>
        </div>

        {/* 4. Community Repayment Ledger */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginTop: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', marginBottom: '16px' }}>Community Repayment Ledger</div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#16a34a' }}>0</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Defaults (6mo)</div>
            </div>
            <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>3</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>EMIs Due Next Wk</div>
            </div>
          </div>

          {/* Ledger List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[{name: 'Ramesh K.', date: yesterday, status: 'Paid On Time', c: '#16a34a'}, {name: 'Sunita P.', date: lastWeek, status: 'Paid On Time', c: '#16a34a'}].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i !== 0 ? '1px solid #f1f5f9' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Paid: {item.date}</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: item.c, background: '#dcfce3', padding: '4px 8px', borderRadius: '6px' }}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
