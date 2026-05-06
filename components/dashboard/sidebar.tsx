'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { roleNamesAr } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  CreditCard,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const superAdminNav: NavItem[] = [
  { label: 'لوحة التحكم', href: '/super-admin', icon: LayoutDashboard },
  { label: 'المدارس', href: '/super-admin/schools', icon: School },
  { label: 'الاشتراكات', href: '/super-admin/subscriptions', icon: CreditCard },
  { label: 'الإعدادات', href: '/super-admin/settings', icon: Settings },
];

const schoolAdminNav: NavItem[] = [
  { label: 'لوحة التحكم', href: '/school-admin', icon: LayoutDashboard },
  { label: 'الطلاب', href: '/school-admin/students', icon: Users },
  { label: 'المعلمين', href: '/school-admin/teachers', icon: GraduationCap },
  { label: 'الحضور', href: '/school-admin/attendance', icon: ClipboardList },
  { label: 'التقارير', href: '/school-admin/reports', icon: FileText },
  { label: 'الإعدادات', href: '/school-admin/settings', icon: Settings },
];

const teacherNav: NavItem[] = [
  { label: 'لوحة التحكم', href: '/teacher', icon: LayoutDashboard },
  { label: 'فصولي', href: '/teacher/classes', icon: BookOpen },
  { label: 'الحضور', href: '/teacher/attendance', icon: ClipboardList },
  { label: 'الدرجات', href: '/teacher/grades', icon: Award },
  { label: 'الإعدادات', href: '/teacher/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, school, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Get navigation items based on user role
  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'super_admin':
        return superAdminNav;
      case 'school_admin':
        return schoolAdminNav;
      case 'teacher':
        return teacherNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const userInitials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2) || 'U';

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-l flex flex-col transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground">VexLap</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href) && item.href.split('/').length === pathname.split('/').length);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t p-3">
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role && roleNamesAr[user.role]}
              </p>
              {school && (
                <p className="text-xs text-muted-foreground truncate">
                  {school.nameAr}
                </p>
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className={cn('w-full mt-2', !collapsed && 'justify-start')}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="mr-2">تسجيل الخروج</span>}
        </Button>
      </div>
    </aside>
  );
}
