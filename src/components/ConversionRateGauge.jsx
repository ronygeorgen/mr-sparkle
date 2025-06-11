import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ConversionRateGauge = ({ percentage, onClick }) => {
  return (
    <div className="flex flex-col sm:col-span-full md:col-span-3 xl:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 cursor-pointer h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClick}>
      <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-4">Conversion Rate</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              textSize: '16px',
              textColor: 'var(--text-primary)',
              pathColor: 'var(--primary)',
              trailColor: '#d6d6d6',
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversionRateGauge;