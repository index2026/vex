"use client"

import { DashboardLayout } from "@/components/dashboard"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
