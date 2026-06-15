import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSWORD;
    if (expected && password === expected) {
      sessionStorage.setItem('admin_auth', '1');
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%)',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '48px 40px',
          boxShadow: '0 8px 40px rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.15)',
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          animation: shake ? 'shake 0.4s ease' : 'none',
        }}
      >
        <div style={{
          width: '60px', height: '60px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981, #047857)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
        }}>
          <Lock size={26} color="white" strokeWidth={2} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1a1a1a' }}>
            Admin Access
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
            Enter the admin password to continue
          </p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: '12px',
              border: `1.5px solid ${error ? '#ef4444' : 'rgba(16,185,129,0.3)'}`,
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              color: '#1a1a1a',
            }}
          />
          {error && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ef4444', textAlign: 'center' }}>
              Incorrect password
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
          }}
        >
          Sign In
        </button>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
