import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ open, onClose, onAuth }) {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { email, password, name };
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Auth failed');
      const token = data.token;
      const user = data.user || data;
      if (token) localStorage.setItem('veritas_auth_token', token);
      if (user) localStorage.setItem('veritas_user', JSON.stringify(user));
      onAuth?.({ token, user });
      onClose?.();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md dashboard-card rounded-2xl border border-[var(--border)] p-6 relative">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          {mode === 'login' ? <LogIn className="w-4 h-4 text-red-400" /> : <UserPlus className="w-4 h-4 text-red-400" />}
          <h2 className="text-sm font-black text-[var(--text-primary)]">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] mb-4">
          Demo account: <span className="font-mono text-[var(--text-primary)]">demo@recheckx.ai</span> / <span className="font-mono text-[var(--text-primary)]">demo1234</span>
        </p>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <input
              className="w-full rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)]"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            required
            className="w-full rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg bg-[var(--bg-hover)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)]"
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-[11px] text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>
        <button
          type="button"
          className="mt-3 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
