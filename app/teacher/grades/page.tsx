'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award } from 'lucide-react';

export default function TeacherGradesPage() {
  const { user } = useAuth();

  return (
    <>
      <DashboardHeader title="الدرجات" description="إدارة درجات الطلاب" />
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Award className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold">قريباً</h3>
              <p className="text-muted-foreground mt-1">ميزة إدارة الدرجات ستكون متاحة قريباً</p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
