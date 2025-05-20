import React, { useState, useEffect } from 'react';
import BarChart01 from '../../charts/BarChart01'
import { axiosInstance } from '../../services/api'

function DashboardCard04() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/dashboard/', {
          params: {
            start_date: '2025-01-01',
            end_date: '2025-03-20'
          }
        });
        
        if (response.data && response.data.revenue_trend) {
          // Format the data for the chart
          const formattedData = response.data.revenue_trend.map(item => ({
            name: `${item.month.substring(0, 3)} ${item.year}`,
            value: parseFloat(item.value.toFixed(2))
          }));
          
          setRevenueData(formattedData);
        }
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  const formattedTotal = formatCurrency(totalRevenue);

  return (
    <div className="flex flex-col col-span-full sm:col-span-full md:col-span-full lg:col-span-full bg-white dark:bg-gray-800 shadow-md rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Revenue Trend Chart</h2>
      </header>
      
      <div className="px-5 pt-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{formattedTotal}</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Total</div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading revenue data...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <BarChart01 data={revenueData} width={795} height={248} />
      )}
    </div>
  );
}

export default DashboardCard04;