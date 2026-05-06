'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getStudentsBySchool, mockStudents } from '@/lib/mock-data';
import { gradeNamesAr, type GradeLevel, type Student } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Search, Plus, Download, QrCode, MoreHorizontal, Edit, Trash2, Eye,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

const grades: GradeLevel[] = [
  'KG1', 'KG2', 'KG3',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6',
  'G7', 'G8', 'G9', 'G10', 'G11', 'G12',
];

export default function StudentsPage() {
  const { school } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '' as GradeLevel | '',
    className: '',
    parentName: '',
    parentPhone: '',
    gender: 'male' as 'male' | 'female',
  });

  const students = useMemo(() => {
    if (!school) return [];
    return getStudentsBySchool(school.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school, refreshKey]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.nameAr.includes(searchQuery) ||
        student.qrCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
      const matchesClass = selectedClass === 'all' || student.className === selectedClass;
      return matchesSearch && matchesGrade && matchesClass;
    });
  }, [students, searchQuery, selectedGrade, selectedClass]);

  const uniqueClasses = useMemo(() => {
    const classes = new Set(students.map((s) => s.className));
    return Array.from(classes).sort();
  }, [students]);

  const handleAddStudent = useCallback(() => {
    if (!school || !newStudent.name || !newStudent.grade || !newStudent.className) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const qrCode = `QR-${school.id.toUpperCase()}-${(mockStudents.length + 1).toString().padStart(4, '0')}`;

    const student: Student = {
      id: `student-${Date.now()}`,
      qrCode,
      name: newStudent.name,
      nameAr: newStudent.name,
      grade: newStudent.grade as GradeLevel,
      className: newStudent.className,
      tenantId: school.id,
      parentName: newStudent.parentName,
      parentPhone: newStudent.parentPhone,
      gender: newStudent.gender,
      dateOfBirth: '2010-01-01',
      enrollmentDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    mockStudents.push(student);
    setIsAddDialogOpen(false);
    setNewStudent({ name: '', grade: '', className: '', parentName: '', parentPhone: '', gender: 'male' });
    setRefreshKey((k) => k + 1);
    toast.success('تم إضافة الطالب بنجاح');
  }, [school, newStudent]);

  const handleDeleteStudent = useCallback(() => {
    if (!deleteStudentId) return;
    const index = mockStudents.findIndex((s) => s.id === deleteStudentId);
    if (index > -1) {
      mockStudents.splice(index, 1);
      setRefreshKey((k) => k + 1);
      toast.success('تم حذف الطالب بنجاح');
    }
    setDeleteStudentId(null);
  }, [deleteStudentId]);

  return (
    <>
      <DashboardHeader title="إدارة الطلاب" description="عرض وإدارة بيانات الطلاب" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Actions Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث بالاسم أو رمز QR..."
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
                        <SelectItem key={grade} value={grade}>{gradeNamesAr[grade]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="الفصل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {uniqueClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>الفصل {cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.info('ميزة التصدير قريباً')}>
                    <Download className="h-4 w-4 ml-2" />
                    تصدير
                  </Button>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة طالب
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>إضافة طالب جديد</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>اسم الطالب *</Label>
                          <Input
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            placeholder="أدخل اسم الطالب"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>الصف *</Label>
                            <Select value={newStudent.grade} onValueChange={(v) => setNewStudent({ ...newStudent, grade: v as GradeLevel })}>
                              <SelectTrigger><SelectValue placeholder="اختر الصف" /></SelectTrigger>
                              <SelectContent>
                                {grades.map((grade) => (
                                  <SelectItem key={grade} value={grade}>{gradeNamesAr[grade]}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>الفصل *</Label>
                            <Select value={newStudent.className} onValueChange={(v) => setNewStudent({ ...newStudent, className: v })}>
                              <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>الجنس</Label>
                          <Select value={newStudent.gender} onValueChange={(v) => setNewStudent({ ...newStudent, gender: v as 'male' | 'female' })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">ذكر</SelectItem>
                              <SelectItem value="female">أنثى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>اسم ولي الأمر</Label>
                          <Input value={newStudent.parentName} onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })} placeholder="أدخل اسم ولي الأمر" />
                        </div>
                        <div className="space-y-2">
                          <Label>رقم الهاتف</Label>
                          <Input value={newStudent.parentPhone} onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })} placeholder="+966xxxxxxxxx" dir="ltr" />
                        </div>
                        <Button onClick={handleAddStudent} className="w-full">إضافة الطالب</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>قائمة الطلاب</span>
                <Badge variant="secondary">{filteredStudents.length} طالب</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">QR</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الصف</TableHead>
                      <TableHead>الفصل</TableHead>
                      <TableHead>ولي الأمر</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent(student); setIsQRDialogOpen(true); }}>
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">{student.nameAr}</TableCell>
                          <TableCell>{gradeNamesAr[student.grade]}</TableCell>
                          <TableCell>{student.className}</TableCell>
                          <TableCell>{student.parentName}</TableCell>
                          <TableCell dir="ltr" className="text-right">{student.parentPhone}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsQRDialogOpen(true); }}>
                                  <Eye className="h-4 w-4 ml-2" />عرض QR
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info('ميزة التعديل قريباً')}>
                                  <Edit className="h-4 w-4 ml-2" />تعديل
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteStudentId(student.id)}>
                                  <Trash2 className="h-4 w-4 ml-2" />حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">لا يوجد طلاب مطابقون للبحث</p>
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

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">بطاقة الطالب</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="p-4 bg-white rounded-xl border">
                <QRCodeSVG value={selectedStudent.qrCode} size={200} level="H" includeMargin />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{selectedStudent.nameAr}</p>
                <p className="text-muted-foreground">{gradeNamesAr[selectedStudent.grade]} - الفصل {selectedStudent.className}</p>
                <p className="text-sm font-mono text-muted-foreground mt-1">{selectedStudent.qrCode}</p>
              </div>
              <Button className="w-full" onClick={() => toast.info('ميزة التحميل قريباً')}>
                <Download className="h-4 w-4 ml-2" />تحميل البطاقة
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
