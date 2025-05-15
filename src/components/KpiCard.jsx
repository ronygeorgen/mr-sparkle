import React from 'react';

const KpiCard = ({ title, value, unit, subtitle }) => {
  return (
    <div className="flex flex-col sm:col-span-full md:col-span-3 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}{unit}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
};

export default KpiCard;