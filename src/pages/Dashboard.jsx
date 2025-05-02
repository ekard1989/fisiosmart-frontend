import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-700">
              Questa è una versione di test semplificata. Se stai vedendo questa pagina, 
              l'applicazione funziona correttamente a livello base.
            </p>
            <p className="mt-4 text-gray-700">
              Una volta confermato che questa versione funziona, possiamo gradualmente 
              reintrodurre le funzionalità più complesse.
            </p>
            <div className="mt-6">
              <Link 
                to="/login" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Torna al login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;