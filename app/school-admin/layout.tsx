import { DashboardLayout } from '@/components/dashboard';

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={['school_admin']}>
      {children}
    </DashboardLayout>
  );
}
