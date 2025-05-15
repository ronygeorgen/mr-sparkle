import React from 'react';
import BarChart01 from '../charts/BarChart01';
import { getCssVariable } from '../utils/Utils';

const LeadsGeneratedCard = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Leads Generated',
        data,
        backgroundColor: getCssVariable('--primary'),
        hoverBackgroundColor: getCssVariable('--primary-dark'),
        barPercentage: 0.6,
        categoryPercentage: 0.6,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-full md:col-span-8 xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Leads Generated</h2>
      </header>
      <div className="p-5">
        <BarChart01 data={chartData} width={595} height={200} />
      </div>
    </div>
  );
};

export default LeadsGeneratedCard;