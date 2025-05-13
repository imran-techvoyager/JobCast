// src/lib/scraper/naukari.ts

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Job } from '@/types/job';

const JOB_PORTALS = {
  frontend: 'https://remoteok.com/remote-dev+frontend-jobs',
  backend: 'https://remoteok.com/remote-dev+backend-jobs'
} as const;

export const scrapeJobs = async (category: keyof typeof JOB_PORTALS): Promise<Job[]> => {
  try {
    const { data } = await axios.get(JOB_PORTALS[category], {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);
    const jobs: Job[] = [];

    $('tr.job').each((_, element) => {
      const title = $(element).find('h2').text().trim();
      const company = $(element).find('.companyLink h3').text().trim();
      const location = $(element).find('.location').text().trim() || 'Remote';
      const link = $(element).attr('data-href');

      if (title && company && link) {
        jobs.push({
          title,
          company,
          location,
          link: `https://remoteok.com${link}`
        });
      }
    });

    console.log(`✅ Scraped ${jobs.length} jobs from RemoteOK for ${category}`);
    return jobs.slice(0, 10); // return top 10
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    return [];
  }
};
