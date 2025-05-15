import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ConversionRateGauge = ({ percentage }) => {
  return (
    <div className="flex flex-col sm:col-span-full md:col-span-3 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Conversion Rate</h3>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: 'var(--text-primary)',
          pathColor: 'var(--primary)',
          trailColor: '#d6d6d6',
        })}
      />
    </div>
  );
};

export default ConversionRateGauge;