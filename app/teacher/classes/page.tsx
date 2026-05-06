'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mockStudents, mockClasses, mockAttendanceRecords } from '@/lib/mock-data';
import { gradeNamesAr } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

export default function TeacherClassesPage() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const teacherClasses = useMemo(
    () => mockClasses.filter((c) => c.teacherId === user?.id),
    [user?.id]
  );

  return (
    <>
      <DashboardHeader title="فصولي الدراسية" description="عرض جميع الفصول المُسندة إليك" />
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {teacherClasses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teacherClasses.map((cls) => {
                const students = mockStudents.filter((s) => s.classId === cls.id);
                const todayRecords = mockAttendanceRecords.filter(
                  (r) => r.date === today && students.some((s) => s.id === r.studentId)
                );
                const presentCount = todayRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
                const rate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

                return (
                  <Card key={cls.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{cls.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{gradeNamesAr[cls.grade]}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">الفصل {cls.section}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{students.length} طالب</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-medium">{rate}% حضور اليوم</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="font-bold text-success">{presentCount}</p>
                          <p className="text-muted-foreground">حاضر</p>
                        </div>
                        <div>
                          <p className="font-bold text-warning">{todayRecords.filter((r) => r.status === 'late').length}</p>
                          <p className="text-muted-foreground">متأخر</p>
                        </div>
                        <div>
                          <p className="font-bold text-destructive">{students.length - presentCount}</p>
                          <p className="text-muted-foreground">غائب</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="text-lg font-semibold">لا توجد فصول مُسندة</h3>
                <p className="text-muted-foreground mt-1">تواصل مع مدير المدرسة لإسناد الفصول إليك</p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
