'use client';

import { useMemo } from 'react';
import { mockSchools, mockStudents } from '@/lib/mock-data';
import { DashboardHeader, StatsCard } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { School, Users, DollarSign, TrendingUp, Building2, CreditCard } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export default function SuperAdminDashboard() {
  const stats = useMemo(() => {
    const activeSchools = mockSchools.filter((s) => s.isActive).length;
    const totalStudents = mockStudents.length;
    
    const subscriptionCounts = {
      basic: mockSchools.filter((s) => s.subscription === 'basic').length,
      premium: mockSchools.filter((s) => s.subscription === 'premium').length,
      enterprise: mockSchools.filter((s) => s.subscription === 'enterprise').length,
    };

    // Mock revenue calculation
    const revenue = 
      subscriptionCounts.basic * 500 +
      subscriptionCounts.premium * 1000 +
      subscriptionCounts.enterprise * 2500;

    return {
      totalSchools: mockSchools.length,
      activeSchools,
      totalStudents,
      revenue,
      subscriptionCounts,
    };
  }, []);

  const subscriptionData = useMemo(() => [
    { name: 'أساسي', value: stats.subscriptionCounts.basic, color: 'oklch(0.7 0.1 250)' },
    { name: 'متقدم', value: stats.subscriptionCounts.premium, color: 'oklch(0.55 0.2 250)' },
    { name: 'مؤسسي', value: stats.subscriptionCounts.enterprise, color: 'oklch(0.45 0.25 250)' },
  ], [stats.subscriptionCounts]);

  const monthlyGrowth = useMemo(() => [
    { month: 'يناير', المدارس: 1, الطلاب: 50 },
    { month: 'فبراير', المدارس: 1, الطلاب: 80 },
    { month: 'مارس', المدارس: 2, الطلاب: 120 },
    { month: 'أبريل', المدارس: 2, الطلاب: 100 },
    { month: 'مايو', المدارس: 3, الطلاب: 150 },
  ], []);

  const schoolsData = useMemo(() => 
    mockSchools.map((school) => ({
      name: school.nameAr,
      الطلاب: school.currentStudents,
      الحد: school.maxStudents,
    }))
  , []);

  return (
    <>
      <DashboardHeader 
        title="لوحة التحكم الرئيسية" 
        description="نظرة عامة على جميع المدارس والاشتراكات"
      />
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="إجمالي المدارس"
              value={stats.totalSchools}
              description={`${stats.activeSchools} مدرسة نشطة`}
              icon={Building2}
              variant="primary"
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="إجمالي الطلاب"
              value={stats.totalStudents.toLocaleString()}
              icon={Users}
              variant="success"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="الإيرادات الشهرية"
              value={`${stats.revenue.toLocaleString()} ر.س`}
              icon={DollarSign}
              variant="warning"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="الاشتراكات النشطة"
              value={stats.activeSchools}
              icon={CreditCard}
              variant="default"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Growth Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  نمو المدارس والطلاب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis yAxisId="left" className="text-xs" />
                      <YAxis yAxisId="right" orientation="right" className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          direction: 'rtl',
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="المدارس"
                        stroke="oklch(0.55 0.2 250)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="الطلاب"
                        stroke="oklch(0.6 0.18 145)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الاشتراكات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subscriptionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schools Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>مقارنة عدد الطلاب بين المدارس</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={schoolsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        direction: 'rtl',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="الطلاب" fill="oklch(0.55 0.2 250)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="الحد" fill="oklch(0.85 0.05 250)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Schools */}
          <Card>
            <CardHeader>
              <CardTitle>المدارس المسجلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchools.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <School className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{school.nameAr}</p>
                        <p className="text-sm text-muted-foreground">{school.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          {school.currentStudents} / {school.maxStudents}
                        </p>
                        <p className="text-sm text-muted-foreground">طالب</p>
                      </div>
                      <Badge
                        variant={
                          school.subscription === 'enterprise'
                            ? 'default'
                            : school.subscription === 'premium'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {school.subscription === 'basic' && 'أساسي'}
                        {school.subscription === 'premium' && 'متقدم'}
                        {school.subscription === 'enterprise' && 'مؤسسي'}
                      </Badge>
                      <Badge variant={school.isActive ? 'default' : 'destructive'}>
                        {school.isActive ? 'نشط' : 'معطل'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
