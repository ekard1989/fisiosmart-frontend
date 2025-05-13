import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
};

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Aggiungi questo hook per il reindirizzamento

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      navigate('/login'); // Reindirizza alla pagina di login dopo il logout
    }
  };

  return (
    <div className="w-64 bg-white h-full shadow-md flex flex-col">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-primary">Fisiosmart</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavItem 
          to="/dashboard" 
          icon={<i className="fas fa-chart-line"></i>}
        >
          Dashboard
        </NavItem>
        <NavItem 
          to="/patients" 
          icon={<i className="fas fa-users"></i>}
        >
          Pazienti
        </NavItem>
        <NavItem 
          to="/appointments" 
          icon={<i className="fas fa-calendar-alt"></i>}
        >
          Appuntamenti
        </NavItem>
        <NavItem 
          to="/exercises" 
          icon={<i className="fas fa-dumbbell"></i>}
        >
          Esercizi
        </NavItem>
        <NavItem 
          to="/billing" 
          icon={<i className="fas fa-file-invoice-dollar"></i>}
        >
          Fatturazione
        </NavItem>
      </div>
      <div className="p-4 border-t">
        <button 
          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;