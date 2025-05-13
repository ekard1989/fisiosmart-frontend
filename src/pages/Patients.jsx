import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { createClient } from '@supabase/supabase-js';

// Inizializza Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Componente Modal semplificato (da spostare in un file separato in seguito)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
                <div className="mt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente PatientForm semplificato (da spostare in un file separato in seguito)
const PatientForm = ({ patient, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    fiscal_code: '',
    address: '',
    medical_history: '',
    notes: ''
  });
  
  useEffect(() => {
    if (patient) {
      setForm({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        birth_date: patient.birth_date ? new Date(patient.birth_date).toISOString().split('T')[0] : '',
        fiscal_code: patient.fiscal_code || '',
        address: patient.address || '',
        medical_history: patient.medical_history || '',
        notes: patient.notes || ''
      });
    }
  }, [patient]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nome *</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            required
            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Cognome *</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            required
            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefono</label>
        <input
          type="text"
          name="phone"
          id="phone"
          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-3 border-t">
        <button
          type="button"
          className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annulla
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvataggio...' : 'Salva'}
        </button>
      </div>
    </form>
  );
};

const PatientRow = ({ patient, onView, onEdit, onDelete }) => (
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
        className="text-primary hover:text-primary-dark mr-3"
      >
        <i className="fas fa-eye"></i>
      </button>
      <button 
        onClick={() => onEdit(patient.id)} 
        className="text-gray-500 hover:text-gray-700 mr-3"
      >
        <i className="fas fa-edit"></i>
      </button>
      <button 
        onClick={() => onDelete(patient.id)} 
        className="text-red-500 hover:text-red-700"
      >
        <i className="fas fa-trash"></i>
      </button>
    </td>
  </tr>
);

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      
      setPatients(data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Si è verificato un errore nel caricamento dei pazienti");
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const handleEditPatient = (id) => {
    const patient = patients.find(p => p.id === id);
    setCurrentPatient(patient);
    setShowEditModal(true);
  };
  
  const handleDeletePatient = (id) => {
    const patient = patients.find(p => p.id === id);
    setCurrentPatient(patient);
    setShowDeleteModal(true);
  };
  
  const handleAddSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('patients')
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      // Aggiorna la lista dei pazienti
      setPatients(prevPatients => [...prevPatients, data[0]]);
      setShowAddModal(false);
      
    } catch (err) {
      console.error("Error adding patient:", err);
      setError("Si è verificato un errore durante il salvataggio");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('patients')
        .update(formData)
        .eq('id', currentPatient.id)
        .select();
      
      if (error) throw error;
      
      // Aggiorna la lista dei pazienti
      setPatients(prevPatients => 
        prevPatients.map(p => p.id === currentPatient.id ? data[0] : p)
      );
      setShowEditModal(false);
      
    } catch (err) {
      console.error("Error updating patient:", err);
      setError("Si è verificato un errore durante l'aggiornamento");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', currentPatient.id);
      
      if (error) throw error;
      
      // Aggiorna la lista dei pazienti
      setPatients(prevPatients => 
        prevPatients.filter(p => p.id !== currentPatient.id)
      );
      setShowDeleteModal(false);
      
    } catch (err) {
      console.error("Error deleting patient:", err);
      setError("Si è verificato un errore durante l'eliminazione");
    } finally {
      setSubmitting(false);
    }
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
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                      lastVisit: patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A' // In futuro, questo sarà la data dell'ultima visita
                    }} 
                    onView={handleViewPatient}
                    onEdit={handleEditPatient}
                    onDelete={handleDeletePatient}
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
      
      {/* Modale Aggiungi Paziente */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Aggiungi Nuovo Paziente"
      >
        <PatientForm 
          onSubmit={handleAddSubmit}
          isSubmitting={submitting}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
      
      {/* Modale Modifica Paziente */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifica Paziente"
      >
        <PatientForm 
          patient={currentPatient}
          onSubmit={handleEditSubmit}
          isSubmitting={submitting}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
      
      {/* Modale Conferma Eliminazione */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Conferma Eliminazione"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            Sei sicuro di voler eliminare il paziente {currentPatient?.first_name} {currentPatient?.last_name}?
            Questa azione non può essere annullata.
          </p>
          <div className="flex justify-end space-x-3">
            <button 
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setShowDeleteModal(false)}
              disabled={submitting}
            >
              Annulla
            </button>
            <button 
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={submitting}
            >
              {submitting ? 'Eliminazione...' : 'Elimina'}
            </button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Patients;