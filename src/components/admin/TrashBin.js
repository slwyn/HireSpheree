import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getDeletedApplications, restoreApplication, deleteApplication } from '../../services/staticDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateLeft, faCheckSquare, faSquare, faArchive } from '@fortawesome/free-solid-svg-icons';
import { supabaseAdmin } from '../../components/Services/supabaseClient';

const TrashBin = () => {
  const [trash, setTrash] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, applicantId: null });
  const subscriptionRef = useRef(null);

  useEffect(() => {
    fetchTrash();
    
    // Set up real-time subscription for deleted applications
    const channel = supabaseAdmin
      .channel('trash-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'applications'
          // Note: We listen to all changes and filter in fetchTrash
          // Real-time filters have limitations, so we filter after fetching
        },
        (payload) => {
          console.log('Real-time trash update received:', payload);
          // Refresh the trash list when changes occur
          // This will handle both soft deletes (deleted_at set) and restores (deleted_at cleared)
          fetchTrash();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to real-time updates for trash');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to real-time updates for trash');
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

  const fetchTrash = async () => {
    try {
      const deletedApps = await getDeletedApplications();
      setTrash(Array.isArray(deletedApps) ? deletedApps : []);
    } catch (error) {
      console.error('Error fetching trash:', error);
      setTrash([]);
    }
  };

  const handleApplicantClick = (uniqueId) => {
    setContextMenu({ visible: false });
    if (selectedApplicants.includes(uniqueId)) {
      setSelectedApplicants(selectedApplicants.filter(id => id !== uniqueId));
    } else {
      setSelectedApplicants([...selectedApplicants, uniqueId]);
    }
  };

  const handleRestoreSelected = async () => {
    try {
      // Get application IDs from unique_ids
      const applicationIds = selectedApplicants.map(uniqueId => {
        const applicant = trash.find(a => a.unique_id === uniqueId);
        return applicant?.id;
      }).filter(Boolean);

      // Restore all selected applications
      await Promise.all(applicationIds.map(id => restoreApplication(id)));

      // Refresh the trash list
      await fetchTrash();
      
      setSelectedApplicants([]);
      setIsRestoreModalOpen(false);
    } catch (error) {
      console.error('Error restoring applications:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Get application IDs from unique_ids
      const applicationIds = selectedApplicants.map(uniqueId => {
        const applicant = trash.find(a => a.unique_id === uniqueId);
        return applicant?.id;
      }).filter(Boolean);

      // Permanently delete all selected applications
      await Promise.all(applicationIds.map(id => deleteApplication(id)));

      // Refresh the trash list
      await fetchTrash();
      
      setSelectedApplicants([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting applicants from trash:', error);
    }
  };

  const selectAllApplicants = () => {
    if (selectedApplicants.length === trash.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(trash.map((applicant) => applicant.unique_id));
    }
  };

  const handleRestoreSingle = (uniqueId) => {
    handleApplicantClick(uniqueId);
    setIsRestoreModalOpen(true);
  };

  const handleDeleteSingle = (uniqueId) => {
    handleApplicantClick(uniqueId);
    setIsDeleteModalOpen(true);
  };

  const handleContextMenu = (e, applicantId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, applicantId });
  };

  const handleInputChange = (e) => { 
    setSearchTerm(e.target.value.toLowerCase());
  }

  const formatName = (applicant) => {
    if (applicant.applicant_name) {
      return applicant.applicant_name.toUpperCase();
    }
    // Fallback if name is split
    return `${applicant.surname || ''}, ${applicant.first_name || ''} ${applicant.middle_name || ''}`.trim().toUpperCase() || 'N/A';
  };

  const filteredApplicants = useMemo(() => {
    return trash.filter(applicant =>
      applicant.unique_id.toLowerCase().includes(searchTerm)
    );
  }, [trash, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto" onClick={() => setContextMenu({ visible: false })}>
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faArchive} className="text-blue-300 text-xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Archive</h2>
            <p className="text-white/70 text-sm">Restore or permanently delete archived applications</p>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl mb-6">
        {selectedApplicants.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-xl">
            <div className="text-white font-semibold">
              Selected: <span className="font-bold text-blue-300">{selectedApplicants.length}</span> applicant(s)
            </div>
            <div className="flex gap-3">
              <button
                onClick={selectAllApplicants}
                className="px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all font-semibold"
              >
                {selectedApplicants.length === trash.length ? "Deselect All" : "Select All"}
              </button>
              <button
                onClick={() => setIsRestoreModalOpen(true)}
                disabled={selectedApplicants.length === 0}
                className="px-4 py-2 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faRotateLeft} />
                <span>Restore</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={selectedApplicants.length === 0}
                className="px-4 py-2 bg-red-600/20 border border-red-400/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by Application ID..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            onClick={fetchTrash}
            className="px-4 py-3 bg-blue-600/20 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-all"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* TRASH LIST */}
      {trash.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faArchive} className="text-white/40 text-3xl" />
          </div>
          <p className="text-white/70 text-lg mb-2">No applicants in trash</p>
          <p className="text-white/50 text-sm">Deleted applications will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplicants.map((applicant, index) => {
            const isSelected = selectedApplicants.includes(applicant.unique_id);
            return (
              <div
                key={applicant.unique_id}
                className={`bg-white/10 backdrop-blur-md border rounded-xl p-5 shadow-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-400/50 bg-red-500/20'
                    : 'border-white/10 hover:border-blue-400/50 hover:bg-white/15'
                }`}
                onClick={() => handleApplicantClick(applicant.unique_id)}
                onContextMenu={(e) => handleContextMenu(e, applicant.unique_id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 border-blue-400' : 'border-white/30'
                    }`}>
                      {isSelected && <FontAwesomeIcon icon={faCheckSquare} className="text-white text-xs" />}
                    </div>
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-300 font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider">ID</p>
                      <p className="text-white font-semibold text-sm">{applicant.unique_id}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Name</p>
                    <p className="text-white font-semibold">{formatName(applicant)}</p>
                  </div>

                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Position</p>
                    <p className="text-white font-semibold">{applicant.job_position || 'N/A'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RESTORE MODAL */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faRotateLeft} className="text-blue-300 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Restore Selected Applications?</h2>
            <p className="text-white/70 mb-8">Are you sure you want to restore {selectedApplicants.length} selected applicant(s)? This will move them back to the dashboard.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsRestoreModalOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreSelected}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-300 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Permanently Delete?</h2>
            <p className="text-white/70 mb-8">Are you sure you want to permanently delete {selectedApplicants.length} selected applicant(s)? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEXT MENU */}
      {contextMenu.visible && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="absolute bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-2 rounded-lg z-50 min-w-[180px]"
        >
          <button
            onClick={() => handleRestoreSingle(contextMenu.applicantId)}
            className="w-full text-left px-4 py-2 text-blue-300 hover:bg-blue-600/20 rounded-lg transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="h-4 w-4" />
            <span>Restore</span>
          </button>
          <button
            onClick={() => handleDeleteSingle(contextMenu.applicantId)}
            className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-600/20 rounded-lg transition-all flex items-center gap-2 mt-1"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            <span>Delete Permanently</span>
          </button>
          <button
            onClick={selectAllApplicants}
            className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 mt-1"
          >
            <FontAwesomeIcon icon={selectedApplicants.length === trash.length ? faCheckSquare : faSquare} className="h-4 w-4" />
            <span>{selectedApplicants.length === trash.length ? "Deselect All" : "Select All"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TrashBin;
