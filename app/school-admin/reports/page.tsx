'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getStudentsBySchool, mockAttendanceRecords } from '@/lib/mock-data';
import { gradeNamesAr, type GradeLevel } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Download, FileText, TrendingUp, Users } from 'lucide-react';
import { format, subDays, eachDayOfInterval, isWeekend } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const grades: GradeLevel[] = [
  'KG1', 'KG2', 'KG3',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6',
  'G7', 'G8', 'G9', 'G10', 'G11', 'G12',
];

export default function ReportsPage() {
  const { school } = useAuth();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const students = useMemo(() => {
    if (!school) return [];
    let allStudents = getStudentsBySchool(school.id);
    if (selectedGrade !== 'all') {
      allStudents = allStudents.filter((s) => s.grade === selectedGrade);
    }
    return allStudents;
  }, [school, selectedGrade]);

  const attendanceData = useMemo(() => {
    if (!school) return [];
    
    const days = eachDayOfInterval({ start: startDate, end: endDate })
      .filter((date) => !isWeekend(date));

    return days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayRecords = mockAttendanceRecords.filter(
        (r) =>
          r.tenantId === school.id &&
          r.date === dateStr &&
          (selectedGrade === 'all' ||
            students.some((s) => s.id === r.studentId))
      );

      const present = dayRecords.filter((r) => r.status === 'present').length;
      const late = dayRecords.filter((r) => r.status === 'late').length;
      const absent = students.length - present - late;
      const rate = students.length > 0
        ? Math.round(((present + late) / students.length) * 100)
        : 0;

      return {
        date: format(date, 'MM/dd'),
        dayName: format(date, 'EEE', { locale: ar }),
        حاضر: present,
        متأخر: late,
        غائب: absent,
        نسبة: rate,
      };
    });
  }, [school, startDate, endDate, selectedGrade, students]);

  const summaryStats = useMemo(() => {
    if (attendanceData.length === 0) return null;

    const totalDays = attendanceData.length;
    const avgRate = Math.round(
      attendanceData.reduce((sum, d) => sum + d.نسبة, 0) / totalDays
    );
    const totalPresent = attendanceData.reduce((sum, d) => sum + d.حاضر, 0);
    const totalLate = attendanceData.reduce((sum, d) => sum + d.متأخر, 0);
    const totalAbsent = attendanceData.reduce((sum, d) => sum + d.غائب, 0);

    return {
      avgRate,
      totalPresent,
      totalLate,
      totalAbsent,
      totalDays,
    };
  }, [attendanceData]);

  const gradeDistribution = useMemo(() => {
    if (!school) return [];
    
    const allStudents = getStudentsBySchool(school.id);
    const gradeStats: Record<string, { total: number; present: number; late: number }> = {};

    grades.forEach((grade) => {
      const gradeStudents = allStudents.filter((s) => s.grade === grade);
      if (gradeStudents.length === 0) return;

      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRecords = mockAttendanceRecords.filter(
        (r) =>
          r.tenantId === school.id &&
          r.date === today &&
          gradeStudents.some((s) => s.id === r.studentId)
      );

      gradeStats[grade] = {
        total: gradeStudents.length,
        present: todayRecords.filter((r) => r.status === 'present').length,
        late: todayRecords.filter((r) => r.status === 'late').length,
      };
    });

    return Object.entries(gradeStats).map(([grade, stats]) => ({
      grade: gradeNamesAr[grade as GradeLevel],
      الطلاب: stats.total,
      الحضور: stats.present + stats.late,
      النسبة: stats.total > 0
        ? Math.round(((stats.present + stats.late) / stats.total) * 100)
        : 0,
    }));
  }, [school]);

  return (
    <>
      <DashboardHeader title="التقارير" description="تقارير وإحصائيات الحضور" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Date Range */}
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[180px]">
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {format(startDate, 'PP', { locale: ar })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        locale={ar}
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-muted-foreground">إلى</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[180px]">
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {format(endDate, 'PP', { locale: ar })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        locale={ar}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Grade Filter */}
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="الصف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الصفوف</SelectItem>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {gradeNamesAr[grade]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Export Buttons */}
                <div className="flex gap-2 mr-auto">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 ml-2" />
                    تصدير Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          {summaryStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{summaryStats.avgRate}%</p>
                  <p className="text-sm text-muted-foreground">متوسط الحضور</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-success">{summaryStats.totalPresent}</p>
                  <p className="text-sm text-muted-foreground">إجمالي الحضور</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-warning">{summaryStats.totalLate}</p>
                  <p className="text-sm text-muted-foreground">إجمالي التأخير</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">{summaryStats.totalAbsent}</p>
                  <p className="text-sm text-muted-foreground">إجمالي الغياب</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          <Tabs defaultValue="trend" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trend">
                <TrendingUp className="h-4 w-4 ml-2" />
                اتجاه الحضور
              </TabsTrigger>
              <TabsTrigger value="distribution">
                <Users className="h-4 w-4 ml-2" />
                توزيع الصفوف
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <CardTitle>اتجاه الحضور خلال الفترة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
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
                          type="monotone"
                          dataKey="نسبة"
                          name="نسبة الحضور %"
                          stroke="oklch(0.55 0.2 250)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution">
              <Card>
                <CardHeader>
                  <CardTitle>توزيع الحضور حسب الصف (اليوم)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="grade" type="category" className="text-xs" width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            direction: 'rtl',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="الطلاب" fill="oklch(0.7 0.1 250)" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="الحضور" fill="oklch(0.6 0.18 145)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
}
