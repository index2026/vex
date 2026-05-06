import { DashboardLayout } from '@/components/dashboard';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={['super_admin']}>
      {children}
    </DashboardLayout>
  );
}
