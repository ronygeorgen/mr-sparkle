import React from 'react';
import LeadsGeneratedCard from '../../components/LeadsGeneratedCard';
import KpiCard from '../../components/KpiCard';
import ConversionRateGauge from '../../components/ConversionRateGauge';

const DashboardCardSalesPerfMatrics = () => {
  const leads = [80, 120, 95, 130, 160];
  const quotes = [60, 100, 80, 110, 140];
  const jobs = [40, 80, 60, 90, 120];
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  const totalSales = 25000;
  const totalJobs = jobs.reduce((acc, curr) => acc + curr, 0);
  const avgJobValue = (totalSales / totalJobs).toFixed(2);
  const conversionRate = ((jobs.reduce((a, b) => a + b, 0) / quotes.reduce((a, b) => a + b, 0)) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-full md:grid-cols-full xl:grid-cols-full gap-4">
      <LeadsGeneratedCard data={leads} labels={labels} />
      
    </div>
  );
};

export default DashboardCardSalesPerfMatrics;