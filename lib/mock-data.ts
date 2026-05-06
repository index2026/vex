import type {
  User,
  School,
  Student,
  AttendanceRecord,
  Teacher,
  Class,
  GradeLevel,
  AttendanceStatus,
} from './types';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock Schools
export const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'Al Noor International School',
    nameAr: 'مدرسة النور الدولية',
    logo: '/schools/alnoor-logo.png',
    address: '123 Education Street, Riyadh',
    phone: '+966501234567',
    email: 'info@alnoor.edu.sa',
    cutoffTime: '07:30',
    maxStudents: 500,
    currentStudents: 342,
    subscription: 'premium',
    subscriptionExpiry: '2025-12-31',
    isActive: true,
    createdAt: '2023-01-15',
  },
  {
    id: 'school-2',
    name: 'Al Faisal Academy',
    nameAr: 'أكاديمية الفيصل',
    logo: '/schools/alfaisal-logo.png',
    address: '456 Knowledge Ave, Jeddah',
    phone: '+966509876543',
    email: 'info@alfaisal.edu.sa',
    cutoffTime: '07:45',
    maxStudents: 300,
    currentStudents: 187,
    subscription: 'basic',
    subscriptionExpiry: '2025-06-30',
    isActive: true,
    createdAt: '2023-06-20',
  },
  {
    id: 'school-3',
    name: 'Excellence Private School',
    nameAr: 'مدرسة التفوق الأهلية',
    address: '789 Learning Blvd, Dammam',
    phone: '+966503456789',
    email: 'info@excellence.edu.sa',
    cutoffTime: '07:30',
    maxStudents: 800,
    currentStudents: 612,
    subscription: 'enterprise',
    subscriptionExpiry: '2026-03-15',
    isActive: true,
    createdAt: '2022-09-01',
  },
];

// Mock Users
export const mockUsers: User[] = [
  // Super Admin
  {
    id: 'user-super-1',
    name: 'Ahmed Al-Rashid',
    email: 'admin@vexlap.com',
    role: 'super_admin',
  },
  // School Admin - School 1
  {
    id: 'user-admin-1',
    name: 'Mohammed Al-Harbi',
    email: 'admin@alnoor.edu.sa',
    role: 'school_admin',
    tenantId: 'school-1',
  },
  // School Admin - School 2
  {
    id: 'user-admin-2',
    name: 'Khalid Al-Otaibi',
    email: 'admin@alfaisal.edu.sa',
    role: 'school_admin',
    tenantId: 'school-2',
  },
  // Teacher - School 1
  {
    id: 'user-teacher-1',
    name: 'Fatima Al-Zahrani',
    email: 'fatima@alnoor.edu.sa',
    role: 'teacher',
    tenantId: 'school-1',
  },
  // Security - School 1
  {
    id: 'user-security-1',
    name: 'Salem Al-Qahtani',
    email: 'security@alnoor.edu.sa',
    role: 'security',
    tenantId: 'school-1',
  },
  // Security - School 2
  {
    id: 'user-security-2',
    name: 'Faisal Al-Mutairi',
    email: 'security@alfaisal.edu.sa',
    role: 'security',
    tenantId: 'school-2',
  },
];

// Arabic names for students
const arabicFirstNamesMale = ['أحمد', 'محمد', 'عبدالله', 'خالد', 'سعد', 'فهد', 'عمر', 'يوسف', 'علي', 'سلطان', 'ناصر', 'تركي', 'بندر', 'ماجد', 'راشد'];
const arabicFirstNamesFemale = ['سارة', 'نورة', 'فاطمة', 'مريم', 'ريم', 'هند', 'لمى', 'دانة', 'جود', 'لين', 'ملاك', 'رهف', 'شهد', 'ديما', 'ريناد'];
const arabicLastNames = ['العتيبي', 'الحربي', 'الشمري', 'القحطاني', 'الدوسري', 'المطيري', 'الزهراني', 'الغامدي', 'العنزي', 'السبيعي'];

// Generate students for a school
const generateStudents = (schoolId: string, count: number): Student[] => {
  const students: Student[] = [];
  const grades: GradeLevel[] = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12'];
  const sections = ['A', 'B', 'C'];

  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstNames = gender === 'male' ? arabicFirstNamesMale : arabicFirstNamesFemale;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)];
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];
    const classId = `class-${schoolId}-${grade}-${section}`;

    students.push({
      id: `student-${schoolId}-${i + 1}`,
      qrCode: `QR-${schoolId.toUpperCase()}-${(i + 1).toString().padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      nameAr: `${firstName} ${lastName}`,
      grade,
      className: section,
      classId,
      tenantId: schoolId,
      parentName: `والد ${firstName}`,
      parentPhone: `+9665${Math.floor(10000000 + Math.random() * 90000000)}`,
      parentEmail: `parent${i + 1}@example.com`,
      gender,
      dateOfBirth: `${2010 + Math.floor(Math.random() * 8)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      enrollmentDate: '2023-09-01',
      isActive: true,
    });
  }

  return students;
};

// Generate all students
export const mockStudents: Student[] = [
  ...generateStudents('school-1', 50),
  ...generateStudents('school-2', 30),
  ...generateStudents('school-3', 70),
];

// Generate attendance records for last 30 days
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  mockStudents.forEach((student) => {
    // Generate records for last 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      
      // Skip weekends (Friday = 5, Saturday = 6)
      if (date.getDay() === 5 || date.getDay() === 6) continue;

      const dateStr = date.toISOString().split('T')[0];
      const random = Math.random();
      
      let status: AttendanceStatus;
      let checkIn: string | undefined;
      let checkOut: string | undefined;

      if (random < 0.85) {
        // 85% present
        const isLate = Math.random() < 0.1; // 10% late
        status = isLate ? 'late' : 'present';
        const hour = isLate ? '07' : '07';
        const minute = isLate ? Math.floor(35 + Math.random() * 25) : Math.floor(Math.random() * 30);
        checkIn = `${hour}:${String(minute).padStart(2, '0')}:00`;
        checkOut = '14:30:00';
      } else if (random < 0.95) {
        // 10% absent
        status = 'absent';
      } else {
        // 5% excused
        status = 'excused';
      }

      records.push({
        id: generateId(),
        studentId: student.id,
        tenantId: student.tenantId,
        date: dateStr,
        checkIn,
        checkOut,
        status,
        recordedBy: 'system',
        createdAt: `${dateStr}T${checkIn || '08:00:00'}`,
      });
    }
  });

  return records;
};

export const mockAttendanceRecords: AttendanceRecord[] = generateAttendanceRecords();

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    userId: 'user-teacher-1',
    name: 'Fatima Al-Zahrani',
    nameAr: 'فاطمة الزهراني',
    tenantId: 'school-1',
    subject: 'Mathematics',
    classes: ['class-1-G6-A', 'class-1-G6-B'],
    phone: '+966501111111',
    email: 'fatima@alnoor.edu.sa',
    isActive: true,
  },
  {
    id: 'teacher-2',
    userId: 'user-teacher-2',
    name: 'Abdullah Al-Harbi',
    nameAr: 'عبدالله الحربي',
    tenantId: 'school-1',
    subject: 'Arabic',
    classes: ['class-1-G7-A', 'class-1-G7-B', 'class-1-G8-A'],
    phone: '+966502222222',
    email: 'abdullah@alnoor.edu.sa',
    isActive: true,
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  // School 1 classes
  { id: 'class-1-G6-A', name: 'Grade 6 - Section A', grade: 'G6', section: 'A', tenantId: 'school-1', teacherId: 'teacher-1', studentCount: 25 },
  { id: 'class-1-G6-B', name: 'Grade 6 - Section B', grade: 'G6', section: 'B', tenantId: 'school-1', teacherId: 'teacher-1', studentCount: 23 },
  { id: 'class-1-G7-A', name: 'Grade 7 - Section A', grade: 'G7', section: 'A', tenantId: 'school-1', teacherId: 'teacher-2', studentCount: 28 },
  { id: 'class-1-G7-B', name: 'Grade 7 - Section B', grade: 'G7', section: 'B', tenantId: 'school-1', teacherId: 'teacher-2', studentCount: 26 },
  // School 2 classes
  { id: 'class-2-G1-A', name: 'Grade 1 - Section A', grade: 'G1', section: 'A', tenantId: 'school-2', studentCount: 20 },
  { id: 'class-2-G1-B', name: 'Grade 1 - Section B', grade: 'G1', section: 'B', tenantId: 'school-2', studentCount: 22 },
];

// Helper functions to get data
export const getSchoolById = (id: string): School | undefined => {
  return mockSchools.find((s) => s.id === id);
};

export const getStudentsBySchool = (tenantId: string): Student[] => {
  return mockStudents.filter((s) => s.tenantId === tenantId);
};

export const getStudentByQRCode = (qrCode: string, tenantId: string): Student | undefined => {
  return mockStudents.find((s) => s.qrCode === qrCode && s.tenantId === tenantId);
};

export const getTodayAttendance = (tenantId: string): AttendanceRecord[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockAttendanceRecords.filter((r) => r.tenantId === tenantId && r.date === today);
};

export const getAttendanceByDate = (tenantId: string, date: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter((r) => r.tenantId === tenantId && r.date === date);
};

export const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter((r) => r.studentId === studentId);
};

export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((u) => u.email === email);
};

export const getTeachersBySchool = (tenantId: string): Teacher[] => {
  return mockTeachers.filter((t) => t.tenantId === tenantId);
};

export const getClassesBySchool = (tenantId: string): Class[] => {
  return mockClasses.filter((c) => c.tenantId === tenantId);
};

// Login passwords (for mock auth)
export const mockPasswords: Record<string, string> = {
  'admin@vexlap.com': 'admin123',
  'admin@alnoor.edu.sa': 'school123',
  'admin@alfaisal.edu.sa': 'school123',
  'fatima@alnoor.edu.sa': 'teacher123',
  'security@alnoor.edu.sa': 'security123',
  'security@alfaisal.edu.sa': 'security123',
};
