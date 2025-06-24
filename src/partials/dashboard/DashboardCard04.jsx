import React, { useState, useEffect } from 'react';
import BarChart01 from '../../charts/BarChart01'
import { axiosInstance } from '../../services/api'
import { useFiscalPeriod } from '../../contexts/FiscalPeriodContext';
import CardDetailModal from '../../components/CardDetailModal';
import OpportunityTable from '../../components/OpportunityTable';
import { opportunityAPI } from '../../features/opportunity/opportunityAPI';
import SubDatePicker from '../../components/SubDatePicker';

function DashboardCard04() {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dateRange, periodLabel, setDateRange, setPeriodLabel } = useFiscalPeriod();
  
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpportunities, setModalOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [values, setValues] = useState({start_date: '', end_date: ''});
  const [pageSize] = useState(10);
  
  const fetchData = async (SubDateRange = null) => {
    try {
      setLoading(true);
      const effectiveRange  = SubDateRange || dateRange;
      const response = await axiosInstance.get('/data/dashboard/', {
        params: {
          start_date: effectiveRange .from.toISOString().split('T')[0],
          end_date: effectiveRange .to.toISOString().split('T')[0],
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
  useEffect(() => {

    fetchData();
  }, [dateRange]);

  const fetchOpenOpportunities = React.useCallback(async (page = 1, start_date, end_date) => {
    try {
      const searchQuery = "";
      const data = await opportunityAPI.getOpportunities(
        searchQuery,
        page,
        pageSize,
        start_date,
        end_date
      );
      setModalOpportunities(data.results || []);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching open opportunities:', error);
    }
  }, [pageSize]);

  const handleBarClick = ({ payload }) => {
    const { created_at_min, created_at_max } = payload;
    // Convert to start_date and end_date
    const start_date = created_at_min;
    const end_date = created_at_max;
    setIsModalOpen(true);
    setValues({ start_date, end_date });
    fetchOpenOpportunities(1, start_date, end_date);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    fetchOpenOpportunities(page, values.start_date, values.end_date);
  };

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
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Revenue Trend Chart
        </h2>
        <SubDatePicker onDateChange={fetchData} />
      </div>
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
        <BarChart01 
          data={revenueData} 
          width={795} 
          height={248} 
          onBarClick={handleBarClick}
        />
      )}

      {showModal && modalOpportunities && (
        <CardDetailModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={`Opportunities - ${periodLabel}`}
        >
          <OpportunityTable 
            opportunities={modalOpportunities} 
            currentPage={currentPage}
            totalCount={totalCount}
            onPageChange={handlePageChange}
          />
        </CardDetailModal>
      )}
    </div>
  );
}

export default DashboardCard04;