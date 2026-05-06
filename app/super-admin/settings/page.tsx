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
import { User, Shield, Bell, Settings2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminSettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleSaveProfile = () => {
    toast.success('تم حفظ البيانات الشخصية بنجاح');
  };

  const handleSaveSystem = () => {
    toast.success('تم حفظ إعدادات النظام بنجاح');
  };

  return (
    <>
      <DashboardHeader title="الإعدادات" description="إعدادات النظام والحساب" />

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 ml-2" />
                الملف الشخصي
              </TabsTrigger>
              <TabsTrigger value="system">
                <Settings2 className="h-4 w-4 ml-2" />
                النظام
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

            {/* Profile */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>الملف الشخصي</CardTitle>
                  <CardDescription>معلومات حساب مدير النظام</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>الاسم</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      placeholder="+966xxxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات النظام</CardTitle>
                  <CardDescription>التحكم في إعدادات النظام العامة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">وضع الصيانة</p>
                        <p className="text-sm text-muted-foreground">
                          تعطيل الوصول للمستخدمين أثناء الصيانة
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onCheckedChange={(checked) =>
                          setSystemSettings({ ...systemSettings, maintenanceMode: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">التسجيلات الجديدة</p>
                        <p className="text-sm text-muted-foreground">
                          السماح بتسجيل مدارس جديدة
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.newRegistrations}
                        onCheckedChange={(checked) =>
                          setSystemSettings({ ...systemSettings, newRegistrations: checked })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveSystem}>
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
                  <CardDescription>التحكم في إشعارات النظام</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">إشعارات البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">
                          استقبال إشعارات عبر البريد
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setSystemSettings({ ...systemSettings, emailNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">إشعارات SMS</p>
                        <p className="text-sm text-muted-foreground">
                          استقبال إشعارات نصية
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) =>
                          setSystemSettings({ ...systemSettings, smsNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveSystem}>
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
                  <CardTitle>الأمان</CardTitle>
                  <CardDescription>إعدادات الأمان والحماية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">تغيير كلمة المرور</p>
                        <p className="text-sm text-muted-foreground">
                          تحديث كلمة مرور حسابك
                        </p>
                      </div>
                      <Button variant="outline" size="sm">تغيير</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">المصادقة الثنائية</p>
                        <p className="text-sm text-muted-foreground">
                          إضافة طبقة حماية إضافية
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">سجل النشاط</p>
                        <p className="text-sm text-muted-foreground">
                          عرض سجل العمليات في النظام
                        </p>
                      </div>
                      <Button variant="outline" size="sm">عرض السجل</Button>
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
