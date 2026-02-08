import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = (await request.json()) as LoginRequestBody;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const cookie = serialize(
      'session',
      JSON.stringify({ email: user.email, role: user.role }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24,
      },
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: { email: user.email, role: user.role },
    });

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error during login', error: message }, { status: 500 });
  }
}
