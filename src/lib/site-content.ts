import { connection } from "next/server";

import { prisma } from "@/lib/prisma";

export type SitePage = "home" | "about" | "contact" | "journal" | "lookbook" | "custom" | "faq" | "footer" | "header" | "assistant";
export type SiteContent = Record<string, string>;

export const siteContentDefaults: Record<SitePage, SiteContent> = {
  home: {
    heroEyebrow: "Luxury Streetwear • Kenya",
    heroTitle: "Wear\nYour Identity",
    heroDescription: "Premium luxury streetwear crafted for creators, visionaries and trendsetters.",
    heroPrimaryLabel: "Shop Now",
    heroSecondaryLabel: "Explore Luxury",
    heroImage: "/images/hero-model.png",
    heroImageAlt: "IRG luxury streetwear campaign",
    heroVideo: "",
    heroCollectionLabel: "IRG Collection",
    heroCollectionTitle: "Wear Your Identity",
    heroCollectionDescription: "Explore the products currently available from IRG.",
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
    benefitTwoTitle: "Delivery Information",
    benefitTwoText: "Contact IRG to confirm current delivery options.",
    benefitThreeTitle: "Distinctive Design",
    benefitThreeText: "Explore the styles currently available in the IRG shop.",
    benefitFourTitle: "Luxury Standard",
    benefitFourText: "Designed for timeless elegance.",
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "Reviews From IRG Customers",
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
  faq: {
    eyebrow: "Customer Care",
    title: "Frequently Asked Questions",
    description: "Helpful answers about shopping with IRG. Contact our team if you need more help.",
    questionOne: "How do I place an order?",
    answerOne: "Choose products and variants, add them to your cart, then complete checkout with your delivery details.",
    questionTwo: "Which payment methods are available?",
    answerTwo: "M-Pesa is currently available in checkout. Payment is confirmed only after the provider verifies it.",
    questionThree: "When is my payment confirmed?",
    answerThree: "Your order stays pending until the payment provider confirms payment. Stock is deducted only after that confirmation.",
    questionFour: "How does delivery work?",
    answerFour: "Contact IRG to confirm delivery options, costs, and estimated timing for your location before ordering.",
    questionFive: "What is IRG's return or exchange policy?",
    answerFive: "Please contact IRG before ordering for current return and exchange terms; no unverified policy is promised here.",
    questionSix: "How do I choose a size?",
    answerSix: "Available sizes are listed on each product page. Contact IRG if you need measurements or fit guidance.",
    questionSeven: "How can I check product availability?",
    answerSeven: "Stock is tracked by product variant. An order is confirmed only after payment and inventory are verified.",
    questionEight: "Can I cancel or change an order?",
    answerEight: "Contact IRG as soon as possible with your order number. Changes depend on payment and fulfillment status.",
    questionNine: "Can I order from outside Kenya?",
    answerNine: "Contact IRG to confirm whether delivery is available to your country and what it will cost.",
    questionTen: "How does M-Pesa checkout work?",
    answerTen: "Enter your M-Pesa phone number at checkout and approve the payment prompt. Check your order status if confirmation takes time.",
    questionEleven: "How do I use my account or wishlist?",
    answerEleven: "Sign in to manage your account, view orders, and save products to your wishlist.",
    questionTwelve: "How do I request a custom piece?",
    answerTwelve: "Use the Custom page to describe your idea and provide your contact details. The IRG team will follow up.",
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
    faqLabel: "FAQ",
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
    navFaq: "FAQ",
    searchPlaceholder: "Search...",
    joinLabel: "Join IRG",
    accountLabel: "Account",
    adminDashboardLabel: "Admin Dashboard",
    ordersLabel: "Orders",
    logoutLabel: "Logout",
    loginLabel: "Login",
    cartLabel: "Cart",
  },
  assistant: {
    assistantName: "IRG Assistant",
    welcomeMessage: "Welcome to IRG. How can I help you today?",
    instructions: "Be warm, polished, and concise. Help customers discover products, understand the store, and find the right contact or directions.",
    knowledge: "IRG advertises free worldwide shipping. Do not invent delivery timelines, return policies, or other store policies that are not listed here. For order-specific questions, explain that you cannot access customer orders and direct the customer to sign in at /orders or contact IRG.",
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
