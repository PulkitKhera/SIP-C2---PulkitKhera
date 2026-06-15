import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

export default function AgentHome() {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [statusDropdown, setStatusDropdown] = useState(null);

  // Extract Agent's name
  const token = localStorage.getItem('token');
  let agentName = "Agent";
  if (token) {
    try { agentName = jwtDecode(token).user.name || "Agent"; } catch(e) {}
  }

  // Fetch assigned tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/agent/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Update Complaint Status
  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      await api.put('/agent/status', { assignedComplaintId: assignmentId, newStatus });
      alert(`Status updated to ${newStatus}`);
      setStatusDropdown(null);
      // Refresh tasks to show the new status
      const res = await api.get('/agent/tasks');
      setTasks(res.data);
    } catch (error) {
      alert("Error updating status");
    }
  };

  // Open Chat and Fetch Messages
  const handleOpenChat = async (assignmentId) => {
    if (activeChat === assignmentId) {
      setActiveChat(null); // Toggle close
      return;
    }
    setActiveChat(assignmentId);
    try {
      const res = await api.get(`/chat/${assignmentId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Send a Message
  const handleSendMessage = async (e, assignmentId) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const res = await api.post('/chat/send', {
        complaintId: assignmentId,
        name: agentName,
        message: newMessage
      });
      setMessages([...messages, res.data]); // Add new message to UI
      setNewMessage(""); // Clear input
    } catch (error) {
      alert("Error sending message");
    }
  };

  return (
    <div className="min-h-screen bg-[#b5c0c8] flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#1f252e] text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-6 ml-8 text-sm">
          <span className="font-semibold text-lg mr-4">Hi Agent {agentName}</span>
          <span className="cursor-pointer text-gray-300 hover:text-white">View Complaints</span>
        </div>
        <button onClick={handleLogout} className="bg-transparent border border-red-500 text-red-500 px-4 py-1.5 rounded text-sm mr-8 hover:bg-red-500 hover:text-white transition-colors">
          Log out
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow p-8">
        {tasks.length === 0 ? (
          <div className="text-center mt-10 text-xl text-gray-700">No complaints assigned to you yet.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {tasks.map((task) => {
              // The populated complaint data
              const comp = task.complaintId; 
              if (!comp) return null; // Safety check

              return (
                <div key={task._id} className="bg-white p-6 rounded shadow-md border w-full max-w-sm flex flex-col">
                  <p className="font-bold text-lg mb-4 text-center">Name: {comp.name}</p>
                  
                  <div className="space-y-2 text-sm text-gray-700 mb-6">
                    <p><strong>Address:</strong> {comp.address}</p>
                    <p><strong>City:</strong> {comp.city}</p>
                    <p><strong>State:</strong> {comp.state}</p>
                    <p><strong>Pincode:</strong> {comp.pincode}</p>
                    <p><strong>Comment:</strong> {comp.comment}</p>
                    <p><strong>Status:</strong> <span className="text-blue-600 font-semibold">{task.status}</span></p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <button 
                        onClick={() => setStatusDropdown(statusDropdown === task._id ? null : task._id)}
                        className="w-full bg-[#0d6efd] text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
                      >
                        Status Change
                      </button>
                      
                      {/* Status Dropdown Menu */}
                      {statusDropdown === task._id && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border shadow-lg rounded z-10 flex flex-col">
                          <button onClick={() => handleStatusUpdate(task._id, 'In Progress')} className="p-2 hover:bg-gray-100 text-sm text-left">In Progress</button>
                          <button onClick={() => handleStatusUpdate(task._id, 'Resolved')} className="p-2 hover:bg-gray-100 text-sm text-left">Resolved</button>
                          <button onClick={() => handleStatusUpdate(task._id, 'Rejected')} className="p-2 hover:bg-gray-100 text-sm text-left">Rejected</button>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleOpenChat(comp._id)}
                      className="flex-1 bg-[#0d6efd] text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
                    >
                      Message
                    </button>
                  </div>

                  {/* Chat Box (Conditionally Rendered) */}
                  {activeChat === comp._id && (
                    <div className="mt-2 border rounded p-4 bg-gray-50 flex flex-col">
                      <h4 className="text-center font-serif text-lg mb-3">Message Box</h4>
                      
                      <div className="h-32 overflow-y-auto mb-3 space-y-2 pr-2 border-b pb-2">
                        {messages.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center">No messages yet.</p>
                        ) : (
                          messages.map((msg, i) => (
                            <div key={i} className="text-xs">
                              <span className="font-bold">{msg.name}: </span>
                              <span>{msg.message}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={(e) => handleSendMessage(e, comp._id)} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Message" 
                          className="flex-grow border rounded p-1.5 text-sm outline-none"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="bg-[#198754] text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">
                          Send
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shared Footer */}
      <footer className="bg-[#1f252e] text-white text-center py-5 text-sm mt-auto">
        <p>ComplaintCare</p>
        <p className="mt-1 text-gray-400">© 2024</p>
      </footer>
    </div>
  );
}