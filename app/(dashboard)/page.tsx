import React from 'react';
import StatsHeader from '@/components/dashboard/StatsHeader';
import PortfolioGrowthChart from '@/components/dashboard/PortfolioGrowthChart';
import ActiveAllocationsList from '@/components/dashboard/ActiveAllocationsList';
import PlatformActivityFeed from '@/components/dashboard/PlatformActivityFeed';
import { getPortfolioChartData, getPlatformActivityFeed } from '@/app/actions/dashboardActions';

import MarketOverview from '@/components/dashboard/MarketOverview';

export default async function Dashboard() {
  const chartData = await getPortfolioChartData();
  const activities = await getPlatformActivityFeed();

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Header Metrics */}
      <StatsHeader />

      {/* Main Charts & Side Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Portfolio Growth Chart (Left - 2/3 width) */}
        <div className="lg:col-span-2">
          <PortfolioGrowthChart data={chartData} />
        </div>

        {/* Active Allocations (Right - 1/3 width) */}
        <div>
          <ActiveAllocationsList />
        </div>

        {/* Market Overview (Bottom - full width) */}
        <div className="lg:col-span-3">
          <MarketOverview />
        </div>

      </div>

      {/* 4. Platform Activity Feed */}
      <PlatformActivityFeed activities={activities || []} />

    </div>
  );
}
