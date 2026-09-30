import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Patient } from '@/models/Patient';
import { Doctor } from '@/models/Doctor';
import { Appointment } from '@/models/Appointment';
import { MedicalRecord } from '@/models/MedicalRecord';

export async function GET() {
  try {
    await connectToDatabase();

    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      todayAppointments,
      pendingAppointments,
      availableDoctors,
      completedVisits,
      recentAppointments,
      doctorsList,
      recentRecords,
    ] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments({ appointmentDate: todayStr }),
      Appointment.countDocuments({ status: 'Pending' }),
      Doctor.countDocuments({ isAvailable: true }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.find().sort({ createdAt: -1 }).limit(6).lean(),
      Doctor.find().sort({ rating: -1 }).limit(5).lean(),
      MedicalRecord.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Calculate revenue
    const paidAppointments = await Appointment.find({ paymentStatus: 'Paid' }).select('fee').lean();
    const monthlyRevenue = paidAppointments.reduce((acc, curr) => acc + (curr.fee || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalPatients,
        todayAppointments,
        pendingAppointments,
        availableDoctors,
        completedVisits,
        monthlyRevenue,
      },
      recentAppointments,
      doctorsList,
      recentRecords,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Dashboard stats error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
