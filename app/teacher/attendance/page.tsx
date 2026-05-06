'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mockStudents, mockAttendanceRecords, mockClasses } from '@/lib/mock-data';
import { gradeNamesAr } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function TeacherAttendancePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const today = new Date().toISOString().split('T')[0];

  const teacherClasses = useMemo(
    () => mockClasses.filter((c) => c.teacherId === user?.id),
    [user?.id]
  );

  const myStudents = useMemo(() => {
    const classIds = teacherClasses.map((c) => c.id);
    return mockStudents.filter((s) => s.classId && classIds.includes(s.classId));
  }, [teacherClasses]);

  const filteredStudents = useMemo(() => {
    return myStudents.filter((s) => {
      const matchSearch = s.nameAr.includes(searchQuery);
      const matchClass = selectedClass === 'all' || s.classId === selectedClass;
      return matchSearch && matchClass;
    });
  }, [myStudents, searchQuery, selectedClass]);

  const getStatus = (studentId: string) => {
    const record = mockAttendanceRecords.find((r) => r.studentId === studentId && r.date === today);
    return record?.status || 'absent';
  };

  const getCheckIn = (studentId: string) => {
    const record = mockAttendanceRecords.find((r) => r.studentId === studentId && r.date === today);
    return record?.checkIn?.substring(0, 5) || '-';
  };

  return (
    <>
      <DashboardHeader
        title="سجل الحضور"
        description={format(new Date(), 'PPP', { locale: ar })}
      />
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>حضور طلابي اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الفصل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفصول</SelectItem>
                    {teacherClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الصف</TableHead>
                      <TableHead>وقت الدخول</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const status = getStatus(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.nameAr}</TableCell>
                          <TableCell>{gradeNamesAr[student.grade]} - {student.className}</TableCell>
                          <TableCell dir="ltr" className="text-right">{getCheckIn(student.id)}</TableCell>
                          <TableCell>
                            {status === 'present' && <Badge className="bg-success text-success-foreground">حاضر</Badge>}
                            {status === 'late' && <Badge className="bg-warning text-warning-foreground">متأخر</Badge>}
                            {status === 'absent' && <Badge variant="destructive">غائب</Badge>}
                            {status === 'excused' && <Badge variant="secondary">بعذر</Badge>}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          لا يوجد طلاب
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
