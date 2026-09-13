import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../context/FarmerContext';
import { FarmerNav } from './FarmerDashboard';

const FIELD_CONFIG = [
  { key: 'yield_history', label: 'Yield History', icon: '📈', desc: 'Crop production data from last 3 seasons' },
  { key: 'gps_location', label: 'Exact GPS Location', icon: '📍', desc: 'Precise farm coordinates (±10m accuracy)' },
  { key: 'crop_type', label: 'Crop Type', icon: '🌾', desc: 'Current and planned crop variety' },
  { key: 'vouch_details', label: 'Vouch Details', icon: '🤝', desc: 'Names and FPO IDs of your vouchers' },
  { key: 'land_area', label: 'Land Area', icon: '🗺️', desc: 'Total cultivated land area in acres' },
  { key: 'soil_health', label: 'Soil Health Report', icon: '🧪', desc: 'Soil NPK and pH test results' },
];

export default function SelectiveDisclosure() {
  const navigate = useNavigate();
  const { state, update } = useFarmer();
  const [fields, setFields] = useState(state.disclosedFields || {
    yield_history: true, gps_location: false, crop_type: true, vouch_details: true, land_area: false, soil_health: true
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBankView, setIsBankView] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encStep, setEncStep] = useState(0);
  const [manualEntryMode, setManualEntryMode] = useState(false);

  const toggle = (key) => {
    if (isBankView) return; // Disable toggle in bank view
    setFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sharedCount = Object.values(fields).filter(Boolean).length;
  const hiddenCount = FIELD_CONFIG.length - sharedCount;

  const handleSubmit = () => {
    // Start ZKP Encryption Animation
    setIsEncrypting(true);
    window.dispatchEvent(new CustomEvent('trigger-voice', { detail: 'zkp_encrypting' }));
    
    // Simulate terminal steps
    const steps = [0, 1, 2, 3, 4];
    steps.forEach((step, index) => {
      setTimeout(() => setEncStep(step), index * 600);
    });

    // Finish and route
    setTimeout(() => {
      update({ disclosedFields: fields, loanStatus: 'applied' });
      window.dispatchEvent(new CustomEvent('trigger-voice', { detail: 'loan_submitted' }));
      navigate('/farmer/status');
    }, 3200);
  };

  if (isEncrypting) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: '#10b981', fontFamily: 'monospace', padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '20px' }}>🔐 Securing Payload</h2>
        <div style={{ fontSize: '14px', lineHeight: 2, opacity: 0.9 }}>
          {encStep >= 0 && <div>&gt; Initializing Zero-Knowledge Proof...</div>}
          {encStep >= 1 && <div>&gt; Hashing PII data... <span style={{color: '#fff'}}>SHA-256 [OK]</span></div>}
          {encStep >= 2 && <div>&gt; Redacting hidden fields from Bank View...</div>}
          {encStep >= 3 && <div>&gt; Generating verifiable cryptographic claim...</div>}
          {encStep >= 4 && <div style={{ color: '#3b82f6', marginTop: '12px' }}>✓ Smart Contract Executed. Forwarding to Bank...</div>}
        </div>
        <div style={{ marginTop: '40px', width: '100%', height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${(encStep / 4) * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.5s linear' }}></div>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <FarmerNav title="Confirm Submission" />
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Confirm Your Choices</h2>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Review exactly what you are sharing and hiding before submitting to the bank.</p>
          </div>

          {/* View Toggle */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '6px', display: 'flex', marginBottom: '24px', border: '1.5px solid #e2e8f0' }}>
            <button onClick={() => setIsBankView(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: !isBankView ? '#1e293b' : 'transparent', color: !isBankView ? '#fff' : '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>Farmer's View</button>
            <button onClick={() => setIsBankView(true)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: isBankView ? '#1e293b' : 'transparent', color: isBankView ? '#fff' : '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>Bank's View</button>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderBottom: '1.5px solid #e2e8f0', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              {isBankView ? "What the Bank sees:" : "Your Data Payload:"}
            </div>
            <div style={{ padding: '16px' }}>
              {FIELD_CONFIG.map(f => {
                const isHidden = !fields[f.key];
                return (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: isBankView && isHidden ? 0.6 : 1 }}>
                    <span style={{ fontSize: '20px' }}>{f.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{f.label}</div>
                      {isBankView && isHidden ? (
                        <div style={{ fontSize: '11px', color: '#10b981', fontFamily: 'monospace', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>🔒 ZKP Verified (0x{Math.random().toString(16).slice(2,8)})</div>
                      ) : (
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{f.desc}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Access Logs Demo */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px dashed #cbd5e1', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>Recent Access Logs</div>
            <div style={{ fontSize: '12px', color: '#0f172a', marginBottom: '6px' }}><span style={{ color: '#16a34a' }}>●</span> Sanjeevani ML Model (Trust Score) - Today 08:30 AM</div>
            <div style={{ fontSize: '12px', color: '#0f172a' }}><span style={{ color: '#16a34a' }}>●</span> FPO Officer (Vouch Request) - Yesterday 14:15 PM</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleSubmit}
              style={{ width: '100%', height: '52px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
              Submit Loan Request ✓
            </button>
            <button onClick={() => { setShowConfirm(false); setIsBankView(false); }}
              style={{ width: '100%', height: '44px', background: '#fff', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: '14px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              ← Edit Choices
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <FarmerNav title="Selective Disclosure" />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>

        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Protect Your Identity</h2>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>Choose what the bank can see. Turn off a switch to <strong>Hide from Bank</strong>. Hidden fields stay completely private.</p>
        </div>

        {/* Disclaimer & Manual Entry Mode */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px' }}>ℹ️</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>Data Collection Notice</div>
              <div style={{ fontSize: '11px', color: '#1e40af', lineHeight: 1.5, marginBottom: '10px' }}>
                We automatically extract this data from your uploaded crop image and GPS metadata for convenience.
              </div>
              <button onClick={() => setManualEntryMode(!manualEntryMode)}
                style={{ background: manualEntryMode ? '#1d4ed8' : '#fff', color: manualEntryMode ? '#fff' : '#1d4ed8', border: '1px solid #1d4ed8', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                {manualEntryMode ? 'Using Manual Entry' : 'Add Data Manually Instead'}
              </button>
            </div>
          </div>
        </div>

        {manualEntryMode && (
          <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '16px', marginBottom: '24px', animation: 'slideDown 0.2s ease-out' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Manual Entry Mode Active</div>
            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>Please fill in all details manually and upload supporting documents for bank verification.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <input type="text" placeholder="Enter Farm Location (GPS/Address)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Enter Crop Type" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Enter Est. Yield (Quintals)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Enter Land Ownership Details" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Enter Aadhaar Number" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Enter Bank History / Account Info" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🚀</span> High-Trust Alternative Data
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', padding: '12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>PM-KISAN DBT ID (+20 Trust Score)</div>
                <input type="text" placeholder="Enter 12-digit PM-KISAN ID" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>e-NWR Warehouse Receipt (+30 Trust Score)</div>
                <input type="text" placeholder="Enter e-NWR Collateral ID" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Upload Verification Documents</div>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ fontSize: '11px', color: '#64748b', width: '100%' }} />
            </div>
          </div>
        )}

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px' }}>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#15803d' }}>{sharedCount}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Showing Bank</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '12px' }}>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#c2410c' }}>{hiddenCount}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Protected (Hidden)</div>
          </div>
        </div>

        {/* Field Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', opacity: manualEntryMode ? 0.5 : 1, pointerEvents: manualEntryMode ? 'none' : 'auto' }}>
          {FIELD_CONFIG.map(field => {
            const on = fields[field.key];
            return (
              <div key={field.key}
                style={{ background: '#fff', border: `1.5px solid ${on ? '#86efac' : '#e2e8f0'}`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => toggle(field.key)}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{field.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{field.label}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{field.desc}</div>
                </div>
                {/* Toggle switch */}
                <div style={{ width: 48, height: 26, borderRadius: '13px', background: on ? '#16a34a' : '#e2e8f0', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: on ? '25px' : '3px', width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setShowConfirm(true)}
          style={{ width: '100%', height: '52px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
          {manualEntryMode ? 'Proceed with Manual Entry →' : 'Review & Confirm →'}
        </button>
      </div>
    </div>
  );
}
