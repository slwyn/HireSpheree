// Supabase-backed data service
import { supabase, supabaseAdmin } from "../components/Services/supabaseClient";

// User Registration
export const registerUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .insert({
      first_name: userData.first_name,
      middle_name: userData.middle_name || "",
      surname: userData.surname,
      email: userData.email,
      contact_number: userData.contact_number || "",
      password_hash: userData.password, // TODO: hash securely
      verified: true,
    })
    .select()
    .maybeSingle();

  if (error) return { status: 0, message: error.message };
  return { status: 1, message: "Registration successful", user: data };
};

// Forgot Password
export const forgotPassword = async (email) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("tokens").insert({
    token,
    email,
    type: "password_reset",
    expires_at: expiresAt,
  });

  if (error) return { status: 0, message: error.message };

  const resetLink = `${window.location.origin}/new-password/${token}/${encodeURIComponent(email)}`;
  return { status: 1, message: "Password reset link sent", reset_link: resetLink };
};

// Reset Password
export const resetPassword = async (email, token, newPassword) => {
  const { data: tokenRow, error: tokenErr } = await supabase
    .from("tokens")
    .select("*")
    .eq("token", token)
    .eq("email", email)
    .eq("type", "password_reset")
    .maybeSingle();

  if (tokenErr || !tokenRow) return { status: 0, message: "Invalid token" };

  if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
    await supabase.from("tokens").delete().eq("token", token);
    return { status: 0, message: "Token has expired" };
  }

  const { error: updateErr } = await supabase
    .from("users")
    .update({ password_hash: newPassword })
    .eq("email", email);

  if (updateErr) return { status: 0, message: updateErr.message };

  await supabase.from("tokens").delete().eq("token", token);
  return { status: 1, message: "Password reset successfully" };
};

// User Login
export const loginUser = async (email, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password_hash", password)
    .maybeSingle();

  if (error || !data) return { status: 0, message: "Invalid email or password" };

  const { password_hash, ...userData } = data;
  return { status: 1, message: "Login successful", user: userData };
};

// Get All Users
export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// Delete Users
export const deleteUsers = async (userIds) => {
  const { error } = await supabase.from("users").delete().in("id", userIds);
  if (error) return { status: 0, message: error.message };
  return { status: 1, message: "Users deleted successfully" };
};

// Submit Job Application
export const submitApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: applicationData.user_id || null,
      job_id: applicationData.job_id || null,
      applicant_name: applicationData.applicant_name || applicationData.first_name || "",
      email: applicationData.email,
      tel: applicationData.tel || applicationData.contact || "",
      requirement_file_url: applicationData.requirement_file_url || null,
      unique_id: applicationData.unique_id || null,
      decision: "pending",
    })
    .select()
    .maybeSingle();

  if (error) return { status: 0, message: error.message };

  return {
    status: 1,
    message: "Application submitted successfully",
    unique_id: data?.unique_id || data?.id,
  };
};

// Get All Applications (non-deleted only)
export const getApplications = async () => {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select(`
      *,
      jobs (
        id,
        title,
        company
      )
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Get Deleted Applications (for trash bin)
export const getDeletedApplications = async () => {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Soft Delete Application (move to trash)
export const softDeleteApplication = async (applicationId) => {
  const { error } = await supabaseAdmin
    .from("applications")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", applicationId);
  if (error) return { status: 0, message: error.message };
  return { status: 1, message: "Application moved to trash successfully" };
};

// Restore Application (from trash)
export const restoreApplication = async (applicationId) => {
  const { error } = await supabaseAdmin
    .from("applications")
    .update({ deleted_at: null })
    .eq("id", applicationId);
  if (error) return { status: 0, message: error.message };
  return { status: 1, message: "Application restored successfully" };
};

// Permanently Delete Application
export const deleteApplication = async (applicationId) => {
  const { error } = await supabaseAdmin
    .from("applications")
    .delete()
    .eq("id", applicationId);
  if (error) return { status: 0, message: error.message };
  return { status: 1, message: "Application permanently deleted" };
};

// Get All Jobs (active only for public)
export const getJobs = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("posted_date", { ascending: false });

  if (error) throw error;
  return { success: true, jobs: data || [] };
};

// Create Job Application (used by modal)
export const createJobApplication = async (formData) => {
  try {
    // Generate unique_id if not provided
    const uniqueId = formData.unique_id || `APP-${Date.now()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    
    // Ensure email is not null or empty (database constraint requires NOT NULL)
    if (!formData.email || formData.email.trim() === "") {
      return { 
        success: false, 
        message: 'Email address is required' 
      };
    }
    
    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: formData.userId || null,
        job_id: formData.jobId || null,
        email: formData.email.trim(), // Email is required
        tel: null, // Phone number not used
        applicant_name: formData.applicant_name || null,
        requirement_file_url: formData.resume_url || null,
        unique_id: uniqueId,
        decision: "pending",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Application creation error:', error);
      
      // Provide helpful error message for RLS violations
      if (error.message && error.message.includes('row-level security')) {
        return { 
          success: false, 
          message: 'Permission denied. Please ensure RLS policies allow public application submissions. See fix_rls_applications_policy.sql for the fix.' 
        };
      }
      
      return { success: false, message: error.message || 'Failed to submit application' };
    }
    
    return { success: true, message: "Application submitted successfully", data };
  } catch (err) {
    console.error('Application creation exception:', err);
    return { 
      success: false, 
      message: err.message || 'An unexpected error occurred while submitting the application' 
    };
  }
};

// ============================================
// ADMIN FUNCTIONS (using supabaseAdmin)
// ============================================

// Create Job (Admin only)
export const createJob = async (jobData) => {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({
      title: jobData.title,
      company: jobData.company || 'HireSphere',
      description: jobData.description || '',
      location: jobData.location || 'Manila, Philippines',
      salary_range: jobData.salary_range || 'Competitive',
      job_type: jobData.job_type || 'Full-time',
      posted_date: jobData.posted_date || new Date().toISOString().split('T')[0],
      slots_available: jobData.slots_available || 0,
      is_active: true,
    })
    .select()
    .maybeSingle();

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Job created successfully", job: data };
};

// Update Job (Admin only)
export const updateJob = async (jobId, jobData) => {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .update({
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      salary_range: jobData.salary_range,
      job_type: jobData.job_type,
      slots_available: jobData.slots_available,
      is_active: jobData.is_active !== undefined ? jobData.is_active : true,
    })
    .eq("id", jobId)
    .select()
    .maybeSingle();

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Job updated successfully", job: data };
};

// Delete Job (Admin only)
export const deleteJob = async (jobId) => {
  const { error } = await supabaseAdmin
    .from("jobs")
    .delete()
    .eq("id", jobId);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Job deleted successfully" };
};

// Get All Jobs (Admin - includes inactive)
export const getAllJobsAdmin = async () => {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .order("posted_date", { ascending: false });

  if (error) throw error;
  return { success: true, jobs: data || [] };
};

// Update Application Decision (Admin only)
export const updateApplicationDecision = async (applicationId, decision, notes = null) => {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .update({
      decision: decision,
      notes: notes,
    })
    .eq("id", applicationId)
    .select()
    .maybeSingle();

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Application updated successfully", application: data };
};

// Get Applications with Job Details (Admin)
export const getApplicationsWithDetails = async () => {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select(`
      *,
      jobs (
        id,
        title,
        company,
        location,
        job_type,
        description
      )
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  // Ensure unique_id exists for all applications
  return (data || []).map(app => ({
    ...app,
    unique_id: app.unique_id || app.id
  }));
};

// Upload File to Supabase Storage
export const uploadFile = async (file, folder = 'resumes') => {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `${folder}/${fileName}`;
  const bucketName = 'resume';

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      
      // Provide helpful error message for missing bucket
      if (error.message && error.message.includes('Bucket not found')) {
        return { 
          success: false, 
          message: `Storage bucket '${bucketName}' not found. Please create it in Supabase Dashboard → Storage. See SUPABASE_STORAGE_SETUP.md for instructions.` 
        };
      }
      
      return { success: false, message: error.message || 'Failed to upload file' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl, path: filePath };
  } catch (err) {
    console.error('Upload exception:', err);
    return { 
      success: false, 
      message: err.message || 'An unexpected error occurred while uploading the file' 
    };
  }
};

