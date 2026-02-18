import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';


import { setLogin, logout } from '@/redux/slices/authSlice';
import { useLoginMutation, useForgotPasswordMutation, useVerifyForgotOtpMutation, useResetPasswordMutation } from '@/redux/api/authApi';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'forgot-email' | 'forgot-code' | 'forgot-password' | 'forgot-success'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [verifyForgotOtp, { isLoading: isVerifyLoading }] = useVerifyForgotOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  const isLoading = localLoading || isLoginLoading || isForgotLoading || isVerifyLoading || isResetLoading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const result = await login({ email, password }).unwrap();
      const responseData = result.data || result;
      console.log("Response Data:", responseData);

      // Extract tokens from session object as per API response
      const accessToken =
        responseData.session?.accessToken ||
        responseData.data?.session?.accessToken; // Fallback for double nesting

      const refreshToken =
        responseData.session?.refreshToken ||
        responseData.data?.session?.refreshToken;

      const user = responseData.user || responseData.data?.user;

      if (accessToken && user?.role === 'ADMIN') {
        dispatch(setLogin({
          user: user,
          token: accessToken,
          refreshToken
        }));

        localStorage.setItem("token", accessToken);
        localStorage.setItem("isAuthenticated", "true");
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        navigate('/');
      } else if (accessToken && user?.role !== 'ADMIN') {
        setErrorMsg("Access Denied: Only administrators can access this dashboard.");
        dispatch(logout()); // Clean up any partial state
      } else {
        console.error("Login successful but no token found in session object:", result);
        setErrorMsg("Login failed: Invalid server response structure.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage = error?.data?.message || (typeof error?.data === 'string' ? error.data : null) || error?.message || "Login failed";
      setErrorMsg(`Login Failed: ${errorMessage}`);
    }
  };

  // ... (rest of code) ...
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Clear any existing auth state to prevent interference with reset flow
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated"); // Just in case

    try {
      await forgotPassword({ email }).unwrap();
      setStep('forgot-code');
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      setErrorMsg(error?.data?.message || "Failed to send verification code");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const result = await verifyForgotOtp({ email, otp: code }).unwrap();
      const accessToken = result.data?.accessToken || result.accessToken;

      if (accessToken) {
        setResetToken(accessToken);
        setStep('forgot-password');
      } else {
        setErrorMsg("Failed to retrieve reset token.");
      }
    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      setErrorMsg(error?.data?.message || "Invalid verification code");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (!resetToken) {
      setErrorMsg("Reset token missing. Please verify OTP again.");
      return;
    }

    try {
      await resetPassword({ newPassword, confirmPassword, token: resetToken }).unwrap();
      // Clear token after success
      setResetToken(null);
      setStep('forgot-success');
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      setErrorMsg(error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... */}
      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(255,107,53,0.1)] border border-white p-8 md:p-10 backdrop-blur-sm">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-10">
            {/* ... */}
          </div>

          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Error Message Display */}
              {errorMsg && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 flex items-center animate-in fade-in zoom-in-95 duration-200">
                  <span className="mr-2">⚠️</span> {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="admin@foodsaver.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setStep('forgot-email')}
                    className="text-xs font-bold text-[#FF6B35] hover:text-[#E85A2D] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E85A2D] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'forgot-email' && (
            <form onSubmit={handleSendCode} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Recovery Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  We'll send a verification code to this email address.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E85A2D] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Send Verification Code'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="w-full text-gray-500 font-semibold py-2 hover:text-gray-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {step === 'forgot-code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2 text-center">
                <label className="text-sm font-semibold text-gray-700 block">Verification Code</label>
                <div className="flex justify-center mt-4">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-40 text-center text-2xl tracking-[0.5em] font-black bg-gray-50 border border-gray-100 rounded-2xl py-4 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E85A2D] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Verify Code'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('forgot-email')}
                  className="w-full text-gray-500 font-semibold py-2 hover:text-gray-700 transition-colors"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {step === 'forgot-password' && (
            <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E85A2D] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Update Password'}
              </button>
            </form>
          )}

          {step === 'forgot-success' && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-green-50/50">
                <LogIn className="text-green-500 h-10 w-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                <p className="text-gray-500 mt-2">
                  Your password has been reset successfully. You can now login with your new credentials.
                </p>
              </div>
              <button
                onClick={() => setStep('login')}
                className="w-full bg-[#FF6B35] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF6B35]/20 hover:bg-[#E85A2D] transition-all"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-gray-400 text-sm">
          Protected by industry standard encryption.<br />
          &copy; {new Date().getFullYear()} DineFive Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}
