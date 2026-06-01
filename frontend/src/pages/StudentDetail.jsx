import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Building,
  GraduationCap,
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentService.getById(id);
        if (response.success) {
          setStudent(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to retrieve student directory record');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate, toast]);

  const handleDeleteConfirm = async () => {
    if (!student) return;
    setDeleting(true);
    try {
      const response = await studentService.delete(student._id);
      if (response.success) {
        toast.success(`Successfully removed profile for ${student.fullName}`);
        navigate('/students');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete student record');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Retrieving student folder...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Record Not Found</h3>
        <p className="text-slate-400 mt-2">The requested student file could not be retrieved from the server.</p>
        <Link to="/students" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-semibold underline">
          Return to Directory
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(student.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back button and profile actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/students"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
            title="Back to directory"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 px-3 py-1 rounded-full flex items-center gap-1 font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Active Student Directory</span>
          </span>
        </div>

        {/* Admin Quick Action Handles */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to={`/students/edit/${student._id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl transition-all shadow-sm"
            >
              <Edit2 className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Modify Details</span>
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4 shrink-0 text-rose-500" />
              <span>Erase Record</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Premium Academic ID Card badge */}
        <div className="glass-card rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl h-fit">
          {/* Accent Header background */}
          <div className="h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 relative flex items-center justify-center">
            <Award className="absolute -bottom-8 right-6 w-16 h-16 text-indigo-500/20 shrink-0" />
          </div>

          <div className="px-6 pb-6 flex flex-col items-center text-center -mt-12 relative z-10">
            {/* Real Avatar */}
            <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 p-1 shadow-lg border border-slate-100/50 dark:border-slate-700/30 overflow-hidden mb-3">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                {student.profilePhoto ? (
                  <img
                    src={student.profilePhoto.startsWith('/uploads/') ? `http://localhost:5000${student.profilePhoto}` : student.profilePhoto}
                    alt={student.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-2xl text-slate-500 dark:text-slate-400">{student.fullName.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Display names */}
            <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-snug">{student.fullName}</h3>
            <span className="font-mono text-xs font-semibold text-slate-400 mt-1 block block select-all">{student.studentId}</span>

            {/* Micro Details Grid inside Badge */}
            <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-100 dark:border-slate-800/80 mt-6 pt-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex flex-col items-center bg-slate-50/50 dark:bg-slate-800/40 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Branch</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{student.branch}</span>
              </div>
              <div className="flex flex-col items-center bg-slate-50/50 dark:bg-slate-800/40 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Semester</span>
                <span className="font-bold text-slate-800 dark:text-white mt-0.5">Sem {student.semester}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tabular Detailed Dossier information */}
        <div className="glass-card p-6 md:col-span-2 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            Academic Profile details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Email Field */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email Address</span>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href={`mailto:${student.email}`} className="hover:underline">{student.email}</a>
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Contact Phone Number</span>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href={`tel:${student.phone}`} className="hover:underline">{student.phone}</a>
              </div>
            </div>

            {/* Major Branch Detail */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Academic Branch</span>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{student.branch} - Engineering Department</span>
              </div>
            </div>

            {/* Semester Detail */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Semester Level</span>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Semester {student.semester} (Undergraduate)</span>
              </div>
            </div>

            {/* Address Field */}
            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Residential Address</span>
              <div className="flex items-start gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 leading-normal">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{student.address}</span>
              </div>
            </div>

            {/* Created Timestamp */}
            <div className="space-y-1 sm:col-span-2 border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Dossier first cataloged on: <span className="text-slate-600 dark:text-slate-300">{formattedDate}</span></span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Delete Confirmation Overlay */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently delete the profile directory for ${student.fullName} (${student.studentId})? This will erase all enrollment documents and photos from local logs. This action is irreversible.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        cancelText="Keep Profile"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default StudentDetail;
