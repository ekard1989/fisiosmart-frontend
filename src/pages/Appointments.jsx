import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';

const AppointmentItem = ({ appointment, onClick }) => {
  const getStatusClass = () => {
    switch (appointment.status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className={`p-4 mb-3 border-l-4 rounded shadow-sm cursor-pointer hover:shadow ${getStatusClass()}`}
      onClick={() => onClick(appointment.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{appointment.time} - {appointment.patient}</p>
          <p className="text-sm">{appointment.type}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          appointment.status === 'scheduled' ? 'bg-blue-200' :
          appointment.status === 'completed' ? 'bg-green-200' : 'bg-red-200'
        }`}>
          {appointment.status === 'scheduled' ? 'In programma' : 
           appointment.status === 'completed' ? 'Completato' : 'Annullato'}
        </span>
      </div>
    </div>
  );
};

const CalendarDay = ({ date, isToday, hasAppointments, onClick }) => (
  <div 
    className={`h-24 p-2 border border-gray-200 ${isToday ? 'bg-primary-light bg-opacity-20' : 'hover:bg-gray-50'} cursor-pointer`}
    onClick={() => onClick(date)}
  >
    <div className="flex justify-between items-center">
      <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>{date}</span>
      {hasAppointments && (
        <span className="w-2 h-2 rounded-full bg-primary"></span>
      )}
    </div>
  </div>
);

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState('19');
  const [selectedMonth, setSelectedMonth] = useState('Aprile 2025');
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  
  // Dati di esempio
  const appointments = [
    { id: 1, time: '09:00', patient: 'Marco Rossi', type: 'Prima Visita', status: 'scheduled' },
    { id: 2, time: '10:30', patient: 'Laura Bianchi', type: 'Terapia Manuale', status: 'scheduled' },
    { id: 3, time: '12:00', patient: 'Giuseppe Verdi', type: 'Riabilitazione', status: 'completed' },
    { id: 4, time: '14:30', patient: 'Anna Neri', type: 'Valutazione', status: 'cancelled' },
    { id: 5, time: '16:00', patient: 'Sofia Romano', type: 'Follow-up', status: 'scheduled' },
  ];

  // Giorni del mese di esempio
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  
  const handleAppointmentClick = (id) => {
    console.log(`Appuntamento selezionato: ${id}`);
    // Qui implementeremo la visualizzazione/modifica dell'appuntamento
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
    console.log(`Data selezionata: ${date} ${selectedMonth}`);
    // Qui implementeremo il cambio della data selezionata
  };

  return (
    <MainLayout title="Appuntamenti">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button className="mr-2 p-2 rounded hover:bg-gray-100">
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <h2 className="text-xl font-semibold">{selectedMonth}</h2>
          <button className="ml-2 p-2 rounded hover:bg-gray-100">
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
          <button className="ml-4 px-3 py-1 bg-gray-200 rounded-md text-sm">
            Oggi
          </button>
        </div>
        
        <div className="flex">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm ${view === 'day' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setView('day')}
            >
              Giorno
            </button>
            <button 
              className={`px-4 py-2 text-sm ${view === 'week' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setView('week')}
            >
              Settimana
            </button>
            <button 
              className={`px-4 py-2 text-sm ${view === 'month' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setView('month')}
            >
              Mese
            </button>
          </div>
          
          <button className="ml-4 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center">
            <i className="fas fa-plus mr-2"></i>
            Nuovo Appuntamento
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-7 gap-0">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Spazio vuoto per i giorni precedenti al primo del mese (esempio) */}
            {[...Array(3)].map((_, i) => (
              <div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>
            ))}
            
            {/* Giorni del mese */}
            {calendarDays.map(day => (
              <CalendarDay 
                key={day}
                date={day.toString()} 
                isToday={day.toString() === selectedDate}
                hasAppointments={[5, 12, 15, 19, 22, 28].includes(day)}
                onClick={handleDateClick}
              />
            ))}
          </div>
        </div>
        
        {/* Lista appuntamenti del giorno */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Appuntamenti del {selectedDate} {selectedMonth}</h3>
          </div>
          <div className="p-4">
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <AppointmentItem 
                  key={appointment.id}
                  appointment={appointment}
                  onClick={handleAppointmentClick}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Nessun appuntamento per questa data</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;