'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { roleNamesAr } from '@/lib/types';
import { toast } from 'sonner';

export default function TeacherSettingsPage() {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2) || 'U';

  return (
    <>
      <DashboardHeader title="الإعدادات" description="إدارة بيانات حسابك الشخصي" />
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{user?.name}</p>
                  <p className="text-muted-foreground text-sm">{user?.role && roleNamesAr[user.role]}</p>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="grid gap-4 pt-4">
                <div className="space-y-2">
                  <Label>الاسم</Label>
                  <Input defaultValue={user?.name} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input defaultValue={user?.email} readOnly className="bg-muted" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>كلمة المرور الجديدة</Label>
                  <Input type="password" placeholder="أدخل كلمة مرور جديدة" />
                </div>
                <Button onClick={() => toast.success('تم حفظ التغييرات بنجاح')}>
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
