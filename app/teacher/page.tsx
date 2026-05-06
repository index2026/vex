"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard"
import { useAuth } from "@/lib/auth-context"
import { mockStudents, mockAttendanceRecords, mockClasses } from "@/lib/mock-data"
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen,
  Calendar,
  TrendingUp,
  Bell
} from "lucide-react"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [selectedDate] = useState(new Date().toISOString().split('T')[0])

  // Get teacher's classes
  const teacherClasses = mockClasses.filter(c => c.teacherId === user?.id)
  const classIds = teacherClasses.map(c => c.id)
  
  // Get students in teacher's classes
  const myStudents = mockStudents.filter(s => classIds.includes(s.classId))
  
  // Get today's attendance for my students
  const todayAttendance = mockAttendanceRecords.filter(
    r => r.date === selectedDate && myStudents.some(s => s.id === r.studentId)
  )

  const presentCount = todayAttendance.filter(r => r.status === 'present' || r.status === 'late').length
  const absentCount = todayAttendance.filter(r => r.status === 'absent').length
  const lateCount = todayAttendance.filter(r => r.status === 'late').length
  const attendanceRate = myStudents.length > 0 
    ? Math.round((presentCount / myStudents.length) * 100) 
    : 0

  // Recent attendance activity
  const recentActivity = todayAttendance
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(record => {
      const student = myStudents.find(s => s.id === record.studentId)
      return { ...record, student }
    })

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            مرحباً، {user?.name}
          </h1>
          <p className="text-muted-foreground">
            لوحة تحكم المعلم - {new Date().toLocaleDateString('ar-SA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Calendar className="h-4 w-4" />
            جدول الحصص
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="طلابي"
          value={myStudents.length}
          icon={Users}
          description="في جميع الفصول"
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="الحاضرون اليوم"
          value={presentCount}
          icon={CheckCircle2}
          description={`من ${myStudents.length} طالب`}
          trend={{ value: attendanceRate, isPositive: attendanceRate >= 90 }}
          iconClassName="text-success"
        />
        <StatsCard
          title="الغائبون"
          value={absentCount}
          icon={XCircle}
          description="يحتاجون متابعة"
          iconClassName="text-destructive"
        />
        <StatsCard
          title="المتأخرون"
          value={lateCount}
          icon={Clock}
          description="وصلوا متأخرين"
          iconClassName="text-warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* My Classes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              فصولي الدراسية
            </CardTitle>
            <CardDescription>
              الفصول التي تدرّسها وحالة الحضور فيها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherClasses.length > 0 ? (
                teacherClasses.map((cls) => {
                  const classStudents = myStudents.filter(s => s.classId === cls.id)
                  const classAttendance = todayAttendance.filter(
                    r => classStudents.some(s => s.id === r.studentId)
                  )
                  const classPresent = classAttendance.filter(
                    r => r.status === 'present' || r.status === 'late'
                  ).length
                  const classRate = classStudents.length > 0 
                    ? Math.round((classPresent / classStudents.length) * 100) 
                    : 0

                  return (
                    <div 
                      key={cls.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {classStudents.length} طالب
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <div className="text-2xl font-bold">{classRate}%</div>
                          <div className="text-xs text-muted-foreground">نسبة الحضور</div>
                        </div>
                        <Badge 
                          variant={classRate >= 90 ? "default" : classRate >= 70 ? "secondary" : "destructive"}
                          className={classRate >= 90 ? "bg-success text-success-foreground" : ""}
                        >
                          {classPresent}/{classStudents.length}
                        </Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">لا توجد فصول مُسندة إليك حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              آخر النشاطات
            </CardTitle>
            <CardDescription>
              آخر تسجيلات الحضور اليوم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      activity.status === 'present' 
                        ? 'bg-success/10 text-success' 
                        : activity.status === 'late'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {activity.status === 'present' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : activity.status === 'late' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">
                        {activity.student?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.checkInTime || 'لم يسجل'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status === 'present' ? 'حاضر' : 
                       activity.status === 'late' ? 'متأخر' : 'غائب'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="mb-3 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    لا توجد نشاطات حتى الآن
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>
            الوصول السريع للمهام المتكررة
          </CardDescription>
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
  )
}
