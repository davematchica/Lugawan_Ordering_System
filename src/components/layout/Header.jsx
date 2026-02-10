import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ title, showBack = false, action }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="touch-target p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div>
            <h1 className="text-lg font-bold font-display">{title}</h1>
          </div>
        </div>
        
        {/* Right side action */}
        {action && (
          <div>{action}</div>
        )}
      </div>
    </header>
  );
};

export default Header;