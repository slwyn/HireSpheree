import React, { useState, useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";

const UserVerification = () => {
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const formRef = useRef();
  const navigate = useNavigate();

  const { control, handleSubmit, watch, setError, formState: { errors } } = useForm();

  // Simple CAPTCHA generator
  const generateCaptcha = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  const [generatedCaptcha] = useState(generateCaptcha());

  const onSubmit = async (data) => {
    if (!data.terms) {
      setError("terms", { type: "manual", message: "You must accept the Terms & Agreement." });
      return;
    }

    if (data.captcha !== generatedCaptcha) {
      setError("captcha", { type: "manual", message: "Captcha is incorrect." });
      return;
    }

    setLoading(true);

    // Simulate API call then go to job listings
    setTimeout(() => {
      navigate("/job-listings");
    }, 1500);
  };

  const getBorderColor = (field) => {
    return errors[field] ? "border-red-400" : "border-white/20";
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 fixed"
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col flex-grow w-full">
        <main className="flex-1 flex justify-center items-center py-12 px-6">
          <div className="w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/10">

            {/* LEFT PANEL (Verification Form) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 bg-white/10 backdrop-blur-md border-r border-white/10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white tracking-wide">
                Verification Form
              </h2>
              <p className="text-white/70 text-sm mb-8">
                Please verify your identity to proceed with your application.
              </p>

              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                {/* First Name */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-wider">
                    First Name
                  </label>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: "First Name is required." }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g., Juan"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border ${getBorderColor("first_name")} placeholder-white/50`}
                      />
                    )}
                  />
                  {errors.first_name && (
                    <span className="text-red-400 text-xs">{errors.first_name.message}</span>
                  )}
                </div>

                {/* Surname */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-wider">
                    Surname
                  </label>
                  <Controller
                    name="surname"
                    control={control}
                    rules={{ required: "Surname is required." }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g., Dela Cruz"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border ${getBorderColor("surname")} placeholder-white/50`}
                      />
                    )}
                  />
                  {errors.surname && (
                    <span className="text-red-400 text-xs">{errors.surname.message}</span>
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-wider">
                    Middle Name
                  </label>
                  <Controller
                    name="middle_name"
                    control={control}
                    rules={{ required: "Middle Name is required." }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g., Santos"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border ${getBorderColor("middle_name")} placeholder-white/50`}
                      />
                    )}
                  />
                  {errors.middle_name && (
                    <span className="text-red-400 text-xs">{errors.middle_name.message}</span>
                  )}
                </div>

                {/* Gmail */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-wider">
                    Gmail
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required.",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                        message: "Please enter a valid Gmail address.",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        placeholder="you@gmail.com"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border ${getBorderColor("email")} placeholder-white/50`}
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-red-400 text-xs">{errors.email.message}</span>
                  )}
                </div>

                {/* Mobile Number for OTP */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-wider">
                    Mobile Number (for OTP)
                  </label>
                  <Controller
                    name="mobile"
                    control={control}
                    rules={{
                      required: "Mobile number is required.",
                      pattern: {
                        // Accept PH numbers starting with 09 or +639 followed by 9 digits
                        value: /^(?:\+63|0)9\d{9}$/,
                        message: "Enter a valid PH mobile (e.g., 09123456789 or +639123456789).",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        placeholder="09123456789 or +639123456789"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 text-white border ${getBorderColor("mobile")} placeholder-white/50`}
                      />
                    )}
                  />
                  {errors.mobile && (
                    <span className="text-red-400 text-xs">{errors.mobile.message}</span>
                  )}
                </div>

                {/* CAPTCHA */}
                <div>
                  <label className="block text-xs font-bold mb-2 text-gray-400 uppercase tracking-wider">
                    CAPTCHA Verification
                  </label>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-700 px-4 py-2 rounded-lg text-lg font-bold tracking-widest text-white shadow-lg">
                      {generatedCaptcha}
                    </div>

                    <button
                      type="button"
                      className="text-white/70 text-sm hover:text-white underline"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </button>
                  </div>

                  <Controller
                    name="captcha"
                    control={control}
                    rules={{ required: "Please enter the CAPTCHA." }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter CAPTCHA"
                        className={`mt-3 w-full px-4 py-3 rounded-lg bg-white/10 text-white border ${getBorderColor("captcha")} placeholder-white/50`}
                      />
                    )}
                  />

                  {errors.captcha && (
                    <span className="text-red-400 text-xs">{errors.captcha.message}</span>
                  )}
                </div>

                {/* Terms & Agreement */}
                <div className="flex items-start gap-3 pt-2">
                  <Controller
                    name="terms"
                    control={control}
                    rules={{ required: "You must accept the Terms & Agreement." }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className={`mt-1 h-5 w-5 rounded border ${getBorderColor("terms")} bg-white/20 text-blue-500 focus:ring-blue-400`}
                      />
                    )}
                  />
                  <div className="text-white/80 text-sm leading-relaxed">
                    I agree to the <span className="font-semibold text-white">Terms & Agreement</span> and confirm that the information provided is accurate.
                  </div>
                </div>
                {errors.terms && (
                  <span className="text-red-400 text-xs">{errors.terms.message}</span>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                >
                  VERIFY & CONTINUE
                </button>
              </form>
            </div>

            {/* RIGHT PANEL INFO */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-white/10 backdrop-blur-md p-8">
              <div className="text-center text-white">
                <svg className="w-20 h-20 mx-auto text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.33 0-7 1.167-7 3.5V19h14v-2.5c0-2.333-4.67-3.5-7-3.5z" />
                </svg>
                <h2 className="text-3xl font-bold">Identity Verification</h2>
                <p className="text-white/70 mt-3">
                  Secure and fast verification to ensure legitimate applicants.
                </p>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default UserVerification;
