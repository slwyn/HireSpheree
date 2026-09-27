import { Button, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { faRefresh, faAddressBook, faTrash, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { getApplicationsWithDetails, softDeleteApplication } from '../../services/staticDataService';
import { supabaseAdmin } from '../../components/Services/supabaseClient';

const UserApplications = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMultiDeleteActive, setIsMultiDeleteActive] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, applicantId: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
    
    // Set up real-time subscription for applications table
    const channel = supabaseAdmin
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'applications'
          // Note: We listen to all changes and filter in fetchApplicants
          // Real-time filters have limitations, so we filter after fetching
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Only refresh if it's not a delete operation or if deleted_at changed
          // For INSERT and UPDATE, always refresh to get latest data
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            fetchApplicants();
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted item from list immediately
            setApplicants(prev => prev.filter(app => app.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to real-time updates for applications');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to real-time updates');
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

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError('');
      const currentApplicants = await getApplicationsWithDetails();
      // Filter out deleted applications and add job_position from job details
      const filtered = (Array.isArray(currentApplicants) ? currentApplicants : [])
        .filter(app => !app.deleted_at)
        .map(app => ({
          ...app,
          job_position: app.jobs?.title || 'N/A',
          unique_id: app.unique_id || app.id || `APP-${app.id}`
        }));
      setApplicants(filtered);
      if (filtered.length === 0) {
        setError('No applications found. Applications submitted by users will appear here.');
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setError(`Failed to load applications: ${error.message || 'Unknown error'}`);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleApplicantClick = (applicant) => {
    if (isMultiDeleteActive) {
      setSelectedApplicants((prevSelected) =>
        prevSelected.includes(applicant.unique_id)
          ? prevSelected.filter(id => id !== applicant.unique_id)
          : [...prevSelected, applicant.unique_id]
      );
    } else {
      navigate(`/application-info/${applicant.unique_id}`, { state: { application: applicant } });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Get application IDs from unique_ids
      const applicationIds = selectedApplicants.map(uniqueId => {
        const applicant = applicants.find(a => a.unique_id === uniqueId);
        return applicant?.id;
      }).filter(Boolean);

      // Soft delete all selected applications
      await Promise.all(applicationIds.map(id => softDeleteApplication(id)));

      // Refresh the list
      await fetchApplicants();
      
      setSelectedApplicants([]);
      setIsDeleteModalOpen(false);
      setContextMenu({ visible: false });
      setIsMultiDeleteActive(false);
      
    } catch (error) {
      console.error('Error moving applicants to trash:', error);
    }
  };

  const handleDeleteSingle = (applicantId) => {
    setSelectedApplicants([applicantId]);
    setIsDeleteModalOpen(true);
    setContextMenu({ visible: false });
  };

  const handleContextMenu = (e, applicantId) => {
    e.preventDefault();
    const xPos = `${e.clientX + window.pageXOffset}px`;
    const yPos = `${e.clientY + window.pageYOffset}px`;
    setContextMenu({ visible: true, x: xPos, y: yPos, applicantId });
  };

  const toggleMultiDeleteMode = () => {
    setIsMultiDeleteActive((prev) => !prev);
    setSelectedApplicants([]);
  };

  const selectAllApplicants = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map((applicant) => applicant.unique_id));
    }
  };

  const formatName = (applicant) => {
    if (applicant.applicant_name) {
      return applicant.applicant_name.toUpperCase();
    }
    // Fallback if name is split
    return `${applicant.surname || ''}, ${applicant.first_name || ''} ${applicant.middle_name || ''}`.trim().toUpperCase() || 'N/A';
  };

  const filteredApplicants = applicants.filter((applicant) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const uniqueId = String(applicant.unique_id || applicant.id || '').toLowerCase();
    const name = formatName(applicant).toLowerCase();
    const position = (applicant.job_position || '').toLowerCase();
    const email = (applicant.email || '').toLowerCase();
    
    return uniqueId.includes(search) || 
           name.includes(search) || 
           position.includes(search) ||
           email.includes(search);
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value.toString());
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplicants().finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    });
  }

  return (
    <div
      className="max-w-7xl mx-auto"
      onClick={() => setContextMenu({ visible: false })}
    >
      {/* HEADER */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faAddressBook} className="text-blue-300 text-lg sm:text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">User Applications</h2>
            <p className="text-white/70 text-xs sm:text-sm">Manage and review submitted applications</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
              <span className="text-white/60 text-xs">
                Total: <span className="font-bold text-white">{applicants.length}</span>
              </span>
              <span className="text-yellow-300/60 text-xs">
                Pending: <span className="font-bold text-yellow-300">
                  {applicants.filter(a => !a.decision || a.decision === 'pending').length}
                </span>
              </span>
              <span className="text-blue-300/60 text-xs">
                Accepted: <span className="font-bold text-blue-300">
                  {applicants.filter(a => a.decision === 'accepted' || a.decision === 'approved').length}
                </span>
              </span>
              <span className="text-red-300/60 text-xs">
                Rejected: <span className="font-bold text-red-300">
                  {applicants.filter(a => a.decision === 'rejected').length}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4">
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faRefresh} className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="font-semibold">Refresh</span>
          </button>
          <button
            onClick={toggleMultiDeleteMode}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              isMultiDeleteActive
                ? 'bg-red-600/20 border border-red-400/30 text-red-300 hover:bg-red-600/30'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <FontAwesomeIcon icon={isMultiDeleteActive ? faCheckSquare : faSquare} className="h-4 w-4" />
            <span className="font-semibold">{isMultiDeleteActive ? 'Cancel Multi' : 'Multi Select'}</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl mb-4 sm:mb-6">
        {isMultiDeleteActive && selectedApplicants.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 p-3 sm:p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg sm:rounded-xl">
            <div className="text-white font-semibold text-sm sm:text-base">
              Selected: <span className="font-bold text-blue-300">{selectedApplicants.length}</span> applicant(s)
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={selectAllApplicants}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all font-semibold text-sm sm:text-base"
              >
                {selectedApplicants.length === applicants.length ? "Deselect All" : "Select All"}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={selectedApplicants.length === 0}
                className="w-full sm:w-auto px-4 py-2 bg-red-600/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by ID, Name, Position, or Email..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-sm sm:text-base"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faRefresh} className={`h-4 w-4 sm:h-5 sm:w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && !loading && (
        <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* APPLICATIONS LIST */}
      {loading || refreshing ? ( 
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div> 
      ) : (
        <>
          {filteredApplicants.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faAddressBook} className="text-white/40 text-3xl" />
              </div>
              <p className="text-white/70 text-lg mb-2">
                {searchTerm ? 'No applications match your search' : 'No applications found'}
              </p>
              <p className="text-white/50 text-sm">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Applications submitted by users will appear here'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplicants.map((applicant, index) => {
                const isSelected = selectedApplicants.includes(applicant.unique_id);
                const decisionColor = 
                  applicant.decision === 'approved' || applicant.decision === 'accepted' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                  applicant.decision === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-400/30' :
                  'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';

                return (
                  <div
                    key={applicant.unique_id}
                    className={`bg-white/10 backdrop-blur-md border rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-400/50 bg-red-500/20'
                        : 'border-white/10 hover:border-blue-400/50 hover:bg-white/15'
                    }`}
                    onClick={() => handleApplicantClick(applicant)}
                    onContextMenu={(e) => handleContextMenu(e, applicant.unique_id)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-start md:items-center">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {isMultiDeleteActive && (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-blue-600 border-blue-400' : 'border-white/30'
                          }`}>
                            {isSelected && <FontAwesomeIcon icon={faCheckSquare} className="text-white text-xs" />}
                          </div>
                        )}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-300 font-bold text-xs sm:text-sm">#{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white/60 text-xs uppercase tracking-wider">ID</p>
                          <p className="text-white font-semibold text-xs sm:text-sm truncate">{applicant.unique_id}</p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Name</p>
                        <p className="text-white font-semibold text-sm sm:text-base truncate">{formatName(applicant)}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Position</p>
                        <p className="text-white font-semibold text-sm sm:text-base truncate">{applicant.job_position || 'N/A'}</p>
                      </div>

                      <div className="flex items-center justify-start md:justify-end">
                        <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold border ${decisionColor} whitespace-nowrap`}>
                          {applicant.decision ? applicant.decision.toUpperCase() : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl text-center w-full max-w-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-300 text-xl sm:text-2xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Delete Selected Applications?</h2>
            <p className="text-white/70 mb-6 sm:mb-8 text-sm sm:text-base">Are you sure you want to delete {selectedApplicants.length} selected applicant(s)? This action cannot be undone.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-2.5 sm:py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT MENU */}
      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-2 rounded-lg z-50 min-w-[180px]"
        >
          <button
            onClick={() => handleDeleteSingle(contextMenu.applicantId)}
            className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-600/20 rounded-lg transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            <span>Delete</span>
          </button>
          <button
            onClick={toggleMultiDeleteMode}
            className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 mt-1"
          >
            <FontAwesomeIcon icon={isMultiDeleteActive ? faCheckSquare : faSquare} className="h-4 w-4" />
            <span>{isMultiDeleteActive ? "Cancel Multi" : "Multiple Deletion"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserApplications;
