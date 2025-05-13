import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { userModel } from '@/lib/db/models/user';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  console.log("hii");
  const { userId, otp } = await req.json();

  await mongoose.connect(process.env.DATABASE_URL!);
  const user = await userModel.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: 'User not found' });

  const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SID!)
    .verificationChecks
    .create({ to: user.phoneNumber, code: otp });

  if (verification.status === 'approved') {
    user.isVerified = true;
    await user.save();
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, message: 'OTP verification failed' });
  }
}
