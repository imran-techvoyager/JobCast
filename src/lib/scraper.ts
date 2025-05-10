import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const urls: Record<string, string> = {
  frontend: "https://www.naukri.com/frontend-development-jobs?k=frontend%20development&experience=0",
  backend: "https://www.naukri.com/back-end-developer-jobs?k=back%20end%20developer&experience=0",
};

export type Job = {
  title: string;
  company: string;
  location: string;
  link: string;
};

export const scrapeJobs = async (category: "frontend" | "backend"): Promise<Job[]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(urls[category], { waitUntil: "networkidle2" });

  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll(".srp-jobtuple-wrapper");
    const data: any[] = [];

    jobCards.forEach((card) => {
      const title = card.querySelector("a.title")?.textContent?.trim() || "";
      const link = card.querySelector("a.title")?.getAttribute("href") || "";
      const company = card.querySelector(".comp-name")?.textContent?.trim() || "";
      const location = card.querySelector(".locWdth")?.textContent?.trim() || "";

      if (title && link) {
        data.push({ title, company, location, link });
      }
    });

    return data;
  });

  await browser.close();
  return jobs;
};