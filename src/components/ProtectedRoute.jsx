import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, hasActiveSubscription, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Redireziona a login se non c'è utente
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redireziona a pagina di abbonamento se non ha abbonamento attivo
  if (!hasActiveSubscription()) {
    return <Navigate to="/subscription" />;
  }

  return children;
};