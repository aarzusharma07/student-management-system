import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  XCircle,
  GraduationCap
} from 'lucide-react';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  
  // Search and filter parameters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [semester, setSemester] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal parameters
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();
  const { isAdmin } = useAuth();

  // Load students data
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await studentService.getAll({
        search,
        branch,
        semester,
        page: currentPage,
        limit: 8, // Sleek fits on normal desktop views
      });
      if (response.success) {
        setStudents(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students directory');
    } finally {
      setLoading(false);
    }
  }, [search, branch, semester, currentPage, toast]);

  useEffect(() => {
    // Debounce search slightly or let standard loads trigger
    loadStudents();
  }, [loadStudents]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset page on new query
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearch('');
    setBranch('All');
    setSemester('All');
    setCurrentPage(1);
    toast.info('Filters cleared');
  };

  // Handle Delete trigger click
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Perform delete execution
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      const response = await studentService.delete(studentToDelete._id);
      if (response.success) {
        toast.success(`Successfully removed record for ${studentToDelete.fullName}`);
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
        // Refresh list
        loadStudents();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete student record');
    } finally {
      setDeleting(false);
    }
  };

  // Export data to CSV helper
  const handleExportCSV = async () => {
    try {
      toast.info('Preparing CSV export...');
      // Fetch all students (limit: 1000 to grab everything)
      const res = await studentService.getAll({ limit: 1000 });
      if (res.success && res.data.length > 0) {
        const headers = ['Student ID', 'Full Name', 'Email', 'Phone', 'Branch', 'Semester', 'Address', 'Registration Date'];
        const csvRows = [
          headers.join(','),
          ...res.data.map(stu => [
            stu.studentId,
            `"${stu.fullName.replace(/"/g, '""')}"`,
            stu.email,
            `"${stu.phone}"`,
            stu.branch,
            stu.semester,
            `"${stu.address.replace(/"/g, '""')}"`,
            new Date(stu.createdAt).toLocaleDateString()
          ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `academix_students_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Students directory exported to CSV successfully!');
      } else {
        toast.warning('No student records found to export');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to export students data');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Management</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, view details, enroll, and manage student folders.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-95 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Export CSV</span>
          </button>
          
          {isAdmin && (
            <Link
              to="/students/add"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Student</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Panel Card */}
      <div className="glass-card p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, ID, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm shadow-sm"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Branch</span>
            <select
              value={branch}
              onChange={(e) => { setBranch(e.target.value); setCurrentPage(1); }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all shadow-sm"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EE">EE</option>
            </select>
          </div>

          {/* Semester Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Semester</span>
            <select
              value={semester}
              onChange={(e) => { setSemester(e.target.value); setCurrentPage(1); }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all shadow-sm"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {/* Clear Button */}
          {(search || branch !== 'All' || semester !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-semibold text-sm flex items-center gap-1.5 border border-dashed border-rose-200 dark:border-rose-500/30"
              title="Reset Filters"
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="glass-card rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching students data...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/20">
                  <th className="py-4 px-6">Student details</th>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Branch</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {students.map((stu) => (
                  <tr key={stu._id} className="group hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-all">
                    {/* Photo + Name + Email */}
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 shadow-sm shrink-0">
                        {stu.profilePhoto ? (
                          <img
                            src={stu.profilePhoto.startsWith('/uploads/') ? `http://localhost:5000${stu.profilePhoto}` : stu.profilePhoto}
                            alt={stu.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-sm text-slate-500 dark:text-slate-400">{stu.fullName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 dark:text-white leading-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{stu.fullName}</span>
                        <span className="text-xs text-slate-400 font-medium truncate">{stu.email}</span>
                      </div>
                    </td>
                    
                    {/* ID */}
                    <td className="py-3.5 px-6 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {stu.studentId}
                    </td>

                    {/* Branch Badge */}
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg inline-block ${
                        stu.branch === 'CSE' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        stu.branch === 'ECE' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        stu.branch === 'IT' ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                        'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                      }`}>
                        {stu.branch}
                      </span>
                    </td>

                    {/* Semester */}
                    <td className="py-3.5 px-6 font-medium text-slate-700 dark:text-slate-300">
                      Sem {stu.semester}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 font-semibold text-xs">
                      {stu.phone}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Profile Details */}
                        <Link
                          to={`/students/${stu._id}`}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all shadow-sm"
                          title="View Profile Card"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit (Admin only) */}
                        {isAdmin && (
                          <Link
                            to={`/students/edit/${stu._id}`}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all shadow-sm"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Delete (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteClick(stu)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all shadow-sm"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              <GraduationCap className="w-12 h-12" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-white">No Student Records Found</h4>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 max-w-sm">
              We couldn't find any profiles matching your search or filters. Try adjusting your fields or add a new student.
            </p>
            {(search || branch !== 'All' || semester !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="mt-2 py-2 px-4 rounded-xl text-sm font-semibold border border-indigo-600/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Dynamic Pagination Footer */}
        {students.length > 0 && pagination.pages > 1 && (
          <div className="flex items-center justify-between p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-bold text-slate-800 dark:text-white">{students.length}</span> of{' '}
              <span className="font-bold text-slate-800 dark:text-white">{pagination.total}</span> enrolled students
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm text-xs ${
                      currentPage === p
                        ? 'bg-indigo-600 text-white shadow-indigo-600/25'
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={currentPage === pagination.pages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently delete the profile directory for ${studentToDelete?.fullName} (${studentToDelete?.studentId})? This will erase all enrollment documents and photos from local logs. This action is irreversible.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        cancelText="Keep Profile"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
      />
    </div>
  );
};

export default StudentList;
