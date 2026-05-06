"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const translations = {
  ar: {
    // Header
    "nav.features": "المميزات",
    "nav.howItWorks": "كيف يعمل",
    "nav.contact": "تواصل معنا",
    "nav.startNow": "ابدأ الآن",
    
    // Hero
    "hero.badge": "نظام ذكي ومتطور",
    "hero.title1": "إدارة",
    "hero.titleHighlight": "الحضور والتقييم",
    "hero.title2": "بكفاءة عالية",
    "hero.description": "منصة متكاملة لإدارة الحضور والغياب وتقييم الطلاب باستخدام تقنية QR Code للمدارس والجامعات",
    "hero.tryFree": "جرب مجاناً",
    "hero.watchDemo": "شاهد العرض",
    "hero.institutions": "مؤسسة تعليمية",
    "hero.students": "طالب مسجل",
    "hero.accuracy": "دقة التسجيل",
    
    // Card
    "card.todaySession": "جلسة اليوم",
    "card.math": "الرياضيات - الصف الثالث",
    "card.active": "نشط",
    "card.scanToCheckin": "امسح للتسجيل",
    "card.attendanceRate": "نسبة الحضور",
    "card.todayStudents": "طلاب اليوم",
    
    // Students
    "student.ahmed": "أحمد محمد",
    "student.sara": "سارة علي",
    "student.mohamed": "محمد خالد",
    "status.present": "حاضر",
    "status.absent": "غائب",
    "status.late": "متأخر",
    
    // Features
    "features.label": "المميزات",
    "features.title1": "كل ما تحتاجه في",
    "features.titleHighlight": "منصة واحدة",
    "features.subtitle": "نظام متكامل يجمع بين سهولة الاستخدام والدقة العالية",
    "features.qr.title": "تسجيل حضور بـ QR",
    "features.qr.desc": "مسح سريع وآمن باستخدام رمز QR فريد لكل جلسة",
    "features.reports.title": "تقارير وإحصائيات",
    "features.reports.desc": "لوحة تحكم متقدمة مع تقارير مفصلة وقابلة للتصدير",
    "features.students.title": "إدارة الطلاب",
    "features.students.desc": "قاعدة بيانات شاملة لجميع الطلاب والمجموعات",
    "features.tracking.title": "تتبع فوري",
    "features.tracking.desc": "متابعة الحضور والغياب في الوقت الفعلي",
    "features.security.title": "أمان متقدم",
    "features.security.desc": "حماية البيانات بأعلى معايير الأمان والتشفير",
    "features.mobile.title": "متوافق مع الجوال",
    "features.mobile.desc": "واجهة سهلة تعمل على جميع الأجهزة",
    "features.featured": "مميز",
    
    // How it works
    "how.label": "كيف يعمل",
    "how.title1": "ثلاث خطوات",
    "how.titleHighlight": "بسيطة",
    "how.subtitle": "ابدأ في دقائق معدودة",
    "how.step1.title": "إنشاء الجلسة",
    "how.step1.desc": "أنشئ جلسة جديدة وحدد التفاصيل والمجموعة المستهدفة",
    "how.step2.title": "مسح الكود",
    "how.step2.desc": "الطلاب يمسحون رمز QR للتسجيل بشكل فوري",
    "how.step3.title": "متابعة التقارير",
    "how.step3.desc": "راجع الإحصائيات والتقارير المفصلة مباشرة",
    
    // Contact
    "contact.label": "تواصل معنا",
    "contact.title1": "نحن هنا",
    "contact.titleHighlight": "لمساعدتك",
    "contact.subtitle": "تواصل معنا لأي استفسار أو طلب تجربة",
    "contact.email": "البريد الإلكتروني",
    "contact.whatsapp": "واتساب",
    
    // CTA
    "cta.title1": "جاهز لتحويل إدارة",
    "cta.titleHighlight": "الحضور",
    "cta.title2": "؟",
    "cta.subtitle": "انضم لمئات المؤسسات التعليمية التي تثق بنظام VEXLAP",
    "cta.freeTrial": "ابدأ التجربة المجانية",
    "cta.talkToSales": "تحدث مع فريق المبيعات",
    
    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.builtWith": "صُنع بـ VEXLAP",
  },
  en: {
    // Header
    "nav.features": "Features",
    "nav.howItWorks": "How It Works",
    "nav.contact": "Contact Us",
    "nav.startNow": "Get Started",
    
    // Hero
    "hero.badge": "Smart & Advanced System",
    "hero.title1": "Manage",
    "hero.titleHighlight": "Attendance & Evaluation",
    "hero.title2": "Efficiently",
    "hero.description": "A comprehensive platform for managing attendance and student evaluation using QR Code technology for schools and universities",
    "hero.tryFree": "Try Free",
    "hero.watchDemo": "Watch Demo",
    "hero.institutions": "Institutions",
    "hero.students": "Registered Students",
    "hero.accuracy": "Accuracy Rate",
    
    // Card
    "card.todaySession": "Today's Session",
    "card.math": "Mathematics - Grade 3",
    "card.active": "Active",
    "card.scanToCheckin": "Scan to Check-in",
    "card.attendanceRate": "Attendance Rate",
    "card.todayStudents": "Today's Students",
    
    // Students
    "student.ahmed": "Ahmed Mohamed",
    "student.sara": "Sara Ali",
    "student.mohamed": "Mohamed Khaled",
    "status.present": "Present",
    "status.absent": "Absent",
    "status.late": "Late",
    
    // Features
    "features.label": "Features",
    "features.title1": "Everything You Need in",
    "features.titleHighlight": "One Platform",
    "features.subtitle": "An integrated system combining ease of use and high accuracy",
    "features.qr.title": "QR Attendance",
    "features.qr.desc": "Fast and secure scanning using unique QR codes for each session",
    "features.reports.title": "Reports & Analytics",
    "features.reports.desc": "Advanced dashboard with detailed and exportable reports",
    "features.students.title": "Student Management",
    "features.students.desc": "Comprehensive database for all students and groups",
    "features.tracking.title": "Real-time Tracking",
    "features.tracking.desc": "Monitor attendance in real-time",
    "features.security.title": "Advanced Security",
    "features.security.desc": "Data protection with highest security standards",
    "features.mobile.title": "Mobile Friendly",
    "features.mobile.desc": "Easy interface that works on all devices",
    "features.featured": "Featured",
    
    // How it works
    "how.label": "How It Works",
    "how.title1": "Three",
    "how.titleHighlight": "Simple Steps",
    "how.subtitle": "Get started in minutes",
    "how.step1.title": "Create Session",
    "how.step1.desc": "Create a new session and set the details and target group",
    "how.step2.title": "Scan Code",
    "how.step2.desc": "Students scan the QR code for instant registration",
    "how.step3.title": "Track Reports",
    "how.step3.desc": "Review statistics and detailed reports instantly",
    
    // Contact
    "contact.label": "Contact Us",
    "contact.title1": "We're Here",
    "contact.titleHighlight": "To Help",
    "contact.subtitle": "Contact us for any inquiries or demo requests",
    "contact.email": "Email",
    "contact.whatsapp": "WhatsApp",
    
    // CTA
    "cta.title1": "Ready to Transform",
    "cta.titleHighlight": "Attendance",
    "cta.title2": "Management?",
    "cta.subtitle": "Join hundreds of educational institutions that trust VEXLAP",
    "cta.freeTrial": "Start Free Trial",
    "cta.talkToSales": "Talk to Sales",
    
    // Footer
    "footer.rights": "All Rights Reserved",
    "footer.builtWith": "Built with VEXLAP",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("vexlap-language") as Language
    if (saved && (saved === "ar" || saved === "en")) {
      setLanguageState(saved)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("vexlap-language", language)
      document.documentElement.lang = language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
