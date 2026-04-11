import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Landing from "./pages/Landing.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import SavedJobs from "./pages/student/SavedJobs.jsx";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.jsx";
import PostJob from "./pages/recruiter/PostJob.jsx";
import ViewApplicants from "./pages/recruiter/ViewApplicants.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function RoleRedirect() {
  const role = localStorage.getItem("role");
  if (role === "recruiter") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={["student"]}><Landing /></ProtectedRoute>
        } />
        <Route path="/jobs/:id" element={
          <ProtectedRoute allowedRoles={["student"]}><JobDetail /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["student"]}><StudentProfile /></ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute allowedRoles={["student"]}><MyApplications /></ProtectedRoute>
        } />
        <Route path="/saved-jobs" element={
          <ProtectedRoute allowedRoles={["student"]}><SavedJobs /></ProtectedRoute>
        } />

        {/* RECRUITER */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute allowedRoles={["recruiter"]}><PostJob /></ProtectedRoute>
        } />
        <Route path="/applicants" element={
          <ProtectedRoute allowedRoles={["recruiter"]}><ViewApplicants /></ProtectedRoute>
        } />

        {/* FALLBACK */}
        <Route path="*" element={<RoleRedirect />} />

      </Routes>
    </BrowserRouter>
  );
}
