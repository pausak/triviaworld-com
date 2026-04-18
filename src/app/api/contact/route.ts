import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CATEGORIES = {
  general: "General & support",
  bug: "Bug report",
  privacy: "Privacy / data request",
  feature: "Feature suggestion",
} as const;

type Category = keyof typeof CATEGORIES;

const ratelimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const prior = ratelimit.get(ip) ?? [];
  const recent = prior.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    ratelimit.set(ip, recent);
    return true;
  }
  recent.push(now);
  ratelimit.set(ip, recent);
  return false;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, category, message, website } = body as {
    name?: unknown;
    email?: unknown;
    category?: unknown;
    message?: unknown;
    website?: unknown;
  };

  // Honeypot: real users can't see this field. If it's filled, silently accept.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof category !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || trimmedName.length > 100) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 200) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (!(category in CATEGORIES)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters" },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    console.error("Contact form: missing RESEND_API_KEY or CONTACT_TO_EMAIL env var");
    return NextResponse.json(
      { error: "Email is not configured on the server" },
      { status: 500 }
    );
  }

  const categoryLabel = CATEGORIES[category as Category];
  const subject = `[TriviaWorld / ${categoryLabel}] ${trimmedName}`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px;">
      <h2 style="margin:0 0 16px">New contact form submission</h2>
      <table style="border-collapse:collapse; width:100%;">
        <tr><td style="padding:6px 0; color:#666; width:110px;">Category</td><td style="padding:6px 0;">${escapeHtml(categoryLabel)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Name</td><td style="padding:6px 0;">${escapeHtml(trimmedName)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Email</td><td style="padding:6px 0;">${escapeHtml(trimmedEmail)}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">IP</td><td style="padding:6px 0; font-family:monospace;">${escapeHtml(ip)}</td></tr>
      </table>
      <h3 style="margin:20px 0 8px">Message</h3>
      <div style="white-space:pre-wrap; padding:12px; background:#f6f6f6; border-radius:8px;">${escapeHtml(trimmedMessage)}</div>
    </div>
  `;

  const text = [
    `Category: ${categoryLabel}`,
    `Name: ${trimmedName}`,
    `Email: ${trimmedEmail}`,
    `IP: ${ip}`,
    "",
    trimmedMessage,
  ].join("\n");

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: `TriviaWorld Contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: trimmedEmail,
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failure:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 }
    );
  }
}
