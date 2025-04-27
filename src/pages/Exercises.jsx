import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';

const ExerciseCard = ({ exercise, onSelect }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="h-40 bg-gray-200 flex items-center justify-center">
      {exercise.imageUrl ? (
        <img 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <i className="fas fa-dumbbell text-4xl text-gray-400"></i>
      )}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{exercise.name}</h3>
        <span className={`text-xs rounded-full px-2 py-1 ${
          exercise.difficulty === 'base' 
            ? 'bg-green-100 text-green-800' 
            : exercise.difficulty === 'intermedio' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
        }`}>
          {exercise.difficulty}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{exercise.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">{exercise.category}</span>
        <button 
          className="text-primary hover:text-primary-dark text-sm"
          onClick={() => onSelect(exercise.id)}
        >
          Dettagli
        </button>
      </div>
    </div>
  </div>
);

const Exercises = () => {
  const [activeTab, setActiveTab] = useState('exercises'); // 'exercises', 'protocols'
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dati di esempio
  const exercisesData = [
    { id: 1, name: 'Plank', description: 'Esercizio di stabilizzazione del core', category: 'Core', difficulty: 'base', imageUrl: '' },
    { id: 2, name: 'Squat', description: 'Esercizio per rafforzare gambe e glutei', category: 'Gambe', difficulty: 'intermedio', imageUrl: '' },
    { id: 3, name: 'Push-up', description: 'Esercizio per pettorali, tricipiti e spalle', category: 'Braccia', difficulty: 'intermedio', imageUrl: '' },
    { id: 4, name: 'Bird-dog', description: 'Esercizio per la stabilità lombare', category: 'Schiena', difficulty: 'base', imageUrl: '' },
    { id: 5, name: 'Shoulder press', description: 'Esercizio per le spalle con manubri', category: 'Spalle', difficulty: 'avanzato', imageUrl: '' },
    { id: 6, name: 'Stretching cervicale', description: 'Allungamento dei muscoli del collo', category: 'Cervicale', difficulty: 'base', imageUrl: '' },
  ];
  
  // Filtra gli esercizi
  const filteredExercises = exercisesData.filter(exercise => {
    // Filtra per termine di ricerca
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtra per categoria
    const matchesFilter = filter === 'all' || exercise.category.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });
  
  const handleSelectExercise = (id) => {
    console.log(`Esercizio selezionato: ${id}`);
    // Qui implementeremo la visualizzazione dei dettagli dell'esercizio
  };

  return (
    <MainLayout title="Esercizi">
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'exercises' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('exercises')}
          >
            Esercizi
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'protocols' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('protocols')}
          >
            Protocolli
          </button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Cerca esercizi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex">
          <select 
            className="mr-4 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tutte le categorie</option>
            <option value="core">Core</option>
            <option value="gambe">Gambe</option>
            <option value="braccia">Braccia</option>
            <option value="schiena">Schiena</option>
            <option value="spalle">Spalle</option>
            <option value="cervicale">Cervicale</option>
          </select>
          
          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center">
            <i className="fas fa-plus mr-2"></i>
            Nuovo Esercizio
          </button>
        </div>
      </div>
      
      {activeTab === 'exercises' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onSelect={handleSelectExercise} 
            />
          ))}
          
          {filteredExercises.length === 0 && (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-500">Nessun esercizio trovato</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Sezione Protocolli in sviluppo</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Exercises;