import React, { useState, useEffect } from 'react';
import PieChart from '../../charts/PieChart';
import { axiosInstance } from '../../services/api';
import { useFiscalPeriod } from '../../contexts/FiscalPeriodContext';
import CardDetailModal from '../../components/CardDetailModal';
import OpportunityTable from '../../components/OpportunityTable';
import { opportunityAPI } from '../../features/opportunity/opportunityAPI';
import SubDatePicker from '../../components/SubDatePicker';

function DashboardCard06() {
  const [loading, setLoading] = useState(true);
  const [leadSourceData, setLeadSourceData] = useState(null);
  const { dateRange, periodLabel } = useFiscalPeriod();
  const [cardDateRange, setCardDateRange] = useState(dateRange);

  useEffect(() => {
    setCardDateRange(dateRange);
  }, [dateRange]);
  
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpportunities, setModalOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSource, setSelectedSource] = useState('');

  // Define the categories we want to display
  const categoriesToShow = [
    'Google Ads',
    'GBP Organic',
    'Facebook Groups',
    'Referrals',
    'Door Knocking'
  ];

  // Define color mapping for lead sources
  const leadSourceColorMap = {
    'Google Ads': '#36A501',
    'GBP Organic': '#3985AE',
    'Facebook Groups': '#BCD230',
    'Referrals': '#F7A928',
    'Door Knocking': '#8E44AD'
  };

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

  const fetchOpportunities = React.useCallback(async (page = 1, source) => {
    try {
      const effectiveRange = cardDateRange;
      const response = await axiosInstance.get('/data/opportunities/', {
        params: {
          start_date: effectiveRange.from.toISOString().split('T')[0],
          end_date: effectiveRange.to.toISOString().split('T')[0],
          source: source,
          page: page
        }
      });
      
      setModalOpportunities(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  }, [cardDateRange]);

  const handlePieClick = (source) => {
    setSelectedSource(source);
    setIsModalOpen(true);
    setShowModal(true);
    fetchOpportunities(1, source);
  };

  const handlePageChange = (page) => {
    fetchOpportunities(page, selectedSource);
  };

  const handleDateChange = (newDateRange) => {
    setCardDateRange(newDateRange);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const effectiveRange = cardDateRange;
      const response = await axiosInstance.get('/data/dashboard/', {
        params: {
          start_date: effectiveRange.from.toISOString().split('T')[0],
          end_date: effectiveRange.to.toISOString().split('T')[0],
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
  useEffect(() => {
    fetchDashboardData();
  }, [cardDateRange]);

  return (
    <div className="flex flex-col h-full col-span-full sm:col-span-6 xl:col-span-5 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Lead Source Breakdown
        </h2>
        <SubDatePicker onDateChange={handleDateChange} />
      </div>
    </header>
      {loading ? (
        <div className="px-5 py-3 flex items-center justify-center h-96">
          <p>Loading chart data...</p>
        </div>
      ) : (
        (() => {
          const hasData = leadSourceData && leadSourceData.datasets && leadSourceData.datasets[0] && Array.isArray(leadSourceData.datasets[0].data) && leadSourceData.datasets[0].data.some(v => v > 0);
          if (hasData) {
            return (
              <PieChart 
                data={leadSourceData} 
                width={389} 
                height={320}
                onSegmentClick={handlePieClick}
                categories={categoriesToShow}
                colorMap={leadSourceColorMap}
              />
            );
          } else {
            return (
              <div className="flex items-center justify-center h-64 w-full">
                <span className="text-gray-400 dark:text-gray-500 text-lg font-medium">No data to display</span>
              </div>
            );
          }
        })()
      )}

      {showModal && (
        <CardDetailModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setShowModal(false);
            setModalOpportunities([]);
            setCurrentPage(1);
            setTotalCount(0);
          }}
          title={`${selectedSource} Opportunities - ${cardDateRange.from.toLocaleDateString()} to ${cardDateRange.to.toLocaleDateString()}`}
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

export default DashboardCard06;