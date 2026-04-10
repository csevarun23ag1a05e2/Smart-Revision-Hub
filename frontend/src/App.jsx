import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Topics from './pages/Topics';
import Materials from './pages/Materials';
import Schedules from './pages/Schedules';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
              <Route path="/subjects/:subjectId/topics" element={<PrivateRoute><Topics /></PrivateRoute>} />
              <Route path="/topics/:topicId/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
              <Route path="/topics/:topicId/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
              <Route path="/schedules" element={<PrivateRoute><Schedules /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />

              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
