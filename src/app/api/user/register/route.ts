import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { userModel } from '@/lib/db/models/user';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  const { name, phoneNumber, categories } = await req.json();

  await mongoose.connect(process.env.DATABASE_URL!);
  const user = await userModel.create({ name, phoneNumber, categories });

  await client.verify.v2.services(process.env.TWILIO_VERIFY_SID!)
    .verifications
    .create({ to: phoneNumber, channel: 'sms' });

  return NextResponse.json({ success: true, userId: user._id });
}
