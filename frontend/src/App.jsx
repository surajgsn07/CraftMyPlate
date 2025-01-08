import React from 'react';
import { Routes, Route, Router } from 'react-router-dom'; // Import Routes and Route
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import MenuPage from './components/Menu';
import CartPage from './components/CartPage';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';
import { useSelector } from 'react-redux';
import { getCookie } from './axiosConfig/cookieFunc';


const App = () => {
  const user = useSelector(state=>state.auth.user);
  const cookie = getCookie('accessToken');
  console.log({user , cookie})
  return (
    <div className=''>
      {/* Set up routing */}
        {/* <Login/> */}
        <Navbar/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
