import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Doctor } from '@/models/Doctor';
import { Patient } from '@/models/Patient';
import { Appointment } from '@/models/Appointment';
import { MedicalRecord } from '@/models/MedicalRecord';
import { ClinicSettings } from '@/models/ClinicSettings';
import { hashPassword } from '@/lib/auth/password';

export async function seedDatabase() {
  await connectToDatabase();

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
    Appointment.deleteMany({}),
    MedicalRecord.deleteMany({}),
    ClinicSettings.deleteMany({}),
  ]);

  console.log('🧹 Existing collections cleared');

  // 1. Create Default Passwords
  const adminPassword = await hashPassword('admin123');
  const doctorPassword = await hashPassword('doctor123');
  const patientPassword = await hashPassword('patient123');

  // 2. Create Users
  const adminUser = await User.create({
    name: 'Dr. Arthur Vance (Chief Administrator)',
    email: 'admin@carepulse.com',
    password: adminPassword,
    role: 'admin',
    phone: '+1 (555) 100-2000',
    isActive: true,
  });

  const doctor1User = await User.create({
    name: 'Dr. Sarah Jenkins',
    email: 'dr.sarah@carepulse.com',
    password: doctorPassword,
    role: 'doctor',
    phone: '+1 (555) 201-3001',
    isActive: true,
  });

  const doctor2User = await User.create({
    name: 'Dr. Marcus Chen',
    email: 'dr.marcus@carepulse.com',
    password: doctorPassword,
    role: 'doctor',
    phone: '+1 (555) 201-3002',
    isActive: true,
  });

  const doctor3User = await User.create({
    name: 'Dr. Elena Rostova',
    email: 'dr.elena@carepulse.com',
    password: doctorPassword,
    role: 'doctor',
    phone: '+1 (555) 201-3003',
    isActive: true,
  });

  const patient1User = await User.create({
    name: 'Eleanor Sterling',
    email: 'patient@carepulse.com',
    password: patientPassword,
    role: 'patient',
    phone: '+1 (555) 401-5001',
    isActive: true,
  });

  const patient2User = await User.create({
    name: 'David Miller',
    email: 'david.miller@example.com',
    password: patientPassword,
    role: 'patient',
    phone: '+1 (555) 401-5002',
    isActive: true,
  });

  // 3. Create Doctors
  const doctor1 = await Doctor.create({
    userId: doctor1User._id,
    name: 'Dr. Sarah Jenkins',
    email: doctor1User.email,
    specialization: 'Cardiology',
    experience: 12,
    qualification: 'MD, FACC - Harvard Medical School',
    consultationFee: 120,
    availableTimings: [
      { day: 'Monday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30 },
      { day: 'Tuesday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30 },
      { day: 'Wednesday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30 },
      { day: 'Thursday', startTime: '09:00', endTime: '16:00', slotDurationMinutes: 30 },
    ],
    contactInformation: {
      phone: '+1 (555) 201-3001',
      email: 'dr.sarah@carepulse.com',
      roomNumber: 'Cardiology Suite 301',
    },
    isAvailable: true,
    rating: 4.95,
    bio: 'Board-certified cardiologist specializing in preventive cardiology, hypertension, and advanced echocardiography.',
  });

  const doctor2 = await Doctor.create({
    userId: doctor2User._id,
    name: 'Dr. Marcus Chen',
    email: doctor2User.email,
    specialization: 'Dermatology',
    experience: 9,
    qualification: 'MD, FAAD - Johns Hopkins University',
    consultationFee: 95,
    availableTimings: [
      { day: 'Monday', startTime: '10:00', endTime: '17:00', slotDurationMinutes: 30 },
      { day: 'Wednesday', startTime: '10:00', endTime: '17:00', slotDurationMinutes: 30 },
      { day: 'Friday', startTime: '10:00', endTime: '17:00', slotDurationMinutes: 30 },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30 },
    ],
    contactInformation: {
      phone: '+1 (555) 201-3002',
      email: 'dr.marcus@carepulse.com',
      roomNumber: 'Derma Suite 204',
    },
    isAvailable: true,
    rating: 4.88,
    bio: 'Clinical & cosmetic dermatology expert focusing on complex dermatological disorders and laser surgery.',
  });

  const doctor3 = await Doctor.create({
    userId: doctor3User._id,
    name: 'Dr. Elena Rostova',
    email: doctor3User.email,
    specialization: 'Pediatrics',
    experience: 14,
    qualification: 'MD, FAAP - Stanford University',
    consultationFee: 85,
    availableTimings: [
      { day: 'Tuesday', startTime: '08:30', endTime: '16:30', slotDurationMinutes: 30 },
      { day: 'Wednesday', startTime: '08:30', endTime: '16:30', slotDurationMinutes: 30 },
      { day: 'Thursday', startTime: '08:30', endTime: '16:30', slotDurationMinutes: 30 },
      { day: 'Friday', startTime: '08:30', endTime: '15:00', slotDurationMinutes: 30 },
    ],
    contactInformation: {
      phone: '+1 (555) 201-3003',
      email: 'dr.elena@carepulse.com',
      roomNumber: 'Pediatric Wing 110',
    },
    isAvailable: true,
    rating: 4.98,
    bio: 'Dedicated pediatrician with special focus on developmental health, adolescent medicine, and child immunizations.',
  });

  // 4. Create Patients
  const patient1 = await Patient.create({
    userId: patient1User._id,
    fullName: 'Eleanor Sterling',
    age: 34,
    gender: 'Female',
    phoneNumber: '+1 (555) 401-5001',
    email: 'patient@carepulse.com',
    address: '42 Maplecrest Avenue, Metro City, NY 10001',
    bloodGroup: 'O+',
    emergencyContact: 'Robert Sterling (Spouse) - +1 (555) 401-5009',
    medicalHistory: ['Mild Asthma', 'Seasonal Pollen Allergies'],
    allergies: ['Penicillin', 'Dust Mites'],
    currentMedications: ['Albuterol Inhaler PRN', 'Cetirizine 10mg'],
    registrationDate: new Date('2026-01-15'),
  });

  const patient2 = await Patient.create({
    userId: patient2User._id,
    fullName: 'David Miller',
    age: 48,
    gender: 'Male',
    phoneNumber: '+1 (555) 401-5002',
    email: 'david.miller@example.com',
    address: '88 Oakridge Blvd, Riverdale, NY 10025',
    bloodGroup: 'A+',
    emergencyContact: 'Claire Miller (Daughter) - +1 (555) 401-5020',
    medicalHistory: ['Primary Hypertension', 'Hyperlipidemia'],
    allergies: ['None known'],
    currentMedications: ['Lisinopril 10mg', 'Atorvastatin 20mg'],
    registrationDate: new Date('2026-02-10'),
  });

  const patient3 = await Patient.create({
    fullName: 'Sophia Martinez',
    age: 8,
    gender: 'Female',
    phoneNumber: '+1 (555) 401-5003',
    email: 'martinez.family@example.com',
    address: '15 Pinewood Court, Queens, NY 11375',
    bloodGroup: 'B+',
    emergencyContact: 'Maria Martinez (Mother) - +1 (555) 401-5033',
    medicalHistory: ['Mild Eczema'],
    allergies: ['Peanuts'],
    currentMedications: ['Hydrocortisone 1% cream'],
    registrationDate: new Date('2026-03-01'),
  });

  const patient4 = await Patient.create({
    fullName: 'James Wilson',
    age: 62,
    gender: 'Male',
    phoneNumber: '+1 (555) 401-5004',
    email: 'james.wilson.62@example.com',
    address: '772 Horizon Lane, Brooklyn, NY 11201',
    bloodGroup: 'AB+',
    emergencyContact: 'Martha Wilson (Wife) - +1 (555) 401-5044',
    medicalHistory: ['Type 2 Diabetes', 'Coronary Artery Disease'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Metformin 500mg', 'Aspirin 81mg'],
    registrationDate: new Date('2026-03-12'),
  });

  // 5. Create Realistic Appointments
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const appt1 = await Appointment.create({
    patientId: patient1._id,
    doctorId: doctor1._id,
    patientName: patient1.fullName,
    doctorName: doctor1.name,
    department: 'Cardiology',
    appointmentDate: today,
    timeSlot: '09:30 AM',
    status: 'Confirmed',
    type: 'In-Person',
    reason: 'Routine cardiovascular checkup & blood pressure review',
    symptoms: 'Occasional mild palpitations after exercise',
    fee: doctor1.consultationFee,
    paymentStatus: 'Paid',
  });

  const appt2 = await Appointment.create({
    patientId: patient2._id,
    doctorId: doctor1._id,
    patientName: patient2.fullName,
    doctorName: doctor1.name,
    department: 'Cardiology',
    appointmentDate: today,
    timeSlot: '11:00 AM',
    status: 'Pending',
    type: 'In-Person',
    reason: 'Hypertension follow-up and lipid panel discussion',
    symptoms: 'Fatigue and mild headaches in the morning',
    fee: doctor1.consultationFee,
    paymentStatus: 'Pending',
  });

  const appt3 = await Appointment.create({
    patientId: patient3._id,
    doctorId: doctor3._id,
    patientName: patient3.fullName,
    doctorName: doctor3.name,
    department: 'Pediatrics',
    appointmentDate: tomorrow,
    timeSlot: '10:00 AM',
    status: 'Confirmed',
    type: 'In-Person',
    reason: 'Annual pediatric developmental wellness visit & vaccinations',
    symptoms: 'None, regular checkup',
    fee: doctor3.consultationFee,
    paymentStatus: 'Paid',
  });

  const appt4 = await Appointment.create({
    patientId: patient1._id,
    doctorId: doctor2._id,
    patientName: patient1.fullName,
    doctorName: doctor2.name,
    department: 'Dermatology',
    appointmentDate: yesterday,
    timeSlot: '02:00 PM',
    status: 'Completed',
    type: 'In-Person',
    reason: 'Skin rash inspection on forearm',
    symptoms: 'Red itchy patch persisting for 10 days',
    consultationNotes: 'Examination revealed localized contact dermatitis. Recommended topical corticosteroid.',
    prescription: 'Triamcinolone Acetonide 0.1% cream twice daily for 7 days',
    fee: doctor2.consultationFee,
    paymentStatus: 'Paid',
  });

  // 6. Create Medical Records
  await MedicalRecord.create({
    patientId: patient1._id,
    doctorId: doctor2._id,
    appointmentId: appt4._id,
    patientName: patient1.fullName,
    doctorName: doctor2.name,
    diagnosis: 'Acute Contact Dermatitis',
    treatmentPlan: 'Apply topical corticosteroid twice daily. Avoid scented detergents and synthetic fabrics.',
    prescriptions: [
      {
        medication: 'Triamcinolone Acetonide 0.1%',
        dosage: 'Thin layer',
        frequency: 'Twice daily',
        duration: '7 days',
        instructions: 'Apply gently to affected area after washing.',
      },
    ],
    labTests: [
      {
        testName: 'Skin Patch Allergy Test',
        status: 'Completed',
        notes: 'Mild reaction to nickel sulfate.',
      },
    ],
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: '70 bpm',
      temperature: '98.4 °F',
      weight: '62 kg',
    },
    notes: 'Patient advised to follow up if rash does not subside within 10 days.',
    date: new Date(Date.now() - 86400000),
  });

  // 7. Create Clinic Settings
  await ClinicSettings.create({
    clinicName: 'CarePulse Medical & Specialty Clinic',
    tagline: 'Precision Care, Modern Telehealth & Patient-First Medicine',
    contactEmail: 'contact@carepulse-medical.com',
    contactPhone: '+1 (555) 234-5678',
    emergencyPhone: '+1 (555) 911-HELP',
    address: '742 Evergreen Healthcare Blvd, Suite 400, Metro City, NY 10016',
    workingHours: {
      weekdays: '08:00 AM - 08:00 PM',
      weekends: '09:00 AM - 04:00 PM',
    },
    defaultSlotDurationMinutes: 30,
  });

  console.log('✅ Clinic Appointment System successfully seeded with demo accounts:');
  console.log('   👑 Admin: admin@carepulse.com / admin123');
  console.log('   🩺 Doctors: dr.sarah@carepulse.com, dr.marcus@carepulse.com, dr.elena@carepulse.com / doctor123');
  console.log('   👤 Patient: patient@carepulse.com / patient123');

  return {
    adminUser,
    doctor1User,
    patient1User,
    doctorsCount: 3,
    patientsCount: 4,
    appointmentsCount: 4,
  };
}
