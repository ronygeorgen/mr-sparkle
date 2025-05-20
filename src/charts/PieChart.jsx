import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';

import {
  Chart, PieController, ArcElement, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(PieController, ArcElement, TimeScale, Tooltip);

// Stacatruc color palette
const stacatrucColors = {
  green: '#36A501',
  darkGrey: '#474747',
  lightGrey: '#E4E4E4',
  medGrey: '#707070',
  clarkGreen: '#BCD230',
  blue: '#3985AE',
  orange: '#F7A928',
  purple: '#8E44AD',
};

// Fixed color mapping for lead sources
const leadSourceColorMap = {
  'Google Ads': stacatrucColors.green,
  'GBP Organic': stacatrucColors.blue,
  'Facebook Groups': stacatrucColors.clarkGreen,
  'Referrals': stacatrucColors.orange,
  'Door Knocking': stacatrucColors.purple,
};

// Custom tooltip colors that match the Stacatruc theme
const stacatrucTooltipColors = {
  titleColor: {
    light: stacatrucColors.darkGrey,
    dark: stacatrucColors.lightGrey,
  },
  bodyColor: {
    light: stacatrucColors.medGrey,
    dark: stacatrucColors.lightGrey,
  },
  backgroundColor: {
    light: '#FFFFFF',
    dark: stacatrucColors.darkGrey,
  },
  borderColor: {
    light: stacatrucColors.lightGrey,
    dark: stacatrucColors.medGrey,
  },
};

function PieChart({
  data,
  width,
  height
}) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';

  // Prepare the chart data with Stacatruc colors
  const prepareChartData = (sourceData) => {
    if (!sourceData) return null;
    
    return {
      ...sourceData,
      datasets: sourceData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: sourceData.labels.map((label) => leadSourceColorMap[label] || stacatrucColors.medGrey),
        hoverBackgroundColor: sourceData.labels.map((label) => leadSourceColorMap[label] || stacatrucColors.medGrey),
        borderWidth: 0,
      }))
    };
  };

  useEffect(() => {
    const ctx = canvas.current;
    // Create chart with Stacatruc colors
    const chartData = prepareChartData(data);
    
    const newChart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        layout: {
          padding: {
            top: 12,
            right: 20,
            bottom: 12,
            left: 20
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 16,
              boxWidth: 10,
              color: darkMode ? stacatrucColors.lightGrey : stacatrucColors.darkGrey,
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, i) {
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i);
                    
                    return {
                      text: label,
                      fillStyle: style.backgroundColor,
                      strokeStyle: style.borderColor,
                      lineWidth: style.borderWidth,
                      hidden: false, // Important: never hide the legend items
                      index: i
                    };
                  });
                }
                return [];
              }
            },
            onClick: null // Disable legend item click handler
          },
          tooltip: {
            titleColor: darkMode ? stacatrucTooltipColors.titleColor.dark : stacatrucTooltipColors.titleColor.light,
            bodyColor: darkMode ? stacatrucTooltipColors.bodyColor.dark : stacatrucTooltipColors.bodyColor.light,
            backgroundColor: darkMode ? stacatrucTooltipColors.backgroundColor.dark : stacatrucTooltipColors.backgroundColor.light,
            borderColor: darkMode ? stacatrucTooltipColors.borderColor.dark : stacatrucTooltipColors.borderColor.light,
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                const dataset = context.chart.data.datasets[0];
                const index = context.dataIndex;
                const original = dataset.tooltipData?.[index];
                if (original) {
                  const formatCurrency = (amount) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(amount);
                  };
                  return [`Count: ${original.count}`, `Value: ${formatCurrency(original.value)}`];
                }
                return context.label || '';
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: {
          duration: 500,
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (!chart || !data) return;
    
    // Update data values if they changed
    chart.data.labels = data.labels;
    chart.data.datasets.forEach((dataset, i) => {
      dataset.data = data.datasets[i].data;
      dataset.backgroundColor = data.labels.map(label => leadSourceColorMap[label] || stacatrucColors.medGrey);
      dataset.hoverBackgroundColor = data.labels.map(label => leadSourceColorMap[label] || stacatrucColors.medGrey);
      dataset.tooltipData = data.datasets[i].tooltipData;
    });
    
    chart.update();
  }, [data, chart, darkMode]);

  return (
    <div className="grow flex flex-col justify-center">
      <div className="h-80">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </div>
  );
}

export default PieChart;