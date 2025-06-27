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
  height,
  onSegmentClick,
  categories,
  colorMap
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
        backgroundColor: sourceData.labels.map((label) => colorMap[label] || stacatrucColors.medGrey),
        hoverBackgroundColor: sourceData.labels.map((label) => colorMap[label] || stacatrucColors.medGrey),
        borderWidth: 0,
        hoverOffset: 12,
        hoverBorderColor: '#fff',
        hoverBorderWidth: 2,
      }))
    };
  };

  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return;
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
        onClick: (event, elements) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const label = data.labels[index];
            if (onSegmentClick) {
              onSegmentClick(label);
            }
          }
        }
      },
    });
    setChart(newChart);
    return () => {
      if (newChart) {
        newChart.destroy();
      }
      setChart(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (!chart || !data) return;
    // Prevent update if chart is destroyed
    if (chart._destroyed) return;

    // Update data values if they changed
    chart.data.labels = data.labels;
    chart.data.datasets.forEach((dataset, i) => {
      dataset.data = data.datasets[i].data;
      dataset.backgroundColor = data.labels.map(label => colorMap[label] || stacatrucColors.medGrey);
      dataset.hoverBackgroundColor = data.labels.map(label => colorMap[label] || stacatrucColors.medGrey);
      dataset.tooltipData = data.datasets[i].tooltipData;
    });

    chart.update();
  }, [data, chart, darkMode]);

  return (
    <div className="grow flex flex-col md:flex-row xl:flex-row justify-center items-center md:h-80 w-full">
      <div className="w-full md:flex-shrink-0 md:w-[320px] md:h-[320px] flex items-center justify-center">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-4 py-3 flex-1 w-full">
        <div className="grid grid-cols-1 gap-2 items-center justify-items-center overflow-x-auto">
          {data?.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const count = data.datasets[0].tooltipData[index].count;
            const formatCurrency = (amount) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(amount);
            };
            return (
              <div key={label} className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 w-32">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colorMap[label] }}
                  />
                  <span className={darkMode ? "text-slate-100" : "text-slate-800"}>
                    {label}
                  </span>
                </div>
                <div className="w-16 text-right">
                  <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                    {count}
                  </span>
                </div>
                <div className="w-32 text-right">
                  <span className={darkMode ? "text-slate-300" : "text-slate-600"}>
                    {formatCurrency(value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PieChart;