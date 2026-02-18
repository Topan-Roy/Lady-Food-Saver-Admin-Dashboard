import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { KPICard } from '../components/dashboard/KPICard';
import { Table } from '../components/ui/Table';
import { Leaf, DollarSign, Utensils } from 'lucide-react';
import { GlobalFilter, FilterRange } from '../components/ui/GlobalFilter';

import { useGetCustomerFeedbackQuery, useGetTopPerformingRestaurantsQuery, useGetAnalyticsOverviewQuery } from '../redux/features/analytics';
import { useGetOrderStatsQuery } from '../redux/features/dashboardApi';

const mockData = {
  'today': {
    sales: [
      { name: '6am', income: 100, expense: 60 },
      { name: '10am', income: 400, expense: 250 },
      { name: '2pm', income: 800, expense: 450 },
      { name: '6pm', income: 1200, expense: 700 },
      { name: '10pm', income: 600, expense: 350 }
    ],
    transactions: [{ name: '6am', value: 10 }, { name: '10am', value: 30 }, { name: '2pm', value: 50 }, { name: '6pm', value: 80 }, { name: '10pm', value: 40 }],
    userAnalysis: [{ name: '6am', active: 50 }, { name: '10am', active: 120 }, { name: '2pm', active: 200 }, { name: '6pm', active: 350 }, { name: '10pm', active: 180 }],
    states: [{ name: 'NY', value: 120 }, { name: 'CA', value: 90 }, { name: 'TX', value: 60 }, { name: 'FL', value: 40 }]
  },
  '7d': {
    sales: [
      { name: 'Mon', income: 3000, expense: 1800 },
      { name: 'Tue', income: 4500, expense: 2600 },
      { name: 'Wed', income: 3200, expense: 1900 },
      { name: 'Thu', income: 5100, expense: 3100 },
      { name: 'Fri', income: 6800, expense: 3900 },
      { name: 'Sat', income: 7200, expense: 4100 },
      { name: 'Sun', income: 6500, expense: 3800 }
    ],
    transactions: [{ name: 'Mon', value: 120 }, { name: 'Tue', value: 180 }, { name: 'Wed', value: 140 }, { name: 'Thu', value: 200 }, { name: 'Fri', value: 280 }, { name: 'Sat', value: 310 }, { name: 'Sun', value: 290 }],
    userAnalysis: [{ name: 'Mon', active: 1500 }, { name: 'Tue', active: 1600 }, { name: 'Wed', active: 1550 }, { name: 'Thu', active: 1700 }, { name: 'Fri', active: 1900 }, { name: 'Sat', active: 2200 }, { name: 'Sun', active: 2100 }],
    states: [{ name: 'NY', value: 850 }, { name: 'CA', value: 720 }, { name: 'TX', value: 450 }, { name: 'FL', value: 380 }, { name: 'IL', value: 210 }]
  },
  '30d': {
    sales: [
      { name: 'Week 1', income: 25000, expense: 14000 },
      { name: 'Week 2', income: 28000, expense: 16500 },
      { name: 'Week 3', income: 26000, expense: 19000 },
      { name: 'Week 4', income: 32000, expense: 16000 }
    ],
    transactions: [{ name: 'Week 1', value: 900 }, { name: 'Week 2', value: 1100 }, { name: 'Week 3', value: 1050 }, { name: 'Week 4', value: 1300 }],
    userAnalysis: [{ name: 'Week 1', active: 5000 }, { name: 'Week 2', active: 5400 }, { name: 'Week 3', active: 5800 }, { name: 'Week 4', active: 6200 }],
    states: [{ name: 'NY', value: 3200 }, { name: 'CA', value: 2800 }, { name: 'TX', value: 1900 }, { name: 'FL', value: 1500 }, { name: 'IL', value: 900 }, { name: 'PA', value: 800 }]
  }
};

export function Analytics() {
  const [timeFilter, setTimeFilter] = useState<any>('7d');
  const [data, setData] = useState(mockData['7d']);
  const [selectedProviderId] = useState('69714abce548ab10b90c0e50'); // Default ID as requested
  const navigate = useNavigate();

  // Fetch feedback data
  const { data: feedbackApiResponse } = useGetCustomerFeedbackQuery(selectedProviderId);

  // Fetch top restaurants data
  const { data: topRestaurantsResponse, isLoading: topRestaurantsLoading } = useGetTopPerformingRestaurantsQuery({ page: 1, limit: 5 });

  // Fetch analytics overview data
  // Fetch analytics overview data
  const { data: analyticsOverview, isLoading: analyticsLoading } = useGetAnalyticsOverviewQuery(selectedProviderId);

  // Determine API filter based on timeFilter
  const apiFilter = useMemo(() => {
    const map: Record<string, string> = {
      'today': 'today',
      '7d': 'week',
      '30d': 'month',
      '12m': 'year',
      'year': 'year',
      'custom': 'year'
    };
    return map[timeFilter] || 'week';
  }, [timeFilter]);

  // Fetch Order Stats
  const { data: ordersResponse, isLoading: isOrdersLoading } = useGetOrderStatsQuery(apiFilter);

  // Transform Order Data
  const orderStatsData = useMemo(() => {
    if (!ordersResponse?.data?.values) return data.sales;

    const { labels, values } = ordersResponse.data;
    return labels.map((label: string, index: number) => ({
      name: label,
      orders: values[index] || 0
    }));
  }, [ordersResponse, data.sales]);

  useEffect(() => {
    // Determine which dataset to use based on filter
    let key = '7d';
    if (timeFilter === 'today') key = 'today';
    if (timeFilter === '30d' || timeFilter === '12m' || timeFilter === 'year') key = '30d';

    // ts-ignore
    setData(mockData[key] || mockData['7d']);
  }, [timeFilter]);

  // Transform Feedback Data for DonutChart
  const feedbackData = useMemo(() => {
    const apiData = feedbackApiResponse?.CustomerFeedback;
    if (!apiData) return [
      { name: '5 Stars', value: 0 },
      { name: '4 Stars', value: 0 },
      { name: '3 Stars', value: 0 },
      { name: '1-2 Stars', value: 0 }
    ];

    return [
      { name: '5 Stars', value: apiData["5Stars"] || 0 },
      { name: '4 Stars', value: apiData["4Stars"] || 0 },
      { name: '3 Stars', value: apiData["3Stars"] || 0 },
      { name: '1-2 Stars', value: (apiData["1Stars"] || 0) + (apiData["2Stars"] || 0) }
    ];
  }, [feedbackApiResponse]);

  // Transform Top Restaurants Data for Table
  const topRestaurants = useMemo(() => {
    const apiData = topRestaurantsResponse?.TopPerformingRestaurants;
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((r: any) => ({
      rank: r.Rank,
      id: r.providerId,
      name: r.RestaurantName,
      orders: r.TotalOrders,
      revenue: `$${(r.TotalRevenue || 0).toLocaleString()}`
    }));
  }, [topRestaurantsResponse]);

  return <AdminLayout>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-gray-500">
            Platform performance and sustainability metrics
          </p>
        </div>
        <GlobalFilter onFilterChange={(range: FilterRange) => {
          setTimeFilter(range);
        }} />
      </div>

      {/* Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Orders Overview"
          value={analyticsLoading ? "..." : (analyticsOverview?.OrdersOverview?.totalOrders || 0).toLocaleString()}
          change="15%"
          trend="up"
          icon={Utensils}
          color="orange"
        />
        <KPICard
          title="CO2 Reduced (kg)"
          value={analyticsLoading ? "..." : (analyticsOverview?.["CO2Reduced(kg)"] || 0).toLocaleString()}
          change="12%"
          trend="up"
          icon={Leaf}
          color="green"
        />
        <KPICard
          title="Platform Profit"
          value={analyticsLoading ? "..." : `$${(analyticsOverview?.platformProfit || 0).toLocaleString()}`}
          change="8%"
          trend="up"
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <LineChart
            title="Orders Overview"
            data={orderStatsData}
            height={350}
            lines={[{ key: 'orders', color: '#E4983A', name: 'Orders' }]}
          />
        </div>
        <div className="h-[400px]">
          <BarChart title="State-based Analysis" data={data.states} height={350} />
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <LineChart
            title="Customer Analysis"
            data={data.userAnalysis}
            height={350}
            lines={[{ key: 'active', color: '#E4983A', name: 'Active Customers' }]}
            variant="area"
          />
        </div>
        <div className="h-[400px]">
          <BarChart title="Orders Overview (Vol)" data={data.transactions} height={350} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="h-full">
          <DonutChart title="Customer Feedback" data={feedbackData} height={350} showFilter={false} />
        </div>
        <div className="lg:col-span-2 h-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Performing Restaurants
          </h3>
          {topRestaurantsLoading ? (
            <div className="flex items-center justify-center h-48 animate-pulse text-gray-400 font-medium">
              Loading top restaurants...
            </div>
          ) : (
            <Table data={topRestaurants} columns={[{
              header: 'Rank',
              accessorKey: 'rank',
              className: 'w-16'
            }, {
              header: 'Restaurant Name',
              cell: (item) => (
                <span
                  className="font-medium text-gray-900 cursor-pointer hover:text-[#E4983A] transition-colors"
                  onClick={() => navigate(`/restaurant/${item.id}`)}
                >
                  {item.name}
                </span>
              )
            }, {
              header: 'Total Orders',
              accessorKey: 'orders'
            }, {
              header: 'Total Revenue',
              accessorKey: 'revenue',
              className: 'text-[#E4983A] font-bold'
            }]} />
          )}
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-8"></div>
    </div>
  </AdminLayout>;
}
