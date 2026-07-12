import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as loginApi, parseAuthError } from '../services/authService';
import FormField from '../components/common/FormField';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { token, user } = await loginApi(data);
      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from || '/inventory', { replace: true });
    } catch (error) {
      const message = parseAuthError(error);
      setServerError(message);
    }
  };

  const PasswordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-ink-400 hover:text-ink-700 transition-colors"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} text-lg`} />
    </button>
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-cream-100 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="anim-blob-1 absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/8 blur-3xl rounded-full" />
        <div className="anim-blob-2 absolute bottom-0 right-0 w-64 h-64 bg-blue-500/6 blur-3xl rounded-full" />
        <div className="anim-blob-3 absolute top-1/2 left-0 w-48 h-48 bg-violet-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-md anim-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 mb-4 shadow-card anim-float">
            <i className="bx bxs-car text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Welcome back</h1>
          <p className="text-ink-500 mt-1 text-sm">Sign in to your GearShift account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-cream-200 rounded-2xl p-8 shadow-card-md">
          {serverError && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <i className="bx bxs-error-circle text-base shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              iconClass="bx-envelope"
              registration={register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })}
              error={errors.email}
            />

            <FormField
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              iconClass="bxs-lock-alt"
              rightElement={PasswordToggle}
              registration={register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              error={errors.password}
            />

            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm shadow-primary-500/20 mt-2"
            >
              {isSubmitting ? (
                <>
                  <i className="bx bx-loader-alt text-base anim-spin-slow" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <i className="bx bx-right-arrow-alt text-lg" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
