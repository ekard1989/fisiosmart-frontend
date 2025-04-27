import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SubscriptionPlan = ({ title, price, features, recommended, onSelect }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${recommended ? 'border-2 border-primary' : 'border border-gray-200'}`}>
    {recommended && (
      <div className="bg-primary text-white text-center py-2 font-medium">
        Consigliato
      </div>
    )}
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <div className="mt-4 flex items-baseline text-gray-900">
        <span className="text-4xl font-extrabold tracking-tight">{price}</span>
        <span className="ml-1 text-xl font-semibold">/mese</span>
      </div>
      <p className="mt-4 text-gray-500">Tutto ciò di cui hai bisogno per la tua attività di fisioterapista.</p>
      
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0">
              <i className="fas fa-check text-green-500"></i>
            </div>
            <p className="ml-3 text-base text-gray-700">{feature}</p>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onSelect}
        className={`mt-8 block w-full py-3 px-6 rounded-md shadow ${
          recommended 
            ? 'bg-primary text-white hover:bg-primary-dark' 
            : 'bg-gray-50 text-primary hover:bg-gray-100'
        } text-center font-medium`}
      >
        Attiva ora
      </button>
    </div>
  </div>
);

const Subscription = () => {
  const { user, subscription, logout } = useAuth();

  const handleSelectPlan = (plan) => {
    // Qui implementerai l'integrazione con un sistema di pagamento
    console.log(`Selected plan: ${plan}`);
    alert(`Hai selezionato il piano ${plan}. L'integrazione con il sistema di pagamento sarà implementata in seguito.`);
  };

  // Features dei piani
  const standardFeatures = [
    'Gestione illimitata dei pazienti',
    'Agenda appuntamenti',
    'Gestione documentazione clinica',
    'Libreria esercizi base',
    'Supporto email',
  ];

  const premiumFeatures = [
    ...standardFeatures,
    'Fatturazione elettronica',
    'Libreria esercizi completa',
    'Report avanzati',
    'Supporto prioritario',
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {subscription ? 'Il tuo abbonamento' : 'Scegli il tuo piano'}
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            {subscription 
              ? 'Grazie per essere un membro di Fisiosmart' 
              : 'Sblocca tutte le funzionalità di Fisiosmart con un abbonamento'}
          </p>
        </div>

        {subscription ? (
          <div className="mt-12 max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-center text-gray-900">
                Piano {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
              </h3>
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Il tuo abbonamento è attivo fino al {new Date(subscription.expires_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  to="/dashboard"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Vai alla dashboard
                </Link>
                <button
                  onClick={logout}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <SubscriptionPlan
              title="Standard"
              price="€29.99"
              features={standardFeatures}
              recommended={false}
              onSelect={() => handleSelectPlan('standard')}
            />
            <SubscriptionPlan
              title="Premium"
              price="€49.99"
              features={premiumFeatures}
              recommended={true}
              onSelect={() => handleSelectPlan('premium')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;