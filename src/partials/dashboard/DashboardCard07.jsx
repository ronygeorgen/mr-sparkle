import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { axiosInstance } from '../../services/api';
import { useFiscalPeriod } from '../../contexts/FiscalPeriodContext';

function DashboardCard07() {
  const [loading, setLoading] = useState(true);
  const { dateRange } = useFiscalPeriod();
  
  const [cashflowData, setCashflowData] = useState({
    this_week: 0,
    this_month: 0,
    next_30_days: 0,
    weeklyChange: 0,
    monthlyChange: 0,
    projectedChange: 0
  });

  // Fetch dashboard data including cashflow snapshot
  useEffect(() => {
    const fetchCashflowData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/data/dashboard/', {
          params: {
            start_date: dateRange.from.toISOString().split('T')[0],
            end_date: dateRange.to.toISOString().split('T')[0],
          }
        });
        
        // Extract cashflow data from response
        if (response.data && response.data.cashflow_snapshot) {
          const { this_week, this_month, next_30_days } = response.data.cashflow_snapshot;
          
          // Calculate changes (this would normally come from the API)
          // For this example, we're using placeholder values since we don't have historical data
          // In a real implementation, these would likely come from the API or be calculated from historical data
          const weeklyChange = this_week > 0 ? 15 : 0; // Placeholder
          const monthlyChange = this_month > 0 ? 8 : 0; // Placeholder
          const projectedChange = next_30_days > 0 ? 22 : 0; // Placeholder
          
          setCashflowData({
            this_week,
            this_month,
            next_30_days,
            weeklyChange,
            monthlyChange,
            projectedChange
          });
        }
      } catch (error) {
        console.error('Error fetching cashflow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashflowData();
  }, [dateRange]);

  // Format currency function (in USD)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to determine trend icon and color
  const getTrendDisplay = (change) => {
    if (change > 0) {
      return {
        icon: <ArrowUpRight className="w-4 h-4" />,
        color: 'text-green-500'
      };
    } else {
      return {
        icon: <ArrowDownRight className="w-4 h-4" />,
        color: 'text-red-500'
      };
    }
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-full xl:col-span-12 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Cashflow Snapshot</h2>
      </header>
      {loading ? (
        <div className="p-5 flex items-center justify-center h-64">
          <p>Loading cashflow data...</p>
        </div>
      ) : (
        <div className="p-5">
          {/* Cash Collected This Week */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Cash Collected This Week</div>
              {cashflowData.weeklyChange !== 0 && (
                <div className={`flex items-center ${getTrendDisplay(cashflowData.weeklyChange).color}`}>
                  <span className="text-xs font-semibold mr-1">{cashflowData.weeklyChange}%</span>
                  {getTrendDisplay(cashflowData.weeklyChange).icon}
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(cashflowData.this_week)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Deposits + Final Payments</div>
          </div>

          {/* Cash Collected This Month */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Cash Collected This Month</div>
              {cashflowData.monthlyChange !== 0 && (
                <div className={`flex items-center ${getTrendDisplay(cashflowData.monthlyChange).color}`}>
                  <span className="text-xs font-semibold mr-1">{cashflowData.monthlyChange}%</span>
                  {getTrendDisplay(cashflowData.monthlyChange).icon}
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(cashflowData.this_month)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Running total</div>
          </div>

          {/* Cash Expected Next 30 Days */}
          <div className="mb-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Cash Expected Next 30 Days</div>
              {cashflowData.projectedChange !== 0 && (
                <div className={`flex items-center ${getTrendDisplay(cashflowData.projectedChange).color}`}>
                  <span className="text-xs font-semibold mr-1">{cashflowData.projectedChange}%</span>
                  {getTrendDisplay(cashflowData.projectedChange).icon}
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(cashflowData.next_30_days)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Future payments projected</div>
          </div>

          {/* Footer with date information */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Last updated today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              {/* <button className="text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                View Details
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCard07;