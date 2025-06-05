
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for mock users (for demonstration purposes only, do not use in production)
const mockUsers: { email: string, password?: string, firstName?: string, lastName?: string, id?: string }[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Mock: Email and password are required.' }, { status: 400 });
    }

    // Simulate email already exists
    if (mockUsers.find(user => user.email === email)) {
      return NextResponse.json({ message: 'Mock: Email already exists.' }, { status: 409 });
    }

    const newUserId = `mock-user-${Math.random().toString(36).substr(2, 9)}`;
    mockUsers.push({ id: newUserId, email, firstName, lastName }); // Don't store plaintext passwords even in mocks if sensitive

    return NextResponse.json({
      userId: newUserId,
      email: email,
      message: 'Mock: Registration successful. Please check your email to verify your account.',
    }, { status: 201 });

  } catch (error) {
    console.error('Mock register error:', error);
    return NextResponse.json({ message: 'Mock: An unexpected error occurred during registration.' }, { status: 500 });
  }
}
