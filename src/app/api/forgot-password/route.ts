import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/utils/emailService';

interface ForgotPasswordBody {
  email?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = (await req.json()) as ForgotPasswordBody;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (emailSent) {
      return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  } catch (error: unknown) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
