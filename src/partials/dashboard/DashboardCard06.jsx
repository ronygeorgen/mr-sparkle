import React, { useState, useEffect } from 'react';
import PieChart from '../../charts/PieChart';
import { axiosInstance } from '../../services/api';

function DashboardCard06() {
  const [loading, setLoading] = useState(true);
  const [leadSourceData, setLeadSourceData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-03-20'
  });

  // Define the categories we want to display
  const categoriesToShow = [
    'Google Ads',
    'GBP Organic',
    'Facebook Groups',
    'Referrals',
    'Door Knocking'
  ];

  // Function to process API data and create chart data
  const processLeadSourceData = (apiData) => {
    if (!apiData || !apiData.lead_source_breakdown) return null;

    // Map the API data to our categories
    const sourceMap = {
      // Google Ads related sources
      'Google Ads': ['Google Ads', 'Google Advertising', 'google Ads'],
      // Organic Google/GBP related sources
      'GBP Organic': ['Organic Google', 'Google Maps', 'Organic google'],
      // Facebook related sources
      'Facebook Groups': ['FB Community Group', 'FB Community G', 'Facebook Community Group', 'Facebook Ad', 'Instagram'],
      // Referral related sources
      'Referrals': ['Client Referral', 'Client referral', 'Word of mouth', 'Word Of Mouth', 'Referral', 'BNI'],
      // Door Knocking related sources
      'Door Knocking': ['Door Knocking', 'Door knocking']
    };

    // Initialize data for each category
    const processedData = {
      labels: categoriesToShow,
      datasets: [{
        data: Array(categoriesToShow.length).fill(0),
        tooltipData: categoriesToShow.map(() => ({ count: 0, value: 0 }))
      }]
    };

    // Process the API data
    apiData.lead_source_breakdown.forEach(item => {
      // Find which category this source belongs to
      for (const [category, sources] of Object.entries(sourceMap)) {
        if (sources.includes(item.source)) {
          const index = categoriesToShow.indexOf(category);
          if (index !== -1) {
            // Add to the count and value
            processedData.datasets[0].tooltipData[index].count += item.count;
            processedData.datasets[0].tooltipData[index].value += item.value;
            // Update the main data array (used for the chart visualization)
            processedData.datasets[0].data[index] += item.value;
          }
          break;
        }
      }
    });

    return processedData;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/data/dashboard/', {
          params: {
            start_date: dateRange?.startDate,
            end_date: dateRange?.endDate
          }
        });
        
        const processedData = processLeadSourceData(response.data);
        setLeadSourceData(processedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-5 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Lead Source Breakdown</h2>
      </header>
      {loading ? (
        <div className="px-5 py-3 flex items-center justify-center h-96">
          <p>Loading chart data...</p>
        </div>
      ) : (
        leadSourceData && (
          <PieChart 
            data={leadSourceData} 
            width={389} 
            height={320} 
          />
        )
      )}
    </div>
  );
}

export default DashboardCard06;