import React from 'react';
import PieChart from '../../charts/PieChart';

function DashboardCard06() {
  const leadSourceData = {
    labels: [
      'Google Ads',
      'GBP Organic',
      'Facebook Groups',
      'Referrals',
      'Door Knocking'
    ],
    datasets: [{
      data: [120, 90, 70, 40, 30],
      tooltipData: [
        { count: 120, value: 24000 },
        { count: 90, value: 18000 },
        { count: 70, value: 14000 },
        { count: 40, value: 8000 },
        { count: 30, value: 6000 }
      ]
    }]
  };

  const handleSegmentClick = (index, label) => {
    console.log(`Clicked segment: ${label} (Index: ${index})`);
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Lead Source Breakdown</h2>
      </header>
      <div className="p-3">
        <PieChart
          data={leadSourceData}
          width={389}
          height={260}
          onSegmentClick={handleSegmentClick}
        />
      </div>
    </div>
  );
}

export default DashboardCard06;