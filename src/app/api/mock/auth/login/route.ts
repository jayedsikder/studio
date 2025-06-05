
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user data (ensure this aligns with any users created by the mock register endpoint if needed for consistency)
const mockUsers = [
  { id: 'mock-user-123', email: 'user@example.com', password: 'password123' }, // Example user
  // You might want to populate this from the mock register's in-memory store in a more complex mock
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Mock: Email and password are required.' }, { status: 400 });
    }

    // Simulate user lookup and password check
    // In a real app, passwords would be hashed and compared securely.
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) { // Simplified password check for mock
      return NextResponse.json({ message: 'Mock: Invalid email or password.' }, { status: 401 });
    }

    // Simulate generating JWTs
    const accessToken = `mock.jwt.access.token.${Math.random().toString(36).substr(2)}`;
    const refreshToken = `mock.jwt.refresh.token.${Math.random().toString(36).substr(2)}`;

    return NextResponse.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      // You could also include some user info if your app expects it
      // userId: user.id, 
      // email: user.email,
    }, { status: 200 });

  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json({ message: 'Mock: An unexpected error occurred during login.' }, { status: 500 });
  }
}
