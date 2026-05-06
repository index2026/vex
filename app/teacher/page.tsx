'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard, DashboardHeader } from '@/components/dashboard';
import { useAuth } from '@/lib/auth-context';
import { mockStudents, mockAttendanceRecords, mockClasses } from '@/lib/mock-data';
import { gradeNamesAr } from '@/lib/types';
import {
  Users, CheckCircle2, XCircle, Clock, BookOpen,
  Calendar, TrendingUp, Bell, ClipboardList,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const teacherClasses = useMemo(
    () => mockClasses.filter((c) => c.teacherId === user?.id),
    [user?.id]
  );

  const myStudents = useMemo(() => {
    const classIds = teacherClasses.map((c) => c.id);
    return mockStudents.filter((s) => s.classId && classIds.includes(s.classId));
  }, [teacherClasses]);

  const todayAttendance = useMemo(
    () => mockAttendanceRecords.filter(
      (r) => r.date === today && myStudents.some((s) => s.id === r.studentId)
    ),
    [today, myStudents]
  );

  const presentCount = todayAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
  const absentCount = todayAttendance.filter((r) => r.status === 'absent').length;
  const lateCount = todayAttendance.filter((r) => r.status === 'late').length;
  const attendanceRate = myStudents.length > 0 ? Math.round((presentCount / myStudents.length) * 100) : 0;

  const recentActivity = useMemo(
    () => [...todayAttendance]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((record) => ({ ...record, student: myStudents.find((s) => s.id === record.studentId) }))
      .filter((r) => r.student),
    [todayAttendance, myStudents]
  );

  return (
    <>
      <DashboardHeader
        title={`مرحباً، ${user?.name || 'المعلم'}`}
        description={new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="طلابي" value={myStudents.length} icon={Users} description="في جميع الفصول" />
            <StatsCard title="الحاضرون اليوم" value={presentCount} icon={CheckCircle2} description={`من ${myStudents.length} طالب`} variant="success" />
            <StatsCard title="الغائبون" value={absentCount} icon={XCircle} description="يحتاجون متابعة" variant="destructive" />
            <StatsCard title="المتأخرون" value={lateCount} icon={Clock} description="وصلوا متأخرين" variant="warning" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  فصولي الدراسية
                </CardTitle>
                <CardDescription>الفصول التي تدرّسها وحالة الحضور فيها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherClasses.length > 0 ? teacherClasses.map((cls) => {
                    const classStudents = myStudents.filter((s) => s.classId === cls.id);
                    const classAttendance = todayAttendance.filter((r) => classStudents.some((s) => s.id === r.studentId));
                    const classPresent = classAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
                    const classRate = classStudents.length > 0 ? Math.round((classPresent / classStudents.length) * 100) : 0;
                    return (
                      <div key={cls.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cls.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {gradeNamesAr[cls.grade]} - الفصل {cls.section} • {classStudents.length} طالب
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <div className="text-2xl font-bold">{classRate}%</div>
                            <div className="text-xs text-muted-foreground">نسبة الحضور</div>
                          </div>
                          <Badge className={classRate >= 90 ? 'bg-success text-success-foreground' : classRate >= 70 ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'}>
                            {classPresent}/{classStudents.length}
                          </Badge>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">لا توجد فصول مُسندة إليك حالياً</p>
                      <p className="text-sm text-muted-foreground mt-1">تواصل مع مدير المدرسة لإسناد الفصول</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  آخر النشاطات
                </CardTitle>
                <CardDescription>آخر تسجيلات الحضور اليوم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.status === 'present' ? 'bg-success/10 text-success' : activity.status === 'late' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                        {activity.status === 'present' ? <CheckCircle2 className="h-4 w-4" /> : activity.status === 'late' ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-sm">{activity.student?.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{activity.checkIn ? `دخل: ${activity.checkIn.substring(0, 5)}` : 'لم يسجل'}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.status === 'present' ? 'حاضر' : activity.status === 'late' ? 'متأخر' : 'غائب'}
                      </Badge>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="mb-3 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">لا توجد نشاطات حتى الآن</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {myStudents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  ملخص حضور اليوم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">نسبة الحضور الكلية</span>
                    <span className="font-bold text-lg">{attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${attendanceRate}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">{presentCount}</p>
                      <p className="text-xs text-muted-foreground">حاضر</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">{lateCount}</p>
                      <p className="text-xs text-muted-foreground">متأخر</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                      <p className="text-xs text-muted-foreground">غائب</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
              <CardDescription>الوصول السريع للمهام المتكررة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Users className="h-6 w-6 text-primary" />
                  <span>عرض الطلاب</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  <span>تسجيل حضور يدوي</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>عرض التقارير</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Bell className="h-6 w-6 text-warning" />
                  <span>إرسال تنبيه</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
