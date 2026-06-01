
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)        e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiErr('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const result = await login(form);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiErr(result.message);
    }
  };

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Welcome back</h1>
        <p className="text-smoke text-sm">Sign in to your workspace</p>
      </div>

      {apiErr && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm fade-in">
          {apiErr}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-display font-semibold text-smoke uppercase tracking-wider">Email</label>
          <input
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="you@company.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-display font-semibold text-smoke uppercase tracking-wider">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className={`input ${errors.password ? 'input-error' : ''}`}
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
              </svg>
              Signing in…
            </span>
          ) : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-smoke">
        No account?{' '}
        <Link to="/register" className="text-ink font-semibold hover:text-accent transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
