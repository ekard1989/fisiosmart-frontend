import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Mostra un loader mentre verifichiamo l'autenticazione
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redireziona a login se non c'è utente
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se siamo qui, l'utente è autenticato
  return children;
}