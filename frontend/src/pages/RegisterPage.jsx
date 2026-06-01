
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form,   setForm]   = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name     = 'Name is required.';
    else if (form.name.trim().length < 2) e.name    = 'Name must be at least 2 characters.';
    if (!form.email.trim())              e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)                  e.password = 'Password is required.';
    else if (form.password.length < 6)   e.password = 'At least 6 characters.';
    else if (!/\d/.test(form.password))  e.password = 'Must contain at least one number.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiErr('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const result = await register(form);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiErr(result.message);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="space-y-1.5">
      <label className="text-xs font-display font-semibold text-smoke uppercase tracking-wider">{label}</label>
      <input
        type={type}
        autoComplete={type === 'password' ? 'new-password' : name}
        className={`input ${errors[name] ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
      />
      {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl text-ink tracking-tight">Create account</h1>
        <p className="text-smoke text-sm">Set up your workspace in seconds</p>
      </div>

      {apiErr && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm fade-in">
          {apiErr}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {field('name',     'Full name',  'text',     'Ada Lovelace')}
        {field('email',    'Email',      'email',    'you@company.com')}
        {field('password', 'Password',   'password', 'Min. 6 chars + one number')}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
              </svg>
              Creating account…
            </span>
          ) : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-smoke">
        Already have an account?{' '}
        <Link to="/login" className="text-ink font-semibold hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
