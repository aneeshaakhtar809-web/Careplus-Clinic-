import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Appointment } from '@/models/Appointment';
import { Doctor } from '@/models/Doctor';
import { Patient } from '@/models/Patient';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const date = searchParams.get('date');
    const search = searchParams.get('search');

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (doctorId) {
      filter.doctorId = doctorId;
    }
    if (patientId) {
      filter.patientId = patientId;
    }
    if (date) {
      filter.appointmentDate = date;
    }
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { reason: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(filter)
      .sort({ appointmentDate: -1, timeSlot: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      patientId,
      doctorId,
      patientName,
      doctorName,
      department,
      appointmentDate,
      timeSlot,
      reason,
      symptoms = '',
      type = 'In-Person',
      fee,
    } = body;

    if (!patientId || !doctorId || !appointmentDate || !timeSlot || !reason) {
      return NextResponse.json(
        { success: false, error: 'Patient, Doctor, Date, Time Slot, and Reason are required' },
        { status: 400 }
      );
    }

    // Resolve doctor & patient names if missing
    let resolvedPatientName = patientName;
    if (!resolvedPatientName) {
      const p = await Patient.findById(patientId);
      resolvedPatientName = p ? p.fullName : 'Unknown Patient';
    }

    let resolvedDoctorName = doctorName;
    let resolvedDepartment = department;
    let resolvedFee = fee;

    const doc = await Doctor.findById(doctorId);
    if (doc) {
      if (!resolvedDoctorName) resolvedDoctorName = doc.name;
      if (!resolvedDepartment) resolvedDepartment = doc.specialization;
      if (resolvedFee === undefined) resolvedFee = doc.consultationFee;
    }

    // Availability Check: check for existing non-cancelled appointment at exact doctor + date + slot
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Dr. ${resolvedDoctorName} is already booked for ${timeSlot} on ${appointmentDate}. Please choose another time slot.`,
        },
        { status: 409 }
      );
    }

    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      patientName: resolvedPatientName,
      doctorName: resolvedDoctorName || 'Staff Physician',
      department: resolvedDepartment || 'General Medicine',
      appointmentDate,
      timeSlot,
      status: 'Confirmed', // Direct confirmation
      type,
      reason,
      symptoms,
      fee: resolvedFee || 60,
      paymentStatus: 'Pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment successfully booked and confirmed!',
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
