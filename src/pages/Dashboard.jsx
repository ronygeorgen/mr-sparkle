// Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';

import Header from '../partials/Header';
import Datepicker from '../components/Datepicker';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import KpiCard from '../components/KpiCard';
import LeadsGeneratedSmallCard from '../components/LeadsGeneratedSmallCard';
import ConversionRateGauge from '../components/ConversionRateGauge';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import { axiosInstance } from '../services/api';
import { useFiscalPeriod } from '../contexts/FiscalPeriodContext';
import CardDetailModal from '../components/CardDetailModal';
import OpportunityTable from '../components/OpportunityTable';
import { opportunityAPI } from '../features/opportunity/opportunityAPI';
import SubDatePicker from '../components/SubDatePicker';

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
    },
    financial_metrics: {
      revenue_ytd: 0,
      revenue_mtd: 0,
      revenue_qtd: 0,
      cash_collected: 0,
      projected_revenue_week1: 0,
      projected_revenue_week2: 0,
      pipeline_value: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dateRange } = useFiscalPeriod();

  // Add state for modal and opportunities
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpportunities, setModalOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // Add state for sales performance section date range
  const [salesPerfDateRange, setSalesPerfDateRange] = useState(null);

  // Function to fetch opportunities based on metric
  const fetchOpportunities = async (page = 1, metric) => {
    try {
      setModalLoading(true);
      const params = {
        searchQuery: "",
        page: page,
        pageSize: 10
      };

      // Add date range if available
      if (dateRange && dateRange.from) {
        params.created_at_min = dateRange.from.toISOString().split('T')[0];
        if (dateRange.to) {
          params.created_at_max = dateRange.to.toISOString().split('T')[0];
        }
      }

      // Add metric-specific filters
      switch (metric) {
        case 'quotes':
          params.stage_name = ['Quote Sent'];
          break;
        case 'jobs':
          params.stage_name = ['Job Booked'];
          break;
        case 'leads':
          params.stage_name = ['New Lead'];
          break;
        case 'value':
          params.stage_name = ['Job Booked'];
          break;
        default:
          break;
      }

      const data = await opportunityAPI.getOpportunities(
        params.searchQuery,
        params.page,
        params.pageSize,
        params.fiscal_period,
        params.created_at_min,
        params.created_at_max,
        params.state,
        params.pipeline,
        params.stage_name,
        params.assigned_to,
        params.contact,
        params.opportunity_source,
      );

      setModalOpportunities(data.results || []);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // Memoized handlers
  const handleKpiClick = useCallback((metric) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
    fetchOpportunities(1, metric);
  }, [fetchOpportunities]);

  const handlePageChange = useCallback((page) => {
    fetchOpportunities(page, selectedMetric);
  }, [fetchOpportunities, selectedMetric]);

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
        console.log(response.data)
        setDashboardData(prev => ({
          ...prev,
          ...response.data,
        }));
        
        // setDashboardData(response.data);
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
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">

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

            </div>

            {/* Financial Metrics Section - now at the top */}
            <div className="w-full mb-8 grid grid-cols-1 sm:grid-cols-2 grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="sm:col-span-1">
                <KpiCard 
                  title="Revenue YTD" 
                  value={dashboardData.financial_metrics?.revenue_ytd.toFixed(2)} 
                  unit="$" 
                  subtitle="Year to Date"
                  className="text-4xl font-extrabold py-8"
                  onClick={() => handleKpiClick('revenue_ytd')}
                />
              </div>
              <div className="sm:col-span-1">
                <KpiCard 
                  title="Revenue MTD" 
                  value={dashboardData.financial_metrics?.revenue_mtd.toFixed(2)} 
                  unit="$" 
                  subtitle="Month to Date"
                  className="text-4xl font-extrabold py-8"
                  onClick={() => handleKpiClick('revenue_mtd')}
                />
              </div>
              <div className="sm:col-span-1">
                <KpiCard 
                  title="Revenue QTD" 
                  value={dashboardData.financial_metrics?.revenue_qtd.toFixed(2)} 
                  unit="$" 
                  subtitle="Quarter to Date"
                  className="text-4xl font-extrabold py-8"
                  onClick={() => handleKpiClick('revenue_qtd')}
                />
              </div>
              <div className="sm:col-span-1">
                <KpiCard 
                  title="Cash Collected" 
                  value={dashboardData.financial_metrics?.cash_collected.toFixed(2)} 
                  unit="$" 
                  subtitle="Selected Period"
                  className="text-4xl font-extrabold py-8"
                  onClick={() => handleKpiClick('cash_collected')}
                />
              </div>
              <div className="sm:col-span-1">
                <KpiCard 
                  title="Projected Revenue (Week 2)" 
                  value={dashboardData.financial_metrics?.projected_revenue_week2.toFixed(2)} 
                  unit="$" 
                  subtitle="Week After Next"
                  className="text-4xl font-extrabold py-8"
                  onClick={() => handleKpiClick('projected_week2')}
                />
              </div>
              <div className="sm:col-span-1">
                <KpiCard 
                  title="Pipeline Value" 
                  value={dashboardData.financial_metrics?.pipeline_value.toFixed(2)} 
                  unit="$" 
                  subtitle="Open Deals"
                  className="text-4xl font-extrabold py-8"
                  onClick={() => handleKpiClick('pipeline')}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Bar chart (Revenue) */}
                <div className="col-span-full">
                  <DashboardCard04 />
                </div>

                {/* Sales Performance Section */}
                <div className="col-span-full lg:col-span-6 flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-xl h-full">
                  <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-semibold text-gray-800 dark:text-gray-100">Sales Performance</h2>
                      <SubDatePicker onDateChange={setSalesPerfDateRange} />
                    </div>
                  </header>
                  <div className="px-5 pt-3 pb-2 flex-1 flex flex-col">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <KpiCard 
                          title="Quotes Sent" 
                          value={sales_performance?.quotes_sent} 
                          unit="" 
                          subtitle="This Period"
                          onClick={() => handleKpiClick('quotes')}
                        />
                      </div>
                      <div>
                        <KpiCard 
                          title="Jobs Booked" 
                          value={sales_performance?.jobs_booked} 
                          unit="" 
                          subtitle="Confirmed"
                          onClick={() => handleKpiClick('jobs')}
                        />
                      </div>
                      <div>
                        <ConversionRateGauge 
                          percentage={parseFloat(sales_performance?.conversion_rate.toFixed(1))} 
                          onClick={() => handleKpiClick('value')}
                        />
                      </div>
                      <div>
                        <KpiCard 
                          title="Avg. Job Value" 
                          value={sales_performance?.average_job_value.toFixed(2)} 
                          unit="$" 
                          subtitle="This Period"
                          onClick={() => handleKpiClick('value')}
                        />
                      </div>
                      <div>
                        <KpiCard 
                          title="Leads Generated" 
                          value={sales_performance?.leads_generated} 
                          unit="" 
                          subtitle="This Period"
                          onClick={() => handleKpiClick('leads')}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                      <span>Leads Generated, Quotes Sent: GHL</span> &nbsp;|&nbsp; <span>Jobs Booked: ServiceM8</span>
                    </div>
                  </div>
                </div>
                
                {/* Pie chart */}
                <div className="col-span-full lg:col-span-6 h-full">
                  <DashboardCard06 />
                </div>
                <div className="col-span-full lg:col-span-4">
                  <DashboardCard07 />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CardDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Opportunities - ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`}
        >
          <OpportunityTable 
            opportunities={modalOpportunities} 
            currentPage={currentPage}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            loading={modalLoading}
          />
        </CardDetailModal>
      )}
    </div>
  );
}

export default Dashboard;