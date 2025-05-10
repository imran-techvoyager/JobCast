import { NextResponse, NextRequest } from "next/server";
import { userModel, UserDocument } from "@/lib/db/models/user"; 
import { scrapeJobs } from "@/lib/scraper";
import twilio from "twilio";
import dbConnect from "@/lib/db/dbConnect";
import { JobMessageFormatter } from "@/lib/message-formater";
import { validateRequest } from "@/lib/validator";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Validate request format
    const validation = await validateRequest(req);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { userId } = await req.json();

    // Validate user exists and is verified with proper typing
    const user = await userModel.findById<UserDocument>(userId).lean();
    if (!user) return notFoundResponse();
    if (!user.isVerified) return unauthorizedResponse();

    // Validate user category
    if (!["frontend", "backend"].includes(user.category)) {
      return NextResponse.json(
        { error: "Invalid user category" },
        { status: 400 }
      );
    }


    // Scrape jobs with error handling
    const jobs = await scrapeJobs(user.category as "frontend" | "backend");
    const top10 = jobs.slice(0, 10);

    if (top10.length === 0) {
      return NextResponse.json(
        { error: "No recent jobs found in this category" },
        { status: 404 }
      );
    }

    // Format and validate message
    const message = JobMessageFormatter.format(
      user.name,
      user.category,
      top10
    );

    if (message.length > 4096) {
      return NextResponse.json(
        { error: "Job list too large to send via WhatsApp" },
        { status: 413 }
      );
    }

    // Send WhatsApp message
    const whatsappResponse = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${user.phoneNumber}`,
    });

    // Update user with send status
    await userModel.findByIdAndUpdate(userId, {
      $set: {
        lastJobSend: new Date(),
        jobsSent: top10.length
      }
    });

    return NextResponse.json({
      success: true,
      message: "Jobs sent successfully",
      jobsCount: top10.length,
      messageSid: whatsappResponse.sid
    });

  } catch (err: any) {
    console.error("Send Jobs Error:", err);
    return NextResponse.json(
      { 
        error: err.message.includes('ECONNREFUSED')
          ? "Service temporarily unavailable"
          : "Failed to send jobs"
      },
      { status: 500 }
    );
  }
}

// Helper functions
const notFoundResponse = () => 
  NextResponse.json({ error: "User not found" }, { status: 404 });

const unauthorizedResponse = () =>
  NextResponse.json({ error: "User not verified" }, { status: 401 });
