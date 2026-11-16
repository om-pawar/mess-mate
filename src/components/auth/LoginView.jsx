import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, Headphones, Smartphone, Sparkles, Database, User, AtSign } from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { loginUser } from '../../services/messService';

export const LoginView = () => {
  const { setCurrentUserRole, setAuthenticatedUser, setStudentTab, setOwnerTab, addToast } = useMess();

  // Role selection: 'student' | 'owner'
  const [selectedRole, setSelectedRole] = useState('student');

  // Input mode: 'username' | 'mobile'
  const [loginMode, setLoginMode] = useState('username');

  // Form inputs
  const [identifier, setIdentifier] = useState('rohan');
  const [pin, setPin] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle switching between Student and Owner roles
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (loginMode === 'username') {
      setIdentifier(role === 'student' ? 'rohan' : 'warden');
    } else {
      setIdentifier(role === 'student' ? '9876543210' : '9876500000');
    }
  };

  // Handle switching between Username and Mobile modes
  const handleModeChange = (mode) => {
    setLoginMode(mode);
    if (mode === 'username') {
      setIdentifier(selectedRole === 'student' ? 'rohan' : 'warden');
    } else {
      setIdentifier(selectedRole === 'student' ? '9876543210' : '9876500000');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser(identifier, pin, selectedRole);
      if (res.success && res.user) {
        setAuthenticatedUser(res.user);
        setCurrentUserRole(selectedRole);

        if (selectedRole === 'student') {
          setStudentTab('today-menu');
          addToast(
            `Welcome ${res.user.name || 'Rohan'} 👋`,
            res.fromDatabase
              ? 'Authenticated via Supabase (Hostel 4 • Veg Mess).'
              : 'Logged into Student Portal (Hostel 4 • Veg Mess).',
            'success'
          );
        } else {
          setOwnerTab('headcount');
          addToast(
            'Owner Console Active',
            res.fromDatabase
              ? 'Authenticated via Supabase (Kitchen Management & Headcount).'
              : 'Logged into Kitchen Management & Headcount.',
            'success'
          );
        }
      } else {
        addToast('Login Failed', res.error || 'Please check your username / mobile and PIN.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error', 'Unable to complete login. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role, mode, idVal, demoPin) => {
    setSelectedRole(role);
    setLoginMode(mode);
    setIdentifier(idVal);
    setPin(demoPin);
    addToast(
      'Demo Credentials Filled',
      `Filled ${role === 'student' ? 'Student' : 'Owner'} (${mode === 'username' ? '@' + idVal : idVal})`,
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center px-4 py-8 max-w-[430px] mx-auto">
      {/* Header with rounded soft-blue icon box */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#E0F2FE] border border-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          {/* Soup Ladle / Hot Pot Icon matching screenshot */}
          <svg
            className="w-7 h-7 text-slate-900"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Steam waves */}
            <path d="M6 3v2" />
            <path d="M10 2v3" />
            <path d="M14 3v2" />
            {/* Bowl and ladle handle */}
            <path d="M3 11h16a1 1 0 0 1 1 1c0 5-4 8-9 8s-9-3-9-8a1 1 0 0 1 1-1Z" />
            <path d="M19 11l2-7" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">MessMate</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Hostel Mess & Kitchen Portal</p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        {/* Role Switcher Segmented Control */}
        <div className="bg-[#EFF6FF] p-1 rounded-xl flex gap-1 mb-5 border border-blue-50">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('owner')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedRole === 'owner'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mess Staff / Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Mobile Option Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                {loginMode === 'username' ? (
                  <>
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    <span>Username or Roll No</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-3.5 h-3.5 text-slate-700" />
                    <span>Mobile Number</span>
                  </>
                )}
              </label>

              {/* Login Mode Toggle Pills */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-medium border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => handleModeChange('username')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    loginMode === 'username'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Username
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('mobile')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    loginMode === 'mobile'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Input field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {loginMode === 'username' ? (
                  <AtSign className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                ) : (
                  <Phone className="w-4 h-4 text-slate-400" strokeWidth={1.8} />
                )}
              </span>
              <input
                type={loginMode === 'username' ? 'text' : 'tel'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  loginMode === 'username'
                    ? selectedRole === 'student'
                      ? 'e.g., rohan or 2022CSB1042'
                      : 'e.g., warden or admin'
                    : 'e.g., +91 98765 43210'
                }
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-medium"
                required
              />
            </div>

            {/* Helper link underneath */}
            <div className="flex items-center justify-between mt-1 px-0.5 text-[10px] text-slate-400">
              <span>
                {loginMode === 'username'
                  ? 'Accepts username, roll number, or name'
                  : 'Accepts 10-digit registered phone number'}
              </span>
              <button
                type="button"
                onClick={() => handleModeChange(loginMode === 'username' ? 'mobile' : 'username')}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
              >
                {loginMode === 'username' ? 'Use Mobile Instead' : 'Use Username Instead'}
              </button>
            </div>
          </div>

          {/* Password or 4-digit PIN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-900">
                Password or 4-digit PIN
              </label>
              <button
                type="button"
                onClick={() => addToast('PIN Reset Link', 'OTP sent to your registered account.', 'info')}
                className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
              >
                Forgot PIN?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" strokeWidth={1.8} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono tracking-widest"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* OTP Alternate Link */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => {
                setIsOtpMode(!isOtpMode);
                addToast('OTP Mode', 'Instant 6-digit SMS OTP requested.', 'info');
              }}
              className="text-xs font-medium text-[#16A34A] hover:text-[#15803D] flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Or log in with OTP instead</span>
            </button>
          </div>

          {/* Submit Log In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F172A] hover:bg-black text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer mt-2 disabled:opacity-70"
          >
            <span>{isLoading ? 'Authenticating...' : 'Log In'}</span>
            {!isLoading && <span className="text-sm leading-none">→</span>}
          </button>
        </form>

        {/* Quick One-Click Demo Credentials for both Username & Mobile */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              <Database className="w-3 h-3 text-blue-600" />
              <span>Demo Quick-Fill (Username / Mobile)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">PIN: 1234</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Student Username */}
            <button
              type="button"
              onClick={() => handleDemoFill('student', 'username', 'rohan', '1234')}
              className="bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 text-[#1E40AF] px-2 py-1.5 rounded-lg text-left text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <span className="block text-[9px] text-blue-500 font-semibold uppercase">Student User</span>
                <span className="font-bold text-slate-900">@rohan</span>
              </div>
              <span className="text-[9px] bg-white px-1.5 py-0.5 rounded shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">Fill</span>
            </button>

            {/* Student Mobile */}
            <button
              type="button"
              onClick={() => handleDemoFill('student', 'mobile', '9876543210', '1234')}
              className="bg-[#EFF6FF] hover:bg-blue-100/80 border border-blue-100 text-[#1E40AF] px-2 py-1.5 rounded-lg text-left text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <span className="block text-[9px] text-blue-500 font-semibold uppercase">Student Phone</span>
                <span className="font-bold text-slate-900">9876543210</span>
              </div>
              <span className="text-[9px] bg-white px-1.5 py-0.5 rounded shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">Fill</span>
            </button>

            {/* Owner Username */}
            <button
              type="button"
              onClick={() => handleDemoFill('owner', 'username', 'warden', '1234')}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-2 py-1.5 rounded-lg text-left text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <span className="block text-[9px] text-slate-500 font-semibold uppercase">Owner User</span>
                <span className="font-bold text-slate-900">@warden</span>
              </div>
              <span className="text-[9px] bg-white px-1.5 py-0.5 rounded shadow-2xs group-hover:bg-slate-900 group-hover:text-white transition-colors">Fill</span>
            </button>

            {/* Owner Mobile */}
            <button
              type="button"
              onClick={() => handleDemoFill('owner', 'mobile', '9876500000', '1234')}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-2 py-1.5 rounded-lg text-left text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer group"
            >
              <div>
                <span className="block text-[9px] text-slate-500 font-semibold uppercase">Owner Phone</span>
                <span className="font-bold text-slate-900">9876500000</span>
              </div>
              <span className="text-[9px] bg-white px-1.5 py-0.5 rounded shadow-2xs group-hover:bg-slate-900 group-hover:text-white transition-colors">Fill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start mt-4">
        <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" strokeWidth={2.2} />
        <p className="text-[11px] text-slate-700 leading-relaxed">
          Biometric mess registration is active at Diners Hall A & B. You can sign in using your registered username, student roll number, or mobile.
        </p>
      </div>

      {/* Help Link */}
      <div className="text-center mt-5">
        <button
          onClick={() => addToast('Warden Helpline', 'Contact Mess Warden Dr. S. Rao at +91 94140 12345 (Intercom: 4402).', 'info')}
          className="text-xs text-slate-700 hover:text-slate-900 font-medium inline-flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <Headphones className="w-3.5 h-3.5 text-slate-600" />
          <span>Need help? Contact Mess Warden</span>
        </button>
      </div>

      {/* Footer Links */}
      <div className="text-center mt-3">
        <p className="text-[11px] text-slate-400 font-mono">
          Terms of Service • Privacy Policy • Dining Rules
        </p>
      </div>
    </div>
  );
};
