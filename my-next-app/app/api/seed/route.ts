import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Seeding is disabled in production environments for security reasons.' },
        { status: 403 }
      );
    }

    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with realistic healthcare data',
      credentials: {
        admin: { email: 'admin@carepulse.com', password: 'admin123', role: 'admin' },
        doctor: { email: 'dr.sarah@carepulse.com', password: 'doctor123', role: 'doctor' },
        patient: { email: 'patient@carepulse.com', password: 'patient123', role: 'patient' },
      },
      stats: {
        doctorsCount: result.doctorsCount,
        patientsCount: result.patientsCount,
        appointmentsCount: result.appointmentsCount,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Seed API error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to seed database. Ensure MongoDB is accessible.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
