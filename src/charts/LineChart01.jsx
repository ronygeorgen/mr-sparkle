import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { useFiscalPeriod } from '../contexts/FiscalPeriodContext';
import { format, isValid, parse } from 'date-fns';

import { chartColors } from './ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { formatValue } from '../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, CategoryScale, Tooltip);

function LineChart01({
  data,
  width,
  height
}) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const { selectedPeriodIndex, periodLabel } = useFiscalPeriod();
  const darkMode = currentTheme === 'dark';
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor, tooltipTitleColor } = chartColors;

  // Get current year for date correction
  const currentYear = new Date().getFullYear();

  // Determine time unit based on fiscal period
  const getTimeUnit = () => {
    switch (selectedPeriodIndex) {
      case 1: // This Week
      case 2: // Last Week
        return 'day';
      case 3: // This Month
      case 4: // Last Month
        return 'day';
      case 5: // Last 6 Months
        return 'month';
      case 6: // This Year
      case 7: // Last Year
        return 'month';
      default:
        return 'day';
    }
  };

  // Parse date with year correction if needed
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    let date;
    
    // Handle different date formats
    if (typeof dateStr === 'string') {
      // Check for MM-DD format without year (could be causing the 2001 issue)
      if (/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        // Add current year since it's missing
        date = new Date(currentYear, parseInt(parts[0]) - 1, parseInt(parts[1]));
      }
      // Check for MM-DD-YYYY format
      else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      }
      // Check for YYYY-MM-DD format
      else if (/^\d{4}-\d{1,2}-\d{1,2}/.test(dateStr)) {
        const parts = dateStr.split('-');
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      // Try standard date parsing
      else {
        date = new Date(dateStr);
        
        // Fix for dates that might default to 2001
        if (isValid(date) && date.getFullYear() === 2001) {
          // This is likely a default year issue, override with current year
          date.setFullYear(currentYear);
        }
      }
    } else if (dateStr instanceof Date) {
      date = new Date(dateStr);
      
      // Check for 2001 year and fix
      if (date.getFullYear() === 2001) {
        date.setFullYear(currentYear);
      }
    }

    return isValid(date) ? date : null;
  };

  // Format date for tooltip based on time unit
  const formatTooltipDate = (dateStr) => {
    if (!dateStr) return '';
    
    const date = parseDate(dateStr);
    if (!date) return dateStr; // Return original if parsing failed

    const timeUnit = getTimeUnit();
    
    switch (timeUnit) {
      case 'day':
        return format(date, 'MMMM yyyy'); // e.g., "Monday, Apr 25, 2025"
      case 'week':
        return format(date, 'MMMM yyyy');
      case 'month':
        return format(date, 'MMMM yyyy'); // e.g., "April 2025"
      case 'year':
        return format(date, 'MMMM yyyy');
      default:
        return format(date, 'MMMM yyyy');
    }
  };

  // Create or recreate chart based on data and theme
  const createChart = () => {
    if (!canvas.current || !data || !data.labels || data.labels.length === 0) {
      return null;
    }

    const ctx = canvas.current;
    const timeUnit = getTimeUnit();
    
    // Process date labels if needed
    const processedData = {
      ...data,
      labels: data.labels.map(label => {
        // If using date objects directly, make sure they have the correct year
        if (label instanceof Date && label.getFullYear() === 2001) {
          const correctedDate = new Date(label);
          correctedDate.setFullYear(currentYear);
          return correctedDate;
        }
        return label;
      })
    };
    
    // Determine if we're dealing with date strings
    let isTimeScale = false;
    if (processedData.labels[0]) {
      if (typeof processedData.labels[0] === 'string') {
        // Check for date patterns
        isTimeScale = /^\d{1,2}-\d{1,2}$/.test(processedData.labels[0]) ||
                      /^\d{1,2}-\d{1,2}-\d{4}$/.test(processedData.labels[0]) || 
                      /^\d{4}-\d{1,2}-\d{1,2}/.test(processedData.labels[0]) ||
                      !isNaN(Date.parse(processedData.labels[0]));
      } else if (processedData.labels[0] instanceof Date) {
        isTimeScale = true;
      }
    }
    
    // Configure the options based on label type
    const scaleOptions = isTimeScale ? 
      {
        x: {
          type: 'time',
          time: {
            unit: timeUnit,
            tooltipFormat: timeUnit === 'day' ? 'MMMM yyyy' : 
                          timeUnit === 'month' ? 'MMMM yyyy': 'MMMM yyyy',
            displayFormats: {
              day: 'd',
              week: 'MMM d',
              month: 'MMM',
              year: 'yyyy'
            },
            // Force the year to be the current year for month-based views
            parser: (value) => {
              const parsedDate = parseDate(value);
              return parsedDate;
            }
          },
          display: false,
        }
      } : 
      {
        x: {
          type: 'category',
          display: false,
        }
      };

      // Format value as Euro currency
      const formatEuroValue = (value) => {
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          maximumFractionDigits: 0
        }).format(value);
      };
    
    // Set tooltip color based on theme
    const titleColor = darkMode ? '#fff' : '#000';  // Use explicit colors
    const bodyColor = darkMode ? '#f8fafc' : '#1e293b';  // Light gray for dark mode, dark gray for light mode
    const bgColor = darkMode ? '#334155' : '#ffffff';  // Dark blue-gray for dark mode, white for light mode
    const borderColor = darkMode ? '#475569' : '#e2e8f0';  // Medium gray for dark mode, light gray for light mode
    
    return new Chart(ctx, {
      type: 'line',
      data: processedData,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
          },
          ...scaleOptions
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => {
                // Display date information in the tooltip title
                if (context[0]) {
                  const index = context[0].dataIndex;
                  if (isTimeScale) {
                    return formatTooltipDate(processedData.labels[index]);
                  }
                  return processedData.labels[index] || '';
                }
                return '';
              },
              label: (context) => {
                // Format the tooltip value
                const datasetLabel = context.dataset.label || '';
                
                // Check if the dataset label contains "Deals" and format accordingly
                if (datasetLabel.includes('Deals')) {
                  // For "Deals" labels, don't use currency formatting
                  return `${datasetLabel}: ${context.parsed.y}`;
                } else {
                  // For other labels, use the pound currency formatting
                  const value = formatEuroValue(context.parsed.y);
                  return `${datasetLabel}: ${value}`;
                }
              },
            },
            titleFont: {
              weight: 'bold',
            },
            titleColor: titleColor,
            bodyColor: bodyColor,
            backgroundColor: bgColor,
            borderColor: borderColor,
            padding: 10,
          },
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
  };

  // Initialize and update chart when data or theme changes
  useEffect(() => {
    // Clean up previous chart instance
    if (chart) {
      chart.destroy();
    }
    
    const newChart = createChart();
    if (newChart) {
      setChart(newChart);
    }
    
    // Clean up function
    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [data, selectedPeriodIndex, darkMode]); // Re-create chart when these dependencies change

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default LineChart01;