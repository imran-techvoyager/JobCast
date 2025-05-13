import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { userModel } from '@/lib/db/models/user';
import twilio from 'twilio';
import { validatePhoneNumber } from '@/lib/validator';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  try {
    // Validate request format
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { success: false, message: 'Invalid content type' },
        { status: 400 }
      );
    }

    await mongoose.connect(process.env.DATABASE_URL!);
    const { name, phoneNumber, category } = await req.json();

    // Validate input data
    if (!name || !phoneNumber || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await userModel.findOne({ phoneNumber });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingUser.isVerified 
            ? 'Phone number already registered' 
            : 'Verification already in progress'
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await userModel.create({ 
      name: name.trim(),
      phoneNumber,
      category,
      isVerified: false
    });

    // Send OTP via Twilio
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications
      .create({ 
        to: phoneNumber, 
        channel: 'sms',
        locale: 'en'
      });

    if (verification.status !== 'pending') {
      throw new Error('Failed to initiate OTP verification');
    }

    return NextResponse.json({
      success: true,
      userId: user._id,
      message: 'OTP sent successfully',
      verificationSid: verification.sid
    });

  } catch (err: any) {
    console.error('Registration Error:', err);
    return NextResponse.json(
      { 
        success: false, 
        message: err.message.includes('duplicate')
          ? 'Phone number already registered'
          : 'Registration failed'
      },
      { status: 500 }
    );
  }
}
