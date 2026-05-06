'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getStudentsBySchool, getTodayAttendance, getAttendanceByDate } from '@/lib/mock-data';
import { DashboardHeader, StatsCard } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, TrendingUp } from 'lucide-react';
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
} from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SchoolAdminDashboard() {
  const { school } = useAuth();

  const stats = useMemo(() => {
    if (!school) return null;

    const students = getStudentsBySchool(school.id);
    const todayAttendance = getTodayAttendance(school.id);

    const present = todayAttendance.filter((r) => r.status === 'present').length;
    const late = todayAttendance.filter((r) => r.status === 'late').length;
    const absent = students.length - present - late;
    const attendanceRate = students.length > 0 
      ? Math.round(((present + late) / students.length) * 100) 
      : 0;

    return {
      totalStudents: students.length,
      present,
      late,
      absent,
      attendanceRate,
    };
  }, [school]);

  const weeklyData = useMemo(() => {
    if (!school) return [];

    const data = [];
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const today = new Date();

    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 5 || date.getDay() === 6) continue;

      const dateStr = date.toISOString().split('T')[0];
      const records = getAttendanceByDate(school.id, dateStr);
      const students = getStudentsBySchool(school.id);

      const present = records.filter((r) => r.status === 'present').length;
      const late = records.filter((r) => r.status === 'late').length;
      const absent = students.length - present - late;

      data.push({
        day: days[date.getDay()],
        حاضر: present,
        متأخر: late,
        غائب: absent,
      });
    }

    return data;
  }, [school]);

  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'حاضر', value: stats.present, color: 'oklch(0.6 0.18 145)' },
      { name: 'متأخر', value: stats.late, color: 'oklch(0.75 0.15 70)' },
      { name: 'غائب', value: stats.absent, color: 'oklch(0.55 0.22 25)' },
    ];
  }, [stats]);

  const recentActivity = useMemo(() => {
    if (!school) return [];
    const todayAttendance = getTodayAttendance(school.id);
    const students = getStudentsBySchool(school.id);
    
    return todayAttendance
      .slice(0, 10)
      .map((record) => {
        const student = students.find((s) => s.id === record.studentId);
        return {
          ...record,
          student,
        };
      })
      .filter((r) => r.student);
  }, [school]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DashboardHeader 
        title="لوحة التحكم" 
        description={`مرحباً بك في ${school?.nameAr || 'المدرسة'}`}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="إجمالي الطلاب"
              value={stats.totalStudents}
              icon={Users}
              variant="primary"
            />
            <StatsCard
              title="الحاضرون اليوم"
              value={stats.present}
              description={`${stats.attendanceRate}% نسبة الحضور`}
              icon={UserCheck}
              variant="success"
            />
            <StatsCard
              title="المتأخرون"
              value={stats.late}
              icon={Clock}
              variant="warning"
            />
            <StatsCard
              title="الغائبون"
              value={stats.absent}
              icon={UserX}
              variant="destructive"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Attendance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  الحضور خلال الأسبوع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          direction: 'rtl'
                        }}
                      />
                      <Bar dataKey="حاضر" fill="oklch(0.6 0.18 145)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="متأخر" fill="oklch(0.75 0.15 70)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="غائب" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الحضور اليوم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>آخر عمليات الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {record.student?.nameAr}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.student?.grade} - {record.student?.className}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          {record.checkIn?.substring(0, 5)}
                        </p>
                        <p
                          className={`text-sm ${
                            record.status === 'present'
                              ? 'text-success'
                              : record.status === 'late'
                              ? 'text-warning'
                              : 'text-destructive'
                          }`}
                        >
                          {record.status === 'present' ? 'حاضر' : record.status === 'late' ? 'متأخر' : 'غائب'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد سجلات حضور لهذا اليوم بعد
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
