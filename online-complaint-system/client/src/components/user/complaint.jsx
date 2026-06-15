import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

export default function Complaint() {
  const navigate = useNavigate();
  
  // Extract user's name from the JWT token for the header
  const token = localStorage.getItem('token');
  let userName = "User";
  if (token) {
    try {
        userName = jwtDecode(token).user.name || "User";
    } catch(e) {}
  }

  const [formData, setFormData] = useState({
    name: '', address: '', city: '', state: '', pincode: '', comment: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      alert('Complaint Registered Successfully!');
      navigate('/status'); // Send them to the status tracking page
    } catch (err) {
      alert('Error registering complaint');
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
          <span className="cursor-pointer text-white font-medium border-b border-white pb-0.5">Complaint Register</span>
          <span onClick={() => navigate('/status')} className="cursor-pointer text-gray-300 hover:text-white transition-colors">Status</span>
        </div>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-1.5 rounded text-sm mr-8 hover:bg-red-600 transition-colors">
          LogOut
        </button>
      </nav>

      {/* Form Container */}
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="bg-[#242933] p-10 rounded-md shadow-2xl w-full max-w-3xl text-white">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="flex flex-col">
              <label className="text-sm mb-1.5">Name</label>
              <input type="text" className="text-black p-2 rounded outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm mb-1.5">Address</label>
              <input type="text" className="text-black p-2 rounded outline-none" onChange={(e) => setFormData({...formData, address: e.target.value})} required />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm mb-1.5">City</label>
              <input type="text" className="text-black p-2 rounded outline-none" onChange={(e) => setFormData({...formData, city: e.target.value})} required />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm mb-1.5">State</label>
              <input type="text" className="text-black p-2 rounded outline-none" onChange={(e) => setFormData({...formData, state: e.target.value})} required />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm mb-1.5">Pincode</label>
              <input type="number" className="text-black p-2 rounded outline-none" onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm mb-1.5">Status</label>
              <input type="text" className="text-gray-500 p-2 rounded bg-gray-100 outline-none" value="pending" disabled />
            </div>
            
            <div className="col-span-2 flex flex-col">
              <label className="text-sm mb-1.5">Description</label>
              <textarea className="text-black p-2 rounded h-28 outline-none resize-none" onChange={(e) => setFormData({...formData, comment: e.target.value})} required></textarea>
            </div>
            
            <div className="col-span-2 flex justify-center mt-2">
              <button type="submit" className="bg-[#198754] text-white px-10 py-2.5 rounded hover:bg-green-700 transition-colors">
                Register
              </button>
            </div>
            
          </form>
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