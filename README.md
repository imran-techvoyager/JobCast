# JobCast

**JobCast** is a WhatsApp-based job alert bot that delivers personalized job updates directly to users' phones. Built using Node.js, Next.js, MongoDB, and Twilio, it automates job curation and delivery through web scraping and scheduled messaging.

---

## 🚀 Features

- 🔍 **Curated Job Alerts** based on user-selected categories  
- 💬 **WhatsApp Integration** via Twilio API  
- 🕐 **Scheduled Job Delivery** using `node-cron`  
- 🧠 **Smart Filtering** to avoid duplicate or irrelevant job posts  
- 🧾 **Simple Frontend** to display the product overview

---

## 🛠️ Tech Stack

| Layer       | Tech Used               | Purpose                                     |
|-------------|-------------------------|---------------------------------------------|
| Backend     | Node.js, Next.js API    | Handle requests and cron jobs               |
| Frontend    | React, Tailwind CSS     | Product overview landing page               |
| DB          | MongoDB + Mongoose      | Store users and their job preferences       |
| Scheduler   | node-cron               | Schedule job alerts daily                   |
| Messaging   | Twilio (WhatsApp API)   | Send job alerts to users via WhatsApp       |
| Scraping    | Cheerio + Axios         | Extract jobs from Naukri and other sources  |

---
