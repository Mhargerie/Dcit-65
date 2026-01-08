import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/" replace />;
    return children;
  } catch (e) {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
