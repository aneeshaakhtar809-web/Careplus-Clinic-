export type UserRole = 'admin' | 'doctor' | 'patient';

export type Gender = 'Male' | 'Female' | 'Other';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type AppointmentType = 'In-Person' | 'Video Consultation' | 'Follow-up';

export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPatient {
  _id?: string;
  userId?: string;
  fullName: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  email: string;
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  medicalHistory: string[];
  allergies?: string[];
  currentMedications?: string[];
  registrationDate: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IDoctorScheduleSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "17:00"
  slotDurationMinutes: number; // e.g. 30
}

export interface IDoctor {
  _id?: string;
  userId?: string;
  name: string;
  email: string;
  specialization: string;
  experience: number; // years
  qualification: string;
  consultationFee: number;
  availableTimings: IDoctorScheduleSlot[];
  contactInformation: {
    phone: string;
    email: string;
    roomNumber: string;
  };
  isAvailable: boolean;
  rating?: number;
  bio?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IAppointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;       // e.g. "09:30 AM"
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  symptoms?: string;
  consultationNotes?: string;
  prescription?: string;
  fee: number;
  paymentStatus: PaymentStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IPrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ILabTestItem {
  testName: string;
  status: 'Pending' | 'Completed' | 'Normal' | 'Abnormal';
  notes?: string;
}

export interface IVitalSigns {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
}

export interface IMedicalRecord {
  _id?: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  doctorName?: string;
  patientName?: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: IPrescriptionItem[];
  labTests: ILabTestItem[];
  vitalSigns?: IVitalSigns;
  notes?: string;
  date: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IClinicSettings {
  _id?: string;
  clinicName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  emergencyPhone: string;
  address: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
  defaultSlotDurationMinutes: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  availableDoctors: number;
  completedVisits: number;
  monthlyRevenue: number;
  recentAppointments: IAppointment[];
  monthlyTrend: { month: string; appointments: number; revenue: number }[];
  doctorPerformance: { name: string; specialization: string; appointmentsCount: number; rating: number }[];
}
