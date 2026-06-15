import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function HomePage() {
  const navigate = useNavigate();

  // Extract user's name from the JWT token for the header
  const token = localStorage.getItem('token');
  let userName = "User";
  if (token) {
    try {
        userName = jwtDecode(token).user.name || "User";
    } catch(e) {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#b5c0c8] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-[#1f252e] text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-6 ml-8 text-sm">
          <span className="font-semibold text-lg mr-4">Hi, {userName}</span>
          <span onClick={() => navigate('/lodge-complaint')} className="cursor-pointer text-gray-300 hover:text-white transition-colors">Complaint Register</span>
          <span onClick={() => navigate('/status')} className="cursor-pointer text-gray-300 hover:text-white transition-colors">Status</span>
        </div>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-1.5 rounded text-sm mr-8 hover:bg-red-600 transition-colors">
          LogOut
        </button>
      </nav>

      {/* Main Dashboard Content */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card 1: Lodge Complaint */}
          <div 
            onClick={() => navigate('/lodge-complaint')}
            className="bg-white p-10 rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-blue-500 flex flex-col items-center text-center"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lodge a Complaint</h2>
            <p className="text-gray-600">Submit a new issue or request. Our admins will review and assign it to an agent shortly.</p>
          </div>

          {/* Card 2: Track Status */}
          <div 
            onClick={() => navigate('/status')}
            className="bg-white p-10 rounded-lg shadow-lg cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-green-500 flex flex-col items-center text-center"
          >
            <div className="bg-green-100 p-4 rounded-full mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Status</h2>
            <p className="text-gray-600">Check the progress of your existing complaints and communicate directly with assigned agents.</p>
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