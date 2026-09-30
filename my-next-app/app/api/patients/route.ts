import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Patient } from '@/models/Patient';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search');
    const gender = searchParams.get('gender');
    const bloodGroup = searchParams.get('bloodGroup');

    const filter: Record<string, unknown> = {};

    if (gender && gender !== 'All') {
      filter.gender = gender;
    }
    if (bloodGroup && bloodGroup !== 'All') {
      filter.bloodGroup = bloodGroup;
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      fullName,
      age,
      gender,
      phoneNumber,
      email,
      address,
      bloodGroup = 'Unknown',
      emergencyContact = '',
      medicalHistory = [],
      allergies = [],
    } = body;

    if (!fullName || !age || !gender || !phoneNumber || !email || !address) {
      return NextResponse.json(
        { success: false, error: 'Full name, age, gender, phone number, email, and address are required' },
        { status: 400 }
      );
    }

    const patient = await Patient.create({
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      phoneNumber: phoneNumber.trim(),
      email: email.toLowerCase().trim(),
      address: address.trim(),
      bloodGroup,
      emergencyContact,
      medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : [medicalHistory].filter(Boolean),
      allergies: Array.isArray(allergies) ? allergies : [allergies].filter(Boolean),
      registrationDate: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Patient registered successfully',
        patient,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to add patient' },
      { status: 500 }
    );
  }
}
