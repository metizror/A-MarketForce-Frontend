"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { publicApiPost } from '@/lib/api';
import { VerifyOtpPayload, VerifyOtpResponse, SendOtpResponse } from '@/types/auth.types';

export default function OtpVerifyPage() {
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    
    // Only allow sequential input - prevent editing already-filled digits
    // Allow: adding new digit at the end, or backspacing from the end
    if (numericValue.length === otp.length + 1) {
      // Adding new digit - must be sequential
      if (numericValue.startsWith(otp)) {
        setOtp(numericValue);
      }
    } else if (numericValue.length === otp.length - 1) {
      // Backspace - allow deletion from end only
      if (numericValue === otp.slice(0, -1)) {
        setOtp(numericValue);
      }
    } else if (numericValue.length === 0) {
      // Clear all
      setOtp('');
    }
    // Ignore other changes (editing middle digits)
  };

  useEffect(() => {
    // Get email from URL params (required)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email not found. Please try again from the registration page.');
      return;
    }

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await publicApiPost<VerifyOtpResponse>(
        '/auth/verify-otp',
        {
          email,
          otp,
        } as VerifyOtpPayload
      );

      if (response.isEmailVerified) {
        setIsVerified(true);
        toast.success(response.message || 'Email verified successfully!');
      } else {
        toast.error(response.message || 'Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to verify OTP. Please try again.');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email not found. Please try again from the registration page.');
      return;
    }

    setIsResending(true);
    try {
      const response = await publicApiPost<SendOtpResponse>(
        '/auth/send-otp',
        { email }
      );
      
      toast.success(response.message || 'OTP sent to your email');
      setCountdown(60); // 60 seconds countdown
      setOtp('');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Email Verified!</h2>
                <p className="text-gray-600 mb-6">
                  Your email has been successfully verified.<br />
                  Redirecting to login...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardContent className="pt-8 pb-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#EF8037' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Verification Code</h2>
                  <p className="text-sm text-gray-600">Enter the 6-digit code sent to your email</p>
                </div>
                
                <div className="flex justify-center w-full">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isLoading}
                    containerClassName="w-full justify-center"
                    pattern={/^[0-9]*$/}
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} className="h-14 w-14 text-xl font-semibold cursor-text" />
                      <InputOTPSlot index={1} className="h-14 w-14 text-xl font-semibold cursor-text" />
                      <InputOTPSlot index={2} className="h-14 w-14 text-xl font-semibold cursor-text" />
                      <InputOTPSlot index={3} className="h-14 w-14 text-xl font-semibold cursor-text" />
                      <InputOTPSlot index={4} className="h-14 w-14 text-xl font-semibold cursor-text" />
                      <InputOTPSlot index={5} className="h-14 w-14 text-xl font-semibold cursor-text" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11"
                style={{ backgroundColor: '#EF8037' }}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending || countdown > 0 || !email}
                  className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend code in ${countdown}s`
                  ) : (
                    'Resend code'
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

