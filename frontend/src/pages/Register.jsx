import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
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
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = parseAuthError(error);
      setServerError(message);
    }
  };

  const PasswordToggle = (show, setShow, label) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="text-gray-500 hover:text-gray-300 transition-colors"
      aria-label={show ? `Hide ${label}` : `Show ${label}`}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-950">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <Car className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-gray-400 mt-1 text-sm">Join the GearShift dealership network</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          {/* Server Error Banner */}
          {serverError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
            >
              <span className="mt-0.5 shrink-0 font-bold">!</span>
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
              icon={User}
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
              icon={Mail}
              registration={register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              error={errors.email}
            />

            <FormField
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              icon={Lock}
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
              icon={Lock}
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-gray-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
