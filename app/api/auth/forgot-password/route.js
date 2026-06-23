import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address. Please sign up first.' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const result = await sendPasswordResetEmail(user.email, resetLink);

    if (!result.success) {
      if (result.isTestModeRestricted) {
        return NextResponse.json({
          message: 'Email delivery is restricted in test mode. Use the link below to reset your password.',
          devLink: resetLink,
        });
      }
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      return NextResponse.json({ error: 'Failed to send email. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Password reset link has been sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
