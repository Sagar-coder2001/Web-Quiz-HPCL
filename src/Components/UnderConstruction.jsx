import React from 'react';

const UnderConstruction = ({ darkMode =false }) => {
  return (
    <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-600">🔨</h1>
        <h2 className={`mt-4 text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Under Construction</h2>
        <p className={`mt-2 text-xl ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          We're working hard to bring you something great.
        </p>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Please check back soon!
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
