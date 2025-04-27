import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Pagine temporanee per le altre sezioni
const PatientsPage = () => <div>Pagina pazienti in costruzione</div>;
const AppointmentsPage = () => <div>Pagina appuntamenti in costruzione</div>;
const ExercisesPage = () => <div>Pagina esercizi in costruzione</div>;
const BillingPage = () => <div>Pagina fatturazione in costruzione</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;