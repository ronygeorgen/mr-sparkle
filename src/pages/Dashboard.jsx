import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import LeaderboardCard from '../charts/LeaderboardCard';
import SourceCard from '../charts/SourceCard';
import ProductsCard from '../charts/ProductsCard';
import LeadsGeneratedCard from '../components/LeadsGeneratedCard';
import KpiCard from '../components/KpiCard';
import ConversionRateGauge from '../components/ConversionRateGauge';
import DashboardCardSalesPerfMatrics from '../partials/dashboard/DashboardCardSalesPerfMatrics';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import { getCssVariable } from '../utils/Utils';

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const leads = [80, 120, 95, 130, 160];
  const quotes = [60, 100, 80, 110, 140];
  const jobs = [40, 80, 60, 90, 120];
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  const totalSales = 25000;
  const totalJobs = jobs.reduce((acc, curr) => acc + curr, 0);
  const avgJobValue = (totalSales / totalJobs).toFixed(2);
  const conversionRate = ((jobs.reduce((a, b) => a + b, 0) / quotes.reduce((a, b) => a + b, 0)) * 100).toFixed(1);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

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

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Filter button */}
                {/* <FilterButton align="right" /> */}
                {/* Datepicker built with React Day Picker */}
                <Datepicker align="right" />  
                {/* Add view button */}
                {/* <button 
                className="btn text-white hover:brightness-110"
                style={{ 
                  backgroundColor: getCssVariable('--tertiary'),
                  ':hover': { backgroundColor: getCssVariable('--tertiary-dark') }
                }}
                >
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>                 */}
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              {/* Bar chart (Revenue) */}
              <DashboardCard04 />
              {/* Sales performance matrics */}

              <div className="col-span-3 grid grid-cols-6 gap-6 justify-between ">
                <KpiCard title="Quotes Sent" value={quotes.reduce((a, b) => a + b, 0)} unit="" subtitle="This Period" />
                <KpiCard title="Jobs Booked" value={totalJobs} unit="" subtitle="Confirmed" />
                <ConversionRateGauge percentage={conversionRate} />
                <KpiCard title="Avg. Job Value" value={avgJobValue} unit="$" subtitle="This Period" />
              </div>
              
              {/* Row 2: Right col-6 (Leads Generated Card) */}
              <div className="col-span-9">
                <LeadsGeneratedCard data={leads} labels={labels} />
              </div>

              {/* Pie chart */}
              <DashboardCard06 />
              <DashboardCard07 /> 
              
              {/* <DashboardCardSalesPerfMatrics/> */}
              {/* Line chart (Acme Plus) */}
              {/* <DashboardCard01 /> */}
              {/* <DashboardCard03 /> */}
              {/* Line chart (Acme Advanced) */}
              {/* <DashboardCard02 /> */}
              {/* Line chart (Acme Professional) */}
              {/* <DashboardCard05 /> */}
              {/* Line chart (Real Time Value) */}
              {/* <DashboardCard05 /> */}
              {/* Leader board card */}
              {/* <LeaderboardCard /> */}
              {/* <SourceCard/> */}
              {/* <ProductsCard/> */}
              {/* Table (Top Channels) */}
              {/* Line chart (Sales Over Time) */}
              {/* <DashboardCard08 /> */}
              {/* Stacked bar chart (Sales VS Refunds) */}
              {/* <DashboardCard09 /> */}
              {/* Card (Customers) */}
              {/* <DashboardCard10 /> */}
              {/* Card (Reasons for Refunds) */}
              {/* <DashboardCard11 /> */}
              {/* Card (Recent Activity) */}
              {/* <DashboardCard12 /> */}
              {/* Card (Income/Expenses) */}
              {/* <DashboardCard13 /> */}
              
            </div>

          </div>
        </main>


      </div>
    </div>
  );
}

export default Dashboard;