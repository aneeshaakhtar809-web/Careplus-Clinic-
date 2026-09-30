import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Doctor } from '@/models/Doctor';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth/password';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const specialization = searchParams.get('specialization');
    const available = searchParams.get('available');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};

    if (specialization && specialization !== 'All') {
      filter.specialization = specialization;
    }
    if (available === 'true') {
      filter.isAvailable = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(filter).sort({ name: 1 }).lean();

    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      name,
      email,
      password = 'doctor123',
      specialization,
      experience,
      qualification,
      consultationFee = 60,
      phone = '',
      roomNumber = 'Suite 101',
    } = body;

    if (!name || !email || !specialization || !qualification) {
      return NextResponse.json(
        { success: false, error: 'Name, email, specialization, and qualification are required' },
        { status: 400 }
      );
    }

    // Check existing
    const existingDoc = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (existingDoc) {
      return NextResponse.json(
        { success: false, error: 'A doctor with this email is already registered' },
        { status: 409 }
      );
    }

    // Create User account for doctor
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'doctor',
      phone: phone.trim(),
      isActive: true,
    });

    const doctor = await Doctor.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      specialization: specialization.trim(),
      experience: experience ? Number(experience) : 5,
      qualification: qualification.trim(),
      consultationFee: Number(consultationFee),
      contactInformation: {
        phone: phone.trim() || '+1 (555) 201-0000',
        email: user.email,
        roomNumber: roomNumber.trim() || 'Consultation Suite 101',
      },
      isAvailable: true,
      rating: 4.9,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor added to clinic roster successfully',
        doctor,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to add doctor' },
      { status: 500 }
    );
  }
}
