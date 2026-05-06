'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getStudentsBySchool, getAttendanceByDate } from '@/lib/mock-data';
import { gradeNamesAr, statusNamesAr, type GradeLevel } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, CalendarIcon, Download, UserCheck, UserX, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const grades: GradeLevel[] = [
  'KG1', 'KG2', 'KG3',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6',
  'G7', 'G8', 'G9', 'G10', 'G11', 'G12',
];

export default function AttendancePage() {
  const { school } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const students = useMemo(() => {
    if (!school) return [];
    return getStudentsBySchool(school.id);
  }, [school]);

  const attendanceRecords = useMemo(() => {
    if (!school) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return getAttendanceByDate(school.id, dateStr);
  }, [school, selectedDate]);

  const attendanceWithStudents = useMemo(() => {
    return students.map((student) => {
      const record = attendanceRecords.find((r) => r.studentId === student.id);
      return {
        student,
        record,
        status: record?.status || 'absent',
      };
    });
  }, [students, attendanceRecords]);

  const filteredData = useMemo(() => {
    return attendanceWithStudents.filter((item) => {
      const matchesSearch = item.student.nameAr.includes(searchQuery);
      const matchesGrade = selectedGrade === 'all' || item.student.grade === selectedGrade;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [attendanceWithStudents, searchQuery, selectedGrade, selectedStatus]);

  const stats = useMemo(() => {
    const present = attendanceWithStudents.filter((i) => i.status === 'present').length;
    const late = attendanceWithStudents.filter((i) => i.status === 'late').length;
    const absent = attendanceWithStudents.filter((i) => i.status === 'absent').length;
    const excused = attendanceWithStudents.filter((i) => i.status === 'excused').length;
    return { present, late, absent, excused, total: students.length };
  }, [attendanceWithStudents, students.length]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success text-success-foreground">حاضر</Badge>;
      case 'late':
        return <Badge className="bg-warning text-warning-foreground">متأخر</Badge>;
      case 'absent':
        return <Badge variant="destructive">غائب</Badge>;
      case 'excused':
        return <Badge variant="secondary">بعذر</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <>
      <DashboardHeader title="سجل الحضور" description="متابعة حضور وانصراف الطلاب" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Date Selection and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date Picker */}
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-right font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, 'PPP', { locale: ar })
                        : 'اختر التاريخ'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.present}</p>
                  <p className="text-xs text-muted-foreground">حاضر</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.late}</p>
                  <p className="text-xs text-muted-foreground">متأخر</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.absent}</p>
                  <p className="text-xs text-muted-foreground">غائب</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total > 0
                      ? Math.round(((stats.present + stats.late) / stats.total) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">نسبة الحضور</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle>سجلات الحضور</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="present">حاضر</SelectItem>
                    <SelectItem value="late">متأخر</SelectItem>
                    <SelectItem value="absent">غائب</SelectItem>
                    <SelectItem value="excused">بعذر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الصف</TableHead>
                      <TableHead>الفصل</TableHead>
                      <TableHead>وقت الدخول</TableHead>
                      <TableHead>وقت الخروج</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.student.id}>
                          <TableCell className="font-medium">
                            {item.student.nameAr}
                          </TableCell>
                          <TableCell>{gradeNamesAr[item.student.grade]}</TableCell>
                          <TableCell>{item.student.className}</TableCell>
                          <TableCell dir="ltr" className="text-right">
                            {item.record?.checkIn?.substring(0, 5) || '-'}
                          </TableCell>
                          <TableCell dir="ltr" className="text-right">
                            {item.record?.checkOut?.substring(0, 5) || '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">لا توجد سجلات</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
