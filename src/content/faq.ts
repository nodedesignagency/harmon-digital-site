/**
 * FAQ content.
 *
 * One list, every page. The section appears on the home page and on pricing
 * and reads this object in both, so the answers cannot say one thing in one
 * place and something else in another — editing them here changes them
 * everywhere the section is used.
 */

import { ctaHref } from "@/config/site.config";
/**
 * FAQ — "Answers to Your Questions".
 *
 * The client's current FAQ (cost, timing, risk, fit, hiring a developer),
 * tightened, plus three the brief raises: working across a portfolio, what
 * Unstack is, and training.
 */
export const faqContent = {
  headingLines: ["Answers to Your", "Questions"],
  subheading:
    "Straight answers to what operating partners and portco leaders ask before we talk.",
  items: [
    {
      question: "Why not just hire a developer?",
      answer:
        "You can. But a good full-time developer costs $80–150K a year, takes months to find and still needs managing. We build what you need and you’re live in weeks, not quarters — with ongoing support if you want it.",
    },
    {
      question: "How long until we see results?",
      answer:
        "Most clients are live in 4–8 weeks, and some automations take days. You get a clear timeline on the first call, not a vague estimate.",
    },
    {
      question: "Can you work across a whole portfolio?",
      answer:
        "Yes. We audit each portco, roll out what works across the portfolio, and give the fund a dashboard for every company showing exactly where the savings and revenue gains come from.",
    },
    {
      question: "What if it doesn’t work?",
      answer:
        "We build in sprints and show you working software along the way, not a big reveal at the end. If something isn’t right, we fix it before you’ve paid for a finished product.",
    },
    {
      question: "What does it cost?",
      answer:
        "It depends on what you need. You’ll get the number on the first call, not after three meetings — no generic proposals, no surprise invoices.",
    },
    {
      question: "What is Unstack?",
      answer:
        "Our own AI-powered operations platform. It speeds up every build we do, and teams that want to run things themselves can use it directly.",
    },
    {
      question: "Do our teams need to be technical?",
      answer:
        "No. We deploy the systems, train your people on them and on Claude, ChatGPT and Unstack, and stay on to keep improving them.",
    },
    {
      question: "Who is this not for?",
      answer:
        "Businesses without repeatable processes yet — figure out what works before you automate it. If your teams do the same manual work every day and you know there’s a better way, that’s exactly what we fix.",
    },
  ],
  cta: {
    title: "Still have questions?",
    body: "Book a call.",
    href: ctaHref("/contact"),
  },
} as const;
