import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

export default function Status() {
  const navigate = useNavigate();
  
  const [complaints, setComplaints] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Extract User's name from token
  const token = localStorage.getItem('token');
  let userName = "User";
  if (token) {
    try { userName = jwtDecode(token).user.name || "User"; } catch(e) {}
  }

  // Fetch complaints belonging to this user
  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const res = await api.get('/complaints/my-complaints');
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints", error);
      }
    };
    fetchMyComplaints();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Open Chat and Fetch Messages
  const handleOpenChat = async (complaintId) => {
    if (activeChat === complaintId) {
      setActiveChat(null); // Toggle close if already open
      return;
    }
    setActiveChat(complaintId);
    try {
      const res = await api.get(`/chat/${complaintId}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Send a Message
  const handleSendMessage = async (e, complaintId) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      const res = await api.post('/chat/send', {
        complaintId: complaintId,
        name: userName,
        message: newMessage
      });
      setMessages([...messages, res.data]); // Update UI instantly
      setNewMessage(""); // Clear input field
    } catch (error) {
      alert("Error sending message");
    }
  };

  return (
    <div className="min-h-screen bg-[#b5c0c8] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-[#1f252e] text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-6 ml-8 text-sm">
          <span className="font-semibold text-lg mr-4">Hi, {userName}</span>
          {/* New Home Button */}
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer text-gray-300 hover:text-white transition-colors">Home</span>
          <span onClick={() => navigate('/lodge-complaint')} className="cursor-pointer text-gray-300 hover:text-white transition-colors">Complaint Register</span>
          <span className="cursor-pointer text-white font-medium border-b border-white pb-0.5">Status</span>
        </div>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-1.5 rounded text-sm mr-8 hover:bg-red-600 transition-colors">
          LogOut
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 w-full max-w-5xl text-left border-b border-gray-400 pb-2">
          Your Complaint History
        </h2>

        {complaints.length === 0 ? (
          <div className="text-center mt-10 text-lg text-gray-700 bg-white px-10 py-6 rounded shadow">
            You haven't registered any complaints yet.
          </div>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((comp) => (
              <div key={comp._id} className="bg-white p-6 rounded shadow-md border flex flex-col relative overflow-hidden">
                
                {/* Dynamic Status Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white shadow-sm
                  ${comp.status === 'Pending' ? 'bg-yellow-500' : 
                    comp.status === 'In Progress' ? 'bg-blue-500' : 
                    comp.status === 'Resolved' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {comp.status}
                </div>

                <p className="font-bold text-lg mb-3 mt-2">{comp.name}</p>
                
                <div className="space-y-1.5 text-sm text-gray-700 mb-4 flex-grow">
                  <p><strong>Location:</strong> {comp.city}, {comp.state} {comp.pincode}</p>
                  <p><strong>Address:</strong> {comp.address}</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded border text-gray-600 italic">
                    "{comp.comment}"
                  </div>
                </div>

                {/* Chat Button (Only available if not purely 'Pending') */}
                {comp.status !== 'Pending' && (
                  <button 
                    onClick={() => handleOpenChat(comp._id)}
                    className="w-full bg-[#0d6efd] text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors mt-2"
                  >
                    {activeChat === comp._id ? 'Close Chat' : 'Message Agent'}
                  </button>
                )}

                {/* Chat Box */}
                {activeChat === comp._id && (
                  <div className="mt-3 border rounded p-3 bg-gray-50 flex flex-col border-blue-200">
                    <h4 className="text-center font-serif text-sm font-semibold text-blue-800 mb-2 border-b pb-1">Agent Chat</h4>
                    
                    <div className="h-32 overflow-y-auto mb-2 space-y-1.5 pr-1">
                      {messages.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center mt-4">No messages yet.</p>
                      ) : (
                        messages.map((msg, i) => (
                          <div key={i} className={`text-xs p-1.5 rounded ${msg.name === userName ? 'bg-blue-100 ml-4 text-right' : 'bg-gray-200 mr-4 text-left'}`}>
                            <span className="font-bold block text-[10px] text-gray-500 mb-0.5">{msg.name}</span>
                            <span>{msg.message}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={(e) => handleSendMessage(e, comp._id)} className="flex gap-2 mt-auto">
                      <input 
                        type="text" 
                        placeholder="Type reply..." 
                        className="flex-grow border rounded p-1.5 text-xs outline-none focus:border-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button type="submit" className="bg-[#198754] text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
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