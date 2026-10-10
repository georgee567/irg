import { connection } from "next/server";

import { prisma } from "@/lib/prisma";

export type SitePage = "home" | "about" | "contact" | "journal" | "lookbook" | "custom" | "footer" | "header";
export type SiteContent = Record<string, string>;

export const siteContentDefaults: Record<SitePage, SiteContent> = {
  home: {
    heroEyebrow: "Luxury Streetwear • Est. 2026",
    heroTitle: "Wear\nYour Identity",
    heroDescription: "Premium luxury streetwear crafted for creators, visionaries and trendsetters.",
    heroPrimaryLabel: "Shop Now",
    heroSecondaryLabel: "Explore Luxury",
    heroImage: "/images/hero-model.png",
    heroImageAlt: "IRG luxury streetwear campaign",
    heroVideo: "",
    heroCollectionLabel: "New Collection",
    heroCollectionTitle: "Summer 2026",
    heroCollectionDescription: "Discover timeless luxury inspired by modern street culture.",
    heroProductsCount: "50+",
    heroCustomersCount: "20K+",
    storyEyebrow: "Our Story",
    storyTitle: "More Than Fashion",
    storyDescription: "IRG represents confidence, ambition and identity. Every collection is designed with premium materials, modern silhouettes and timeless luxury, creating fashion that speaks before you do.",
    productsEyebrow: "Our Products",
    productsTitle: "IRG Collection",
    productsButton: "View All",
    collectionsEyebrow: "Collections",
    collectionsTitle: "Explore Categories",
    collectionsButton: "View All",
    menTitle: "Men",
    menImage: "/images/men.png.jpeg",
    womenTitle: "Women",
    womenImage: "/images/women.png.jpeg",
    accessoriesTitle: "Accessories",
    accessoriesImage: "/images/Accessories.png.jpeg",
    collectionsShopButton: "Shop Now",
    benefitsEyebrow: "Why IRG",
    benefitsTitle: "Crafted For Excellence",
    benefitOneTitle: "Premium Quality",
    benefitOneText: "Luxury fabrics with premium finishing.",
    benefitTwoTitle: "Worldwide Shipping",
    benefitTwoText: "Fast global delivery.",
    benefitThreeTitle: "Exclusive Designs",
    benefitThreeText: "Limited edition collections.",
    benefitFourTitle: "Luxury Standard",
    benefitFourText: "Designed for timeless elegance.",
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "Loved By Our Community",
    testimonialOneName: "Brian M.",
    testimonialOneText: "Best luxury streetwear brand I've worn.",
    testimonialTwoName: "Michelle A.",
    testimonialTwoText: "Premium quality and amazing customer service.",
    testimonialThreeName: "Kevin O.",
    testimonialThreeText: "Every piece feels exclusive.",
    newsletterEyebrow: "Join IRG",
    newsletterTitle: "Become Part Of The Movement",
    newsletterDescription: "Receive exclusive drops, limited editions, early access and premium offers.",
    newsletterPlaceholder: "Enter your email",
    newsletterButton: "Subscribe",
  },
  about: {
    eyebrow: "About IRG",
    title: "Confidence, Ambition And Identity",
    description: "IRG creates premium streetwear for people who define their own style. Discover the story and standards behind every collection.",
    mediaUrl: "",
    mediaAlt: "IRG brand story",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get In Touch",
    email: "georgekabiru27@gmail.com",
    phoneOne: "+254 107117425",
    phoneTwo: "+254 715362959",
    location: "Nairobi, Kenya",
    mediaUrl: "",
    mediaAlt: "IRG contact page media",
  },
  journal: {
    eyebrow: "Journal",
    title: "IRG Journal",
    description: "Fashion stories, styling inspiration, behind-the-scenes and future collections.",
    mediaUrl: "",
    mediaAlt: "IRG Journal media",
  },
  lookbook: {
    eyebrow: "Lookbook",
    title: "IRG Lookbook",
    description: "Discover our latest editorials, premium collections and seasonal campaigns.",
    mediaUrl: "",
    mediaAlt: "IRG Lookbook media",
  },
  custom: {
    eyebrow: "Custom Orders",
    title: "Design Your Own IRG",
    description: "Request personalised luxury clothing designed exclusively for you.",
    mediaUrl: "",
    mediaAlt: "IRG Custom Orders media",
  },
  footer: {
    description: "Premium luxury streetwear inspired by confidence, identity and timeless fashion.",
    shopHeading: "Shop",
    menLabel: "Men",
    womenLabel: "Women",
    accessoriesLabel: "Accessories",
    companyHeading: "Company",
    aboutLabel: "About",
    journalLabel: "Journal",
    contactLabel: "Contact",
    contactHeading: "Contact",
    country: "Kenya",
    email: "georgekabiru27@gmail.com",
    phoneOne: "+254 107117425",
    phoneTwo: "+254 715362959",
    copyright: "© 2026 IRG. All Rights Reserved.",
  },
  header: {
    announcementText: "FREE WORLDWIDE SHIPPING • NEW COLLECTION AVAILABLE",
    navHome: "Home",
    navCollections: "Collections",
    navShop: "Shop",
    navAbout: "About",
    navLookbook: "Lookbook",
    navCustom: "Custom",
    navJournal: "Journal",
    navWishlist: "Wishlist",
    navContact: "Contact",
    searchPlaceholder: "Search...",
    joinLabel: "Join IRG",
    accountLabel: "Account",
    adminDashboardLabel: "Admin Dashboard",
    ordersLabel: "Orders",
    logoutLabel: "Logout",
    loginLabel: "Login",
    cartLabel: "Cart",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeContent(defaults: SiteContent, saved: unknown): SiteContent {
  if (!isRecord(saved)) return { ...defaults };

  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      typeof saved[key] === "string" ? saved[key] : fallback,
    ]),
  );
}

export function mergeSiteContent(page: SitePage, saved: unknown): SiteContent {
  return mergeContent(siteContentDefaults[page], saved);
}

export async function getSiteContent(page: SitePage): Promise<SiteContent> {
  await connection();
  const saved = await prisma.siteContent.findUnique({
    where: { page },
    select: { content: true },
  });

  return mergeSiteContent(page, saved?.content);
}
