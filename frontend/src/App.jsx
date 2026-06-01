import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/common/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentAddEdit from './pages/StudentAddEdit';
import StudentDetail from './pages/StudentDetail';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Gateway */}
            <Route path="/login" element={<Login />} />

            {/* Protected Portal Routes inside Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentList />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/add"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <StudentAddEdit />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/edit/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <StudentAddEdit />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StudentDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default Router Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
