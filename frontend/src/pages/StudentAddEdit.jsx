import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Layers,
  BookOpen,
  CheckCircle,
  Loader2,
  Trash2
} from 'lucide-react';

const StudentAddEdit = () => {
  const { id } = useParams(); // Exists if we are on '/students/edit/:id'
  const isEditMode = !!id;

  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form Fields State
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState(1);
  const [address, setAddress] = useState('');

  // Image upload handling
  const [photoType, setPhotoType] = useState('file'); // 'file' or 'url'
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Error States
  const [errors, setErrors] = useState({});

  // Load student data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        setFetching(true);
        try {
          const response = await studentService.getById(id);
          if (response.success && response.data) {
            const stu = response.data;
            setStudentId(stu.studentId);
            setFullName(stu.fullName);
            setEmail(stu.email);
            setPhone(stu.phone);
            setBranch(stu.branch);
            setSemester(stu.semester);
            setAddress(stu.address);

            // Handle Photo Preview
            if (stu.profilePhoto) {
              if (stu.profilePhoto.startsWith('/uploads/')) {
                setPhotoType('file');
                setPhotoPreview(`http://localhost:5000${stu.profilePhoto}`);
              } else {
                setPhotoType('url');
                setPhotoUrl(stu.profilePhoto);
                setPhotoPreview(stu.profilePhoto);
              }
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to retrieve student dossier');
          navigate('/students');
        } finally {
          setFetching(false);
        }
      };

      fetchStudent();
    }
  }, [id, isEditMode, navigate, toast]);

  // Handle local photo file upload select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit');
        return;
      }
      setPhotoFile(file);
      setPhotoUrl(''); // Clear URL if upload is chosen

      // Create browser preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL change
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPhotoUrl(url);
    setPhotoFile(null); // Clear file if URL is chosen
    setPhotoPreview(url);
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoUrl('');
    setPhotoPreview('');
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Student ID check
    if (!studentId.trim()) {
      newErrors.studentId = 'Student ID registration code is required';
    } else if (!/^STU[0-9]{7}$/i.test(studentId.trim())) {
      newErrors.studentId = 'ID must match the system convention (e.g. STU2026001)';
    }

    // Name check
    if (!fullName.trim()) {
      newErrors.fullName = 'Student full name is required';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // Email check
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    // Phone check
    if (!phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(phone.trim())) {
      newErrors.phone = 'Provide a valid phone structure (7-15 digits)';
    }

    // Address check
    if (!address.trim()) {
      newErrors.address = 'Residential mailing address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct form errors before saving.');
      return;
    }

    setLoading(true);

    try {
      // Build FormData to support physical image file uploads
      const formData = new FormData();
      formData.append('studentId', studentId.trim().toUpperCase());
      formData.append('fullName', fullName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('phone', phone.trim());
      formData.append('branch', branch);
      formData.append('semester', semester.toString());
      formData.append('address', address.trim());

      // Photo upload routing
      if (photoType === 'file' && photoFile) {
        formData.append('profilePhoto', photoFile);
      } else if (photoType === 'url' && photoUrl.trim()) {
        formData.append('profilePhoto', photoUrl.trim());
      } else if (photoPreview === '') {
        // If image was explicitly removed, clear DB column
        formData.append('profilePhoto', '');
      }

      let response;
      if (isEditMode) {
        response = await studentService.update(id, formData);
      } else {
        response = await studentService.create(formData);
      }

      if (response.success) {
        toast.success(isEditMode ? 'Student profile updated successfully!' : 'New student enrolled successfully!');
        navigate('/students');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Database submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching dossier records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back button and page title */}
      <div className="flex items-center gap-4">
        <Link
          to="/students"
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
          title="Back to directory"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isEditMode ? 'Edit Student Dossier' : 'New Enrollment Form'}
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {isEditMode ? 'Modify specific details in the student database.' : 'Enrol and register a student folder.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar/Photo Upload Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center h-fit">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Profile Photo</h3>

          {/* Real-time image viewport circle */}
          <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-md relative group mb-4">
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute inset-0 bg-rose-600/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl font-semibold text-xs gap-1.5"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                  <span>Remove</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
                <ImageIcon className="w-10 h-10 mb-1 animate-pulse" />
                <span className="text-[10px] font-semibold">No Image Selected</span>
              </div>
            )}
          </div>

          {/* Select Type Switcher tabs */}
          <div className="flex w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200/20 mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPhotoType('file')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                photoType === 'file'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Upload Local
            </button>
            <button
              type="button"
              onClick={() => setPhotoType('url')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                photoType === 'url'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Image Web URL
            </button>
          </div>

          {/* Dynamic input render */}
          {photoType === 'file' ? (
            <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-indigo-500/20 hover:border-indigo-500/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-500/5 hover:bg-indigo-50/40 cursor-pointer transition-all">
              <Upload className="w-4 h-4 shrink-0" />
              <span>Choose Picture</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="w-full text-left space-y-1.5">
              <input
                type="text"
                value={photoUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <span className="text-[10px] font-semibold text-slate-400 mt-3 block block leading-normal">
            Max upload file size: 5MB.<br />Formats: JPEG, PNG, WEBP.
          </span>
        </div>

        {/* Right Side: Primary Info Fields Form */}
        <div className="glass-card p-6 md:col-span-2 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            Academic & Profile Dossier
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Student ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Student ID Registration Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU2026001"
                  disabled={isEditMode} // Do not allow editing student code to preserve database key consistency
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.studentId ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/60'
                  }`}
                />
              </div>
              {errors.studentId && <p className="text-xs font-medium text-red-500 mt-1">{errors.studentId}</p>}
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Student Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm ${
                    errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/60'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs font-medium text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Enrolled Institution Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@school.edu"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/60'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Contact Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/60'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs font-medium text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Branch Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Academic major Branch
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Layers className="w-4 h-4" />
                </div>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all shadow-sm"
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ME">Mechanical Eng (ME)</option>
                  <option value="CE">Civil Eng (CE)</option>
                  <option value="EE">Electrical Eng (EE)</option>
                </select>
              </div>
            </div>

            {/* Semester Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Active Semester Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all shadow-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Residential Address (Text Area) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Residential Home Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 text-slate-400 pointer-events-none">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street name, Sector, City, State, ZIP..."
                rows={3}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-sm ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/60'
                }`}
              />
            </div>
            {errors.address && <p className="text-xs font-medium text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/students"
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-xl transition-all shadow-sm"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Saving record...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{isEditMode ? 'Update Dossier' : 'Approve Enrollment'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentAddEdit;
