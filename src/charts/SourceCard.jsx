import React, { useState, useEffect, useCallback } from 'react';
import { useFiscalPeriod } from '../contexts/FiscalPeriodContext';
import OpportunityTable from '../components/OpportunityTable';
import CardDetailModal from '../components/CardDetailModal';
import { axiosInstance } from "../services/api";
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';


// Function to get a color based on the source type
const getSourceColor = (sourceName) => {
  // Handle case when sourceName is not a string
  if (typeof sourceName !== 'string') {
    return 'bg-gray-500';
  }
  
  const colorMap = {
    'In Bound Call': 'bg-blue-500',
    'In Bound Email': 'bg-green-500',
    'Best Quote': 'bg-yellow-500',
    'Cold Call': 'bg-red-500',
    'Referral': 'bg-purple-500',
    'Engineer Lead': 'bg-indigo-500',
    'Existing Customer': 'bg-teal-500',
    'Web Chat': 'bg-pink-500',
    'Face to Face': 'bg-orange-500'
  };
  
  return colorMap[sourceName] || 'bg-gray-500';
};

function SourceCard() {
  // Get fiscal period context
  const { periodLabel, dateRange, fiscalPeriodCode } = useFiscalPeriod();
  const [selectedSource, setSelectedSource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceData, setSourceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const selectedPipelines = useSelector((state) => state.filters?.selectedGlobalFilterPipelines || []);

  const selectedPipelineStages = useSelector((state) => state.filters?.pipelineStages || []);
  const selectedAssignedUsers = useSelector((state) => state.filters?.assignedUsers || []);
  const selectedOpportunityOwners = useSelector((state) => state.filters?.opportunityOwners || []);
  const selectedOpportunitySources = useSelector((state) => state.filters?.opportunitySources || []);
  const selectedProductSales = useSelector((state) => state.filters?.productSales || []);

  
  // For modal pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [modalOpportunities, setModalOpportunities] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Fetch dashboard data from the API
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      let url = '/opportunity_dash';
      let params = {};
      
      // Apply fiscal period filter if available, otherwise use date range if available
      if (fiscalPeriodCode) {
        params.fiscal_period = fiscalPeriodCode;
      } else if (dateRange && dateRange.from) {
        params.created_at_min = format(dateRange.from, 'yyyy-MM-dd');
        if (dateRange.to) {
          params.created_at_max = format(dateRange.to, 'yyyy-MM-dd');
        }
      }

      // Add pipeline filters if they exist
      if (selectedPipelines && selectedPipelines.length > 0) {
        // Don't set params.pipeline as an array
        delete params.pipeline; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedPipelines.forEach(pipeline => {
          // This will be handled by axios to create multiple params with same name
          if (!params.pipeline) {
            params.pipeline = pipeline;
          } else if (Array.isArray(params.pipeline)) {
            params.pipeline.push(pipeline);
          } else {
            params.pipeline = [params.pipeline, pipeline];
          }
        });
      }

      if (selectedPipelineStages && selectedPipelineStages.length > 0) {
        // Don't set params.pipeline as an array
        delete params.stage_name; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedPipelineStages.forEach(stage_name => {
          // This will be handled by axios to create multiple params with same name
          if (!params.stage_name) {
            params.stage_name = stage_name;
          } else if (Array.isArray(params.stage_name)) {
            params.stage_name.push(stage_name);
          } else {
            params.stage_name = [params.stage_name, stage_name];
          }
        });
      }
      
      if (selectedAssignedUsers && selectedAssignedUsers.length > 0) {
        // Don't set params.pipeline as an array
        delete params.assigned_to; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedAssignedUsers.forEach(assigned_to => {
          // This will be handled by axios to create multiple params with same name
          if (!params.assigned_to) {
            params.assigned_to = assigned_to;
          } else if (Array.isArray(params.assigned_to)) {
            params.assigned_to.push(assigned_to);
          } else {
            params.assigned_to = [params.assigned_to, assigned_to];
          }
        });
      }
      
      if (selectedOpportunityOwners && selectedOpportunityOwners.length > 0) {
        // Don't set params.pipeline as an array
        delete params.contact; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedOpportunityOwners.forEach(contact => {
          // This will be handled by axios to create multiple params with same name
          if (!params.contact) {
            params.contact = contact;
          } else if (Array.isArray(params.contact)) {
            params.contact.push(contact);
          } else {
            params.contact = [params.contact, contact];
          }
        });
      }
      
      if (selectedOpportunitySources && selectedOpportunitySources.length > 0) {
        // Don't set params.pipeline as an array
        delete params.opportunity_source; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedOpportunitySources.forEach(opportunity_source => {
          // This will be handled by axios to create multiple params with same name
          if (!params.opportunity_source) {
            params.opportunity_source = opportunity_source;
          } else if (Array.isArray(params.opportunity_source)) {
            params.opportunity_source.push(opportunity_source);
          } else {
            params.opportunity_source = [params.opportunity_source, opportunity_source];
          }
        });
      }
      
      const response = await axiosInstance.get(url, { params });
      setDashboardData(response.data);
      
      // Transform the source data to match the expected format and ensure source is a string
      const transformedSourceData = response.data.opp_source.map((source, index) => ({
        id: index,
        name: String(source.source || ''), // Ensure source is always a string
        value: source.total_value || 0,
        deals: source.count || 0,
        average_value: source.average_value || 0
      }));
      
      setSourceData(transformedSourceData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, fiscalPeriodCode, selectedPipelines, selectedPipelineStages, selectedAssignedUsers, selectedOpportunityOwners, selectedOpportunitySources]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch opportunities for a specific source
  const fetchSourceOpportunities = useCallback(async (source, page = 1) => {
    if (!source) return;
    
    try {
      setModalLoading(true);
      
      let url = '/opportunities/';
      let params = {
        opportunity_source: source.name, // Using opportunity_source parameter as specified
        page: page,
        page_size: pageSize
      };
      
      // Apply fiscal period filter if available, otherwise use date range if available
      if (fiscalPeriodCode) {
        params.fiscal_period = fiscalPeriodCode;
      } else if (dateRange && dateRange.from) {
        params.created_at_min = format(dateRange.from, 'yyyy-MM-dd');
        if (dateRange.to) {
          params.created_at_max = format(dateRange.to, 'yyyy-MM-dd');
        }
      }

      // Add pipeline filters if they exist
      if (selectedPipelines && selectedPipelines.length > 0) {
        // Don't set params.pipeline as an array
        delete params.pipeline; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedPipelines.forEach(pipeline => {
          // This will be handled by axios to create multiple params with same name
          if (!params.pipeline) {
            params.pipeline = pipeline;
          } else if (Array.isArray(params.pipeline)) {
            params.pipeline.push(pipeline);
          } else {
            params.pipeline = [params.pipeline, pipeline];
          }
        });
      }

      if (selectedPipelineStages && selectedPipelineStages.length > 0) {
        // Don't set params.pipeline as an array
        delete params.stage_name; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedPipelineStages.forEach(stage_name => {
          // This will be handled by axios to create multiple params with same name
          if (!params.stage_name) {
            params.stage_name = stage_name;
          } else if (Array.isArray(params.stage_name)) {
            params.stage_name.push(stage_name);
          } else {
            params.stage_name = [params.stage_name, stage_name];
          }
        });
      }
      
      if (selectedAssignedUsers && selectedAssignedUsers.length > 0) {
        // Don't set params.pipeline as an array
        delete params.assigned_to; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedAssignedUsers.forEach(assigned_to => {
          // This will be handled by axios to create multiple params with same name
          if (!params.assigned_to) {
            params.assigned_to = assigned_to;
          } else if (Array.isArray(params.assigned_to)) {
            params.assigned_to.push(assigned_to);
          } else {
            params.assigned_to = [params.assigned_to, assigned_to];
          }
        });
      }
      
      if (selectedOpportunityOwners && selectedOpportunityOwners.length > 0) {
        // Don't set params.pipeline as an array
        delete params.contact; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedOpportunityOwners.forEach(contact => {
          // This will be handled by axios to create multiple params with same name
          if (!params.contact) {
            params.contact = contact;
          } else if (Array.isArray(params.contact)) {
            params.contact.push(contact);
          } else {
            params.contact = [params.contact, contact];
          }
        });
      }
      
      if (selectedOpportunitySources && selectedOpportunitySources.length > 0) {
        // Don't set params.pipeline as an array
        delete params.opportunity_source; // Remove any existing pipeline param
        
        // Add each pipeline as a separate parameter with the same name
        selectedOpportunitySources.forEach(opportunity_source => {
          // This will be handled by axios to create multiple params with same name
          if (!params.opportunity_source) {
            params.opportunity_source = opportunity_source;
          } else if (Array.isArray(params.opportunity_source)) {
            params.opportunity_source.push(opportunity_source);
          } else {
            params.opportunity_source = [params.opportunity_source, opportunity_source];
          }
        });
      }
      
      const response = await axiosInstance.get(url, { params });
      
      setModalOpportunities(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching source opportunities:', error);
      setModalOpportunities([]);
      setTotalCount(0);
    } finally {
      setModalLoading(false);
    }
  }, [dateRange, fiscalPeriodCode, selectedPipelines, selectedPipelineStages, selectedAssignedUsers, selectedOpportunityOwners, selectedOpportunitySources]);

  // Handle source row click
  const handleSourceClick = (source) => {
    setSelectedSource(source);
    setModalOpen(true);
    fetchSourceOpportunities(source, 1); // Reset to first page when opening modal
  };

  // Handle pagination in the modal
  const handlePageChange = (page) => {
    fetchSourceOpportunities(selectedSource, page);
  };

  // Calculate total value of all sources
  const totalValue = sourceData.reduce((sum, source) => sum + source.value, 0);

  return (
    <>
      <div className="flex flex-col col-span-full sm:col-span-12 lg:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Opportunity Sources</h2>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
            <span className="mr-1">{periodLabel || "All Time"}</span>
            <span className="ml-2">Total: {formatCurrency(totalValue)}</span>
          </div>
        </header>
        
        <div className="p-3">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Source</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-right">Total Value</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Deals</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-right">Avg. Deal Size</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                  {sourceData.map((source) => {
                    const bgColorClass = getSourceColor(source.name);
                    
                    return (
                      <tr 
                        key={source.id} 
                        onClick={() => handleSourceClick(source)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 mr-2 flex-shrink-0 rounded-full ${bgColorClass} flex items-center justify-center text-white font-medium`}>
                              {typeof source.name === 'string' ? source.name.charAt(0) : '-'}
                            </div>
                            <div className="font-medium text-gray-800 dark:text-gray-100">{source.name}</div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-right font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(source.value)}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center font-medium text-gray-800 dark:text-gray-200">{source.deals}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-right font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(source.average_value)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for source details */}
      <CardDetailModal
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedSource ? `${selectedSource.name} Opportunities - ${periodLabel}` : ''}
      >
        <OpportunityTable
          opportunities={modalOpportunities}
          currentPage={currentPage}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          loading={modalLoading}
        />
      </CardDetailModal>
    </>
  );
}

export default SourceCard;