import { NextResponse } from 'next/server';
import { userModel } from '@/lib/db/models/user';
import { scrapeJobs } from '@/lib/scraper/scrape';
import { MessageFormatter } from '@/lib/messaging/formatter';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  try {
    console.log("hii");
    const { userId } = await req.json();

    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: 'User not verified' }, { status: 401 });
    }

    const jobs = await scrapeJobs(user.category as 'frontend' | 'backend');

    if (jobs.length === 0) {
      return NextResponse.json({ 
        error: 'Temporarily unavailable - Please try again later' 
      }, { status: 404 });
    }

    const message = MessageFormatter.createMessage(user.name, user.category, jobs);

    const msgResponse = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${user.phoneNumber}`
    });

    console.log('Twilio response:', msgResponse.sid);

    await userModel.findByIdAndUpdate(userId, {
      lastJobSend: new Date(),
      jobsSent: jobs.length
    });

    return NextResponse.json({ success: true, jobsSent: jobs.length });

  } catch (error: any) {
    console.error('Job send error:', error);
    return NextResponse.json({ 
      error: error.message?.includes('ECONNREFUSED') 
        ? 'Service temporarily unavailable' 
        : 'Failed to process your request' 
    }, { status: 500 });
  }
}