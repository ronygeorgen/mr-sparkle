import React, { useState, useEffect, useRef } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

function OpportunityTable({ opportunities, totalCount, currentPage, onPageChange, loading }) {
  const fixedTableRef = useRef(null);
  const scrollableTableRef = useRef(null);
  const [rowHeights, setRowHeights] = useState([]);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';


  // Stacatruc color palette
const stacatrucColors = {
  green: '#36A501',
  darkGrey: '#474747',
  lightGrey: '#E4E4E4',
  medGrey: '#707070',
  clarkGreen: '#BCD230',
  blue: '#3985AE',
};
  
  // Synchronize vertical scroll between tables
  useEffect(() => {
    const fixedTable = fixedTableRef.current;
    const scrollableTable = scrollableTableRef.current;
    
    if (!fixedTable || !scrollableTable) return;

    const handleFixedTableScroll = () => {
      // Sync scrollable table with fixed table's vertical scroll
      scrollableTable.scrollTop = fixedTable.scrollTop;
    };
    
    const handleScrollableTableScroll = () => {
      // Sync fixed table with scrollable table's vertical scroll
      fixedTable.scrollTop = scrollableTable.scrollTop;
    };
    
    fixedTable.addEventListener('scroll', handleFixedTableScroll);
    scrollableTable.addEventListener('scroll', handleScrollableTableScroll);
    
    return () => {
      fixedTable.removeEventListener('scroll', handleFixedTableScroll);
      scrollableTable.removeEventListener('scroll', handleScrollableTableScroll);
    };
  }, []);

  // Synchronize row heights between tables
  useEffect(() => {
    const syncRowHeights = () => {
      const fixedRows = fixedTableRef.current?.querySelectorAll('tbody tr');
      const scrollableRows = scrollableTableRef.current?.querySelectorAll('tbody tr');
      
      if (!fixedRows || !scrollableRows || fixedRows.length !== scrollableRows.length) return;
      
      const newRowHeights = [];
      
      // Calculate heights for each row
      for (let i = 0; i < fixedRows.length; i++) {
        const fixedRowHeight = fixedRows[i].offsetHeight;
        const scrollableRowHeight = scrollableRows[i].offsetHeight;
        const maxHeight = Math.max(fixedRowHeight, scrollableRowHeight);
        newRowHeights.push(maxHeight);
      }
      
      setRowHeights(newRowHeights);
    };
    
    syncRowHeights();
    
    // Re-sync on window resize
    window.addEventListener('resize', syncRowHeights);
    return () => window.removeEventListener('resize', syncRowHeights);
  }, [opportunities]);

  // Format date strings
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  // Calculate age in days
  const calculateAge = (createdDate) => {
    if (!createdDate) return 'N/A';
    try {
      const created = new Date(createdDate);
      const today = new Date();
      const diffTime = Math.abs(today - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays.toString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '£0.00';
    try {
      const numValue = parseFloat(value);
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,

        maximumFractionDigits: 2,
      }).format(numValue);
    } catch (error) {
      return '£0.00';
    }
  };
  

  // Extract name from nested object
  const getFullName = (contact) => {
    if (!contact) return 'N/A';
    return `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'N/A';
  };

  // Get email and phone from contact
  const getContactDetails = (contact) => {
    if (!contact) return { email: 'N/A', phone: 'N/A' };
    return {
      email: contact.email || 'N/A',
      phone: contact.phone || 'N/A'
    };
  };

// Modified getProbabilityBgColor function
const getProbabilityBgColor = (probabilityStr) => {
  // Extract just the percentage value
  const cleanPercentage = probabilityStr?.trim()?.match(/(\d+)%/)?.[1];
  
  if (!cleanPercentage) return darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700';
  
  // Map percentage to appropriate Tailwind color classes
  switch (cleanPercentage) {
    case '25':
      return darkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'; // Dark Grey
    case '50':
      return darkMode ? 'bg-orange-200 text-green-800' : 'bg-orange-200 text-green-800'; // Clark Green 
    case '75':
      return darkMode ? 'bg-blue-200 text-blue-800' : 'bg-blue-200 text-blue-800'; // Blue
    case '90':
      return darkMode ? 'bg-green-500 text-white' : 'bg-green-500 text-white'; // Green
    default:
      return darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700';
  }
};

   // Format probability display
   const formatProbability = (probabilityStr) => {
    // Extract just the percentage value
    const cleanPercentage = probabilityStr?.trim()?.match(/(\d+)%/)?.[1];
    
    if (!cleanPercentage) return 'N/A';
    return `${cleanPercentage}%`;
  };

  return (
    <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header with Pagination */}
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Opportunities ({totalCount || opportunities.length})
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
            aria-label="First page"
          >
            <span className="sr-only">First page</span>
            <span className="text-xs">«</span>
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
            aria-label="Previous page"
          >
            <span className="sr-only">Previous page</span>
            <span className="text-xs">&lt;</span>
          </button>
          
          {/* Page numbers - dynamic based on current page */}
          {Array.from({ length: 5 }, (_, i) => {
            // Calculate page numbers to display (center current page when possible)
            const totalPages = Math.ceil(totalCount / 10);
            let startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(startPage + 4, totalPages);
            
            if (endPage - startPage < 4) {
              startPage = Math.max(1, endPage - 4);
            }
            
            const pageNum = startPage + i;
            if (pageNum > totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`inline-flex items-center justify-center w-8 h-8 rounded border ${
                  pageNum === currentPage
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          }).filter(Boolean)}
          
          {/* More indicator if needed */}
          {Math.ceil(totalCount / 10) > 5 && currentPage < Math.ceil(totalCount / 10) - 2 && (
            <span className="inline-flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400">
              ...
            </span>
          )}
          
          {/* Last page number if not shown in the sequence */}
          {Math.ceil(totalCount / 10) > 5 && currentPage < Math.ceil(totalCount / 10) - 2 && (
            <button
              onClick={() => onPageChange(Math.ceil(totalCount / 10))}
              disabled={loading}
              className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              aria-label={`Page ${Math.ceil(totalCount / 10)}`}
            >
              {Math.ceil(totalCount / 10)}
            </button>
          )}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalCount / 10) || loading}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
            aria-label="Next page"
          >
            <span className="sr-only">Next page</span>
            <span className="text-xs">&gt;</span>
          </button>
          <button
            onClick={() => onPageChange(Math.ceil(totalCount / 10))}
            disabled={currentPage === Math.ceil(totalCount / 10) || loading}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
            aria-label="Last page"
          >
            <span className="sr-only">Last page</span>
            <span className="text-xs">»</span>
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">Company Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[120px]">Customer Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider min-w-[140px]">Opportunity Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px] hidden sm:table-cell">Contact Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[240px] hidden md:table-cell">Pipeline</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px] hidden md:table-cell">Next Step</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px] hidden md:table-cell">Closing Probability</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px] hidden lg:table-cell">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px] hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px] hidden xl:table-cell">Age (days)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px] hidden xl:table-cell">Expected Close Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px] hidden xl:table-cell">Envisage Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px] hidden 2xl:table-cell">Created Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px] hidden 2xl:table-cell">Updated Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px] hidden 2xl:table-cell">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="15" className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : opportunities.length === 0 ? (
              <tr>
                <td colSpan="15" className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
                  No opportunities found
                </td>
              </tr>
            ) : (
              opportunities.map((opportunity, index) => {
                const rowBg = index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900';
                const contactDetails = getContactDetails(opportunity.contact);
                return (
                  <tr key={opportunity.ghl_id || opportunity.id} className={rowBg}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[120px]">
                      {(opportunity.assigned_to?.first_name || opportunity.assigned?.first_name || 'N/A') + ' ' + (opportunity.assigned_to?.last_name || opportunity.assigned?.last_name || '')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[120px]">
                      {getFullName(opportunity.contact)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[140px]">
                      {opportunity.name || opportunity.description || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[180px] hidden sm:table-cell">
                      <div>
                        <div>{contactDetails.email}</div>
                        <div>{contactDetails.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 min-w-[180px] hidden md:table-cell">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-700 dark:text-green-300">
                        {opportunity.pipeline?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 min-w-[120px] hidden md:table-cell">
                      <span className="px-2 py-1 text-xs font-medium rounded-full text-gray-900 dark:text-gray-100">
                        {opportunity.next_step?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 min-w-[120px] hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProbabilityBgColor(opportunity.custom_fields?.chances_of_closing_the_deal)}`}>
                        {formatProbability(opportunity.custom_fields?.chances_of_closing_the_deal) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[100px] hidden lg:table-cell">
                      {opportunity.current_stage?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[100px] hidden lg:table-cell">
                      <div className="flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                          {opportunity.status || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[80px] hidden xl:table-cell">
                      {calculateAge(opportunity.created_at || opportunity.created_timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[120px] hidden xl:table-cell">
                      N/A
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[120px] hidden xl:table-cell">
                      N/A
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[100px] hidden 2xl:table-cell">
                      {formatDate(opportunity.created_at || opportunity.created_timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 min-w-[100px] hidden 2xl:table-cell">
                      {formatDate(opportunity.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400 min-w-[100px] hidden 2xl:table-cell">
                      {formatCurrency(opportunity.value)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* Mobile message */}
        <div className="sm:hidden text-xs text-gray-500 mt-2 px-2">Swipe left/right to see more columns.</div>
      </div>
    </div>
  );
}

export default OpportunityTable;