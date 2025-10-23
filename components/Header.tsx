import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto max-w-2xl px-4 py-4 flex items-center justify-center">
        <i className="fa-solid fa-pepper-hot text-2xl text-orange-500 mr-3"></i>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Spice AI</h1>
      </div>
    </header>
  );
};

export default Header;