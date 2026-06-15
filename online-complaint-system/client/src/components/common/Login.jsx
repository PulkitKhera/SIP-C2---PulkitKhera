import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data;
      
      // Save token to browser
      localStorage.setItem('token', token);
      
      // Decode token to find out the user's role
      const decodedUser = jwtDecode(token);
      
      // Route them to the correct dashboard based on their role
      if (decodedUser.user.role === 'Admin') navigate('/admin-dashboard');
      else if (decodedUser.user.role === 'Agent') navigate('/agent-dashboard');
      else navigate('/dashboard'); // Ordinary User
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required className="border p-2 rounded" onChange={handleChange} />
          
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Login</button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}