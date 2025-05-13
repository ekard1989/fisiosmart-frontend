import React, { useState, useEffect } from 'react';

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
        
        <div>
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
        
        <div>
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
        
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Data di nascita</label>
          <input
            type="date"
            name="birth_date"
            id="birth_date"
            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={form.birth_date}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="fiscal_code" className="block text-sm font-medium text-gray-700">Codice Fiscale</label>
          <input
            type="text"
            name="fiscal_code"
            id="fiscal_code"
            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={form.fiscal_code}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Indirizzo</label>
        <input
          type="text"
          name="address"
          id="address"
          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={form.address}
          onChange={handleChange}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="medical_history" className="block text-sm font-medium text-gray-700">Storia medica</label>
        <textarea
          name="medical_history"
          id="medical_history"
          rows="3"
          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={form.medical_history}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          name="notes"
          id="notes"
          rows="2"
          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={form.notes}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3 pt-3 border-t">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Annulla
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvataggio...
            </span>
          ) : (
            'Salva'
          )}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;