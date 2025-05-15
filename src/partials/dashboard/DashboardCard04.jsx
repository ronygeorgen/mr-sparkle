import React, { useState } from 'react';
import BarChart from '../../charts/BarChart01';
import Modal from '../../components/ChartModal';
import { getCssVariable } from '../../utils/Utils';

function DashboardCard04() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const chartData = {
    labels: [
      '12-01-2022', '01-01-2023', '02-01-2023',
      '03-01-2023', '04-01-2023', '05-01-2023',
    ],
    datasets: [
      {
        label: 'Total',
        data: [
          800, 1600, 900, 1300, 1950, 1700,
        ],
        backgroundColor: getCssVariable('--secondary'),
        hoverBackgroundColor: getCssVariable('--secondary-dark'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // {
      //   label: 'Indirect',
      //   data: [
      //     4900, 2600, 5350, 4800, 5200, 4800,
      //   ],
      //   backgroundColor: getCssVariable('--primary'),
      //   hoverBackgroundColor: getCssVariable('--primary-dark'),
      //   barPercentage: 0.7,
      //   categoryPercentage: 0.7,
      //   borderRadius: 4,
      // },
    ],
  };

  const handleBarClick = ({ datasetIndex, index }) => {
    console.log(`Clicked dataset ${datasetIndex}, index ${index}`);
    // Get additional data for the modal
    const dataset = chartData.datasets[datasetIndex];
    const label = chartData.labels[index];
    const value = dataset.data[index];
    
    setModalData({ 
      datasetIndex, 
      index,
      label,
      value,
      datasetLabel: dataset.label
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Use a short timeout to avoid UI flicker
    setTimeout(() => setModalData(null), 200);
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-full md:col-span-full lg:col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Revenue Trend Chart</h2>
      </header>
      <BarChart data={chartData} width={795} height={248} onBarClick={handleBarClick} />
      
      {/* Modal component */}
      <Modal isOpen={showModal} onClose={closeModal} data={modalData} />
    </div>
  );
}

export default DashboardCard04;