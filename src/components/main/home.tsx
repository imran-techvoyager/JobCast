"use client";

import { useState } from "react";
import {
  MessageSquare,
  Briefcase,
  Search,
  UserCheck,
  Zap,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  BarChart,
  Target,
  Globe,
  Clock,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    value: "98%",
    label: "Message Open Rate",
    icon: MessageSquare,
  },
  {
    value: "24/7",
    label: "Real-time Alerts",
    icon: Clock,
  },
  {
    value: "100K+",
    label: "Active Users",
    icon: UserCheck,
  },
  {
    value: "1000+",
    label: "Companies",
    icon: Briefcase,
  },
];

const features = [
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Access job opportunities from companies worldwide through WhatsApp.",
  },
  {
    icon: Target,
    title: "Smart Matching",
    description:
      "AI-powered job matching ensures you only see relevant opportunities.",
  },
  {
    icon: BarChart,
    title: "Real-time Analytics",
    description:
      "Track your application status and get insights into your job search.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: CheckCircle,
    title: "Easy Apply",
    description: "One-click applications directly through WhatsApp messages.",
  },
  {
    icon: Sparkles,
    title: "Premium Features",
    description:
      "Access advanced features like resume review and interview preparation.",
  },
];

const problems = [
  {
    icon: Search,
    title: "Job Seekers Struggle",
    points: [
      "Traditional job portals require active searching",
      "Notifications via email often go unnoticed",
      "WhatsApp groups are unstructured",
    ],
  },
  {
    icon: Briefcase,
    title: "Employer Challenges",
    points: [
      "Low visibility on large platforms",
      "Slow hiring process",
      "Scattered resumes across channels",
    ],
  },
  {
    icon: Target,
    title: "Lack of Personalization",
    points: [
      "Generic job alerts",
      "Irrelevant job postings",
      "Poor matching algorithms",
    ],
  },
];

const solutions = [
  {
    icon: MessageSquare,
    title: "Smart Alerts",
    description:
      "Receive personalized job notifications based on your preferences directly on WhatsApp",
  },
  {
    icon: Target,
    title: "AI Matching",
    description:
      "Advanced algorithms ensure perfect matches between candidates and opportunities",
  },
  {
    icon: Zap,
    title: "Easy Apply",
    description: "One-click application process directly through WhatsApp",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description:
      "Stay informed about your application status with instant notifications",
  },
];

export const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <nav className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-primary cursor-pointer" />
            <Link
              href="/"
              className="font-outfit font-bold text-xl cursor-pointer"
            >
              JobCast
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#problems"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Problems
            </Link>
            <Link
              href="#solution"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Solution
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200">
            <div className="container px-4 py-4 flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#problems"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Problems
              </Link>
              <Link
                href="#solution"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Solution
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-outfit font-bold mb-8 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
            Transform Your Job Search with JobCast
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Looking for jobs in a specific field? Choose your preferred job category, verify your WhatsApp number, and start receiving handpicked job opportunities directly on WhatsApp!! no app downloads, no noise, just what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href={"/register"}>
              <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Wave */}
        <div className="wave-divider">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

     <section
        id="problems"
        className="relative py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-white"
      >
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white mb-4">
              <Target className="w-4 h-4 mr-2" />
              Key Challenges
            </span>
            <h2 className="font-outfit text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              The Problems We Solve
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Job seekers and employers face significant challenges in
              today&apos;s hiring landscape
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <div
                key={problem.title}
                className="group p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <problem.icon className="w-12 h-12 text-white/90 mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-outfit text-2xl font-semibold mb-4">
                  {problem.title}
                </h3>
                <ul className="space-y-3">
                  {problem.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start text-white/80 group-hover:text-white transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="wave-divider white">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      <section id="solution" className="relative py-16 md:py-24 bg-white">
        <div className="container px-4">
          <div
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              The Solution
            </span>
            <h2 className="font-outfit text-3xl md:text-5xl font-bold text-gradient">
              Our Revolutionary Approach
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A WhatsApp-based Job Notifier that transforms how you find
              opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={solution.title}
                className="group p-8 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border border-secondary/20 hover:shadow-lg transition-all duration-300"
              >
                <solution.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-outfit text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative py-16 md:py-24 bg-secondary/20"
      >
        <div
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-outfit text-3xl md:text-4xl font-bold">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need for a seamless job search experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-outfit text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} JobCast. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
