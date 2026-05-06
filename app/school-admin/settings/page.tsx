'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Building, Clock, Bell, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { school } = useAuth();
  
  const [schoolInfo, setSchoolInfo] = useState({
    name: school?.name || '',
    nameAr: school?.nameAr || '',
    address: school?.address || '',
    phone: school?.phone || '',
    email: school?.email || '',
  });

  const [cutoffTime, setCutoffTime] = useState(school?.cutoffTime || '07:30');
  
  const [notifications, setNotifications] = useState({
    emailOnAbsent: true,
    smsOnAbsent: false,
    emailOnLate: true,
    smsOnLate: false,
    dailyReport: true,
    weeklyReport: true,
  });

  const handleSaveSchoolInfo = () => {
    toast.success('تم حفظ معلومات المدرسة بنجاح');
  };

  const handleSaveCutoff = () => {
    toast.success('تم حفظ وقت الإغلاق بنجاح');
  };

  const handleSaveNotifications = () => {
    toast.success('تم حفظ إعدادات الإشعارات بنجاح');
  };

  return (
    <>
      <DashboardHeader title="الإعدادات" description="إعدادات المدرسة والنظام" />

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="school" className="space-y-6">
            <TabsList>
              <TabsTrigger value="school">
                <Building className="h-4 w-4 ml-2" />
                المدرسة
              </TabsTrigger>
              <TabsTrigger value="attendance">
                <Clock className="h-4 w-4 ml-2" />
                الحضور
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 ml-2" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 ml-2" />
                الأمان
              </TabsTrigger>
            </TabsList>

            {/* School Info */}
            <TabsContent value="school">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات المدرسة</CardTitle>
                  <CardDescription>
                    البيانات الأساسية للمدرسة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>اسم المدرسة (بالإنجليزية)</Label>
                      <Input
                        value={schoolInfo.name}
                        onChange={(e) =>
                          setSchoolInfo({ ...schoolInfo, name: e.target.value })
                        }
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>اسم المدرسة (بالعربية)</Label>
                      <Input
                        value={schoolInfo.nameAr}
                        onChange={(e) =>
                          setSchoolInfo({ ...schoolInfo, nameAr: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>العنوان</Label>
                    <Input
                      value={schoolInfo.address}
                      onChange={(e) =>
                        setSchoolInfo({ ...schoolInfo, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>رقم الهاتف</Label>
                      <Input
                        value={schoolInfo.phone}
                        onChange={(e) =>
                          setSchoolInfo({ ...schoolInfo, phone: e.target.value })
                        }
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={schoolInfo.email}
                        onChange={(e) =>
                          setSchoolInfo({ ...schoolInfo, email: e.target.value })
                        }
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveSchoolInfo}>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Settings */}
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الحضور</CardTitle>
                  <CardDescription>
                    تحديد أوقات الحضور والتأخير
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>وقت الإغلاق (Cut-off Time)</Label>
                      <p className="text-sm text-muted-foreground">
                        الطلاب الذين يصلون بعد هذا الوقت يسجلون كـ &quot;متأخرين&quot;
                      </p>
                      <Input
                        type="time"
                        value={cutoffTime}
                        onChange={(e) => setCutoffTime(e.target.value)}
                        className="w-40"
                        dir="ltr"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">قواعد الحضور</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              تسجيل الدخول مرة واحدة فقط
                            </p>
                            <p className="text-sm text-muted-foreground">
                              لا يمكن للطالب تسجيل الدخول أكثر من مرة في اليوم
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              تسجيل الخروج تلقائي
                            </p>
                            <p className="text-sm text-muted-foreground">
                              تسجيل خروج جميع الطلاب في نهاية اليوم الدراسي
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSaveCutoff}>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>
                    إدارة إشعارات أولياء الأمور والتقارير
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">إشعارات الغياب</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            إرسال بريد إلكتروني عند الغياب
                          </p>
                          <p className="text-sm text-muted-foreground">
                            إشعار ولي الأمر عبر البريد الإلكتروني
                          </p>
                        </div>
                        <Switch
                          checked={notifications.emailOnAbsent}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailOnAbsent: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            إرسال رسالة SMS عند الغياب
                          </p>
                          <p className="text-sm text-muted-foreground">
                            إشعار ولي الأمر عبر رسالة نصية
                          </p>
                        </div>
                        <Switch
                          checked={notifications.smsOnAbsent}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, smsOnAbsent: checked })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <h4 className="font-medium">إشعارات التأخير</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            إرسال بريد إلكتروني عند التأخير
                          </p>
                        </div>
                        <Switch
                          checked={notifications.emailOnLate}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailOnLate: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            إرسال رسالة SMS عند التأخير
                          </p>
                        </div>
                        <Switch
                          checked={notifications.smsOnLate}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, smsOnLate: checked })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <h4 className="font-medium">التقارير الدورية</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">تقرير يومي</p>
                          <p className="text-sm text-muted-foreground">
                            إرسال ملخص الحضور اليومي
                          </p>
                        </div>
                        <Switch
                          checked={notifications.dailyReport}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, dailyReport: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">تقرير أسبوعي</p>
                          <p className="text-sm text-muted-foreground">
                            إرسال ملخص الحضور الأسبوعي
                          </p>
                        </div>
                        <Switch
                          checked={notifications.weeklyReport}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, weeklyReport: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSaveNotifications}>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>الأمان والخصوصية</CardTitle>
                  <CardDescription>
                    إعدادات الأمان وصلاحيات الوصول
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          تغيير كلمة المرور
                        </p>
                        <p className="text-sm text-muted-foreground">
                          تحديث كلمة مرور حسابك
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        تغيير
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          المصادقة الثنائية
                        </p>
                        <p className="text-sm text-muted-foreground">
                          إضافة طبقة حماية إضافية لحسابك
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          سجل الدخول
                        </p>
                        <p className="text-sm text-muted-foreground">
                          عرض سجل تسجيلات الدخول لحسابك
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        عرض السجل
                      </Button>
                    </div>
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
