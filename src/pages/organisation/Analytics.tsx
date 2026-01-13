import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  PoundSterling,
  Clock,
  Star,
  Download,
  Calendar,
  CheckCircle2,
  Target,
  Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default function OrganisationAnalytics() {
  const [period, setPeriod] = useState("6months");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalHours: 0,
    avgRating: 4.8,
    revenueGrowth: 12.5,
    bookingsGrowth: 8.3,
    hoursGrowth: 5.2,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [bookingsByType, setBookingsByType] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch bookings for this organisation
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          carer:profiles!bookings_carer_id_fkey(full_name, avatar_url)
        `)
        .eq('client_id', user.id);

      if (error) throw error;

      if (!bookings || bookings.length === 0) {
        setLoading(false);
        return;
      }

      // Calculate KPIs
      const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed');
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const totalBookings = bookings.length;
      const totalHours = completedBookings.reduce((sum, b) => sum + (b.duration_hours || 0), 0);

      setStats(prev => ({
        ...prev,
        totalRevenue,
        totalBookings,
        totalHours,
      }));

      // Group by month for chart
      const months = period === "year" ? 12 : period === "6months" ? 6 : 1;
      const monthlyData = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const monthBookings = bookings.filter(b => {
          const bDate = new Date(b.created_at);
          return isWithinInterval(bDate, { start, end });
        });

        monthlyData.push({
          month: format(date, 'MMM'),
          revenue: monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
          bookings: monthBookings.length,
          hours: monthBookings.reduce((sum, b) => sum + (b.duration_hours || 0), 0),
        });
      }
      setChartData(monthlyData);

      // Group by staff
      const staffMap = new Map();
      bookings.forEach(b => {
        if (!b.carer) return;
        const name = b.carer.full_name;
        if (!staffMap.has(name)) {
          staffMap.set(name, { name, bookings: 0, hours: 0, revenue: 0, rating: 4.9 });
        }
        const data = staffMap.get(name);
        data.bookings++;
        data.hours += (b.duration_hours || 0);
        data.revenue += (b.total_price || 0);
      });
      setStaffData(Array.from(staffMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

      // Group by type
      const typesMap = new Map();
      bookings.forEach(b => {
        const type = b.service_type || 'General Care';
        typesMap.set(type, (typesMap.get(type) || 0) + 1);
      });

      const colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(173, 58%, 39%)", "hsl(var(--muted))"];
      const typesData = Array.from(typesMap.entries()).map(([name, value], i) => ({
        name,
        value: Math.round((value / bookings.length) * 100),
        color: colors[i % colors.length]
      }));
      setBookingsByType(typesData);

    } catch (error: any) {
      toast({
        title: "Error loading analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (staffData.length === 0 && chartData.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no analytics data available for the selected period.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Revenue', `£${stats.totalRevenue.toLocaleString()}`],
      ['Total Bookings', stats.totalBookings.toString()],
      ['Total Hours', stats.totalHours.toString()],
      ['Average Rating', stats.avgRating.toString()],
    ];

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organisation-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Your analytics report has been downloaded.",
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="organisation">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="organisation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground">Insights into your organisation's performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500">+{stats.revenueGrowth}%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <PoundSterling className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500">+{stats.bookingsGrowth}%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Care Hours</p>
                  <p className="text-2xl font-bold">{stats.totalHours}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500">+{stats.hoursGrowth}%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">{stats.avgRating}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500">+0.1</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `£${value}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`£${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--primary))"
                          fill="url(#revenueGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Care Type</CardTitle>
                  <CardDescription>Distribution of sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookingsByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {bookingsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {bookingsByType.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trend</CardTitle>
                <CardDescription>Bookings and hours over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                      <Line type="monotone" dataKey="hours" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ fill: 'hsl(var(--secondary))' }} />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Leaderboard</CardTitle>
                <CardDescription>Top performers this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No staff performance data available yet.
                    </div>
                  ) : (
                    staffData.map((staff, index) => (
                      <div key={staff.name} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-amber-500/20 text-amber-600' :
                            index === 1 ? 'bg-gray-300/50 text-gray-600' :
                              index === 2 ? 'bg-amber-700/20 text-amber-700' :
                                'bg-muted text-muted-foreground'
                          }`}>
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{staff.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            {staff.rating}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center">
                          <div>
                            <p className="text-lg font-bold">{staff.bookings}</p>
                            <p className="text-xs text-muted-foreground">Bookings</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{staff.hours}</p>
                            <p className="text-xs text-muted-foreground">Hours</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">£{staff.revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Value</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
