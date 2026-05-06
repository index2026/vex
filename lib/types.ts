// User Roles
export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'security';

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string; // School ID for school_admin, teacher, security
  avatar?: string;
}

// Subscription Plans
export type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';

// School (Tenant) Interface
export interface School {
  id: string;
  name: string;
  nameAr: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  cutoffTime: string; // e.g., "07:30"
  maxStudents: number;
  currentStudents: number;
  subscription: SubscriptionPlan;
  subscriptionExpiry: string;
  isActive: boolean;
  createdAt: string;
}

// Grade Levels
export type GradeLevel = 
  | 'KG1' | 'KG2' | 'KG3'
  | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6'
  | 'G7' | 'G8' | 'G9'
  | 'G10' | 'G11' | 'G12';

// Student Interface
export interface Student {
  id: string;
  qrCode: string;
  name: string;
  nameAr: string;
  grade: GradeLevel;
  className: string; // e.g., "A", "B", "C"
  classId?: string; // Reference to Class id
  tenantId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  enrollmentDate: string;
  isActive: boolean;
  avatar?: string;
}

// Attendance Status
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// Attendance Record
export interface AttendanceRecord {
  id: string;
  studentId: string;
  tenantId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM:SS
  checkOut?: string;
  status: AttendanceStatus;
  note?: string;
  recordedBy: string; // User ID who recorded
  createdAt: string;
}

// Teacher Interface
export interface Teacher {
  id: string;
  userId: string;
  name: string;
  nameAr: string;
  tenantId: string;
  subject: string;
  classes: string[]; // Class IDs
  phone: string;
  email: string;
  isActive: boolean;
}

// Class Interface
export interface Class {
  id: string;
  name: string;
  grade: GradeLevel;
  section: string; // A, B, C
  tenantId: string;
  teacherId?: string;
  studentCount: number;
}

// Grade/Score Record
export interface GradeRecord {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  examType: 'quiz' | 'midterm' | 'final' | 'assignment';
  score: number;
  maxScore: number;
  date: string;
  tenantId: string;
}

// Subscription Payment
export interface SubscriptionPayment {
  id: string;
  tenantId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  paymentDate: string;
  expiryDate: string;
}

// Scan Result for Gate
export interface ScanResult {
  success: boolean;
  status: 'success' | 'already_checked' | 'not_found' | 'late' | 'error';
  message: string;
  messageAr: string;
  student?: Student;
  checkInTime?: string;
  isLate?: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
}

// Super Admin Stats
export interface SuperAdminStats {
  totalSchools: number;
  activeSchools: number;
  totalStudents: number;
  totalRevenue: number;
  subscriptionsByPlan: {
    basic: number;
    premium: number;
    enterprise: number;
  };
}

// Report Filters
export interface ReportFilters {
  startDate: string;
  endDate: string;
  grade?: GradeLevel;
  className?: string;
  status?: AttendanceStatus;
}

// Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  school: School | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Grade Names in Arabic
export const gradeNamesAr: Record<GradeLevel, string> = {
  KG1: 'روضة أولى',
  KG2: 'روضة ثانية',
  KG3: 'تمهيدي',
  G1: 'الصف الأول',
  G2: 'الصف الثاني',
  G3: 'الصف الثالث',
  G4: 'الصف الرابع',
  G5: 'الصف الخامس',
  G6: 'الصف السادس',
  G7: 'الصف السابع',
  G8: 'الصف الثامن',
  G9: 'الصف التاسع',
  G10: 'الصف العاشر',
  G11: 'الصف الحادي عشر',
  G12: 'الصف الثاني عشر',
};

// Attendance Status Names in Arabic
export const statusNamesAr: Record<AttendanceStatus, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  excused: 'غياب بعذر',
};

// Role Names in Arabic
export const roleNamesAr: Record<UserRole, string> = {
  super_admin: 'مدير النظام',
  school_admin: 'مدير المدرسة',
  teacher: 'معلم',
  security: 'حارس البوابة',
};
