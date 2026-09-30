import { cookies, headers } from 'next/headers';
import { verifyToken } from './jwt';
import { JWTPayload, UserRole } from '@/types';
import { connectToDatabase } from '@/lib/db/mongodb';
import { User, IUserDocument } from '@/models/User';

export const AUTH_COOKIE_NAME = 'carepulse_auth_token';

/**
 * Extracts JWT payload from either cookie or Authorization header
 */
export async function getSessionPayload(): Promise<JWTPayload | null> {
  try {
    // 1. Check Authorization header
    const reqHeaders = await headers();
    const authHeader = reqHeaders.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (payload) return payload;
    }

    // 2. Check Cookie
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) return payload;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves full User document for the current request
 */
export async function getCurrentUser(): Promise<IUserDocument | null> {
  const payload = await getSessionPayload();
  if (!payload || !payload.userId) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findById(payload.userId);
  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

/**
 * Guard utility for Route Handlers and Server Actions
 */
export async function requireAuth(allowedRoles?: UserRole[]): Promise<{
  user: IUserDocument;
  payload: JWTPayload;
}> {
  const payload = await getSessionPayload();
  if (!payload) {
    throw new Error('Unauthorized: Authentication required');
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
    throw new Error(`Forbidden: Role "${payload.role}" does not have required permissions`);
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: User not found or inactive');
  }

  return { user, payload };
}
