import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Appointment } from '@/models/Appointment';
import { MedicalRecord } from '@/models/MedicalRecord';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const { status, consultationNotes, prescription, paymentStatus, diagnosis, treatmentPlan } = body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (status) appointment.status = status;
    if (consultationNotes !== undefined) appointment.consultationNotes = consultationNotes;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    // If status is updated to 'Completed' and clinical diagnosis is provided, auto-create a MedicalRecord!
    if (status === 'Completed' && (diagnosis || consultationNotes)) {
      await MedicalRecord.create({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentId: appointment._id,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        diagnosis: diagnosis || 'General Health Consultation',
        treatmentPlan: treatmentPlan || consultationNotes || 'Follow-up as needed',
        notes: consultationNotes || '',
        prescriptions: prescription
          ? [{ medication: prescription, dosage: 'As directed', frequency: 'Daily', duration: '7 days' }]
          : [],
        date: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Appointment updated to "${appointment.status}"`,
      appointment,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
