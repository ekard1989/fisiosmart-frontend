import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center">
          <div className="relative mr-4">
            <button className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <img 
                src="https://via.placeholder.com/40" 
                alt="User" 
                className="w-8 h-8 rounded-full mr-2" 
              />
              <span className="font-medium">Dr. Smith</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;