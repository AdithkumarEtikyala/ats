import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === 'Guest') {
      return <Navigate to="/guest" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
