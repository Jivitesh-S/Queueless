import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';

function AuthLayout({ mode }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const { login, signup, loading } = useAuthStore();
  const { t } = useLanguageStore();
  const [form, setForm] = useState({ name: '', email: 'admin@queueless.app', password: 'Password123!', role: 'admin' });
  const [errorText, setErrorText] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setErrorText('');
    try {
      if (isSignup) await signup(form);
      else await login(form.email, form.password);
      toast.success('Welcome to QueueLess');
      navigate('/dashboard');
    } catch (error) {
      const message = error.message?.includes('Network') || error.code === 'ERR_NETWORK'
        ? 'Cannot reach backend from this page. Make sure backend is running, then restart it after CORS changes.'
        : error.message || 'Authentication failed';
      setErrorText(message);
      toast.error(message);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#f6faf9] px-5 dark:bg-[#091318]">
      <Card className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link to="/" className="block text-2xl font-extrabold text-teal">{t('brand')}</Link>
          <LanguageSwitcher />
        </div>
        <h1 className="text-3xl font-extrabold">{isSignup ? 'Create admin account' : t('staffConsole')}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-300">{t('staffHint')}</p>
        {errorText ? <div className="mt-5 rounded-lg border border-coral/20 bg-coral/5 p-3 text-sm font-semibold text-coral">{errorText}</div> : null}
        <form className="mt-8 space-y-5" onSubmit={submit}>
          {isSignup ? <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /> : null}
          <Input label={t('email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label={t('password')} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
          {isSignup ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Role</span>
              <select className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/10" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </label>
          ) : null}
          <Button className="w-full" disabled={loading}>{isSignup ? 'Create account' : t('login')}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          {isSignup ? 'Already registered?' : 'Need an account?'}{' '}
          <Link className="font-bold text-teal" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Sign up'}</Link>
        </p>
      </Card>
    </div>
  );
}

export const LoginPage = () => <AuthLayout mode="login" />;
export const SignupPage = () => <AuthLayout mode="signup" />;
