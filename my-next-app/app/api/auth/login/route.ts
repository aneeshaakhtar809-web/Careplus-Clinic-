import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Patient } from '@/models/Patient';
import { Doctor } from '@/models/Doctor';
import { comparePassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { AUTH_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password, requestedRole } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user with password field explicitly included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'This account has been deactivated. Please contact clinic administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password || '');
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Optional role validation if client requested specific portal (e.g. Doctor Portal)
    if (requestedRole && user.role !== requestedRole) {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied. This account has role "${user.role}", but "${requestedRole}" was requested.`,
        },
        { status: 403 }
      );
    }

    // Fetch linked profile for convenience
    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
    }

    // Sign JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: userObj,
        profile,
        token,
      },
      { status: 200 }
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
    console.error('Login API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error during login' },
      { status: 500 }
    );
  }
}
