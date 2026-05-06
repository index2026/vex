import { DashboardLayout } from '@/components/dashboard';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={['teacher']}>
      {children}
    </DashboardLayout>
  );
}
