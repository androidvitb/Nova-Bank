// components/Dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ClockIcon,
  UserIcon,
  DocumentArrowUpIcon,
  ArrowRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import axios from 'axios';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1M');
  const [activeTab, setActiveTab] = useState('overview');

  // Simulated paper money balance
  const [paperMoneyBalance, setPaperMoneyBalance] = useState(5000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountRes, transactionsRes] = await Promise.all([
          axios.get('/api/accounts/myaccount'),
          axios.get('/api/transactions/recent')
        ]);
        setAccount(accountRes.data);
        setTransactions(transactionsRes.data.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    router.push(`/dashboard/${path}`);
  };

  const handlePaperMoneyTransfer = async (amount) => {
    try {
      await axios.post('/api/transactions/paper-money', { amount });
      setPaperMoneyBalance(prev => prev - amount);
      // Update main balance
      setAccount(prev => ({ ...prev, balance: prev.balance + amount }));
    } catch (error) {
      console.error('Paper money transfer failed:', error);
    }
  };

  const financialStats = transactions.reduce((acc, transaction) => {
    acc[transaction.type] = (acc[transaction.type] || 0) + transaction.amount;
    return acc;
  }, {});

  const isDark = theme === 'dark';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#A1A1AA' : '#4B5563',
        },
      },
      title: {
        display: true,
        text: 'Financial Overview',
        color: isDark ? '#EDEDED' : '#171717',
      },
      tooltip: {
        backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        titleColor: isDark ? '#EDEDED' : '#171717',
        bodyColor: isDark ? '#A1A1AA' : '#4B5563',
        borderColor: isDark ? '#262626' : '#E5E7EB',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? '#262626' : '#F3F4F6',
        },
        ticks: {
          color: isDark ? '#A1A1AA' : '#4B5563',
        },
      },
      y: {
        grid: {
          color: isDark ? '#262626' : '#F3F4F6',
        },
        ticks: {
          color: isDark ? '#A1A1AA' : '#4B5563',
        },
      },
    },
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        backgroundColor: '#FD5339',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: [2000, 3000, 2000, 5000, 1000, 4000, 3000],
        backgroundColor: isDark ? '#262626' : '#E5E7EB',
        borderRadius: 6,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 space-y-6 bg-white dark:bg-black min-h-screen transition-colors duration-300">
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-zinc-900 shadow-sm transition-colors duration-300 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-[#FD5339] px-3">NOVA</h1>
          </div>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <button
              onClick={() => handleNavigation('transfer')}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors hidden sm:flex"
            >
              <ArrowRightIcon className="h-5 w-5 mr-2" />
              Transfer
            </button>
            <button
              onClick={() => handleNavigation('deposit')}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors hidden sm:flex"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              Deposit
            </button>
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg transition-colors">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mr-2" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">Paper: ${paperMoneyBalance}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
                <p className="text-3xl font-bold dark:text-white">${account?.balance?.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Income</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  +${financialStats.deposit?.toLocaleString() || 0}
                </p>
              </div>
              <ArrowUpIcon className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Expenses</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-500">
                  -${financialStats.withdrawal?.toLocaleString() || 0}
                </p>
              </div>
              <ArrowDownIcon className="h-12 w-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Financial Overview Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm mb-8 border dark:border-gray-800 transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex space-x-8 px-6">
              {['overview', 'transactions', 'analytics', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-[#FD5339] text-[#FD5339]'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="h-96">
                  <Bar
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <QuickActionCard
                    icon={<ArrowRightIcon className="h-8 w-8 text-[#FD5339]" />}
                    title="Send Money"
                    action={() => handleNavigation('transfer')}
                  />
                  <QuickActionCard
                    icon={<DocumentArrowUpIcon className="h-8 w-8 text-[#FD5339]" />}
                    title="Mobile Deposit"
                    action={() => handleNavigation('deposit')}
                  />
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <TransactionTable transactions={transactions} />
            )}

            {activeTab === 'analytics' && <FinancialAnalytics account={account} />}
            
            {activeTab === 'settings' && <AccountSettings account={account} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const QuickActionCard = ({ icon, title, action }) => (
  <div
    onClick={action}
    className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors border border-transparent dark:border-gray-800"
  >
    <div className="flex items-center space-x-4">
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Initiate a new transaction</p>
      </div>
    </div>
  </div>
);

const TransactionTable = ({ transactions }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-zinc-800/50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
              {new Date(transaction.date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-sm dark:text-gray-300">{transaction.description}</td>
            <td className={`px-6 py-4 text-sm font-medium ${
              transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium">
                Completed
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FinancialAnalytics = ({ account }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Savings Goal</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#FD5339] bg-orange-100 dark:bg-orange-900/30">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-[#FD5339]">
                70%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-zinc-700">
            <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FD5339]"></div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Spending Limit</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100 dark:bg-blue-900/30">
                Monthly Limit
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                $2,500 / $5,000
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-zinc-700">
            <div style={{ width: "50%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AccountSettings = ({ account }) => (
  <div className="max-w-2xl space-y-6">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold dark:text-white">Profile Information</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Holder</label>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border dark:border-gray-800 dark:text-white">
            {account?.holderName || 'John Doe'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border dark:border-gray-800 dark:text-white">
            {account?.email || 'john@example.com'}
          </div>
        </div>
      </div>
    </div>
    <div className="pt-6 border-t dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4 dark:text-white text-red-600">Danger Zone</h3>
      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
        Deactivate Account
      </button>
    </div>
  </div>
);

export default Dashboard;