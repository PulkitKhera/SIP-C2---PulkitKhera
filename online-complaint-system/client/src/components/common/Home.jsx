import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#b5c0c8] flex flex-col">
      {/* Dark Navbar */}
      <nav className="bg-[#1f252e] text-white p-5 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold ml-8">ComplaintCare</h1>
        <div className="space-x-6 mr-8 text-sm">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/signup" className="hover:text-gray-300">SignUp</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 items-center justify-center px-20">
        
        {/* Left Side: Illustration Area */}
        <div className="flex-1 flex justify-center">
          <div className="w-[400px] h-[400px] rounded-full overflow-hidden shadow-inner bg-white/30">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Complaint management illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side: Text & CTA */}
        <div className="flex-1 pl-10">
          <h2 className="text-[2.75rem] leading-tight text-gray-800 font-light mb-2">
            Empower Your Team,
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Exceed Customer Expectations: Discover our<br/>
            Complaint Management Solution
          </p>
          <Link to="/signup">
            <button className="bg-[#1a73e8] text-white px-6 py-2.5 rounded hover:bg-blue-600 transition-colors">
              Register your Complaint
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}