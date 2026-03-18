import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Globe2, Loader2, MessageSquare, Sparkles } from "lucide-react";

/**
 * Default content structure if no dynamic content is available
 */
const DEFAULT_CONTENT = {
  section1_title: "Official Partner Network",
  section1_slogan_title: "Exclusive Deals Curated For You",
  section1_description:
    "Browse verified merchants, unlock instant coupons, and save on premium services in your area.",
  section2_coupons_title: "Ready to Explore?",
  section2_coupons_title_description:
    "Click on a merchant profile on the left to unlock their exclusive coupons and limited-time offers.",
  section3_title: "Why Choose Us",
  section3_slogan_title: "Everything you need to grow",
  section3_description:
    "Powerful tools to help you understand your customers and keep them coming back",
  section3_card1_title: "Instant Feedback",
  section3_card1_description:
    "Customers scan a QR code to leave reviews in seconds. Capture negative feedback privately before it hits Google.",
  section3_card2_title: "Smart Coupons",
  section3_card2_description:
    "Issue unique, trackable serial codes. Prevent fraud with secure validation and usage limits.",
  section3_card3_title: "Global Reach",
  section3_card3_description:
    "Expand your business internationally with our comprehensive tools and insights",
  footer_title: "Global Merchant Network",
};

/**
 * Component to render dynamic landing page content sections
 * Falls back to defaults if no custom content is available
 */
export function DynamicLandingPageSections({ adminId, className = "" }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/agent-landing-pages/public/${adminId}`
        );
        if (response.data.data) {
          setContent(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch landing page content:", error);
        // Use defaults on error
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [adminId]);

  // Use either fetched content or defaults
  const displayContent = { ...DEFAULT_CONTENT, ...content };

  const section3Cards = [
    {
      title: displayContent.section3_card1_title,
      description: displayContent.section3_card1_description,
      Icon: MessageSquare,
      iconClassName: "text-sky-600",
      iconWrapperClassName: "bg-sky-500/10 ring-sky-500/20",
      accentClassName: "from-sky-500/15 via-transparent to-transparent",
    },
    {
      title: displayContent.section3_card2_title,
      description: displayContent.section3_card2_description,
      Icon: Sparkles,
      iconClassName: "text-amber-600",
      iconWrapperClassName: "bg-amber-500/10 ring-amber-500/20",
      accentClassName: "from-amber-500/15 via-transparent to-transparent",
    },
    {
      title: displayContent.section3_card3_title,
      description: displayContent.section3_card3_description,
      Icon: Globe2,
      iconClassName: "text-emerald-600",
      iconWrapperClassName: "bg-emerald-500/10 ring-emerald-500/20",
      accentClassName: "from-emerald-500/15 via-transparent to-transparent",
    },
  ].filter((card) => card.title);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Section 1 - Official Partner Network */}
      {displayContent.section1_title && (
        <section className="py-12 md:py-20">
          <div className="space-y-4 text-center">
            <h2 className="text-base font-semibold text-primary">
              {displayContent.section1_title}
            </h2>
            {displayContent.section1_slogan_title && (
              <h3 className="text-3xl font-bold md:text-4xl">
                {displayContent.section1_slogan_title}
              </h3>
            )}
            {displayContent.section1_description && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {displayContent.section1_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Section 2 - Ready to Explore */}
      {displayContent.section2_coupons_title && (
        <section className="py-12 md:py-16">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              {displayContent.section2_coupons_title}
            </h2>
            {displayContent.section2_coupons_title_description && (
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {displayContent.section2_coupons_title_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Section 3 - Why Choose Us */}
      {displayContent.section3_title && (
        <section className="py-12 md:py-20">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-base font-semibold text-primary">
                {displayContent.section3_title}
              </h2>
              {displayContent.section3_slogan_title && (
                <h3 className="text-3xl font-bold md:text-4xl">
                  {displayContent.section3_slogan_title}
                </h3>
              )}
              {displayContent.section3_description && (
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  {displayContent.section3_description}
                </p>
              )}
            </div>

            {/* Cards Grid */}
            {section3Cards.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section3Cards.map((card, index) => (
                  <article
                    key={`${card.title}-${index}`}
                    className="group relative mx-auto flex h-full w-full max-w-md flex-col items-center overflow-hidden rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accentClassName} opacity-70`}
                      aria-hidden="true"
                    />
                    <div className="relative z-10 flex h-full w-full flex-col items-center">
                      <div
                        className={`mb-4 inline-flex rounded-2xl p-3 ring-1 ${card.iconWrapperClassName}`}
                      >
                        <card.Icon
                          className={`h-5 w-5 ${card.iconClassName}`}
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mb-3 w-full text-center text-lg font-semibold leading-snug break-words [overflow-wrap:anywhere]">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="w-full text-center text-sm leading-relaxed text-muted-foreground break-words [overflow-wrap:anywhere]">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer Section */}
      {/* {displayContent.footer_title && (
        <section className="border-t py-12 md:py-16">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            {displayContent.footer_title}
          </h2>
        </section>
      )} */}
    </div>
  );
}

export default DynamicLandingPageSections;
