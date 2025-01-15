import React from 'react';

const Loading = ({ darkMode = true }) => {
  return (
    <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="text-center">
        <svg
          className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"></path>
        </svg>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Loading...</h1>
        <p className={`mt-4 text-xl ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Please wait while we load the content.</p>
      </div>
    </div>
  );
};

export default Loading;
