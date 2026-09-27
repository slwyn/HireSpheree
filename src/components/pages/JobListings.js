import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../../services/staticDataService";
import Footer from "../Footer";
import { supabase } from "../Services/supabaseClient";

export default function JobListings({ user }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentUser(storedUser);
  }, []);

  useEffect(() => {
    fetchJobs();
    
    // Set up real-time subscription for active jobs
    const channel = supabase
      .channel('public-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'jobs',
          filter: 'is_active=eq.true' // Only listen to active jobs
        },
        (payload) => {
          console.log('Real-time job update received:', payload);
          // Refresh the jobs list when changes occur
          fetchJobs();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to real-time updates for public jobs');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to real-time updates for public jobs');
        }
      });

    subscriptionRef.current = channel;

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job) => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentUser(storedUser);
    navigate("/job-application", { state: { job } });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}
      ></div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        {/* HEADER SECTION */}
        <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-wide">
              JOB <span className="text-blue-300">LISTINGS</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-2">
              Discover exciting career opportunities with HireSphere. Join our team and make a difference in the community.
            </p>
          </div>
        </section>

        {/* JOBS SECTION */}
        <section className="py-6 sm:py-8 px-4 md:px-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-white/80 text-sm sm:text-lg">Loading available positions...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => {
                  const slotsAvailable = job.slots ?? job.slots_available ?? job.slotsAvailable ?? 0;
                  const isFull = slotsAvailable <= 0;
                  
                  return (
                    <div
                      key={job.id}
                      className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl hover:border-blue-400/50 hover:scale-105 transition-all duration-300 flex flex-col"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{job.title}</h3>
                          <p className="text-white/70 text-xs sm:text-sm truncate">{job.company}</p>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${
                          job.job_type === 'Full-time' 
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' 
                            : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                        }`}>
                          {job.job_type}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">
                        {job.description}
                      </p>

                      {/* Job Details */}
                      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                          <span className="text-blue-400 text-base sm:text-lg flex-shrink-0">📍</span>
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                          <span className="text-blue-400 text-base sm:text-lg flex-shrink-0">💰</span>
                          <span className="font-semibold text-white/90 truncate">{job.salary_range}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                          <span className="text-blue-400 text-base sm:text-lg flex-shrink-0">📅</span>
                          <span className="truncate">Posted {new Date(job.posted_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                          <span className="text-blue-400 text-base sm:text-lg flex-shrink-0">👥</span>
                          <span className={`truncate ${isFull ? 'text-red-300' : 'text-blue-300 font-semibold'}`}>
                            {isFull ? 'No slots available' : `${slotsAvailable} slot${slotsAvailable > 1 ? 's' : ''} available`}
                          </span>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <button
                        onClick={(e) => {
                          if (isFull) {
                            e.preventDefault();
                            return;
                          }
                          handleApplyClick(job);
                        }}
                        disabled={isFull}
                        className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                          isFull
                            ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed border border-gray-500/30 pointer-events-none'
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg cursor-pointer'
                        }`}
                      >
                        {isFull ? 'Position Filled' : 'Apply Now'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
                  <div className="text-4xl sm:text-6xl mb-4">📭</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Open Positions</h3>
                  <p className="text-white/70 text-sm sm:text-base">
                    We don't have any job openings at the moment. Please check back later for new opportunities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

