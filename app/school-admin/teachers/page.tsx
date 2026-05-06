'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getTeachersBySchool, mockTeachers } from '@/lib/mock-data';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Teacher } from '@/lib/types';

export default function TeachersPage() {
  const { school } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    nameAr: '',
    email: '',
    phone: '',
    subject: '',
  });

  const teachers = useMemo(() => {
    if (!school) return [];
    return getTeachersBySchool(school.id);
  }, [school]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      return (
        teacher.nameAr.includes(searchQuery) ||
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [teachers, searchQuery]);

  const handleAddTeacher = () => {
    if (!school || !newTeacher.name || !newTeacher.email) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const teacher: Teacher = {
      id: `teacher-${Date.now()}`,
      userId: `user-teacher-${Date.now()}`,
      name: newTeacher.name,
      nameAr: newTeacher.nameAr || newTeacher.name,
      tenantId: school.id,
      subject: newTeacher.subject,
      classes: [],
      phone: newTeacher.phone,
      email: newTeacher.email,
      isActive: true,
    };

    mockTeachers.push(teacher);
    setIsAddDialogOpen(false);
    setNewTeacher({
      name: '',
      nameAr: '',
      email: '',
      phone: '',
      subject: '',
    });
    toast.success('تم إضافة المعلم بنجاح');
  };

  const handleDeleteTeacher = (teacherId: string) => {
    const index = mockTeachers.findIndex((t) => t.id === teacherId);
    if (index > -1) {
      mockTeachers.splice(index, 1);
      toast.success('تم حذف المعلم بنجاح');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2);
  };

  return (
    <>
      <DashboardHeader title="إدارة المعلمين" description="عرض وإدارة بيانات المعلمين" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Actions Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو البريد..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة معلم
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>إضافة معلم جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>الاسم بالإنجليزية *</Label>
                          <Input
                            value={newTeacher.name}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, name: e.target.value })
                            }
                            placeholder="Enter name"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الاسم بالعربية</Label>
                          <Input
                            value={newTeacher.nameAr}
                            onChange={(e) =>
                              setNewTeacher({ ...newTeacher, nameAr: e.target.value })
                            }
                            placeholder="أدخل الاسم"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>البريد الإلكتروني *</Label>
                        <Input
                          type="email"
                          value={newTeacher.email}
                          onChange={(e) =>
                            setNewTeacher({ ...newTeacher, email: e.target.value })
                          }
                          placeholder="teacher@school.edu.sa"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>رقم الهاتف</Label>
                        <Input
                          value={newTeacher.phone}
                          onChange={(e) =>
                            setNewTeacher({ ...newTeacher, phone: e.target.value })
                          }
                          placeholder="+966xxxxxxxxx"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>المادة</Label>
                        <Input
                          value={newTeacher.subject}
                          onChange={(e) =>
                            setNewTeacher({ ...newTeacher, subject: e.target.value })
                          }
                          placeholder="الرياضيات"
                        />
                      </div>
                      <Button onClick={handleAddTeacher} className="w-full">
                        إضافة المعلم
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>قائمة المعلمين</span>
                <Badge variant="secondary">{filteredTeachers.length} معلم</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المعلم</TableHead>
                      <TableHead>المادة</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>الفصول</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="w-[80px]">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {getInitials(teacher.nameAr)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">
                                  {teacher.nameAr}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {teacher.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell dir="ltr" className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {teacher.email}
                            </div>
                          </TableCell>
                          <TableCell dir="ltr" className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {teacher.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {teacher.classes.length} فصل
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={teacher.isActive ? 'default' : 'secondary'}
                              className={teacher.isActive ? 'bg-success' : ''}
                            >
                              {teacher.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 ml-2" />
                                  تعديل
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteTeacher(teacher.id)}
                                >
                                  <Trash2 className="h-4 w-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">لا يوجد معلمين</p>
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
