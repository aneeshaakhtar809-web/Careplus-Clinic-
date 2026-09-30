
---

# Core Product Modules

Build these complete working modules:

## 1. Authentication System

Roles:

### Admin
- Manage doctors
- Manage patients
- Manage appointments
- View analytics
- Manage clinic settings

### Doctor
- View appointments
- Update appointment status
- View patient history
- Add medical notes

### Patient
- Register account
- Book appointments
- View appointment history
- View medical records

---

# 2. Patient Management

Features:

- Add patient
- Edit patient information
- Delete patient
- Search patients
- View patient profile

Patient data:

- Full name
- Age
- Gender
- Phone number
- Email
- Address
- Medical history
- Registration date

---

# 3. Doctor Management

Features:

- Add doctors
- Manage specialization
- Set availability
- View doctor schedules

Doctor data:

- Name
- Specialization
- Experience
- Available timings
- Contact information

---

# 4. Appointment System

Create a realistic appointment workflow:

Patient books appointment

↓

Doctor availability check

↓

Appointment confirmation

↓

Doctor consultation

↓

Medical record update


Appointment status:

- Pending
- Confirmed
- Completed
- Cancelled

Include:

- Calendar view
- Date filtering
- Doctor filtering
- Patient search

---

# 5. Dashboard

Create a professional healthcare dashboard.

Dashboard cards:

- Total Patients
- Today's Appointments
- Available Doctors
- Completed Visits
- Monthly Revenue

Charts:

- Appointment statistics
- Patient growth
- Doctor performance

---

# UI/UX Requirements

Design should feel like a premium healthcare SaaS product.

Style:

- Clean
- Modern
- Simple
- Professional
- Friendly

Color system:

Primary:
- Soft Blue
- Medical Teal

Secondary:
- White
- Light Gray
- Green success colors

Avoid:

- Dark complicated themes
- Excessive animations
- Cluttered layouts

---

# Coding Rules

- Use reusable components
- Keep components modular
- Write clean JavaScript
- Add proper error handling
- Add loading states
- Add empty states
- Validate all forms
- Use meaningful variable names
- Keep database logic separate
- Follow production-level practices

---

# Final Goal

The final application should behave like a real clinic appointment SaaS product where:

Admin manages the clinic.

Doctors manage consultations.

Patients book appointments.

MongoDB stores real data.

Dashboard provides real insights.

The application should be fully functional, responsive, scalable, and ready for future expansion.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
