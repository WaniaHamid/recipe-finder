import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export function generateToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Edge Runtime compatible token verification using Web Crypto API
export async function verifyTokenEdge(token) {
  try {
    // Simple base64 decode and check expiry for Edge Runtime
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const payload = JSON.parse(atob(base64));
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Edge token verification failed:', error);
    return null;
  }
}

export async function getAuthUser(request) {
  try {
    // First try to get token from Authorization header (for API calls)
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // If not found in header, try to get from cookies (for server-side)
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    // If still no token, try to get from request cookies directly
    if (!token && request.cookies) {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Get auth user error:', error);
    return null;
  }
}

// Helper function to get user from server components
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}