import React, { useState, useEffect, useRef } from 'react';
import { getAllJobsAdmin, createJob, updateJob, deleteJob } from '../../services/staticDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faPlus, faTrash, faEdit, faSave, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { supabaseAdmin } from '../../components/Services/supabaseClient';

const AdminJobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobSlots, setNewJobSlots] = useState(1);
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('Manila, Philippines');
  const [newJobSalary, setNewJobSalary] = useState('Competitive');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlots, setEditSlots] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editJobType, setEditJobType] = useState('Full-time');
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleteJobTitle, setDeleteJobTitle] = useState('');
  const subscriptionRef = useRef(null);

  useEffect(() => {
    fetchJobs();
    
    // Set up real-time subscription for jobs table
    const channel = supabaseAdmin
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          console.log('Real-time job update received:', payload);
          // Refresh the jobs list when changes occur
          fetchJobs();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to real-time updates for jobs');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to real-time updates for jobs');
        }
      });

    subscriptionRef.current = channel;

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (subscriptionRef.current) {
        supabaseAdmin.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobsAdmin();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setErrorMessage('Failed to load jobs. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (e) => {
    if (e) e.preventDefault();
    
    setErrorMessage('');
    setSuccessMessage('');

    const title = newJobTitle.trim();
    const description = newJobDescription.trim();
    const location = newJobLocation.trim();
    const salary = newJobSalary.trim();
    const slots = Number(newJobSlots);

    // Validation
    if (!title) {
      setErrorMessage('Job title is required');
      return;
    }

    if (slots < 0 || isNaN(slots)) {
      setErrorMessage('Please enter a valid number of slots (0 or greater)');
      return;
    }

    if (jobs.some((j) => j.title.toLowerCase() === title.toLowerCase())) {
      setErrorMessage('Job with this title already exists');
      return;
    }

    try {
      const result = await createJob({
        title,
        company: 'HireSphere',
        description: description || `Join our team as a ${title}. We are looking for dedicated individuals to join the HireSphere.`,
        location: location || 'Manila, Philippines',
        salary_range: salary || 'Competitive',
        job_type: newJobType || 'Full-time',
        posted_date: new Date().toISOString().split('T')[0],
        slots_available: slots,
      });

      if (result.success) {
        // Reset form
        setNewJobTitle('');
        setNewJobDescription('');
        setNewJobLocation('Manila, Philippines');
        setNewJobSalary('Competitive');
        setNewJobType('Full-time');
        setNewJobSlots(1);
        setShowAddModal(false);
        setSuccessMessage(`Job "${title}" added successfully!`);
        
        // Refresh jobs list
        await fetchJobs();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Failed to add job. Please try again.');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      setErrorMessage('Failed to add job. Please try again.');
    }
  };

  const resetForm = () => {
    setNewJobTitle('');
    setNewJobDescription('');
    setNewJobLocation('Manila, Philippines');
    setNewJobSalary('Competitive');
    setNewJobType('Full-time');
    setNewJobSlots(1);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openDeleteModal = (job) => {
    setDeleteJobId(job.id);
    setDeleteJobTitle(job.title);
    setShowDeleteModal(true);
  };

  const removeJob = async () => {
    if (!deleteJobId) return;
    
    try {
      const result = await deleteJob(deleteJobId);
      if (result.success) {
        setJobs(jobs.filter((j) => j.id !== deleteJobId));
        setShowDeleteModal(false);
        setDeleteJobId(null);
        setDeleteJobTitle('');
        setSuccessMessage('Job deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Failed to delete job.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setErrorMessage('Failed to delete job. Please try again.');
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditSlots(job.slots ?? job.slots_available ?? 0);
    setEditDescription(job.description || '');
    setEditLocation(job.location || 'Manila, Philippines');
    setEditSalary(job.salary_range || 'Competitive');
    setEditJobType(job.job_type || 'Full-time');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingJob(null);
    setEditTitle('');
    setEditSlots(0);
    setEditDescription('');
    setEditLocation('');
    setEditSalary('');
    setEditJobType('Full-time');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const saveJob = async (e) => {
    if (e) e.preventDefault();
    
    if (!editingJob) return;

    setErrorMessage('');
    setSuccessMessage('');

    const title = editTitle.trim();
    const description = editDescription.trim();
    const location = editLocation.trim();
    const salary = editSalary.trim();
    const slots = Number(editSlots);

    // Validation
    if (!title) {
      setErrorMessage('Job title is required');
      return;
    }

    if (slots < 0 || isNaN(slots)) {
      setErrorMessage('Please enter a valid number of slots (0 or greater)');
      return;
    }

    // Check for duplicate title (excluding current job)
    if (jobs.some((j) => j.id !== editingJob.id && j.title.toLowerCase() === title.toLowerCase())) {
      setErrorMessage('Job with this title already exists');
      return;
    }

    try {
      const result = await updateJob(editingJob.id, {
        title,
        description: description || editingJob.description,
        location: location || editingJob.location,
        salary_range: salary || editingJob.salary_range,
        job_type: editJobType || editingJob.job_type,
        slots_available: slots,
        is_active: editingJob.is_active !== undefined ? editingJob.is_active : true,
      });

      if (result.success) {
        setSuccessMessage(`Job "${title}" updated successfully!`);
        await fetchJobs(); // Refresh jobs list
        setTimeout(() => {
          closeEditModal();
          setSuccessMessage('');
        }, 1500);
      } else {
        setErrorMessage(result.message || 'Failed to update job. Please try again.');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setErrorMessage('Failed to update job. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faBriefcase} className="text-blue-300 text-xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Job Listings</h2>
            <p className="text-white/70 text-sm">Manage available job positions</p>
          </div>
        </div>
      </div>

      {/* SEARCH AND ADD BUTTON */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title, description, or location..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New Job</span>
          </button>
        </div>
      </div>

      {/* JOBS GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faBriefcase} className="text-white/40 text-3xl" />
          </div>
          <p className="text-white/70 text-lg mb-2">No jobs available</p>
          <p className="text-white/50 text-sm">Add a new job to get started</p>
        </div>
       ) : filteredJobs.length === 0 ? (
         <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
             <FontAwesomeIcon icon={faBriefcase} className="text-white/40 text-3xl" />
           </div>
           <p className="text-white/70 text-lg mb-2">No jobs found</p>
           <p className="text-white/50 text-sm">Try adjusting your search criteria or add a new job</p>
         </div>
       ) : (
         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
           {filteredJobs.map((job) => {
            const slotsAvailable = job.slots ?? job.slots_available ?? 0;
            const isEditing = editingJob === job.id;

            return (
              <div
                key={job.id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                    <p className="text-white/60 text-sm">{job.company || 'HireSphere'}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    slotsAvailable > 0
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : 'bg-red-500/20 text-red-300 border border-red-400/30'
                  }`}>
                    {slotsAvailable > 0 ? 'Open' : 'Full'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Available Slots:</span>
                    <span className="text-white font-bold text-lg">{slotsAvailable}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => openEditModal(job)}
                      className="flex-1 px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                      <span className="text-sm font-semibold">Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(job)}
                      className="px-4 py-2 bg-red-600/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
         </div>
       )}

       {/* ADD JOB MODAL */}
       {showAddModal && (
         <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold">Add New Job</h2>
               <button
                 onClick={() => {
                   setShowAddModal(false);
                   resetForm();
                 }}
                 className="text-white/70 hover:text-white transition-all"
               >
                 <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
               </button>
             </div>

             <form onSubmit={addJob} className="space-y-4">
               {/* Error/Success Messages */}
               {errorMessage && (
                 <div className="p-3 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg text-sm">
                   {errorMessage}
                 </div>
               )}
               {successMessage && (
                 <div className="p-3 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg text-sm">
                   {successMessage}
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Job Title */}
                 <div>
                   <label className="block text-white/80 text-sm font-semibold mb-2">Job Title *</label>
                   <input
                     value={newJobTitle}
                     onChange={(e) => setNewJobTitle(e.target.value)}
                     placeholder="e.g., Security Guard, Cleaner"
                     required
                     className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                   />
                 </div>

                 {/* Slots */}
                 <div>
                   <label className="block text-white/80 text-sm font-semibold mb-2">Available Slots *</label>
                   <input
                     value={newJobSlots}
                     onChange={(e) => setNewJobSlots(e.target.value)}
                     type="number"
                     min={0}
                     required
                     className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                   />
                 </div>

                 {/* Location */}
                 <div>
                   <label className="block text-white/80 text-sm font-semibold mb-2">Location</label>
                   <input
                     value={newJobLocation}
                     onChange={(e) => setNewJobLocation(e.target.value)}
                     placeholder="e.g., Manila, Philippines"
                     className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                   />
                 </div>

                 {/* Salary Range */}
                 <div>
                   <label className="block text-white/80 text-sm font-semibold mb-2">Salary Range</label>
                   <input
                     value={newJobSalary}
                     onChange={(e) => setNewJobSalary(e.target.value)}
                     placeholder="e.g., ₱15,000 - ₱20,000"
                     className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                   />
                 </div>

                 {/* Job Type */}
                 <div className="md:col-span-2">
                   <label className="block text-white/80 text-sm font-semibold mb-2">Job Type</label>
                   <select
                     value={newJobType}
                     onChange={(e) => setNewJobType(e.target.value)}
                     className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                   >
                     <option value="Full-time" className="bg-gray-800">Full-time</option>
                     <option value="Part-time" className="bg-gray-800">Part-time</option>
                     <option value="Contract" className="bg-gray-800">Contract</option>
                   </select>
                 </div>
               </div>

               {/* Description */}
               <div>
                 <label className="block text-white/80 text-sm font-semibold mb-2">Job Description</label>
                 <textarea
                   value={newJobDescription}
                   onChange={(e) => setNewJobDescription(e.target.value)}
                   placeholder="Describe the job responsibilities and requirements..."
                   rows={4}
                   className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none"
                 />
               </div>

               {/* Form Actions */}
               <div className="flex items-center gap-3 pt-4">
                 <button
                   type="submit"
                   className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                 >
                   <FontAwesomeIcon icon={faPlus} />
                   <span>Add Job</span>
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     setShowAddModal(false);
                     resetForm();
                   }}
                   className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-all"
                 >
                   Cancel
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* EDIT JOB MODAL */}
       {showEditModal && editingJob && (
         <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-2 sm:px-4">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4 sm:mb-6">
               <h2 className="text-xl sm:text-2xl font-bold">Edit Job</h2>
               <button
                 onClick={closeEditModal}
                 className="text-white/70 hover:text-white transition-all p-1"
                 aria-label="Close"
               >
                 <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
               </button>
             </div>

             <form onSubmit={saveJob} className="space-y-3 sm:space-y-4">
               {/* Error/Success Messages */}
               {errorMessage && (
                 <div className="p-2 sm:p-3 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg text-xs sm:text-sm">
                   {errorMessage}
                 </div>
               )}
               {successMessage && (
                 <div className="p-2 sm:p-3 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-lg text-xs sm:text-sm">
                   {successMessage}
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                 {/* Job Title */}
                 <div>
                   <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Job Title *</label>
                   <input
                     value={editTitle}
                     onChange={(e) => setEditTitle(e.target.value)}
                     placeholder="e.g., Security Guard, Cleaner"
                     required
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm sm:text-base"
                   />
                 </div>

                 {/* Slots */}
                 <div>
                   <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Available Slots *</label>
                   <input
                     value={editSlots}
                     onChange={(e) => setEditSlots(e.target.value)}
                     type="number"
                     min={0}
                     required
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm sm:text-base"
                   />
                 </div>

                 {/* Location */}
                 <div>
                   <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Location</label>
                   <input
                     value={editLocation}
                     onChange={(e) => setEditLocation(e.target.value)}
                     placeholder="e.g., Manila, Philippines"
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm sm:text-base"
                   />
                 </div>

                 {/* Salary Range */}
                 <div>
                   <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Salary Range</label>
                   <input
                     value={editSalary}
                     onChange={(e) => setEditSalary(e.target.value)}
                     placeholder="e.g., ₱15,000 - ₱20,000"
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm sm:text-base"
                   />
                 </div>

                 {/* Job Type */}
                 <div className="md:col-span-2">
                   <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Job Type</label>
                   <select
                     value={editJobType}
                     onChange={(e) => setEditJobType(e.target.value)}
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm sm:text-base"
                   >
                     <option value="Full-time" className="bg-gray-800">Full-time</option>
                     <option value="Part-time" className="bg-gray-800">Part-time</option>
                     <option value="Contract" className="bg-gray-800">Contract</option>
                   </select>
                 </div>
               </div>

               {/* Description */}
               <div>
                 <label className="block text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Job Description</label>
                 <textarea
                   value={editDescription}
                   onChange={(e) => setEditDescription(e.target.value)}
                   placeholder="Describe the job responsibilities and requirements..."
                   rows={4}
                   className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all resize-none text-sm sm:text-base"
                 />
               </div>

               {/* Form Actions */}
               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
                 <button
                   type="submit"
                   className="flex-1 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                 >
                   <FontAwesomeIcon icon={faSave} />
                   <span>Save Changes</span>
                 </button>
                 <button
                   type="button"
                   onClick={closeEditModal}
                   className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-all text-sm sm:text-base"
                 >
                   Cancel
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* DELETE JOB MODAL */}
       {showDeleteModal && (
         <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
             <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <FontAwesomeIcon icon={faTrash} className="text-red-300 text-2xl" />
             </div>
             <h2 className="text-2xl font-bold mb-4">Delete Job?</h2>
             <p className="text-white/70 mb-2">Are you sure you want to delete this job?</p>
             <p className="text-white/90 font-semibold mb-8 text-lg">"{deleteJobTitle}"</p>
             <p className="text-white/60 text-sm mb-8">This action cannot be undone.</p>
             <div className="flex gap-4">
               <button
                 onClick={() => {
                   setShowDeleteModal(false);
                   setDeleteJobId(null);
                   setDeleteJobTitle('');
                 }}
                 className="flex-1 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
               >
                 Cancel
               </button>
               <button
                 onClick={removeJob}
                 className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
               >
                 Delete
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default AdminJobListings;
