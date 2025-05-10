import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Job } from "@/lib/message-formater";

puppeteer.use(StealthPlugin());

const JOB_PORTALS = {
  frontend: "https://www.naukri.com/frontend-jobs",
  backend: "https://www.naukri.com/backend-jobs",
} as const;

const SCRAPER_CONFIG = {
  timeout: 30000,
  maxJobs: 15, // Scrape extra in case some fail validation
  navigation: {
    waitUntil: "networkidle2" as const,
    viewport: { width: 1280, height: 800 }
  },
  selectors: {
    container: ".srp-jobtuple-wrapper, .jobTuple",
    title: ["a.title:not([data-ga-clicked])", ".job-title"],
    company: [".comp-name", ".company-name"],
    location: [".locWdth", ".location"],
    link: ["a.title[href]", ".job-link"],
  },
  defaults: {
    company: "Company Not Specified",
    location: "Remote",
    link: "#"
  }
};

export const scrapeJobs = async (
  category: keyof typeof JOB_PORTALS
): Promise<Job[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport(SCRAPER_CONFIG.navigation.viewport);
    
    await page.goto(JOB_PORTALS[category], {
      timeout: SCRAPER_CONFIG.timeout,
      waitUntil: SCRAPER_CONFIG.navigation.waitUntil,
    });

    const rawJobs = await page.evaluate((config) => {
      const containers = Array.from(
        document.querySelectorAll(config.selectors.container)
      );

      return containers.map(container => {
        const getText = (selector: string) => 
          container.querySelector(selector)?.textContent?.trim() || "";
          
        const getAttribute = (selector: string, attr: string) =>
          container.querySelector(selector)?.getAttribute(attr) || "";

        return {
          title: config.selectors.title.map(getText).find(Boolean) || "",
          company: config.selectors.company.map(getText).find(Boolean) 
            || config.defaults.company,
          location: config.selectors.location.map(getText).find(Boolean) 
            || config.defaults.location,
          link: config.selectors.link.map(s => getAttribute(s, 'href')).find(Boolean) 
            || config.defaults.link
        };
      });
    }, SCRAPER_CONFIG);

    // Filter and validate jobs
    const validJobs = rawJobs
      .filter(job => job.title && job.link !== "#")
      .slice(0, SCRAPER_CONFIG.maxJobs);

    // Deduplicate by job link
    const uniqueJobs = Array.from(new Map(
      validJobs.map(job => [job.link, job])
    ).values());

    return uniqueJobs.slice(0, 10);

  } catch (err) {
    console.error("Scraping Error:", err);
    return [];
  } finally {
    await browser.close();
  }
};