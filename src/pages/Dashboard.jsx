// Dashboard.jsx
import React, { useState, useEffect } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import LeaderboardCard from '../charts/LeaderboardCard';
import SourceCard from '../charts/SourceCard';
import ProductsCard from '../charts/ProductsCard';
import LeadsGeneratedCard from '../components/LeadsGeneratedCard';
import KpiCard from '../components/KpiCard';
import LeadsGeneratedSmallCard from '../components/LeadsGeneratedSmallCard';
import ConversionRateGauge from '../components/ConversionRateGauge';
import DashboardCardSalesPerfMatrics from '../partials/dashboard/DashboardCardSalesPerfMatrics';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import { getCssVariable } from '../utils/Utils';
import { axiosInstance } from '../services/api';
import { useFiscalPeriod } from '../contexts/FiscalPeriodContext';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    revenue_trend: [],
    sales_performance: {
      leads_generated: 0,
      quotes_sent: 0,
      jobs_booked: 0,
      conversion_rate: 0,
      average_job_value: 0,
      total_sales: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dateRange } = useFiscalPeriod();

  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/data/dashboard/', {
          params: {
            start_date: dateRange.from.toISOString().split('T')[0],
            end_date: dateRange.to.toISOString().split('T')[0],
          }
        });
        
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]);



  const { sales_performance } = dashboardData;

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Datepicker built with React Day Picker */}
                <Datepicker align="right" />  
              </div>

            </div>

            {/* Loading state */}
            {loading && (
              <div className="text-center py-10">
                <div className="text-gray-500 dark:text-gray-400">Loading dashboard data...</div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-10">
                <div className="text-red-500">{error}</div>
              </div>
            )}

            {/* Cards */}
            {!loading && !error && (
              <div className="grid grid-cols-12 gap-6">
                {/* Bar chart (Revenue) */}
                <DashboardCard04 />

                {/* Sales performance metrics */}
                <div className="col-span-3 grid grid-cols-6 gap-6 justify-between">
                  <KpiCard 
                    title="Quotes Sent" 
                    value={sales_performance.quotes_sent} 
                    unit="" 
                    subtitle="This Period" 
                  />
                  <KpiCard 
                    title="Jobs Booked" 
                    value={sales_performance.jobs_booked} 
                    unit="" 
                    subtitle="Confirmed" 
                  />
                  <ConversionRateGauge 
                    percentage={parseFloat(sales_performance.conversion_rate.toFixed(1))} 
                  />
                  <KpiCard 
                    title="Avg. Job Value" 
                    value={sales_performance.average_job_value.toFixed(2)} 
                    unit="$" 
                    subtitle="This Period" 
                  />
                </div>
                
                {/* Leads Generated Card */}
                <div className="col-span-4">
                  <LeadsGeneratedSmallCard 
                    title="Leads Generated" 
                    value={sales_performance.leads_generated} 
                    unit="" 
                    subtitle="This Period" 
                  />
                </div>

                {/* Pie chart */}
                <DashboardCard06 />
                <DashboardCard07 /> 
                
                {/* Other cards here */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;