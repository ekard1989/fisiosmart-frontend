import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

// Inizializza Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Stati per i dati
  const [stats, setStats] = useState({
    todayAppointments: 0,
    newPatients: 0,
    weekAppointments: 0,
    monthlyIncome: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Funzione per ottenere la data di oggi in formato ISO
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };
  
  // Funzione per ottenere la data di una settimana fa
  const getOneWeekAgo = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    return oneWeekAgo.toISOString();
  };
  
  // Funzione per ottenere il primo giorno del mese corrente
  const getFirstDayOfMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString();
  };
  
  // Carica i dati al mount del componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Ottieni appuntamenti di oggi
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        
        const { data: todayAppointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            patients (id, first_name, last_name)
          `)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString())
          .order('start_time', { ascending: true });
        
        if (appointmentsError) throw appointmentsError;
        
        // Ottieni pazienti recenti (ultimi 30 giorni)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: recentPatientsData, error: patientsError } = await supabase
          .from('patients')
          .select('*')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });
        
        if (patientsError) throw patientsError;
        
        // Ottieni appuntamenti della settimana
        const { data: weekAppointmentsData, error: weekAppError } = await supabase
          .from('appointments')
          .select('*')
          .gte('start_time', getOneWeekAgo())
          .lte('start_time', new Date().toISOString());
        
        if (weekAppError) throw weekAppError;
        
        // Ottieni fatture del mese
        const { data: monthInvoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('amount')
          .gte('issue_date', getFirstDayOfMonth());
        
        if (invoicesError) throw invoicesError;
        
        // Calcola il fatturato mensile
        const monthlyIncome = monthInvoicesData?.length 
          ? monthInvoicesData.reduce((total, invoice) => total + parseFloat(invoice.amount), 0)
          : 0;
        
        // Aggiorna lo stato
        setStats({
          todayAppointments: todayAppointmentsData?.length || 0,
          newPatients: recentPatientsData?.length || 0,
          weekAppointments: weekAppointmentsData?.length || 0,
          monthlyIncome: monthlyIncome.toFixed(2)
        });
        
        // Formatta appuntamenti per la visualizzazione
        const formattedAppointments = todayAppointmentsData?.map(app => ({
          time: new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          patient: `${app.patients?.first_name || ''} ${app.patients?.last_name || ''}`,
          type: app.treatment_type,
          status: app.status
        })) || [];
        
        setAppointments(formattedAppointments);
        setRecentPatients(recentPatientsData?.slice(0, 5) || []);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Si è verificato un errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Dati da visualizzare nelle card di statistiche
  const statsCards = [
    { title: 'Appuntamenti Oggi', value: stats.todayAppointments, icon: 'fa-calendar-day', color: 'bg-primary' },
    { title: 'Nuovi Pazienti', value: stats.newPatients, icon: 'fa-user-plus', color: 'bg-secondary' },
    { title: 'Appuntamenti Settimana', value: stats.weekAppointments, icon: 'fa-calendar-week', color: 'bg-warning' },
    { title: 'Fatturato Mensile', value: `€${stats.monthlyIncome}`, icon: 'fa-euro-sign', color: 'bg-danger' },
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Indicatore stato autenticazione - può essere rimosso in produzione */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <p className="text-gray-700 mb-2">
          Stato autenticazione: {user ? `Autenticato (${user.email})` : 'Non autenticato'}
        </p>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Appuntamenti di Oggi</h2>
                <button 
                  className="text-primary hover:text-primary-dark"
                  onClick={() => navigate('/appointments')}
                >
                  Vedi tutti
                </button>
              </div>
              <div>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <AppointmentItem key={index} {...appointment} />
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nessun appuntamento per oggi
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Pazienti Recenti</h2>
              </div>
              <div className="p-4">
                {recentPatients.length > 0 ? (
                  <div className="space-y-3">
                    {recentPatients.map(patient => (
                      <div 
                        key={patient.id} 
                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => navigate(`/patients/${patient.id}`)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-medium">
                          {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                          <p className="text-sm text-gray-500">{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nessun paziente recente</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;