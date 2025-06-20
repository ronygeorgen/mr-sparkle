import React from 'react';

const KpiCard = ({ title, value, unit, subtitle, onClick }) => {
  return (
    <div 
      className="flex flex-col sm:col-span-full md:col-span-3 xl:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 h-full"
      onClick={onClick}
    >
      <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}{unit}</div>
      {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
    </div>
  );
};

export default KpiCard;