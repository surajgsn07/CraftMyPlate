import React, { useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
import { RingLoader } from 'react-spinners'; // Importing the RingLoader for the loading spinner
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { setCookie } from '../axiosConfig/cookieFunc';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axiosInstance.post('/user/login', { username, password });
      if (response.data) {
        console.log('Login successful:', response.data);
        const obj = { user: response.data.data.user };
        dispatch(login(obj));
        setCookie("accessToken", response.data.data.token, 7);
        navigate('/menu')
        
        
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error here
    } finally {
      setLoading(false); // Set loading to false when the request ends (either success or failure)
    }
  };

  if(user){
    navigate('/menu')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-green-900">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
           
          </div>
          {/* Show loader when loading is true */}
          <button
            type="submit"
            className="w-full mt-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <div className="flex justify-center">
                <RingLoader size={24} color="white" />
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-green-500">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
