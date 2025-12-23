"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  QrCode,
  TrendingUp,
  Shield,
  Globe,
  Megaphone,
  Gift,
  Sparkles,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sponsoredAds = [
  {
    title: "Homepage hero slot",
    description: "Premium placement above the fold for your best QR campaign.",
    cta: "Request pricing",
    accent: "High intent",
    tag: "Top banner",
  },
  {
    title: "Checkout takeover",
    description: "Contextual promos at the moment of QR redemption.",
    cta: "Plan experiment",
    accent: "Conversion+",
    tag: "Journey",
  },
  {
    title: "Local discovery rail",
    description: "Show up in city or neighborhood-level carousels.",
    cta: "Talk to sales",
    accent: "Geo‑targeted",
    tag: "Explore",
  },
];

const merchantsData = [
  {
    id: "brewlab",
    name: "BrewLab Coffee",
    category: "Specialty Cafe",
    city: "Berlin",
    highlight: "Loyalty perks on every 5th scan.",
    tone: "Warm & cozy rewards for coffee loyalists.",
    coupons: [
      {
        code: "BREWQR20",
        title: "Morning essentials • 20% off",
        description: "Apply on any handcrafted drink before 11 AM.",
        badge: "Best for regulars",
        expires: "Ends soon",
      },
      {
        code: "BREWFREE",
        title: "Free pastry with 2 coffees",
        description: "Scan in-store and apply at checkout.",
        badge: "In-store exclusive",
        expires: "Weekend only",
      },
    ],
  },
  {
    id: "urbanfit",
    name: "UrbanFit Studio",
    category: "Fitness & Wellness",
    city: "London",
    highlight: "Scan-based passes that convert trial users.",
    tone: "Perfect for fitness creators and studios.",
    coupons: [
      {
        code: "FITPASS7",
        title: "7‑day unlimited pass",
        description: "Access all classes with a single QR.",
        badge: "Top converting",
        expires: "Limited slots",
      },
      {
        code: "FITDUO30",
        title: "Bring a friend • 30% off",
        description: "Applied when two passes are scanned together.",
        badge: "Partner offer",
        expires: "Valid this month",
      },
    ],
  },
  {
    id: "streetbites",
    name: "StreetBites",
    category: "Quick Service Restaurant",
    city: "Singapore",
    highlight: "Serial codes that keep queues moving.",
    tone: "Designed for high-volume counters.",
    coupons: [
      {
        code: "BITES15",
        title: "Combo deals • 15% off",
        description: "Works on QR-based combo menus.",
        badge: "Rush hour",
        expires: "5–7 PM daily",
      },
      {
        code: "QRQUEUE",
        title: "Skip-the-line upgrade",
        description: "Scan to unlock priority pickup.",
        badge: "VIP lane",
        expires: "Selected outlets",
      },
    ],
  },
  {
    id: "glowbar",
    name: "Glow Bar Beauty",
    category: "Salon & Spa",
    city: "Dubai",
    highlight: "Memberships driven by QR-linked referrals.",
    tone: "For beauty chains going phygital.",
    coupons: [
      {
        code: "GLOWFIRST",
        title: "First visit • 30% off",
        description: "Redeemable on any service above $40.",
        badge: "New guests",
        expires: "This quarter",
      },
      {
        code: "GLOWFRIENDS",
        title: "Refer & relax",
        description: "Both get 15% off on the next booking.",
        badge: "Referral booster",
        expires: "No hard expiry",
      },
    ],
  },
  {
    id: "cineplex",
    name: "CinePlex QR",
    category: "Cinema & Events",
    city: "Mumbai",
    highlight: "Serial coupons linked to specific shows.",
    tone: "Ideal for premieres and live events.",
    coupons: [
      {
        code: "SEATUP",
        title: "Seat upgrade on check‑in",
        description: "Scan on arrival to unlock better seats.",
        badge: "Experience",
        expires: "While seats last",
      },
      {
        code: "SNACKQR",
        title: "Snacks combo • 25% off",
        description: "Attach to QR tickets and redeem at the counter.",
        badge: "Upsell",
        expires: "All shows today",
      },
    ],
  },
  {
    id: "freshmart",
    name: "FreshMart Local",
    category: "Grocery & Retail",
    city: "Kuala Lumpur",
    highlight: "Shelf QR tags that rotate seasonal offers.",
    tone: "Perfect for multi-location retail teams.",
    coupons: [
      {
        code: "FRESH20",
        title: "Fresh basket • 20% off",
        description: "Applies on curated fresh produce bundles.",
        badge: "Seasonal",
        expires: "This week only",
      },
      {
        code: "SCANBULK",
        title: "Bulk & save",
        description: "Scan in aisle to unlock volume discounts.",
        badge: "Inventory push",
        expires: "Selected SKUs",
      },
    ],
  },
  {
    id: "stayhub",
    name: "StayHub Stays",
    category: "Hotels & Stays",
    city: "Bangkok",
    highlight: "Room QR that unlock on‑property perks.",
    tone: "For hosts who want every scan to delight.",
    coupons: [
      {
        code: "LATEOUT",
        title: "Late checkout unlock",
        description: "Guests scan room QR for a free 2‑hour extension.",
        badge: "Guest delight",
        expires: "Subject to availability",
      },
      {
        code: "QRBREAKFAST",
        title: "Breakfast for 2",
        description: "Attach to booking confirmations via QR.",
        badge: "Add‑on",
        expires: "Weekends only",
      },
    ],
  },
];

export default function PublicMerchantsPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedMerchantId, setSelectedMerchantId] = useState(
    merchantsData[0]?.id
  );
  const locale = useLocale();

  const activeMerchant =
    merchantsData.find((m) => m.id === selectedMerchantId) ?? merchantsData[0];

  useEffect(() => {
    if (!copiedCode) return;
    const timer = setTimeout(() => setCopiedCode(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedCode]);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="hidden items-center gap-1 text-xs font-medium text-white/60 hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back home
            </Link>
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <QrCode className="h-5 w-5" />
              </div>
              <span>QR Rev Marketplace</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-white/70">
            <Globe className="h-4 w-4 text-emerald-300" />
            <span>Sample catalog for demo & onboarding</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              All merchants
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Explore how different businesses run QR‑powered coupons
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-slate-300">
              Click any merchant on the left to see its live coupon wall and how{" "}
              <span className="font-semibold">paid placements</span> can sit
              alongside always‑on offers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-slate-900"
              asChild
            >
              <Link href={`/${locale}/login`}>Sign in to create your own</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.4fr)]">
          {/* Merchant grid */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                <div className="h-px w-8 bg-white/30" />
                Merchant directory
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/70">
                {merchantsData.length} examples
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {merchantsData.map((merchant) => {
                const isActive = merchant.id === activeMerchant.id;
                return (
                  <button
                    key={merchant.id}
                    type="button"
                    onClick={() => setSelectedMerchantId(merchant.id)}
                    className={`flex flex-col gap-1.5 rounded-xl border px-3.5 py-3 text-left transition ${
                      isActive
                        ? "border-emerald-400/80 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]"
                        : "border-white/10 bg-black/10 hover:border-white/40 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase tracking-wide">
                          {merchant.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 3)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {merchant.name}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                            {merchant.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/60">
                        {merchant.city}
                      </p>
                    </div>
                    <p className="text-xs text-white/70 line-clamp-2">
                      {merchant.highlight}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right side: coupons + ads */}
          <section className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-7 shadow-[0_30px_100px_-60px_rgba(56,189,248,0.7)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                    Coupon wall
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold">
                    {activeMerchant.name}
                  </h2>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                    {activeMerchant.category}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Optimised for QR journeys and upsell flows</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/75">
                {activeMerchant.tone}
              </p>

              <div className="mt-6 space-y-4">
                {activeMerchant.coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-sky-200">
                          {coupon.badge}
                        </span>
                        <span>{coupon.expires}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                        <Gift className="h-4 w-4 text-amber-300" />
                        {coupon.title}
                      </div>
                      <p className="text-xs text-white/65 sm:text-sm">
                        {coupon.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <div className="flex items-center gap-2 rounded-full bg-white text-slate-900 px-3 py-1 text-xs font-semibold shadow-md sm:text-sm">
                        <QrCode className="h-4 w-4" />
                        {coupon.code}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white hover:text-slate-900"
                        onClick={() => handleCopy(coupon.code)}
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsored ads rail on public page */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                  <div className="h-px w-6 bg-white/30" />
                  Paid ad formats
                </div>
                <Button
                  size="xs"
                  variant="ghost"
                  className="h-7 px-2 text-[11px] text-white/75 hover:bg-white/10"
                >
                  <Megaphone className="mr-1.5 h-3.5 w-3.5" />
                  Talk to us about sponsored slots
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {sponsoredAds.map((ad) => (
                  <article
                    key={ad.title}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-black/20 p-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                        {ad.tag}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-amber-200">
                        {ad.accent}
                      </span>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xs font-semibold sm:text-sm">
                        {ad.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-white/70">
                        {ad.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1 text-[11px] font-medium text-white hover:bg-white hover:text-slate-900 transition"
                    >
                      {ad.cta}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
