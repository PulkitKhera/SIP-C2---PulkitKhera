import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Ordinary' // Default role
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration Successful! Please login.');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Full Name" required className="border p-2 rounded" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required className="border p-2 rounded" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required className="border p-2 rounded" onChange={handleChange} />
          <input type="number" name="phone" placeholder="Phone Number" required className="border p-2 rounded" onChange={handleChange} />
          
          <select name="role" className="border p-2 rounded" onChange={handleChange}>
            <option value="Ordinary">Ordinary User</option>
            <option value="Agent">Agent</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
        </form>
        
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}