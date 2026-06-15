import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
// Common Components
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import FooterC from "./components/common/FooterC";

// User Components
import HomePage from "./components/user/HomePage";
import Complaint from "./components/user/Complaint";
import Status from "./components/user/Status";

// Agent Components
import AgentHome from "./components/agent/AgentHome";

// Admin Components
import AdminHome from "./components/admin/AdminHome";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation/Header can go here later */}
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Ordinary User Routes */}
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/lodge-complaint" element={<Complaint />} />
            <Route path="/status" element={<Status />} />

            {/* Agent Routes */}
            <Route path="/agent-dashboard" element={<AgentHome />} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminHome />} />
          </Routes>
        </main>

        <FooterC />
      </div>
    </Router>
  );
}

export default App;