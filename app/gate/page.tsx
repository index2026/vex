'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getStudentByQRCode, getTodayAttendance, mockAttendanceRecords, getSchoolById } from '@/lib/mock-data';
import type { Student, AttendanceRecord, ScanResult } from '@/lib/types';
import { gradeNamesAr } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  GraduationCap, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  User,
  QrCode,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanHistoryItem {
  id: string;
  student: Student;
  time: string;
  status: 'success' | 'late' | 'already_checked' | 'error';
}

export default function GatePage() {
  const router = useRouter();
  const { user, school, isAuthenticated, isLoading, logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus input on mount and after each scan
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanResult]);

  // Refocus on any click
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'security')) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  const processQRCode = useCallback((qrCode: string) => {
    if (!school) return;

    const trimmedCode = qrCode.trim().toUpperCase();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    // Find student
    const student = getStudentByQRCode(trimmedCode, school.id);
    
    if (!student) {
      setScanResult({
        success: false,
        status: 'not_found',
        message: 'Student not found',
        messageAr: 'الطالب غير مسجل في النظام',
      });
      return;
    }

    // Check if already checked in today
    const todayRecords = getTodayAttendance(school.id);
    const existingRecord = todayRecords.find(r => r.studentId === student.id);
    
    if (existingRecord && existingRecord.checkIn) {
      setScanResult({
        success: false,
        status: 'already_checked',
        message: 'Already checked in',
        messageAr: `الطالب مسجل بالفعل اليوم الساعة ${existingRecord.checkIn.substring(0, 5)}`,
        student,
        checkInTime: existingRecord.checkIn,
      });
      
      // Add to history
      setScanHistory(prev => [{
        id: Date.now().toString(),
        student,
        time: timeStr,
        status: 'already_checked',
      }, ...prev.slice(0, 9)]);
      return;
    }

    // Check if late
    const [cutoffHour, cutoffMinute] = school.cutoffTime.split(':').map(Number);
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffHour, cutoffMinute, 0, 0);
    const isLate = now > cutoffDate;

    // Create attendance record
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId: student.id,
      tenantId: school.id,
      date: now.toISOString().split('T')[0],
      checkIn: now.toTimeString().split(' ')[0],
      status: isLate ? 'late' : 'present',
      recordedBy: user?.id || 'system',
      createdAt: now.toISOString(),
    };

    // Add to mock records
    mockAttendanceRecords.push(newRecord);

    setScanResult({
      success: true,
      status: isLate ? 'late' : 'success',
      message: isLate ? 'Checked in - Late' : 'Checked in successfully',
      messageAr: isLate 
        ? `تم تسجيل حضور ${student.nameAr} - متأخر`
        : `تم تسجيل حضور ${student.nameAr}`,
      student,
      checkInTime: newRecord.checkIn,
      isLate,
    });

    // Add to history
    setScanHistory(prev => [{
      id: Date.now().toString(),
      student,
      time: timeStr,
      status: isLate ? 'late' : 'success',
    }, ...prev.slice(0, 9)]);

  }, [school, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // QR scanners typically send Enter after the code
    if (e.key === 'Enter' && qrInput.trim()) {
      processQRCode(qrInput);
      setQrInput('');
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Clear result after 5 seconds
  useEffect(() => {
    if (scanResult) {
      const timer = setTimeout(() => {
        setScanResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  const schoolData = school || getSchoolById('school-1');

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">{schoolData?.nameAr || 'VexLap'}</h1>
            <p className="text-xs text-muted-foreground">بوابة تسجيل الحضور</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="تسجيل الخروج">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* QR Input - Always visible and focused */}
        <div className="w-full max-w-md">
          <div className="relative">
            <QrCode className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              value={qrInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="امسح رمز QR أو أدخل الكود..."
              className="h-16 text-xl pr-14 text-center bg-card border-2 focus:border-primary"
              dir="ltr"
              autoComplete="off"
              autoFocus
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            الماسح جاهز - امسح بطاقة الطالب
          </p>
        </div>

        {/* Scan Result Display */}
        <div className="w-full max-w-md min-h-[200px]">
          {scanResult ? (
            <Card
              className={cn(
                'p-6 text-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-4',
                scanResult.status === 'success' && 'bg-success/10 border-success',
                scanResult.status === 'late' && 'bg-warning/10 border-warning',
                scanResult.status === 'already_checked' && 'bg-warning/10 border-warning',
                (scanResult.status === 'not_found' || scanResult.status === 'error') && 'bg-destructive/10 border-destructive'
              )}
            >
              {/* Status Icon */}
              <div className="flex justify-center mb-4">
                {scanResult.status === 'success' && (
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-success" />
                  </div>
                )}
                {scanResult.status === 'late' && (
                  <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center">
                    <Clock className="h-12 w-12 text-warning" />
                  </div>
                )}
                {scanResult.status === 'already_checked' && (
                  <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-warning" />
                  </div>
                )}
                {(scanResult.status === 'not_found' || scanResult.status === 'error') && (
                  <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="h-12 w-12 text-destructive" />
                  </div>
                )}
              </div>

              {/* Message */}
              <h2 className={cn(
                'text-xl font-bold mb-2',
                scanResult.status === 'success' && 'text-success',
                scanResult.status === 'late' && 'text-warning',
                scanResult.status === 'already_checked' && 'text-warning',
                (scanResult.status === 'not_found' || scanResult.status === 'error') && 'text-destructive'
              )}>
                {scanResult.messageAr}
              </h2>

              {/* Student Info */}
              {scanResult.student && (
                <div className="mt-4 space-y-1 text-foreground">
                  <p className="text-lg font-semibold">{scanResult.student.nameAr}</p>
                  <p className="text-muted-foreground">
                    {gradeNamesAr[scanResult.student.grade]} - {scanResult.student.className}
                  </p>
                  {scanResult.checkInTime && (
                    <p className="text-sm text-muted-foreground">
                      وقت الدخول: {scanResult.checkInTime.substring(0, 5)}
                    </p>
                  )}
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6 text-center bg-card/50 border-dashed">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground">في انتظار مسح بطاقة الطالب...</p>
            </Card>
          )}
        </div>

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <History className="h-4 w-4" />
              <span className="text-sm font-medium">آخر عمليات المسح</span>
            </div>
            <div className="space-y-2">
              {scanHistory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg bg-card border text-sm',
                    item.status === 'success' && 'border-l-4 border-l-success',
                    item.status === 'late' && 'border-l-4 border-l-warning',
                    item.status === 'already_checked' && 'border-l-4 border-l-warning',
                    item.status === 'error' && 'border-l-4 border-l-destructive'
                  )}
                >
                  <div>
                    <p className="font-medium text-foreground">{item.student.nameAr}</p>
                    <p className="text-xs text-muted-foreground">
                      {gradeNamesAr[item.student.grade]} - {item.student.className}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium tabular-nums text-foreground">{item.time}</p>
                    <p className={cn(
                      'text-xs',
                      item.status === 'success' && 'text-success',
                      item.status === 'late' && 'text-warning',
                      item.status === 'already_checked' && 'text-warning',
                      item.status === 'error' && 'text-destructive'
                    )}>
                      {item.status === 'success' && 'حاضر'}
                      {item.status === 'late' && 'متأخر'}
                      {item.status === 'already_checked' && 'مسجل مسبقاً'}
                      {item.status === 'error' && 'خطأ'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t px-4 py-2 text-center">
        <p className="text-xs text-muted-foreground">
          وقت الإغلاق: {schoolData?.cutoffTime || '07:30'} - المتأخرون بعد هذا الوقت يسجلون كـ &quot;متأخر&quot;
        </p>
      </footer>
    </div>
  );
}
