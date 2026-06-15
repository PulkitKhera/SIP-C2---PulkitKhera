import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

export default function AdminHome() {
  const navigate = useNavigate();
  
  // States for data and accordion toggles
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showComplaints, setShowComplaints] = useState(true);
  const [showAgents, setShowAgents] = useState(true);
  
  // Extract Admin's name
  const token = localStorage.getItem('token');
  let adminName = "Admin";
  if (token) {
    try { adminName = jwtDecode(token).user.name || "Admin"; } catch(e) {}
  }

  // Fetch data when the component loads
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const complaintsRes = await api.get('/admin/complaints');
        const agentsRes = await api.get('/admin/agents');
        setComplaints(complaintsRes.data);
        setAgents(agentsRes.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle assigning an agent to a complaint
  const handleAssign = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      await api.post('/admin/assign', { complaintId, agentId });
      alert('Complaint Assigned Successfully!');
      // Refresh complaints list to show updated status
      const res = await api.get('/admin/complaints');
      setComplaints(res.data);
    } catch (error) {
      alert('Error assigning complaint');
    }
  };

  return (
    <div className="min-h-screen bg-[#b5c0c8] flex flex-col">
      {/* Admin Navbar */}
      <nav className="bg-[#1f252e] text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-6 ml-8 text-sm">
          <span className="font-semibold text-lg mr-4">Hi Admin {adminName}</span>
          <span className="cursor-pointer text-gray-300 hover:text-white">Dashboard</span>
          <span className="cursor-pointer text-gray-300 hover:text-white">User</span>
          <span className="cursor-pointer text-gray-300 hover:text-white">Agent</span>
        </div>
        <button onClick={handleLogout} className="bg-transparent border border-red-500 text-red-500 px-4 py-1.5 rounded text-sm mr-8 hover:bg-red-500 hover:text-white transition-colors">
          Log out
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-7xl bg-white shadow-md rounded-sm overflow-hidden min-h-[600px]">
          
          {/* Complaints Accordion */}
          <div className="border-b">
            <button 
              onClick={() => setShowComplaints(!showComplaints)}
              className="w-full text-left px-6 py-3 bg-[#d8e8fa] text-blue-800 font-medium flex justify-between items-center hover:bg-[#c9dff7]"
            >
              Users Complaints
              <span>{showComplaints ? '▲' : '▼'}</span>
            </button>
            
            {showComplaints && (
              <div className="p-6 bg-[#f2f8fc] flex gap-6 overflow-x-auto">
                {complaints.length === 0 ? (
                  <p className="text-gray-500">No complaints found.</p>
                ) : (
                  complaints.map((comp) => (
                    <div key={comp._id} className="bg-white p-6 rounded shadow border min-w-[300px] text-sm">
                      <p className="font-bold text-lg mb-4 text-center">Name: {comp.name}</p>
                      <div className="space-y-2 text-gray-700 text-center">
                        <p>Address: {comp.address}</p>
                        <p>City: {comp.city}</p>
                        <p>State: {comp.state}</p>
                        <p>Pincode: {comp.pincode}</p>
                        <p>Comment: {comp.comment}</p>
                        <p>Status: {comp.status}</p>
                      </div>
                      
                      {/* Assignment Dropdown */}
                      {comp.status === 'Pending' ? (
                        <div className="mt-6 flex justify-center">
                          <select 
                            onChange={(e) => handleAssign(comp._id, e.target.value)}
                            className="bg-[#ffc107] text-black font-medium py-1.5 px-4 rounded outline-none cursor-pointer"
                            defaultValue=""
                          >
                            <option value="" disabled>Assign ▼</option>
                            {agents.map(agent => (
                              <option key={agent._id} value={agent._id}>{agent.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="mt-6 text-center text-green-600 font-medium">Assigned</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Agents Accordion */}
          <div>
            <button 
              onClick={() => setShowAgents(!showAgents)}
              className="w-full text-left px-6 py-3 bg-[#d8e8fa] text-blue-800 font-medium flex justify-between items-center hover:bg-[#c9dff7]"
            >
              Agents
              <span>{showAgents ? '▲' : '▼'}</span>
            </button>
            
            {showAgents && (
              <div className="p-6 bg-[#f2f8fc] min-h-[150px]">
                {agents.length === 0 ? (
                  <div className="inline-block bg-[#d1f4f4] text-[#0f766e] px-6 py-4 rounded shadow-sm">
                    No Agents to show
                  </div>
                ) : (
                  <div className="flex gap-4 flex-wrap">
                     {agents.map(agent => (
                        <div key={agent._id} className="bg-white p-4 rounded shadow border min-w-[200px]">
                           <p className="font-bold">{agent.name}</p>
                           <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                     ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Shared Footer */}
      <footer className="bg-[#1f252e] text-white text-center py-5 text-sm mt-auto">
        <p>ComplaintCare</p>
        <p className="mt-1 text-gray-400">© 2024</p>
      </footer>
    </div>
  );
}