import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createJobApplication, uploadFile } from "../../services/staticDataService";
import emailjs from "@emailjs/browser";

// EmailJS configuration for verification emails
const EMAILJS_SERVICE_ID_VERIFICATION = "service_7ugsqbs";
const EMAILJS_TEMPLATE_ID_VERIFICATION = "template_q55l8yp";
const EMAILJS_PUBLIC_KEY_VERIFICATION = "aIJKJSFtAVhhKA7Cd";

export default function JobApplicationModal({ job: jobProp, onClose, onSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get job from props or route state
  const jobFromState = location.state?.job;
  const job = jobProp || jobFromState;
  
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [codeSending, setCodeSending] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    // If no job is available, redirect back
    if (!job) {
      console.error('No job data available');
      navigate('/job-listings');
    }
  }, [job, navigate]);

  // Handle close - if used as route, navigate back
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/job-listings');
    }
  };

  // Handle success - if used as route, navigate back
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      setTimeout(() => {
        navigate('/job-listings');
      }, 1500);
    }
  };

  const { handleSubmit } = useForm();

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (validTypes.includes(file.type)) {
        setResumeFile(file);
        setError("");
      } else {
        setError("Please upload a PDF, PNG, or Word document");
      }
    }
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSendVerificationCode = async () => {
    setCodeError("");

    if (!email || email.trim() === "") {
      setCodeError("Please enter your email address first.");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setCodeError("Please enter a valid email address before requesting a code.");
      return;
    }

    if (
      !EMAILJS_SERVICE_ID_VERIFICATION ||
      !EMAILJS_TEMPLATE_ID_VERIFICATION ||
      !EMAILJS_PUBLIC_KEY_VERIFICATION ||
      EMAILJS_SERVICE_ID_VERIFICATION === "your_real_service_id" ||
      EMAILJS_SERVICE_ID_VERIFICATION === "YOUR_SERVICE_ID"
    ) {
      setCodeError("Email verification service is not configured yet.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setCodeSending(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID_VERIFICATION,
        EMAILJS_TEMPLATE_ID_VERIFICATION,
        {
          // Template variables - matching EmailJS template configuration
          email: email.trim(),
          to_email: email.trim(),
          name: applicantName || "User",
          verificationCode: code,
          handleSendVerificationCode: code, // Some templates use verificationLink instead
          subject: "Email Authentication",
        },
        EMAILJS_PUBLIC_KEY_VERIFICATION
      );

      setCodeSent(true);
      setIsVerified(false);
      setCodeError("");
    } catch (err) {
      console.error("Failed to send verification code:", err);
      setCodeError("Failed to send verification code. Please try again later.");
    } finally {
      setCodeSending(false);
    }
  };

  const handleVerifyCode = () => {
    setCodeError("");

    if (!verificationCode) {
      setCodeError("Please request a verification code first.");
      return;
    }

    if (!enteredCode || enteredCode.trim().length === 0) {
      setCodeError("Please enter the verification code we sent to your email.");
      return;
    }

    if (enteredCode.trim() !== verificationCode) {
      setCodeError("Verification code is incorrect. Please double-check and try again.");
      setIsVerified(false);
      return;
    }

    setIsVerified(true);
    setCodeError("");
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccess(false);

    if (!resumeFile) {
      setError("Please upload a resume");
      return;
    }

    // Validate name
    if (!applicantName || applicantName.trim() === "") {
      setError("Please enter your full name");
      return;
    }

    // Validate email
    if (!email || email.trim() === "") {
      setError("Please provide your email address");
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Upload resume file to Supabase Storage
      const uploadResult = await uploadFile(resumeFile, 'resumes');
      
      if (!uploadResult.success) {
        setError(uploadResult.message || "Failed to upload resume. Please try again.");
        setLoading(false);
        return;
      }

      // Prepare application data
      if (!job || !job.id) {
        setError("Job information is missing. Please try again.");
        setLoading(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        userId: null, // No user ID since login is not required
        jobId: job.id,
        email: email.trim(),
        phone: null, // Phone number not used
        applicant_name: applicantName.trim(),
        resume_url: uploadResult.url,
      };

      const result = await createJobApplication(applicationData);

      if (result.success) {
        // Send notification email via EmailJS when resume is submitted
        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID_VERIFICATION,
            EMAILJS_TEMPLATE_ID_VERIFICATION,
            {
              email: email.trim(),
              to_email: email.trim(),
              name: applicantName.trim(),
              applicant_name: applicantName.trim(),
              job_title: job.title,
              resume_url: uploadResult.url,
              message: `New Job Application received for ${job.title} from ${applicantName.trim()} (${email.trim()}). Resume link: ${uploadResult.url}`,
              subject: `Job Application Submitted - ${job.title}`,
            },
            EMAILJS_PUBLIC_KEY_VERIFICATION
          );
        } catch (emailErr) {
          console.warn("Application saved, but notification email failed:", emailErr);
        }

        setSuccess(true);
        setTimeout(() => {
          handleSuccess();
        }, 1500);
      } else {
        setError(result.message || "Application failed");
      }
    } catch (err) {
      console.error('Application error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading/error if job is not available
  if (!job) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm min-h-screen">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Job Not Found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">The job information is not available.</p>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm sm:text-base"
          >
            Go Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm" style={{ minHeight: '100vh' }}>
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl flex-shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Apply for Position</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 break-words">{job?.title || 'Position'} at {job?.company || 'HireSphere'}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
          {success ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">Your application has been successfully submitted. We'll review it and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send application confirmation and updates to this email address
                </p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-4 sm:pb-6 px-4">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500 text-center">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 text-center">PDF, PNG, DOC, or DOCX (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.png,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                {resumeFile && (
                  <div className="mt-3 flex items-center gap-2 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-blue-700 font-medium truncate">{resumeFile.name}</span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

