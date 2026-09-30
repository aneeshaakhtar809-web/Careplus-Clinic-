import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Patient } from '@/models/Patient';
import { Appointment } from '@/models/Appointment';
import { MedicalRecord } from '@/models/MedicalRecord';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const patient = await Patient.findById(id).lean();
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    const [appointments, medicalRecords] = await Promise.all([
      Appointment.find({ patientId: id }).sort({ appointmentDate: -1 }).lean(),
      MedicalRecord.find({ patientId: id }).sort({ date: -1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      patient,
      appointments,
      medicalRecords,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch patient profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const patient = await Patient.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient profile updated successfully',
      patient,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update patient profile' },
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

    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patient record deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete patient record' },
      { status: 500 }
    );
  }
}
