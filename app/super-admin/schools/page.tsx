'use client';

import { useState, useMemo } from 'react';
import { mockSchools, mockStudents } from '@/lib/mock-data';
import type { School, SubscriptionPlan } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Switch } from '@/components/ui/switch';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Power,
  Eye,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newSchool, setNewSchool] = useState({
    name: '',
    nameAr: '',
    email: '',
    phone: '',
    address: '',
    subscription: 'basic' as SubscriptionPlan,
    maxStudents: 100,
    cutoffTime: '07:30',
  });

  const filteredSchools = useMemo(() => {
    return mockSchools.filter((school) => {
      const matchesSearch =
        school.nameAr.includes(searchQuery) ||
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlan = selectedPlan === 'all' || school.subscription === selectedPlan;
      return matchesSearch && matchesPlan;
    });
  }, [searchQuery, selectedPlan]);

  const getStudentCount = (schoolId: string) => {
    return mockStudents.filter((s) => s.tenantId === schoolId).length;
  };

  const handleAddSchool = () => {
    if (!newSchool.name || !newSchool.email) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const school: School = {
      id: `school-${Date.now()}`,
      name: newSchool.name,
      nameAr: newSchool.nameAr || newSchool.name,
      address: newSchool.address,
      phone: newSchool.phone,
      email: newSchool.email,
      cutoffTime: newSchool.cutoffTime,
      maxStudents: newSchool.maxStudents,
      currentStudents: 0,
      subscription: newSchool.subscription,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockSchools.push(school);
    setIsAddDialogOpen(false);
    setNewSchool({
      name: '',
      nameAr: '',
      email: '',
      phone: '',
      address: '',
      subscription: 'basic',
      maxStudents: 100,
      cutoffTime: '07:30',
    });
    toast.success('تم إضافة المدرسة بنجاح');
  };

  const handleToggleActive = (schoolId: string) => {
    const school = mockSchools.find((s) => s.id === schoolId);
    if (school) {
      school.isActive = !school.isActive;
      toast.success(school.isActive ? 'تم تفعيل المدرسة' : 'تم تعطيل المدرسة');
    }
  };

  const getSubscriptionBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-primary">مؤسسي</Badge>;
      case 'premium':
        return <Badge variant="secondary">متقدم</Badge>;
      default:
        return <Badge variant="outline">أساسي</Badge>;
    }
  };

  return (
    <>
      <DashboardHeader title="إدارة المدارس" description="عرض وإدارة جميع المدارس المسجلة" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Actions Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث بالاسم أو البريد..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="الباقة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الباقات</SelectItem>
                      <SelectItem value="basic">أساسي</SelectItem>
                      <SelectItem value="premium">متقدم</SelectItem>
                      <SelectItem value="enterprise">مؤسسي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة مدرسة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>إضافة مدرسة جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>الاسم بالإنجليزية *</Label>
                          <Input
                            value={newSchool.name}
                            onChange={(e) =>
                              setNewSchool({ ...newSchool, name: e.target.value })
                            }
                            placeholder="School Name"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الاسم بالعربية</Label>
                          <Input
                            value={newSchool.nameAr}
                            onChange={(e) =>
                              setNewSchool({ ...newSchool, nameAr: e.target.value })
                            }
                            placeholder="اسم المدرسة"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>البريد الإلكتروني *</Label>
                          <Input
                            type="email"
                            value={newSchool.email}
                            onChange={(e) =>
                              setNewSchool({ ...newSchool, email: e.target.value })
                            }
                            placeholder="info@school.edu.sa"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>رقم الهاتف</Label>
                          <Input
                            value={newSchool.phone}
                            onChange={(e) =>
                              setNewSchool({ ...newSchool, phone: e.target.value })
                            }
                            placeholder="+966xxxxxxxxx"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>العنوان</Label>
                        <Input
                          value={newSchool.address}
                          onChange={(e) =>
                            setNewSchool({ ...newSchool, address: e.target.value })
                          }
                          placeholder="المدينة، الحي"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>الباقة</Label>
                          <Select
                            value={newSchool.subscription}
                            onValueChange={(v) =>
                              setNewSchool({ ...newSchool, subscription: v as SubscriptionPlan })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">أساسي</SelectItem>
                              <SelectItem value="premium">متقدم</SelectItem>
                              <SelectItem value="enterprise">مؤسسي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>الحد الأقصى للطلاب</Label>
                          <Input
                            type="number"
                            value={newSchool.maxStudents}
                            onChange={(e) =>
                              setNewSchool({
                                ...newSchool,
                                maxStudents: parseInt(e.target.value) || 100,
                              })
                            }
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>وقت الإغلاق</Label>
                          <Input
                            type="time"
                            value={newSchool.cutoffTime}
                            onChange={(e) =>
                              setNewSchool({ ...newSchool, cutoffTime: e.target.value })
                            }
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddSchool} className="w-full">
                        إضافة المدرسة
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Schools Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>المدارس المسجلة</span>
                <Badge variant="secondary">{filteredSchools.length} مدرسة</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المدرسة</TableHead>
                      <TableHead>الباقة</TableHead>
                      <TableHead>الطلاب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>انتهاء الاشتراك</TableHead>
                      <TableHead className="w-[80px]">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.length > 0 ? (
                      filteredSchools.map((school) => {
                        const studentCount = getStudentCount(school.id);
                        const progress = (studentCount / school.maxStudents) * 100;

                        return (
                          <TableRow key={school.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">{school.nameAr}</p>
                                <p className="text-sm text-muted-foreground">{school.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>{getSubscriptionBadge(school.subscription)}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {studentCount} / {school.maxStudents}
                                  </span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={school.isActive}
                                  onCheckedChange={() => handleToggleActive(school.id)}
                                />
                                <span className={school.isActive ? 'text-success' : 'text-muted-foreground'}>
                                  {school.isActive ? 'نشط' : 'معطل'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell dir="ltr" className="text-right">
                              {school.subscriptionExpiry}
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
                                    <Eye className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 ml-2" />
                                    تعديل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleActive(school.id)}>
                                    <Power className="h-4 w-4 ml-2" />
                                    {school.isActive ? 'تعطيل' : 'تفعيل'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-muted-foreground">لا توجد مدارس</p>
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
