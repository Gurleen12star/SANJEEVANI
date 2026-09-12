import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from './assets/image1.png';

const FARMER_CREDS = { mobile: '9876543210', password: 'farmer123' };
const FPO_CREDS    = { mobile: 'admin@sanjeevani.org', password: 'fpo@admin' };

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState('farmer');
  const [mobile, setMobile]     = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLogin, setIsLogin]   = useState(true);

  const autoFill = (type) => {
    setTab(type);
    setIsLogin(true);
    const c = type === 'farmer' ? FARMER_CREDS : FPO_CREDS;
    setMobile(c.mobile);
    setPassword(c.password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'fpo') {
      navigate('/fpo/dashboard');
    } else {
      navigate('/farmer/dashboard');
    }
  };

  return (
    /* Full-page wrapper — light beige bg exactly like the reference */
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px' }}>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>

        {/* ══ LEFT: White Form Panel ══ */}
        <div style={{ width: '48%', background: '#fff', padding: '40px 44px', display: 'flex', flexDirection: 'column' }}>

          {/* Store Badges */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                <path d="M3 20.5v-17c0-.83 1-.3 1-.3l11 8.5-11 8.5s-1 .53-1-.7z" fill="#4285F4"/>
                <path d="M3 3.5l9.5 9L17 8 4 3a.5.5 0 00-1 .5z" fill="#34A853"/>
                <path d="M3 20.5l9.5-9 4.5 4.5L3.5 21a.5.5 0 01-.5-.5z" fill="#EA4335"/>
                <path d="M17 8l3 2.3a1 1 0 010 1.7L17 14.3l-4.5-4.5L17 8z" fill="#FBBC05"/>
              </svg>
              <div>
                <div style={{ fontSize: '7px', color: '#94a3b8' }}>GET IT ON</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>Google Play</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#1e293b' }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div style={{ fontSize: '7px', color: '#94a3b8' }}>DOWNLOAD ON THE</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>App Store</div>
              </div>
            </div>
          </div>

          {/* Farmer / FPO Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {['farmer', 'fpo'].map(t => (
              <button key={t} onClick={() => { setTab(t); setMobile(''); setPassword(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  border: tab === t ? '2px solid #16a34a' : '2px solid #e2e8f0',
                  background: tab === t ? '#f0fdf4' : '#fff',
                  color: tab === t ? '#15803d' : '#94a3b8',
                  transition: 'all 0.2s'
                }}>
                {t === 'farmer' ? '🌾 Farmer' : '🏢 FPO'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '2px', fontWeight: 500 }}>Welcome</p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', marginBottom: '24px', lineHeight: 1.1 }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Full Name</label>
                <input type="text" placeholder="Your full name"
                  style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                {tab === 'farmer' ? 'Your Mobile' : 'Your Email'}
              </label>
              <input
                type={tab === 'farmer' ? 'tel' : 'email'}
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder={tab === 'farmer' ? 'Mobile number' : 'Email address'}
                required
                style={{ width: '100%', height: '42px', padding: '0 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  style={{ width: '100%', height: '42px', padding: '0 40px 0 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'currentColor' }}>
                    <path d="M12 9a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5z"/>
                  </svg>
                </button>
              </div>
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right' }}>
                <a href="#" style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>Forgot password?</a>
              </div>
            )}

            <button type="submit"
              style={{ width: '100%', height: '44px', background: '#15803d', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '14px' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(v => !v)}
              style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>

          {/* Auto-fill Demo Buttons */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '2px', marginBottom: '10px' }}>HACKATHON DEMO</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => autoFill('farmer')}
                style={{ width: '100%', height: '38px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', color: '#15803d', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                🌾 Auto-fill Farmer credentials
              </button>
              <button onClick={() => autoFill('fpo')}
                style={{ width: '100%', height: '38px', background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '10px', color: '#1d4ed8', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                🏢 Auto-fill FPO credentials
              </button>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Green Brand Panel ══ */}
        <div style={{ width: '52%', background: '#166534', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '40px', overflow: 'hidden' }}>

          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '180px', height: '180px', background: '#15803d', borderRadius: '50%', opacity: 0.6 }}></div>
          <div style={{ position: 'absolute', bottom: '80px', right: '-30px', width: '140px', height: '140px', background: '#14532d', borderRadius: '50%', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', top: '60px', right: '30px', width: '80px', height: '80px', background: '#16a34a', borderRadius: '50%', opacity: 0.4 }}></div>

          {/* Top brand name with logo */}
          <div style={{ position: 'absolute', top: '24px', right: '28px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '18px', letterSpacing: '0.5px' }}>SANJEEVANI</div>
              <div style={{ color: '#86efac', fontSize: '11px', fontWeight: 600, letterSpacing: '2px' }}>( PROTOCOL )</div>
            </div>
            <img src="/logo.png" alt="Sanjeevani Logo" style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: '10px' }} />
          </div>

          {/* Farmer photo in a card frame */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <img src={bgImage} alt="Farmers" style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
          </div>

          {/* Bottom copy */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '10px', lineHeight: 1.2 }}>
              Empower Your Harvest.
            </h3>
            <p style={{ color: '#bbf7d0', fontSize: '13px', lineHeight: 1.6, maxWidth: '260px', margin: '0 auto' }}>
              Unlock collateral-free credit backed by AI crop health and community trust scores.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
