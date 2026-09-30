import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { Patient } from '@/models/Patient';
import { Doctor } from '@/models/Doctor';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ $or: [{ userId: user._id }, { email: user.email }] });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
