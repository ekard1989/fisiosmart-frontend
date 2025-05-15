import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

// Inizializza Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Componente per la visualizzazione dei tabs
const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
      active 
        ? 'bg-white border-l border-r border-t border-gray-200 text-primary' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  
  useEffect(() => {
    fetchPatient();
    fetchAppointments();
    fetchMedicalRecords();
  }, [id]);
  
  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setPatient(data);
    } catch (err) {
      console.error("Error fetching patient:", err);
      setError("Si è verificato un errore nel caricamento dei dati del paziente");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAppointments = async () => {
    try {
      // Qui in futuro faremo una query per ottenere gli appuntamenti del paziente
      // Per ora usiamo dei dati di esempio
      setAppointments([
        { id: 1, date: '2025-05-20', time: '10:00', reason: 'Visita di controllo', status: 'scheduled' },
        { id: 2, date: '2025-04-10', time: '15:30', reason: 'Prima visita', status: 'completed' }
      ]);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };
  
  const fetchMedicalRecords = async () => {
    try {
      // Qui in futuro faremo una query per ottenere la storia medica del paziente
      // Per ora usiamo dei dati di esempio
      setMedicalRecords([
        { id: 1, date: '2025-04-10', title: 'Prima visita', doctor: 'Dr. Rossi', notes: 'Paziente in buona salute generale' },
        { id: 2, date: '2024-12-15', title: 'Consulto specialistico', doctor: 'Dr. Bianchi', notes: 'Esami del sangue nella norma' }
      ]);
    } catch (err) {
      console.error("Error fetching medical records:", err);
    }
  };
  
  if (loading) {
    return (
      <MainLayout title="Dettaglio Paziente">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !patient) {
    return (
      <MainLayout title="Dettaglio Paziente">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error || "Paziente non trovato"}</p>
        </div>
        <button
          onClick={() => navigate('/patients')}
          className="text-primary hover:text-primary-dark flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Torna alla lista pazienti
        </button>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={`${patient.first_name} ${patient.last_name}`}>
      {/* Header con informazioni principali e azioni */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-white text-xl font-medium">
              {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-semibold text-gray-800">{patient.first_name} {patient.last_name}</h2>
              <div className="mt-1 text-gray-600">
                {patient.fiscal_code && <p><span className="font-medium">Codice Fiscale:</span> {patient.fiscal_code}</p>}
                {patient.birth_date && <p><span className="font-medium">Data di nascita:</span> {new Date(patient.birth_date).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/patients/edit/${patient.id}`)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center"
            >
              <i className="fas fa-edit mr-2"></i>
              Modifica
            </button>
            <button
              onClick={() => navigate('/appointments/new', { state: { patientId: patient.id } })}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
            >
              <i className="fas fa-calendar-plus mr-2"></i>
              Nuovo Appuntamento
            </button>
          </div>
        </div>
        
        {/* Contatti rapidi */}
        <div className="mt-6 flex space-x-4">
          {patient.phone && (
            <a href={`tel:${patient.phone}`} className="flex items-center text-gray-600 hover:text-primary">
              <i className="fas fa-phone mr-2"></i>
              {patient.phone}
            </a>
          )}
          {patient.email && (
            <a href={`mailto:${patient.email}`} className="flex items-center text-gray-600 hover:text-primary">
              <i className="fas fa-envelope mr-2"></i>
              {patient.email}
            </a>
          )}
          {patient.address && (
            <div className="flex items-center text-gray-600">
              <i className="fas fa-map-marker-alt mr-2"></i>
              {patient.address}
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs per le diverse sezioni */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <TabButton
            active={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
          >
            Informazioni
          </TabButton>
          <TabButton
            active={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
          >
            Appuntamenti
          </TabButton>
          <TabButton
            active={activeTab === 'medical'}
            onClick={() => setActiveTab('medical')}
          >
            Storia Clinica
          </TabButton>
          <TabButton
            active={activeTab === 'documents'}
            onClick={() => setActiveTab('documents')}
          >
            Documenti
          </TabButton>
        </div>
      </div>
      
      {/* Contenuto del tab attivo */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informazioni Personali</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Codice Fiscale</p>
                  <p className="font-medium">{patient.fiscal_code || 'Non specificato'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data di Nascita</p>
                  <p className="font-medium">{patient.birth_date ? new Date(patient.birth_date).toLocaleDateString() : 'Non specificata'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Indirizzo</p>
                  <p className="font-medium">{patient.address || 'Non specificato'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Contatti</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{patient.email || 'Non specificata'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefono</p>
                  <p className="font-medium">{patient.phone || 'Non specificato'}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4">Note</h3>
              <p className="text-gray-700">{patient.notes || 'Nessuna nota disponibile.'}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'appointments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Appuntamenti</h3>
              <button
                onClick={() => navigate('/appointments/new', { state: { patientId: patient.id } })}
                className="bg-primary hover:bg-primary-dark text-white text-sm py-1 px-3 rounded-md flex items-center"
              >
                <i className="fas fa-plus mr-1"></i>
                Nuovo
              </button>
            </div>
            
            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orario</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Azioni</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map(appointment => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'scheduled' 
                              ? 'bg-blue-100 text-blue-800' 
                              : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status === 'scheduled' ? 'Programmato' : 
                             appointment.status === 'completed' ? 'Completato' : 'Cancellato'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark" onClick={() => navigate(`/appointments/${appointment.id}`)}>
                            Dettagli
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Nessun appuntamento registrato</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'medical' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Storia Clinica</h3>
              <button
                onClick={() => navigate('/medical-records/new', { state: { patientId: patient.id } })}
                className="bg-primary hover:bg-primary-dark text-white text-sm py-1 px-3 rounded-md flex items-center"
              >
                <i className="fas fa-plus mr-1"></i>
                Nuova Registrazione
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">Anamnesi Generale</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{patient.medical_history || 'Nessuna informazione disponibile.'}</p>
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-700 mb-2">Visite e Registrazioni</h4>
            {medicalRecords.length > 0 ? (
              <div className="space-y-4">
                {medicalRecords.map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-gray-800">{record.title}</h5>
                      <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{record.doctor}</p>
                    <p className="mt-2 text-gray-700">{record.notes}</p>
                    <button 
                      className="mt-2 text-primary hover:text-primary-dark text-sm"
                      onClick={() => navigate(`/medical-records/${record.id}`)}
                    >
                      Visualizza dettagli
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Nessuna registrazione medica disponibile</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Documenti</h3>
              <button
                className="bg-primary hover:bg-primary-dark text-white text-sm py-1 px-3 rounded-md flex items-center"
              >
                <i className="fas fa-plus mr-1"></i>
                Carica Documento
              </button>
            </div>
            
            <div className="text-center py-10">
              <p className="text-gray-500">Nessun documento disponibile</p>
              <p className="text-sm text-gray-400 mt-1">I documenti caricati appariranno qui</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PatientDetail;