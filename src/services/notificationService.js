// Notification service for sending emails to applicants
import emailjs from "@emailjs/browser";

// EmailJS configuration
// TODO: Move these to environment variables for security
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_7ugsqbs";
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "aIJKJSFtAVhhKA7Cd";

const EMAIL_TEMPLATE_ACCEPTED = process.env.REACT_APP_EMAILJS_TEMPLATE_ACCEPTED || "template_q55l8yp";
const EMAIL_TEMPLATE_REJECTED = process.env.REACT_APP_EMAILJS_TEMPLATE_REJECTED || "template_q55l8yp";

/**
 * Send email notification to applicant
 * @param {Object} params - Notification parameters
 * @param {string} params.toEmail - Recipient email address
 * @param {string} params.applicantName - Name of the applicant
 * @param {string} params.jobTitle - Title of the job position
 * @param {string} params.decision - 'accepted' or 'rejected'
 * @param {string} params.companyName - Company name (default: HireSphere)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendEmailNotification = async ({
  toEmail,
  applicantName,
  jobTitle,
  decision,
  companyName = "HireSphere"
}) => {
  if (!toEmail) {
    return { success: false, message: "Email address is required" };
  }

  try {
    const templateId = decision === 'accepted' || decision === 'approved' 
      ? EMAIL_TEMPLATE_ACCEPTED 
      : EMAIL_TEMPLATE_REJECTED;

    const isAccepted = decision === 'accepted' || decision === 'approved';
    const decisionMessage = isAccepted
      ? `Congratulations ${applicantName}! Your application for the position of ${jobTitle} at ${companyName} has been ACCEPTED. We are excited about the possibility of you joining our team. Our HR department will contact you soon with further details regarding the next steps in the hiring process. Thank you for your interest in ${companyName}.`
      : `Dear ${applicantName}, Thank you for your interest in the ${jobTitle} position at ${companyName}. After careful consideration, we regret to inform you that your application was not selected at this time. We received many qualified applications, and the decision was difficult. We appreciate the time you took to apply and wish you the best in your future endeavors. We encourage you to apply for other positions that may be a better fit for your skills and experience.`;

    const templateParams = {
      // Standard EmailJS fields (matching ForgotPassword format)
      first_name: applicantName || "Applicant",
      surname: "", // Not required for this notification
      subject: `Application ${isAccepted ? 'Accepted' : 'Rejected'} - ${jobTitle || 'Position'} at ${companyName}`,
      message: decisionMessage,
      email_from: "HireSphere@gmail.com",
      email_to: toEmail,
      // Additional fields for custom templates
      to_email: toEmail,
      applicant_name: applicantName || "Applicant",
      job_title: jobTitle || "Position",
      company_name: companyName,
      decision: isAccepted ? 'accepted' : 'rejected'
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log("Email notification sent successfully:", result.text);
    return { success: true, message: "Email notification sent successfully" };
  } catch (error) {
    console.error("Error sending email notification:", error);
    return { 
      success: false, 
      message: error.text || "Failed to send email notification" 
    };
  }
};

/**
 * Send email notification to applicant
 * @param {Object} params - Notification parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.applicantName - Name of the applicant
 * @param {string} params.jobTitle - Title of the job position
 * @param {string} params.decision - 'accepted' or 'rejected'
 * @param {string} params.companyName - Company name (default: HireSphere)
 * @returns {Promise<{emailSent: boolean, errors: string[]}>}
 */
export const sendApplicationNotification = async ({
  email,
  applicantName,
  jobTitle,
  decision,
  companyName = "HireSphere"
}) => {
  const results = {
    emailSent: false,
    errors: []
  };

  // Send email if email is provided
  if (email) {
    const emailResult = await sendEmailNotification({
      toEmail: email,
      applicantName,
      jobTitle,
      decision,
      companyName
    });
    
    if (emailResult.success) {
      results.emailSent = true;
    } else {
      results.errors.push(`Email: ${emailResult.message}`);
    }
  }

  return results;
};

