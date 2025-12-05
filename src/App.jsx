import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import TaskBoard from './pages/Tasks/TaskBoard';
import CreateTask from './pages/Tasks/CreateTask';
import TaskDetail from './pages/Tasks/TaskDetail';
import UserManagement from './pages/Admin/UserManagement';
import AuditLog from './pages/Admin/AuditLog';
import Analytics from './pages/Analytics/Analytics';
import Dashboard from './pages/Dashboard/Dashboard';



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/tasks" element={<Layout><TaskBoard /></Layout>} />
            <Route path="/tasks/new" element={<Layout><CreateTask /></Layout>} />
            <Route path="/tasks/:taskId" element={<Layout><TaskDetail /></Layout>} />
            <Route path="/tasks/manage" element={<Layout><TaskBoard /></Layout>} />
            <Route path="/admin/users" element={<Layout><UserManagement /></Layout>} />
            <Route path="/admin/audit" element={<Layout><AuditLog /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
