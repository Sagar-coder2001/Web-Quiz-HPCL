import React from 'react';

const DataNotFound = ({ darkMode }) => {
  return (
    <div className={`flex items-center justify-center h-96 ${darkMode ? 'bg-gray-900' : 'bg-gray-300'}`}>
      <div className="text-center">
        <h1 className={`text-6xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>No Data</h1>
        <p className={`mt-4 text-xl ${darkMode ? 'text-white' : 'text-black'}`}>Data Not Found</p>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We couldn't find any data matching your criteria.</p>
        
      </div>
    </div>
  );
};

export default DataNotFound;
