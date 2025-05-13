import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <div className={`rounded-full p-3 ${color}`}>
        <i className={`fas ${icon} text-white`}></i>
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const AppointmentItem = ({ time, patient, type, status }) => (
  <div className="flex items-center p-4 border-b hover:bg-gray-50">
    <div className="w-20 text-sm font-medium">{time}</div>
    <div className="flex-1">
      <h4 className="font-medium">{patient}</h4>
      <p className="text-sm text-gray-500">{type}</p>
    </div>
    <div className={`text-sm rounded-full px-3 py-1 ${
      status === 'scheduled' 
        ? 'bg-blue-100 text-blue-800' 
        : status === 'completed' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
    }`}>
      {status === 'scheduled' ? 'In programma' : status === 'completed' ? 'Completato' : 'Annullato'}
    </div>
  </div>
);

const Dashboard = () => {
  // Aggiunto per debug dell'autenticazione
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  console.log("Dashboard - User auth status:", user);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Questi dati sarebbero normalmente recuperati dal backend
  const stats = [
    { title: 'Appuntamenti Oggi', value: '8', icon: 'fa-calendar-day', color: 'bg-primary' },
    { title: 'Nuovi Pazienti', value: '12', icon: 'fa-user-plus', color: 'bg-secondary' },
    { title: 'Appuntamenti Settimana', value: '42', icon: 'fa-calendar-week', color: 'bg-warning' },
    { title: 'Fatturato Mensile', value: '€3,240', icon: 'fa-euro-sign', color: 'bg-danger' },
  ];
  
  const appointments = [
    { time: '09:00', patient: 'Marco Rossi', type: 'Prima Visita', status: 'scheduled' },
    { time: '10:30', patient: 'Laura Bianchi', type: 'Terapia Manuale', status: 'scheduled' },
    { time: '12:00', patient: 'Giuseppe Verdi', type: 'Riabilitazione', status: 'scheduled' },
    { time: '14:30', patient: 'Anna Neri', type: 'Valutazione', status: 'scheduled' },
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Aggiunto indicatore stato autenticazione */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <p className="text-gray-700 mb-2">
          Stato autenticazione: {user ? `Autenticato (${user.email})` : 'Non autenticato'}
        </p>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Appuntamenti di Oggi</h2>
            <button className="text-primary hover:text-primary-dark">
              Vedi tutti
            </button>
          </div>
          <div>
            {appointments.map((appointment, index) => (
              <AppointmentItem key={index} {...appointment} />
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Pazienti Recenti</h2>
          </div>
          <div className="p-4">
            <p className="text-gray-500">Statistiche pazienti in arrivo...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;