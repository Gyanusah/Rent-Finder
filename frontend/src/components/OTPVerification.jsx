import React, { useState } from "react";
import { otpAPI } from "../services/apiService";

export default function OTPVerification({ 
  email, 
  phone, 
  type = "both", 
  onVerified, 
  onBack 
}) {
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const handleSendOTP = async () => {
    setIsSending(true);
    setMessage("");

    try {
      let response;
      if (type === "email" && email) {
        response = await otpAPI.sendEmailOTP(email);
      } else if (type === "phone" && phone) {
        response = await otpAPI.sendPhoneOTP(phone);
      } else if (type === "both" && email && phone) {
        response = await otpAPI.sendBothOTP(email, phone);
      }

      if (response.data.success) {
        let message = "OTP sent successfully!";
        
        if (response.data.otp) {
          message += ` (Test OTP: ${response.data.otp})`;
        }
        
        if (response.data.previewUrl) {
          message += ` - <a href="${response.data.previewUrl}" target="_blank" style="color: blue;">View Email</a>`;
        }
        
        setMessage(message);
        startResendTimer();
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  const startResendTimer = () => {
    setIsResendEnabled(false);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setIsResendEnabled(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const response = await otpAPI.verifyOTP(email, phone, otp, type);
      
      if (response.data.success) {
        setMessage("OTP verified successfully!");
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    handleSendOTP();
  };

  React.useEffect(() => {
    handleSendOTP();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Verify Your Identity</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 text-center mb-4">
          {type === "email" && `We've sent a verification code to ${email}`}
          {type === "phone" && `We've sent a verification code to ${phone}`}
          {type === "both" && `We've sent verification codes to ${email} and ${phone}`}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter OTP
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter 6-digit code"
          maxLength={6}
        />
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          message.includes("success") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}
        dangerouslySetInnerHTML={{ __html: message }}
        />
      )}

      <div className="mb-4">
        <button
          onClick={handleVerifyOTP}
          disabled={isVerifying || otp.length !== 6}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={handleResendOTP}
          disabled={!isResendEnabled || isSending}
          className="text-blue-500 hover:text-blue-600 text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending..." : 
           isResendEnabled ? "Resend OTP" : 
           `Resend OTP in ${resendTimer}s`}
        </button>
      </div>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-600 text-sm"
          >
            ← Back to signup
          </button>
        </div>
      )}
    </div>
  );
}
