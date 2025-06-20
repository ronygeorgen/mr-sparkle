import React from 'react';

const LeadsGeneratedSmallCard = ({ title, value, unit, subtitle, onClick }) => {
  return (
    <div className="flex flex-col justify-center items-center h-109 sm:col-span-full md:col-span-3 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5 text-center"
    onClick={onClick}>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}{unit}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
};

export default LeadsGeneratedSmallCard;
