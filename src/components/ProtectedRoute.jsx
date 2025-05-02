import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, hasActiveSubscription, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("ProtectedRoute - Stato autenticazione:", { user, hasActiveSubscription, loading });
  }, [user, hasActiveSubscription, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redireziona a login se non c'è utente
  if (!user) {
    console.log("ProtectedRoute - Nessun utente, reindirizzamento a login");
    return <Navigate to="/login" />;
  }

  // Redireziona a pagina di abbonamento se non ha abbonamento attivo
  if (!hasActiveSubscription()) {
    console.log("ProtectedRoute - Nessun abbonamento, reindirizzamento a subscription");
    return <Navigate to="/subscription" />;
  }

  console.log("ProtectedRoute - Accesso consentito");
  return children;
};