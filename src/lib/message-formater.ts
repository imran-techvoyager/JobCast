export type Job = {
  title: string;
  company: string;
  location: string;
  link: string;
};

export const JobMessageFormatter = {
  format: (name: string, category: string, jobs: Job[]) => {
    const header = `👋 Hi ${name},\nHere are *${category.toUpperCase()}* jobs for you:\n\n`;
    const jobList = jobs.map((job, index) => 
      `*${index + 1}. ${job.title.trim()}*\n` +
      `🏢 ${job.company}\n` +
      `📍 ${job.location}\n` +
      `🔗 ${job.link}\n`
    ).join('\n');
    
    const footer = `\nPowered by JobAlerts Pro`;
    
    return JobMessageFormatter.truncate(header + jobList + footer, 4096); 
  },

  truncate: (text: string, maxLength: number) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength - 3) + '...' 
      : text;
  },
};