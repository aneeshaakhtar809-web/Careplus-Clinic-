import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { Doctor } from '@/models/Doctor';
import { hashPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      name,
      email,
      password,
      role = 'patient',
      phone = '',
      // Patient specific fields
      age,
      gender,
      address,
      bloodGroup,
      emergencyContact,
      medicalHistory = [],
      // Doctor specific fields
      specialization,
      experience,
      qualification,
      consultationFee,
    } = body;

    // 1. Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['admin', 'doctor', 'patient'];
    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { success: false, error: `Invalid role specified: ${role}` },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create User
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: phone.trim(),
      isActive: true,
    });

    let roleProfile = null;

    // 5. Create linked role profile
    if (role === 'patient') {
      roleProfile = await Patient.create({
        userId: newUser._id,
        fullName: name.trim(),
        age: age ? Number(age) : 30,
        gender: gender || 'Other',
        phoneNumber: phone.trim() || 'N/A',
        email: email.toLowerCase().trim(),
        address: address?.trim() || 'Default Address',
        bloodGroup: bloodGroup || 'Unknown',
        emergencyContact: emergencyContact || '',
        medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : [],
        registrationDate: new Date(),
      });
    } else if (role === 'doctor') {
      roleProfile = await Doctor.create({
        userId: newUser._id,
        name: name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
        email: email.toLowerCase().trim(),
        specialization: specialization || 'General Medicine',
        experience: experience ? Number(experience) : 5,
        qualification: qualification || 'MBBS, MD',
        consultationFee: consultationFee ? Number(consultationFee) : 60,
        contactInformation: {
          phone: phone.trim() || '+1 (555) 000-0000',
          email: email.toLowerCase().trim(),
          roomNumber: 'Consultation Suite 101',
        },
        isAvailable: true,
        rating: 4.9,
      });
    }

    // 6. Sign JWT token
    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    // 7. Set HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account successfully registered',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        },
        profile: roleProfile,
        token,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Registration API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
