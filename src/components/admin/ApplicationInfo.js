import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faEnvelope, 
  faBriefcase, 
  faFilePdf,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { updateApplicationDecision } from '../../services/staticDataService';
import { supabaseAdmin } from '../../components/Services/supabaseClient';
import { sendApplicationNotification } from '../../services/notificationService';

const ApplicationInfo = () => {
  const { unique_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(location.state?.application || null);
  const [loading, setLoading] = useState(!application);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    if (!application && unique_id) {
      fetchApplication();
    } else if (application) {
      fetchJobDetails();
    }
  }, [unique_id, application]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      // Try to find by unique_id first, then by id as fallback
      let { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('unique_id', unique_id)
        .is('deleted_at', null)
        .maybeSingle();

      // If not found by unique_id, try by id
      if (!data && !isNaN(unique_id)) {
        const result = await supabaseAdmin
          .from('applications')
          .select('*')
          .eq('id', parseInt(unique_id))
          .is('deleted_at', null)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      if (!data) {
        setError('Application not found');
        setLoading(false);
        return;
      }

      // Ensure unique_id exists
      if (!data.unique_id) {
        data.unique_id = data.id;
      }

      setApplication(data);
      await fetchJobDetails(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application details');
      setLoading(false);
    }
  };

  const fetchJobDetails = async (appData = null) => {
    const app = appData || application;
    if (!app || !app.job_id) return;

    try {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .select('*')
        .eq('id', app.job_id)
        .maybeSingle();

      if (error) throw error;
      setJobDetails(data);
    } catch (err) {
      console.error('Error fetching job details:', err);
    }
  };

  const handleDecision = async (decision) => {
    if (!application || !application.id) return;

    setUpdating(true);
    setError('');

    try {
      // Update the application decision in database
      const result = await updateApplicationDecision(application.id, decision);
      
      if (result.success) {
        setApplication({ ...application, decision });
        
        // Send email notification to applicant
        const notificationResult = await sendApplicationNotification({
          email: application.email || null,
          applicantName: application.applicant_name || 'Applicant',
          jobTitle: jobDetails?.title || 'Position',
          decision: decision,
          companyName: jobDetails?.company || 'HireSphere'
        });

        // Build success message with notification status
        let successMessage = `Application ${decision === 'accepted' ? 'accepted' : 'rejected'} successfully!`;
        
        if (notificationResult.emailSent) {
          successMessage += ' (Email notification sent)';
        }
        if (notificationResult.errors.length > 0) {
          console.warn('Notification errors:', notificationResult.errors);
          // Don't show notification errors to user, but log them
        }

        setSuccess(successMessage);
        
        // Trigger a custom event to refresh the applications list
        window.dispatchEvent(new Event('applicationsUpdated'));
        
        // Show success message briefly before navigating
        setTimeout(() => {
          navigate('/admin-interface');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update application decision');
        setUpdating(false);
      }
    } catch (err) {
      console.error('Error updating decision:', err);
      setError('An error occurred while updating the application');
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDecisionColor = (decision) => {
    switch (decision?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}></div>
        <div className="relative z-10 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-300 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => navigate('/admin-interface')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* BACKGROUND */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}
      ></div>

      {/* CONTENT */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        {/* HEADER */}
        <nav className="w-full px-6 md:px-10 py-4 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-interface')}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-white text-lg" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white">Application Details</h1>
              <p className="text-white/60 text-xs">Review applicant information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-xs font-semibold border ${getDecisionColor(application.decision)}`}>
              {application.decision ? application.decision.toUpperCase() : 'PENDING'}
            </span>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} />
                {success}
              </div>
            )}

            {/* APPLICATION INFO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-blue-300" />
                Applicant Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application ID */}
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Application ID</p>
                  <p className="text-white font-semibold text-lg">{application.unique_id || application.id}</p>
                </div>

                {/* Applicant Name */}
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-white font-semibold text-lg">{application.applicant_name || 'N/A'}</p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-300" />
                    Email Address
                  </p>
                  <p className="text-white font-semibold">{application.email || 'N/A'}</p>
                </div>


                {/* Job Position */}
                {jobDetails && (
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBriefcase} className="text-blue-300" />
                      Position Applied
                    </p>
                    <p className="text-white font-semibold">{jobDetails.title || 'N/A'}</p>
                    <p className="text-white/60 text-sm mt-1">{jobDetails.company || 'HireSphere'}</p>
                  </div>
                )}

                {/* Application Date */}
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-blue-300" />
                    Application Date
                  </p>
                  <p className="text-white font-semibold">{formatDate(application.created_at)}</p>
                </div>
              </div>
            </div>

            {/* RESUME CARD */}
            {application.requirement_file_url && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FontAwesomeIcon icon={faFilePdf} className="text-blue-300" />
                  Resume / Documents
                </h2>
                <div className="flex items-center gap-4">
                  <a
                    href={application.requirement_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all flex items-center gap-2 font-semibold"
                  >
                    <FontAwesomeIcon icon={faFilePdf} />
                    View Resume
                  </a>
                </div>
              </div>
            )}

            {/* JOB DETAILS CARD */}
            {jobDetails && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-blue-300" />
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Job Title</p>
                    <p className="text-white font-semibold">{jobDetails.title}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Company</p>
                    <p className="text-white font-semibold">{jobDetails.company || 'HireSphere'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Location</p>
                    <p className="text-white font-semibold">{jobDetails.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Job Type</p>
                    <p className="text-white font-semibold">{jobDetails.job_type || 'N/A'}</p>
                  </div>
                  {jobDetails.description && (
                    <div className="md:col-span-2">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Description</p>
                      <p className="text-white/80 text-sm whitespace-pre-wrap">{jobDetails.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            {application.decision !== 'accepted' && application.decision !== 'approved' && application.decision !== 'rejected' && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <FontAwesomeIcon icon={faClock} className="text-yellow-300" />
                  Application Decision
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleDecision('accepted')}
                    disabled={updating}
                    className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {updating ? 'Processing...' : 'Accept Application'}
                  </button>
                  <button
                    onClick={() => handleDecision('rejected')}
                    disabled={updating}
                    className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                    {updating ? 'Processing...' : 'Reject Application'}
                  </button>
                </div>
              </div>
            )}

            {/* DECISION MADE MESSAGE */}
            {(application.decision === 'accepted' || application.decision === 'approved' || application.decision === 'rejected') && (
              <div className={`backdrop-blur-md border rounded-2xl p-6 shadow-xl ${
                application.decision === 'accepted' || application.decision === 'approved'
                  ? 'bg-blue-500/20 border-blue-400/30'
                  : 'bg-red-500/20 border-red-400/30'
              }`}>
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon 
                    icon={application.decision === 'accepted' || application.decision === 'approved' ? faCheckCircle : faTimesCircle} 
                    className={`text-3xl ${
                      application.decision === 'accepted' || application.decision === 'approved'
                        ? 'text-blue-300'
                        : 'text-red-300'
                    }`}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Application {application.decision === 'accepted' || application.decision === 'approved' ? 'Accepted' : 'Rejected'}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      This application has been {application.decision === 'accepted' || application.decision === 'approved' ? 'accepted' : 'rejected'}.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfo;

