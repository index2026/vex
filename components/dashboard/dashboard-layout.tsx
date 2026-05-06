'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardSidebar } from './sidebar';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        switch (user.role) {
          case 'super_admin':
            router.replace('/super-admin');
            break;
          case 'school_admin':
            router.replace('/school-admin');
            break;
          case 'teacher':
            router.replace('/teacher');
            break;
          case 'security':
            router.replace('/gate');
            break;
          default:
            router.replace('/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAllowed = isAuthenticated && user && (!allowedRoles || allowedRoles.includes(user.role));

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
