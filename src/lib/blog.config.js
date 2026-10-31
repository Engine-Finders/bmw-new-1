// src/lib/blog.config.js
/**
 * Site-specific configuration for Headless CMS Blog & Lead Quote integration.
 * Customized for BMW Engines UK.
 */

export const blogConfig = {
  // 1. Site Identity
  siteName: "BMW Engines UK",
  siteSlug: process.env.CMS_SITE_SLUG || "bmwengines",
  siteDomain: "bmwengines.uk",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://bmwengines.uk").replace(/\/$/, ""),
  defaultAuthor: "BMW Technical Specialist",

  // 2. Headings & UI Copy
  copy: {
    metaTitle: "BMW Engine Guides & Advice | BMW Engines UK",
    metaDescription:
      "Comprehensive BMW engine diagnostic guides, common failure solutions, timing chain advice, and replacement engine buying tips.",
    blogTitlePrefix: "BMW Engines UK",
    blogTitleAccent: "Knowledge & Guides",
    blogSubtitle:
      "Expert failure diagnosis, engine replacement costs, timing chain guidance, and technical specifications for all BMW series.",
    emptyTitle: "No guides published yet",
    emptySubtitle: "BMW technical articles and diagnostic guides published from the CMS will appear here.",
    readMoreText: "Read Guide",
    widgetTitle: "Instant BMW Engine Quote",
    widgetSubtitle: "Enter your registration or request a callback from our BMW engine specialists.",
    widgetSubmitText: "Request Free Quote",
    widgetSuccessTitle: "Quote Request Received!",
    widgetSuccessSubtitle:
      "Our BMW engine specialists will check stock and contact you shortly with the best pricing.",
    recentGuidesTitle: "Recent Guides",
    relatedGuidesTitle: "Related Guides",
    bottomCta: {
      enabled: true,
      badge: "BMW Engine Network",
      title: "Need a Replacement BMW Engine?",
      subtitle:
        "Get an instant quote for reconditioned or tested low-mileage BMW engines with full warranty coverage.",
      buttonText: "Get Free BMW Engine Quote »",
      buttonHref: "#sidebar-reg-input",
    },
  },

  // 3. Theme Colors (Matching BMW Engines UK blue theme)
  theme: {
    fontFamily: "Arial, Helvetica, sans-serif",
    primaryColor: "#075fd8",       // BMW Blue
    primaryHover: "#034daf",
    accentColor: "#1581ff",        // Lighter Accent Blue
    accentHover: "#075fd8",
    widgetBg: "#071827",           // Dark Navy Widget Card
    widgetBorder: "#0d2842",
    widgetButtonBg: "#075fd8",     // Blue Button
    widgetButtonHover: "#034daf",
    ukBadgeBg: "#003399",
    fallbackThumbnail:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
  },
};
