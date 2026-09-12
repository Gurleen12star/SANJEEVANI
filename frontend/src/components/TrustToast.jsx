import React, { useEffect, useState } from 'react';
import { useFarmer } from '../context/FarmerContext';

export default function TrustToast() {
  const { state } = useFarmer();
  const { latestToast } = state;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (latestToast) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [latestToast]);

  if (!visible || !latestToast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: '#fff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      border: '2px solid #16a34a',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      minWidth: '300px',
      animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#dcfce3',
        color: '#15803d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: '16px',
        flexShrink: 0
      }}>
        +{latestToast.amount}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{latestToast.message}</div>
        <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>{latestToast.reason}</div>
      </div>
      <button 
        onClick={() => setVisible(false)}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '18px' }}>
        ×
      </button>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
