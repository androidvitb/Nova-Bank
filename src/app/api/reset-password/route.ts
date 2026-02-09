import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

interface ResetPasswordBody {
  token?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { token, password } = (await req.json()) as ResetPasswordBody;

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
