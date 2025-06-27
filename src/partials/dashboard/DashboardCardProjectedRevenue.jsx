import React from 'react';
import { Calendar } from 'lucide-react';

function DashboardCardProjectedRevenue({ projectedRevenue }) {
  const data = projectedRevenue || { week1: 0, week2: 0, total: 0 };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Projected Revenue (Next 2 Weeks)
        </h2>
      </header>
      <div className="p-5 space-y-6">
        {/* Week 1 */}
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Week 1</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(data.week1)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Booked jobs for the upcoming week</div>
        </div>
        {/* Week 2 */}
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Week 2</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(data.week2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Booked jobs for the following week</div>
        </div>
        {/* Total */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Total</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(data.total)}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Last updated today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCardProjectedRevenue;
