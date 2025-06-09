import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function BarChart01({ data, width, height, onBarClick }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-2 rounded shadow-lg border border-gray-700">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    if (onBarClick) {
      // Extract month and year from the name (format: "MMM YYYY")
      const [month, year] = data.name.split(' ');
      onBarClick({
        datasetIndex: 0,
        payload: {
          created_at_min: month,
          created_at_max: year
        }
      });
    }
  };

  return (
    <div className="px-5 pt-3 pb-5" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: '#4B5563' }}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            axisLine={{ stroke: '#4B5563' }}
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#0EA5E9" 
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart01;