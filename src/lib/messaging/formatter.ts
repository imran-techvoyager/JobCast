import { Job } from '@/types/job';

export class MessageFormatter {
  static createMessage(name: string, category: string, jobs: Job[]): string {
    let message = `👋 Hi ${name},\nHere are *${category.toUpperCase()}* jobs for you:\n\n`;
    let jobCount = 0;

    for (const job of jobs) {
      const jobText = `*${jobCount + 1}. ${job.title.trim()}*\n` +
                      `🏢 ${job.company}\n📍 ${job.location}\n🔗 ${job.link}\n\n`;

      // Predict next message length with job and footer
      const projectedLength = message.length + jobText.length + "Powered by JobCast".length;

      if (projectedLength > 1600) break; // Stop if it will exceed limit

      message += jobText;
      jobCount++;
    }

    message += `Powered by JobCast`;

    return message;
  }
}
