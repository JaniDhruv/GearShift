import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { register as registerApi, login as loginApi, parseAuthError } from '../services/authService';
import FormField from '../components/common/FormField';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' });

  const password = watch('password');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerApi({ name: data.name, email: data.email, password: data.password });
      const { token, user } = await loginApi({ email: data.email, password: data.password });
      login(token, user);
      toast.success(`Welcome to GearShift, ${user.name}!`);
      navigate('/inventory', { replace: true });
    } catch (error) {
      const message = parseAuthError(error);
      setServerError(message);
    }
  };

  const PasswordToggle = (show, setShow, label) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="text-ink-400 hover:text-ink-700 transition-colors"
      aria-label={show ? `Hide ${label}` : `Show ${label}`}
    >
      <i className={`bx ${show ? 'bx-hide' : 'bx-show'} text-lg`} />
    </button>
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-cream-100 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="anim-blob-2 absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/8 blur-3xl rounded-full" />
        <div className="anim-blob-1 absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full" />
        <div className="anim-blob-3 absolute top-1/2 right-0 w-56 h-56 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-md anim-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 mb-4 shadow-card anim-float">
            <i className="bx bxs-car text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Create your account</h1>
          <p className="text-ink-500 mt-1 text-sm">Join the GearShift dealership network</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-cream-200 rounded-2xl p-8 shadow-card-md">
          {serverError && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              <i className="bx bxs-error-circle text-base shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              id="register-name"
              label="Full name"
              type="text"
              placeholder="John Smith"
              autoComplete="name"
              iconClass="bx-user"
              registration={register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 60, message: 'Name must be 60 characters or fewer' },
              })}
              error={errors.name}
            />

            <FormField
              id="register-email"
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
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              iconClass="bxs-lock-alt"
              rightElement={PasswordToggle(showPassword, setShowPassword, 'password')}
              registration={register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              error={errors.password}
            />

            <FormField
              id="register-confirm-password"
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              iconClass="bxs-lock-alt"
              rightElement={PasswordToggle(showConfirm, setShowConfirm, 'confirm password')}
              registration={register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword}
            />

            <button
              id="register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm shadow-primary-500/20 mt-2"
            >
              {isSubmitting ? (
                <>
                  <i className="bx bx-loader-alt text-base anim-spin-slow" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <i className="bx bx-right-arrow-alt text-lg" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
