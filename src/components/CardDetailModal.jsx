import React, { useEffect, useRef } from 'react';

function CardDetailModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal container - increased max width */}
      <div 
        ref={modalRef} 
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-[95rem] max-h-[90vh] overflow-hidden flex flex-col z-10 mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Modal body with scrolling */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CardDetailModal;