'use client';

import { useMemo } from 'react';
import { mockSchools } from '@/lib/mock-data';
import { DashboardHeader } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Star, Building2, Crown } from 'lucide-react';

const plans = [
  {
    name: 'أساسي',
    nameEn: 'basic',
    price: 500,
    icon: Building2,
    features: [
      'حتى 100 طالب',
      'تقارير حضور أساسية',
      'دعم فني عبر البريد',
      'مستخدمين: 2',
    ],
    color: 'border-border',
  },
  {
    name: 'متقدم',
    nameEn: 'premium',
    price: 1000,
    icon: Star,
    features: [
      'حتى 500 طالب',
      'تقارير متقدمة + تصدير',
      'دعم فني أولوية',
      'مستخدمين: 10',
      'إشعارات SMS',
      'تقارير مخصصة',
    ],
    color: 'border-primary',
    popular: true,
  },
  {
    name: 'مؤسسي',
    nameEn: 'enterprise',
    price: 2500,
    icon: Crown,
    features: [
      'عدد غير محدود من الطلاب',
      'جميع الميزات',
      'دعم فني 24/7',
      'مستخدمين غير محدود',
      'تكامل API',
      'تخصيص كامل',
      'مدير حساب مخصص',
    ],
    color: 'border-warning',
  },
];

export default function SubscriptionsPage() {
  const subscriptionStats = useMemo(() => ({
    basic: mockSchools.filter((s) => s.subscription === 'basic').length,
    premium: mockSchools.filter((s) => s.subscription === 'premium').length,
    enterprise: mockSchools.filter((s) => s.subscription === 'enterprise').length,
    totalRevenue:
      mockSchools.filter((s) => s.subscription === 'basic').length * 500 +
      mockSchools.filter((s) => s.subscription === 'premium').length * 1000 +
      mockSchools.filter((s) => s.subscription === 'enterprise').length * 2500,
  }), []);

  return (
    <>
      <DashboardHeader title="الاشتراكات" description="إدارة الباقات والاشتراكات" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{subscriptionStats.basic}</p>
                <p className="text-sm text-muted-foreground">اشتراكات أساسية</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{subscriptionStats.premium}</p>
                <p className="text-sm text-muted-foreground">اشتراكات متقدمة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-warning">{subscriptionStats.enterprise}</p>
                <p className="text-sm text-muted-foreground">اشتراكات مؤسسية</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-success">
                  {subscriptionStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">ر.س / شهرياً</p>
              </CardContent>
            </Card>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const count =
                plan.nameEn === 'basic'
                  ? subscriptionStats.basic
                  : plan.nameEn === 'premium'
                  ? subscriptionStats.premium
                  : subscriptionStats.enterprise;

              return (
                <Card
                  key={plan.nameEn}
                  className={`relative ${plan.color} border-2 ${
                    plan.popular ? 'shadow-lg' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">الأكثر شعبية</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                        plan.nameEn === 'basic'
                          ? 'bg-muted'
                          : plan.nameEn === 'premium'
                          ? 'bg-primary/10'
                          : 'bg-warning/10'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          plan.nameEn === 'basic'
                            ? 'text-muted-foreground'
                            : plan.nameEn === 'premium'
                            ? 'text-primary'
                            : 'text-warning'
                        }`}
                      />
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground"> ر.س / شهرياً</span>
                    </div>
                    <CardDescription>
                      {count} مدرسة مشتركة حالياً
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-6"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      تعديل الباقة
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>سجل الاشتراكات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchools.slice(0, 5).map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{school.nameAr}</p>
                      <p className="text-sm text-muted-foreground">
                        تاريخ الاشتراك: {school.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          {school.subscription === 'basic'
                            ? '500'
                            : school.subscription === 'premium'
                            ? '1,000'
                            : '2,500'}{' '}
                          ر.س
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ينتهي: {school.subscriptionExpiry}
                        </p>
                      </div>
                      <Badge
                        variant={
                          school.subscription === 'enterprise'
                            ? 'default'
                            : school.subscription === 'premium'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {school.subscription === 'basic' && 'أساسي'}
                        {school.subscription === 'premium' && 'متقدم'}
                        {school.subscription === 'enterprise' && 'مؤسسي'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
