import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { register as registerApi, login as loginApi, parseAuthError } from '../services/authService';
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
      // Register the user
      await registerApi({ name: data.name, email: data.email, password: data.password });
      // Auto-login after registration
      const { token, user } = await loginApi({ email: data.email, password: data.password });
      login(token, user);
      toast.success(`Welcome to GearShift, ${user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = parseAuthError(error);
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-950">
      {/* Decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
            <Car className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-gray-400 mt-1 text-sm">Join the GearShift dealership network</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          {/* Server Error Banner */}
          {serverError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-gray-300 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Smith"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    maxLength: { value: 60, message: 'Name must be 60 characters or fewer' },
                  })}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/60 border text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 ${
                    errors.name
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : 'border-gray-700 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/60 border text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 ${
                    errors.email
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : 'border-gray-700 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/60 border text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 ${
                    errors.password
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : 'border-gray-700 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  id="register-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/60 border text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : 'border-gray-700 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-gray-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
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
