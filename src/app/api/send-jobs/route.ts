import { NextResponse } from "next/server";
import { userModel } from "@/lib/db/models/user";
import { scrapeJobs } from "@/lib/scraper";
import twilio from "twilio";
import dbConnect from "@/lib/db/dbConnect";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST() {
  try {
    await dbConnect();

    // 1. Get today's date range (start to end of day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 2. Find the user created today
    const user = await userModel.findOne({
      created_at: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ created_at: -1 }); // latest one today

    if (!user) {
      return NextResponse.json({ error: "No user found for today" }, { status: 404 });
    }

    const category = user.categories?.[0];
    const phoneNumber = user.phoneNumber;

    if (!category || !["frontend", "backend"].includes(category)) {
      return NextResponse.json({ error: "Invalid or missing category" }, { status: 400 });
    }

    // 3. Scrape jobs
    const jobs = await scrapeJobs(category as "frontend" | "backend");
    const top10 = jobs.slice(0, 10);

    // 4. Format message
    const jobList = top10.map((job, idx) => (
      `*${idx + 1}. ${job.title}*\n${job.company} - ${job.location}\n${job.link}`
    )).join("\n\n");

    const message = `👋 Hi ${user.name},\nHere are *${category}* jobs just for you:\n\n${jobList}`;

    // 5. Send WhatsApp message
    await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Twilio sandbox
      to: `whatsapp:${phoneNumber}`,
    });

    return NextResponse.json({ success: true, message: "Jobs sent via WhatsApp" });

  } catch (err: any) {
    console.error("Send Jobs Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

