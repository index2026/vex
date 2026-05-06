import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'primary';
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  const variantStyles = {
    default: {
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
    primary: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    destructive: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                <span className="text-muted-foreground mr-1">من الأسبوع الماضي</span>
              </p>
            )}
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              styles.iconBg
            )}
          >
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
