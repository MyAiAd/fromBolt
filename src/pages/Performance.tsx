import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AffiliateAggregationService, AggregatedAffiliate } from '../services/affiliateAggregationService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceStats {
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  activeAffiliates: number;
}

interface SourceData {
  source: string;
  visits: string;
  conversion: string;
  affiliates: number;
}

interface MonthlyData {
  revenue: number[];
  affiliates: number[];
  labels: string[];
}

const Performance = () => {
  const { supabase, user, isAdmin } = useAuth();
  const [stats, setStats] = useState<PerformanceStats>({
    totalRevenue: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    activeAffiliates: 0
  });
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [sourcesData, setSourcesData] = useState<SourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const aggregationService = new AffiliateAggregationService(supabase);
        
        let allAffiliates: AggregatedAffiliate[] = [];
        
        if (isAdmin) {
          allAffiliates = await aggregationService.getAllAffiliates();
        } else if (user?.email) {
          allAffiliates = await aggregationService.getUserAffiliateData(user.email);
        }

        const affiliateStats = await aggregationService.getAffiliateStats();

        const totalCommissions = allAffiliates.reduce((sum, affiliate) => {
          const commission = parseFloat(affiliate.commission.replace('$', '').replace(',', '')) || 0;
          return sum + commission;
        }, 0);

        const activeAffiliatesCount = allAffiliates.filter(a => a.status === 'Active').length;
        const totalReferrals = allAffiliates.reduce((sum, affiliate) => sum + affiliate.referrals, 0);
        
        const performanceStats: PerformanceStats = {
          totalRevenue: totalCommissions,
          conversionRate: allAffiliates.length > 0 ? 
            (allAffiliates.filter(a => a.referrals > 0).length / allAffiliates.length * 100) : 0,
          averageOrderValue: totalReferrals > 0 ? Math.round(totalCommissions / totalReferrals) : 0,
          activeAffiliates: activeAffiliatesCount
        };

        setStats(performanceStats);

        const monthlyData = generateMonthlyData(allAffiliates);
        const chartDataset: ChartData<'line'> = {
          labels: monthlyData.labels,
          datasets: [
            {
              label: 'Revenue',
              data: monthlyData.revenue,
              borderColor: '#FFAC92',
              backgroundColor: 'rgba(255, 172, 146, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'New Affiliates',
              data: monthlyData.affiliates,
              borderColor: '#6B4E9C',
              backgroundColor: 'rgba(107, 78, 156, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        };

        setChartData(chartDataset);

        if (isAdmin) {
          const sources: SourceData[] = [
            {
              source: 'Shopify',
              visits: `${affiliateStats.bySource.goaffpro * 50}`,
              conversion: `${affiliateStats.bySource.goaffpro > 0 ? '3.2%' : '0%'}`,
              affiliates: affiliateStats.bySource.goaffpro
            },
            {
              source: 'Facebook (Mighty Networks)',
              visits: `${affiliateStats.bySource.mightynetworks * 40}`,
              conversion: `${affiliateStats.bySource.mightynetworks > 0 ? '2.8%' : '0%'}`,
              affiliates: affiliateStats.bySource.mightynetworks
            },
            {
              source: 'JennaZ.co (Native)',
              visits: `${affiliateStats.bySource.native * 60}`,
              conversion: `${affiliateStats.bySource.native > 0 ? '4.1%' : '0%'}`,
              affiliates: affiliateStats.bySource.native
            }
          ].filter(source => source.affiliates > 0);
          
          setSourcesData(sources);
        } else {
          const userSource = allAffiliates.length > 0 ? allAffiliates[0].source : '';
          const sourceMapping: { [key: string]: string } = {
            'goaffpro': 'Shopify',
            'mightynetworks': 'Facebook (Mighty Networks)', 
            'native': 'JennaZ.co (Native)',
            'ghl': 'GHL Platform'
          };
          
          const sources: SourceData[] = userSource ? [{
            source: sourceMapping[userSource] || userSource,
            visits: '50',
            conversion: allAffiliates[0].referrals > 0 ? '3.5%' : '0%',
            affiliates: 1
          }] : [];
          
          setSourcesData(sources);
        }

      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [supabase, user, isAdmin]);

  const generateMonthlyData = (affiliates: AggregatedAffiliate[]): MonthlyData => {
    const labels = [];
    const revenue = [];
    const newAffiliates = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      labels.push(monthLabel);

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthAffiliates = affiliates.filter(affiliate => {
        const joinDate = new Date(affiliate.dateJoined);
        return joinDate.getFullYear() === year && joinDate.getMonth() === month;
      });

      const monthRevenue = monthAffiliates.reduce((sum, affiliate) => {
        const commission = parseFloat(affiliate.commission.replace('$', '').replace(',', '')) || 0;
        return sum + commission;
      }, 0);

      revenue.push(Math.round(monthRevenue));
      newAffiliates.push(monthAffiliates.length);
    }

    return {
      revenue: revenue,
      affiliates: newAffiliates,
      labels: labels,
    };
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 172, 146, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 172, 146, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D1D5DB'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(34, 21, 51, 0.8)',
        titleColor: '#FFAC92',
        bodyColor: '#E5E7EB',
        borderColor: '#FFAC92',
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading performance data...</div>;
  }

  return (
    <motion.div 
      className="pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-semibold text-white mb-2 flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-jennaz-rose" />
          Performance Dashboard
        </h1>
        <p className="text-gray-400">Track your growth, earnings, and campaign effectiveness.</p>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Total Commission</h3>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Conversion Rate</h3>
            <Activity className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm">Active Affiliates</h3>
            <Users className="h-5 w-5 text-jennaz-rose" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeAffiliates}</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Revenue & Growth</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Last 7 Months</span>
            </div>
          </div>
          {chartData && (
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Traffic Sources</h3>
            <p className="text-sm text-gray-400">Referrals by platform</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-jennaz-purple-light">
              <thead>
                <tr>
                  <th className="table-header">Source</th>
                  <th className="table-header">Visits</th>
                  <th className="table-header">Conversion</th>
                  <th className="table-header">New Affiliates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jennaz-purple-light">
                {sourcesData.map((item, index) => (
                  <tr key={index} className="table-row-hover">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.visits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.conversion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.affiliates}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Performance;