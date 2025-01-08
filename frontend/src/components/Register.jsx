import React, { useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
import { Oval } from 'react-loader-spinner'; // You can install react-loader-spinner via npm or yarn
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../axiosConfig/cookieFunc';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // state for loading
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match");
    } else {
      setIsLoading(true); // Start the loading indicator

      try {
        const res = await axiosInstance.post('/user/register', { username, password });
        if (res.data) {
            const obj ={
                user : res.data.data.user
            };
            setCookie("accessToken", res.data.data.token, 7);
            dispatch(login(obj));
            navigate('/menu')
            
          console.log("res.data :", res.data);
        }
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
        setIsLoading(false); // Stop the loading indicator
      }

      console.log('Registration submitted');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-green-900">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading} // Disable input when loading
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
              disabled={isLoading} // Disable input when loading
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading} // Disable input when loading
            />
          </div>

          {/* Conditionally render loader */}
          {isLoading ? (
            <div className="flex justify-center mt-4">
              <Oval height={40} width={40} color="green" secondaryColor="lightgreen" ariaLabel="loading" />
            </div>
          ) : (
            <button
              type="submit"
              className="w-full mt-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              disabled={isLoading} // Disable the button when loading
            >
              Register
            </button>
          )}
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Already have an account?
             <Link to="/login" className="text-green-500">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
