# 🏥 CarePulse — Clinic Appointment & Healthcare SaaS

**CarePulse** is an enterprise-grade Clinic Appointment Management & Practice SaaS suite. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **MongoDB/Mongoose**, it provides a complete healthcare solution for clinic administrators, specialist doctors, and patients.

---

## 🌟 Key Product Features

### 🔐 1. Multi-Role Authentication & Access Control
- **Admin**: Complete clinic oversight, doctor roster management, patient directory, financial analytics, and clinic configuration.
- **Doctor**: Personalized consultation queue, appointment status management, patient history review, and electronic prescription issuing.
- **Patient**: Self-registration, specialist directory lookup, appointment booking, and access to medical records.

### 👥 2. Patient Management Module
- Full patient directory with search by name, email, phone, or address.
- Comprehensive patient profile: demographics, age, gender, blood group, emergency contact, allergies, and past medical history.
- Full CRUD operations with modal workflows.

### 🩺 3. Doctor Management & Specialization Roster
- Specialist doctor profiles: specialization, qualifications, years of experience, and room assignments.
- Custom weekly availability schedules and configurable consultation fees.

### 📅 4. 5-Stage Clinical Appointment Workflow
Supports realistic clinical lifecycle operations:
```
Patient Books ➔ Doctor Availability Check ➔ Appointment Confirmation ➔ Consultation Visit ➔ Medical Record Update
```
- Interactive status filter tabs (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`).
- Real-time double-booking prevention based on doctor slot availability.
- Automated EHR record generation upon consultation completion.

### 📋 5. Electronic Health Records (EHR) & Billing
- **EHR**: Detailed records including clinical diagnoses, treatment plans, prescriptions, dosage schedules, and vital signs.
- **Billing Ledger**: Financial summary tracking revenue collected, pending invoices, and average consultation fees.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.3.6 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom Healthcare Soft Blue & Medical Teal design system
- **Database**: MongoDB with Mongoose connection pooling (HMR safe)
- **Authentication**: JWT via secure HTTP-Only cookies & Bcrypt password hashing
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB server or [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI

### 1. Installation

Clone the repository and install dependencies:

```bash
cd my-next-app
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root (or copy `.env.example`):

```env
# Database Connection
MONGODB_URI=mongodb://127.0.0.1:27017/clinic_appointment_db

# Authentication
JWT_SECRET=super_secure_clinic_jwt_secret_key_2026_production_grade_token

# App Branding
NEXT_PUBLIC_APP_NAME="CarePulse Medical Center"
NEXT_PUBLIC_APP_TAGLINE="Intelligent Healthcare & Clinic Appointment Suite"
```

### 3. Database Seeding

To populate your database with demo accounts (Admin, Doctors, Patients, Appointments, and Medical Records), start the dev server and trigger the seed endpoint or click **"Seed Real Demo Data"** on the dashboard:

```bash
# Via API Request
curl -X POST http://localhost:3000/api/seed
```

#### Demo Credentials:
| Role | Email | Password |
|---|---|---|
| 👑 **Admin** | `admin@carepulse.com` | `admin123` |
| 🩺 **Doctor** | `dr.sarah@carepulse.com` | `doctor123` |
| 👤 **Patient** | `patient@carepulse.com` | `patient123` |

### 4. Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Directory Structure

```text
my-next-app/
├── app/
│   ├── api/                # Next.js Serverless Route Handlers
│   │   ├── appointments/   # Appointment CRUD & availability validation
│   │   ├── auth/           # Login, Register, Logout, Me API handlers
│   │   ├── dashboard/      # Live clinical stats & analytics API
│   │   ├── doctors/        # Doctor roster API
│   │   ├── patients/       # Patient directory API
│   │   └── seed/           # Database seeding endpoint
│   ├── appointments/       # Appointments management page
│   ├── billing/            # Payments & financial ledger page
│   ├── doctors/            # Specialist doctors roster page
│   ├── login/              # Multi-role authentication page
│   ├── patients/           # Patient directory page
│   ├── records/            # EHR medical records page
│   ├── register/           # Patient self-registration page
│   ├── settings/           # Clinic operational configuration page
│   ├── globals.css         # Healthcare design system & Tailwind CSS v4
│   ├── layout.tsx          # Root layout with AuthProvider
│   └── page.tsx            # Main Production SaaS Dashboard
├── components/             # Reusable UI Components
│   ├── BookingModal.tsx    # Interactive appointment booking modal
│   ├── Header.tsx          # Top bar with search, role switcher & actions
│   ├── PatientModal.tsx    # Patient registration modal
│   └── Sidebar.tsx         # Dark theme sidebar with workspace switcher
├── context/
│   └── AuthContext.tsx     # Client React Auth Context & hooks
├── lib/
│   ├── auth/               # JWT, password hashing, and session guards
│   └── db/                 # Mongoose connection pool & seeders
├── models/                 # Mongoose Schemas & Data Models
│   ├── Appointment.ts
│   ├── ClinicSettings.ts
│   ├── Doctor.ts
│   ├── MedicalRecord.ts
│   ├── Patient.ts
│   └── User.ts
└── types/                  # TypeScript interface definitions
```

---

## 📄 License

This project is licensed under the MIT License.
