
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';

const InvoiceRow = ({ invoice, onView }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">
      {invoice.number}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-gray-900">{invoice.patient}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
      {invoice.date}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
      {invoice.dueDate}
    </td>
    <td className="px-6 py-4 whitespace-nowrap font-medium">
      {invoice.amount}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        invoice.status === 'paid' 
          ? 'bg-green-100 text-green-800' 
          : invoice.status === 'pending' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
      }`}>
        {invoice.status === 'paid' 
          ? 'Pagata' 
          : invoice.status === 'pending' 
            ? 'In attesa' 
            : 'Scaduta'}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button 
        onClick={() => onView(invoice.id)} 
        className="text-primary hover:text-primary-dark mr-3"
      >
        <i className="fas fa-eye"></i>
      </button>
      <button className="text-gray-500 hover:text-gray-700 mr-3">
        <i className="fas fa-download"></i>
      </button>
      <button className="text-gray-500 hover:text-gray-700">
        <i className="fas fa-ellipsis-v"></i>
      </button>
    </td>
  </tr>
);

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

const Billing = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'paid', 'pending', 'overdue'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dati di esempio
  const stats = [
    { title: 'Fatturato Totale', value: '€5,480', icon: 'fa-euro-sign', color: 'bg-primary' },
    { title: 'In Attesa', value: '€950', icon: 'fa-clock', color: 'bg-warning' },
    { title: 'Scadute', value: '€320', icon: 'fa-exclamation-circle', color: 'bg-danger' },
    { title: 'Fatture Emesse', value: '32', icon: 'fa-file-invoice', color: 'bg-secondary' },
  ];
  
  const invoicesData = [
    { id: 1, number: 'FT-2025-0032', patient: 'Marco Rossi', date: '19/04/2025', dueDate: '19/05/2025', amount: '€120,00', status: 'paid' },
    { id: 2, number: 'FT-2025-0031', patient: 'Laura Bianchi', date: '18/04/2025', dueDate: '18/05/2025', amount: '€80,00', status: 'paid' },
    { id: 3, number: 'FT-2025-0030', patient: 'Giuseppe Verdi', date: '15/04/2025', dueDate: '15/05/2025', amount: '€150,00', status: 'pending' },
    { id: 4, number: 'FT-2025-0029', patient: 'Anna Neri', date: '10/04/2025', dueDate: '10/05/2025', amount: '€95,00', status: 'pending' },
    { id: 5, number: 'FT-2025-0028', patient: 'Sofia Romano', date: '01/04/2025', dueDate: '01/05/2025', amount: '€120,00', status: 'overdue' },
  ];
  
  // Filtra le fatture
  const filteredInvoices = invoicesData.filter(invoice => {
    // Filtra per termine di ricerca
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtra per tab
    const matchesTab = activeTab === 'all' || invoice.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const handleViewInvoice = (id) => {
    console.log(`Fattura selezionata: ${id}`);
    // Qui implementeremo la visualizzazione dei dettagli della fattura
  };

  return (
    <MainLayout title="Fatturazione">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'all' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('all')}
          >
            Tutte le fatture
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'paid' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('paid')}
          >
            Pagate
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'pending' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            In attesa
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'overdue' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('overdue')}
          >
            Scadute
          </button>
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Cerca fattura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center">
          <i className="fas fa-plus mr-2"></i>
          Nuova Fattura
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fattura #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paziente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scadenza
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Azioni</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map(invoice => (
                <InvoiceRow 
                  key={invoice.id} 
                  invoice={invoice} 
                  onView={handleViewInvoice} 
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">Nessuna fattura trovata</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Billing;