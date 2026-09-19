import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  // Demo OTP
  const correctOTP = "123456";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOTP = [...otp];
    newOTP[index] = value.slice(-1);

    setOtp(newOTP);
    setError("");
    setMessage("");

    // Move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous box when backspace is pressed
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newOTP = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOTP[index] = digit;
    });

    setOtp(newOTP);

    const nextIndex = Math.min(
      pastedValue.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();

    const enteredOTP = otp.join("");

    setError("");
    setMessage("");

    if (enteredOTP.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (enteredOTP !== correctOTP) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    localStorage.setItem(
      "otpVerified",
      "true"
    );

    setMessage("OTP verified successfully!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setMessage("A new OTP has been sent.");
    setTimer(30);

    inputRefs.current[0]?.focus();
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="otp-page">

      <div className="otp-card">

        {/* BRAND */}

        <div className="otp-brand">
          <div className="brand-logo">
            AB
          </div>

          <div>
            <h2>AB Bank</h2>
            <span>Digital Banking</span>
          </div>
        </div>


        {/* ICON */}

        <div className="otp-icon">
          🔐
        </div>


        {/* HEADER */}

        <div className="otp-header">

          <h1>Verify your identity</h1>

          <p>
            We have sent a 6-digit verification
            code to your registered mobile number.
          </p>

        </div>


        {/* OTP FORM */}

        <form
          onSubmit={handleVerify}
          className="otp-form"
        >

          {error && (
            <div className="otp-error">
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div className="otp-success">
              ✓ {message}
            </div>
          )}


          <label className="otp-label">
            Enter OTP
          </label>


          <div
            className="otp-inputs"
            onPaste={handlePaste}
          >

            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] =
                    element;
                }}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="otp-input"
              />
            ))}

          </div>


          {/* TIMER */}

          <div className="otp-timer">

            {timer > 0 ? (
              <span>
                Code expires in{" "}
                <strong>
                  00:{String(timer).padStart(2, "0")}
                </strong>
              </span>
            ) : (
              <span>
                OTP expired
              </span>
            )}

          </div>


          {/* VERIFY */}

          <button
            type="submit"
            className="otp-verify-btn"
          >
            Verify & Continue
          </button>


          {/* RESEND */}

          <button
            type="button"
            className="otp-resend-btn"
            disabled={timer > 0}
            onClick={handleResend}
          >
            Resend OTP
          </button>


          {/* BACK */}

          <button
            type="button"
            className="otp-back-btn"
            onClick={handleBack}
          >
            ← Back to Login
          </button>

        </form>


        {/* DEMO INFO */}

        <div className="otp-demo">

          <div className="otp-demo-icon">
            ℹ️
          </div>

          <div>
            <strong>Demo Mode</strong>

            <p>
              Use OTP{" "}
              <strong>123456</strong>{" "}
              to continue.
            </p>
          </div>

        </div>


        {/* SECURITY */}

        <div className="otp-security">
          🔒 Your verification is protected by
          AB Bank's secure authentication system.
        </div>

      </div>

    </div>
  );
}

export default OTP;