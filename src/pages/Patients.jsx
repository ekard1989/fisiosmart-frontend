import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { patientService } from '../services/api';

const PatientRow = ({ patient, onView }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-medium">
          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
        </div>
        <div className="ml-4">
          <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
          <div className="text-gray-500">{patient.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.phone}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        patient.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {patient.status === 'active' ? 'Attivo' : 'Inattivo'}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.lastVisit}</td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        onClick={() => onView(patient.id)} 
        className="text-primary hover:text-primary-dark"
      >
        Visualizza
      </button>
      <button className="text-gray-500 hover:text-gray-700 ml-4">
        <i className="fas fa-ellipsis-v"></i>
      </button>
    </td>
  </tr>
);

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await patientService.getAll();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Si è verificato un errore nel caricamento dei pazienti");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  // Filtra i pazienti in base al termine di ricerca
  const filteredPatients = patients.filter(patient => 
    patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.phone && patient.phone.includes(searchTerm))
  );
  
  const handleViewPatient = (id) => {
    navigate(`/patients/${id}`);
  };
  
  return (
    <MainLayout title="Pazienti">
      <div className="mb-6 flex justify-between items-center">
        <div className="w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Cerca paziente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus mr-2"></i>
          Nuovo Paziente
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paziente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefono
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ultima Visita
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Azioni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map(patient => (
                  <PatientRow 
                    key={patient.id} 
                    patient={{
                      id: patient.id,
                      firstName: patient.first_name,
                      lastName: patient.last_name,
                      email: patient.email || '',
                      phone: patient.phone || '',
                      status: 'active', // Questo potrebbe essere un campo reale in futuro
                      lastVisit: new Date(patient.created_at).toLocaleDateString() // In futuro, questo sarà la data dell'ultima visita
                    }} 
                    onView={handleViewPatient} 
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Nessun paziente trovato</p>
            </div>
          )}
        </div>
      )}
      
      {/* In futuro, qui implementeremo il modale per aggiungere un nuovo paziente */}
    </MainLayout>
  );
};

export default Patients;