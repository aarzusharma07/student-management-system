import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserPlus, 
  Plus, 
  ArrowRight, 
  Calendar,
  Building,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await studentService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gathering metrics...</p>
        </div>
      </div>
    );
  }

  // Pre-processed charts data fallback
  const branchChartData = stats?.branchStats?.length > 0 
    ? stats.branchStats 
    : [
        { branch: 'CSE', count: 0 },
        { branch: 'ECE', count: 0 },
        { branch: 'ME', count: 0 },
        { branch: 'CE', count: 0 },
        { branch: 'EE', count: 0 },
        { branch: 'IT', count: 0 }
      ];

  const semesterChartData = stats?.semesterStats?.map(item => ({
    name: `Sem ${item.semester}`,
    Students: item.count
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/10 via-indigo-800/5 to-transparent p-6 rounded-3xl border border-indigo-500/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Academy Overview</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time enrollment counts, departmental breakdowns, and recent activity log.
          </p>
        </div>
        <Link
          to="/students/add"
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 shrink-0 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </Link>
      </div>

      {/* Stats Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          title="Total Students Enrolled"
          value={stats?.totalStudents || 0}
          subtitle="Active academic files"
          color="indigo"
        />
        <StatCard 
          icon={<Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          title="Top Performing Branch"
          value={
            branchChartData.length > 0
              ? branchChartData.reduce((prev, current) => (prev.count > current.count ? prev : current), { branch: 'None' }).branch
              : 'N/A'
          }
          subtitle="Highest student registration"
          color="purple"
        />
        <StatCard 
          icon={<Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="Recent Additions"
          value={stats?.recentlyAdded?.length || 0}
          subtitle="Added this session"
          color="emerald"
        />
      </div>

      {/* Visual Analytics Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Count Aggregation Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col h-[400px]">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-500" />
              <span>Students by Branch</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Department registration shares</p>
          </div>
          
          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={branchChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="branch"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {branchChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    background: '#1e293b', 
                    border: 'none', 
                    color: '#f8fafc',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester Count Aggregation Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col h-[400px]">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>Students by Semester</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Registration trends across semesters</p>
          </div>

          <div className="flex-1 w-full min-h-0">
            {semesterChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={semesterChartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      background: '#1e293b', 
                      border: 'none', 
                      color: '#f8fafc',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="Students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-semibold text-slate-400">No active semester logs available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recently Enrolled Table Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-500" />
              <span>Recently Enrolled Students</span>
            </h3>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">Profiles approved in the last few hours</p>
          </div>
          <Link
            to="/students"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline flex items-center gap-1 transition-all"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Responsive Student Row List */}
        {stats?.recentlyAdded?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {stats.recentlyAdded.map((stu) => (
                  <tr key={stu._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                        {stu.profilePhoto ? (
                          <img 
                            src={stu.profilePhoto.startsWith('/uploads/') ? `http://localhost:5000${stu.profilePhoto}` : stu.profilePhoto} 
                            alt={stu.fullName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="font-bold text-xs text-slate-500 dark:text-slate-400">{stu.fullName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 dark:text-white leading-tight">{stu.fullName}</span>
                        <span className="text-xs text-slate-400 font-medium">{stu.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-xs text-slate-500 dark:text-slate-400">{stu.studentId}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        stu.branch === 'CSE' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        stu.branch === 'ECE' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        stu.branch === 'IT' ? 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                        'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                      }`}>
                        {stu.branch}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">Sem {stu.semester}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/students/${stu._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 group-hover:border-indigo-500/30 transition-all shadow-sm"
                      >
                        <span>Profile</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 font-medium border border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl">
            No recently added student records found
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color = 'indigo' }) => {
  const bgStyles = {
    indigo: 'from-indigo-500/10 to-indigo-600/[0.02] border-indigo-500/10',
    purple: 'from-purple-500/10 to-purple-600/[0.02] border-purple-500/10',
    emerald: 'from-emerald-500/10 to-emerald-600/[0.02] border-emerald-500/10',
  }[color];

  return (
    <div className={`p-6 rounded-3xl border bg-gradient-to-br ${bgStyles} glass-card hover:scale-[1.02] transition-all duration-300 flex items-center justify-between`}>
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{title}</span>
        <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">{subtitle}</span>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100/50 dark:border-slate-700/30 shrink-0">
        {icon}
      </div>
    </div>
  );
};

export default Dashboard;
