import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/utils/emailService';

interface RegisterBody {
  type?: string;
  email?: string;
  password?: string;
  otp?: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = (await request.json()) as RegisterBody;

    if (data.type === 'send-otp') {
      if (!data.email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
      }

      const otp = generateOTP();
      await OTP.deleteOne({ email: data.email });

      const newOtp = new OTP({
        email: data.email,
        otp,
      });
      await newOtp.save();

      const emailSent = await sendOTPEmail(data.email, otp);
      if (!emailSent) {
        console.error('Failed to send OTP email');
        return NextResponse.json({ message: 'Failed to send OTP email' }, { status: 500 });
      }

      return NextResponse.json({ message: 'OTP sent successfully' });
    }

    const { email, password, otp } = data;
    if (!email || !password || !otp) {
      return NextResponse.json({ message: 'Email, password, and OTP are required' }, { status: 400 });
    }

    const storedOTPData = await OTP.findOne({ email });
    if (!storedOTPData || storedOTPData.otp !== otp) {
      console.error('Invalid or expired OTP');
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    await OTP.deleteOne({ email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Email already registered');
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    const cookie = serialize(
      'session',
      JSON.stringify({ email: newUser.email, role: newUser.role }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24,
      },
    );

    const response = NextResponse.json({
      message: 'Registration successful',
      user: { email: newUser.email, role: newUser.role },
    });
    response.headers.append('Set-Cookie', cookie);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Error during registration', error: message }, { status: 500 });
  }
}
