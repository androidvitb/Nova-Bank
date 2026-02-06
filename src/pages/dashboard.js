// components/Dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  CreditCard,
  Clock,
  User,
  ArrowRight,
  Wallet,
  LayoutDashboard,
  ArrowUpCircle,
  Settings,
  PlusCircle,
  History,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  ShieldCheck,
  CreditCard as CreditCardIcon,
  PieChart
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const Dashboard = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        titleColor: isDark ? '#EDEDED' : '#171717',
        bodyColor: isDark ? '#A1A1AA' : '#4B5563',
        borderColor: isDark ? '#262626' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { color: isDark ? '#71717A' : '#71717A', font: { size: 12 } } 
      },
      y: { 
        grid: { color: isDark ? '#262626' : '#F3F4F6', borderDash: [5, 5] }, 
        ticks: { color: isDark ? '#71717A' : '#71717A', font: { size: 12 } } 
      },
    },
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        backgroundColor: '#FD5339',
        borderRadius: 6,
        barThickness: 12,
      },
      {
        label: 'Expenses',
        data: [2000, 3000, 2000, 4000, 1000, 3500, 3000],
        backgroundColor: isDark ? '#3F3F46' : '#E4E4E7',
        borderRadius: 6,
        barThickness: 12,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-foreground transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r hidden lg:flex flex-col z-40">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">N</div>
            <span className="text-xl font-bold tracking-tighter">NOVA BANK</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'transactions', icon: History, label: 'Transactions' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
            { id: 'cards', icon: CreditCardIcon, label: 'My Cards' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Card className="bg-primary/5 border-none">
            <CardContent className="p-4 space-y-3">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Pro Account</div>
              <p className="text-xs text-muted-foreground">Unlock advanced features and higher limits.</p>
              <Button size="sm" className="w-full text-xs rounded-lg">Upgrade Now</Button>
            </CardContent>
          </Card>
          <Button variant="ghost" className="w-full justify-start mt-4 text-muted-foreground hover:text-destructive rounded-xl">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions, bills..." 
                className="pl-10 bg-secondary/50 border-none rounded-xl h-10 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl text-xs font-bold border border-border/50">
              <CircleDollarSign className="h-4 w-4 text-yellow-500" />
              <span>PAPER: ${paperMoneyBalance.toLocaleString()}</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </Button>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="flex-1 p-4 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {account?.holderName?.split(' ')[0] || 'User'}!</h1>
              <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your accounts today.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => handleNavigation('deposit')} variant="outline" className="rounded-xl border-dashed border-2 hover:border-primary hover:text-primary transition-all">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
              <Button onClick={() => handleNavigation('transfer')} className="rounded-xl shadow-lg shadow-primary/20">
                <ArrowRight className="h-4 w-4 mr-2" />
                Send Money
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Wallet size={80} className="text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Balance</CardDescription>
                      <CardTitle className="text-3xl font-bold">${account?.balance?.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 bg-green-500/10 w-fit px-2 py-1 rounded-lg">
                        <TrendingUp size={12} />
                        <span>+2.5% this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <ArrowDownRight size={80} className="text-green-500" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs font-bold uppercase tracking-wider">Monthly Income</CardDescription>
                      <CardTitle className="text-3xl font-bold text-green-600">
                        +${financialStats.deposit?.toLocaleString() || 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">From 12 new deposits</p>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={80} className="text-red-500" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs font-bold uppercase tracking-wider">Monthly Expenses</CardDescription>
                      <CardTitle className="text-3xl font-bold text-red-600">
                        -${financialStats.withdrawal?.toLocaleString() || 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">Across 8 transactions</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Chart Card */}
                  <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Spending Analysis</CardTitle>
                        <CardDescription>Visual summary of your weekly cash flow</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs font-medium">Week</Button>
                        <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs font-medium">Month</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                      <Bar data={chartData} options={chartOptions} />
                    </CardContent>
                  </Card>

                  {/* Sidebar Components */}
                  <div className="space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardHeader className="bg-primary/5 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                          Security Score
                        </CardTitle>
                        <CardDescription>Your account is well protected</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className="text-sm font-bold text-primary">85/100</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            className="h-full bg-primary"
                          />
                        </div>
                        <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-primary/5 hover:text-primary rounded-lg">
                          Improve Security <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-3">
                        <Button variant="secondary" className="justify-start h-auto py-3 px-4 rounded-xl group transition-all" onClick={() => handleNavigation('transfer')}>
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-white transition-colors">
                            <PlusCircle className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold">Transfer</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Internal / External</div>
                          </div>
                        </Button>
                        <Button variant="secondary" className="justify-start h-auto py-3 px-4 rounded-xl group transition-all" onClick={() => handleNavigation('deposit')}>
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <ArrowUpCircle className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold">Deposit</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Mobile / Check</div>
                          </div>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Transactions in Overview */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Recent Transactions</CardTitle>
                      <CardDescription>Your latest financial activities</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')} className="text-primary hover:bg-primary/5 rounded-lg">
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <TransactionTable transactions={transactions.slice(0, 5)} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filter transactions..." className="pl-10 rounded-xl bg-secondary/30 border-none" />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl">All Types</Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl">Last 30 Days</Button>
                  </div>
                </div>
                <Card className="border-none shadow-sm">
                  <CardContent className="p-0">
                    <TransactionTable transactions={transactions} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <AnalyticsCard
                  title="Savings Goal"
                  progress={70}
                  label="Holiday Fund"
                  value="$7,000 / $10,000"
                  color="bg-primary"
                  icon={<CircleDollarSign className="w-5 h-5 text-primary" />}
                />
                <AnalyticsCard
                  title="Monthly Limit"
                  progress={45}
                  label="Entertainment"
                  value="$450 / $1,000"
                  color="bg-blue-500"
                  icon={<History className="w-5 h-5 text-blue-500" />}
                />
              </motion.div>
            )}
            
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AccountSettings account={account} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const TransactionTable = ({ transactions }) => (
  <Table>
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b">
        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Transaction</TableHead>
        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Date</TableHead>
        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground text-right">Amount</TableHead>
        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground text-right">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {transactions.map((t) => (
        <TableRow key={t.id} className="group hover:bg-secondary/30 transition-colors border-b last:border-none">
          <TableCell>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                t.amount > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
              )}>
                {t.amount > 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div>
                <div className="font-bold text-sm">{t.description}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.type}</div>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-xs font-medium text-muted-foreground">
            {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </TableCell>
          <TableCell className={cn(
            "text-right font-bold text-sm",
            t.amount > 0 ? "text-green-600" : "text-red-600"
          )}>
            {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
              Completed
            </span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const AnalyticsCard = ({ title, progress, label, value, color, icon }) => (
  <Card className="border-none shadow-sm overflow-hidden group">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-xs">{label}</CardDescription>
        </div>
      </div>
      <div className="text-sm font-bold">{progress}%</div>
    </CardHeader>
    <CardContent className="space-y-4 pt-4">
      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          className={cn("h-full rounded-full transition-all duration-1000", color)} 
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Target Reached</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
    </CardContent>
  </Card>
);

const AccountSettings = ({ account }) => (
  <div className="max-w-3xl space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h3 className="text-lg font-bold">Profile Details</h3>
        <p className="text-sm text-muted-foreground">Manage your account identity and contact information.</p>
      </div>
      <Card className="md:col-span-2 border-none shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-dashed border-primary/40 relative group cursor-pointer">
              <User size={40} className="text-primary" />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <PlusCircle size={24} className="text-white" />
              </div>
            </div>
            <div>
              <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs mb-2">Change Avatar</Button>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">JPG, PNG or SVG. Max 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Full Name</Label>
              <Input value={account?.holderName || 'John Doe'} readOnly className="bg-secondary/50 border-none rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Email Address</Label>
              <Input value={account?.email || 'john@example.com'} readOnly className="bg-secondary/50 border-none rounded-xl" />
            </div>
          </div>
          <Button size="sm" className="rounded-xl px-6">Save Changes</Button>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Permanent actions regarding your account status.</p>
      </div>
      <Card className="md:col-span-2 border-none shadow-sm bg-destructive/5">
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm">Deactivate Account</div>
            <div className="text-xs text-muted-foreground mt-1">This will permanently delete all your data.</div>
          </div>
          <Button variant="destructive" size="sm" className="rounded-xl px-6">Deactivate</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;
