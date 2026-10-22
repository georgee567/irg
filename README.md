# IRG — Independent Royal Generation

> **Luxury fashion. Modern identity. Built for the next generation.**

IRG (Independent Royal Generation) is a modern luxury fashion and streetwear platform focused on premium clothing, contemporary design, digital commerce, and a strong online brand experience.

The project is being built as a scalable full-stack web application using **Next.js, React, TypeScript, and Tailwind CSS**, with plans for production authentication, payments, order management, inventory, analytics, and an administrative dashboard.

---

## Project Vision

IRG is designed to be more than a basic online clothing store.

The platform will combine:

* Luxury fashion
* Premium streetwear
* E-commerce
* Digital brand storytelling
* Collections and product releases
* Lookbooks
* Editorial content
* Customer accounts
* Wishlist
* Shopping cart
* Checkout
* Multiple payment methods
* Order management
* Customer support
* Marketing and newsletter functionality

The final experience should feel premium, modern, minimal, fast, responsive, and internationally competitive.

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Lucide Icons
* Next/Image
* Next/Font

## Application Architecture

The project uses the **Next.js App Router**.

Main application areas include:

```text
src/
├── app/
├── components/
├── context/
├── data/
└── ...
```

The application is component-driven and should maintain reusable shared components rather than duplicating UI between pages.

---

# Current Features

The project currently contains the foundation for:

* Global navigation
* Responsive navigation
* Homepage
* Shop
* Product data
* Product cards
* Product detail routing
* Search
* Category filtering
* Product sorting
* Shopping cart context
* Wishlist context
* Authentication context
* Search context
* Account page
* Login page
* Register page
* Journal
* Lookbook
* Contact
* Collections
* Custom page
* Checkout foundation
* Orders foundation

Some of these features are currently functional while others require further integration and production implementation.

---

# Core Architecture

## Context Providers

The application currently uses React Context for shared client-side state.

### CartContext

Responsible for:

* Cart items
* Add to cart
* Remove from cart
* Increase quantity
* Decrease quantity
* Clear cart
* Local storage persistence

### WishlistContext

Responsible for:

* Wishlist items
* Adding products
* Removing products
* Wishlist persistence

### AuthContext

Responsible for:

* Current user
* Login state
* Logout
* Account state

### SearchContext

Responsible for:

* Global search state
* Search input
* Product filtering

---

# Main Navigation

The global navigation should provide access to:

* Home
* Collections
* Shop
* About
* Lookbook
* Custom
* Journal
* Contact
* Search
* Wishlist
* Cart
* Account

The navbar should be available consistently across the entire website.

---

# Homepage

The homepage is the primary entry point to IRG.

It should eventually contain:

1. Hero section
2. Brand introduction
3. Featured products
4. Latest collection
5. Best sellers
6. New arrivals
7. Brand story
8. Lookbook preview
9. Journal preview
10. Newsletter
11. Social media section
12. Testimonials
13. Footer

The homepage should communicate the complete IRG identity before a visitor navigates deeper into the website.

---

# Shop

The shop is the primary product discovery system.

Required functionality:

* Product grid
* Search
* Category filtering
* Sorting
* Product details
* Add to cart
* Wishlist
* Product images
* Pricing
* Product descriptions
* Related products
* Responsive design

Future functionality:

* Pagination
* Inventory status
* Stock management
* Product variants
* Size selection
* Colour selection
* Quick view
* Reviews

---

# Shopping Cart

The cart must provide a complete shopping experience.

Required:

* Add product
* Remove product
* Increase quantity
* Decrease quantity
* Cart count
* Persistent cart
* Subtotal
* Shipping
* Discount
* Tax/VAT
* Final total
* Proceed to checkout

The cart must be connected directly to the shop.

---

# Checkout

Checkout will eventually include:

## Customer Information

* Full name
* Email
* Phone
* County
* Town
* Delivery address

## Delivery

* Delivery method
* Shipping cost
* Delivery information

## Payment

Planned payment methods:

* M-Pesa
* Visa
* Mastercard
* PayPal

The payment architecture must be implemented only when the backend/payment credentials and required APIs are configured.

---

# Orders

The order system will provide:

* Order creation
* Order number
* Order date
* Products purchased
* Quantity
* Payment status
* Order status
* Delivery status
* Total amount
* Customer information
* Order history

Possible statuses:

```text
Pending
Paid
Processing
Shipped
Delivered
Cancelled
```

---

# Authentication

The current project has authentication UI foundations.

The production authentication system should eventually support:

* Registration
* Login
* Logout
* Password reset
* Email verification
* Profile management
* Secure sessions
* Account dashboard

A production authentication provider such as Supabase can be integrated when the backend phase begins.

---

# Account Dashboard

The account area should eventually contain:

* Profile
* Orders
* Wishlist
* Addresses
* Payment information
* Account settings
* Logout

---

# Product Pages

Each product page should contain:

* Product gallery
* Product name
* Price
* Description
* Category
* Size
* Colour
* Availability
* Add to cart
* Wishlist
* Product sharing
* Reviews
* Related products

---

# Global Layout

Every public page should use the same global structure:

```text
Navbar
   ↓
Page Content
   ↓
Footer
```

The Navbar and Footer should not be manually duplicated across individual pages.

They should be controlled through the application's shared layout architecture.

---

# Footer

The footer should contain:

* IRG branding
* About IRG
* Navigation
* Collections
* Customer care
* Contact information
* Social media
* Newsletter
* Policies
* Copyright

Example:

```text
© IRG — Independent Royal Generation
All Rights Reserved.
```

---

# Design System

IRG follows a dark luxury visual direction.

Primary characteristics:

* Black backgrounds
* Gold accents
* White typography
* Minimal layouts
* Large editorial typography
* Premium spacing
* Subtle borders
* Smooth transitions
* High-quality imagery
* Responsive design
* Luxury fashion aesthetic

The interface should avoid looking like a generic template.

---

# Responsive Design

The website must work across:

* Desktop
* Laptop
* Tablet
* Android
* iPhone

Mobile navigation must provide access to all major sections.

---

# Assets

Product images are currently being developed/updated.

Missing product imagery should not block application development.

Temporary images or placeholders may be used until final IRG photography and product assets are available.

---

# Future Backend

The frontend architecture should remain ready for backend integration.

Potential production stack:

* Supabase
* PostgreSQL
* Prisma where appropriate
* Secure API routes
* Cloud storage
* Authentication
* Database-backed products
* Database-backed orders

---

# Admin Dashboard

Future administrator functionality:

* Dashboard
* Products
* Categories
* Inventory
* Orders
* Customers
* Discounts
* Analytics
* Content management
* Product uploads
* Order management

---

# Payments

Payment integration is currently for development and testing only:

### M-Pesa

Daraja Sandbox flow:

```text
Customer
   ↓
Checkout
   ↓
M-Pesa STK Push
   ↓
Customer confirms payment
   ↓
Payment verification
   ↓
Pending order created
   ↓
Confirmation
```

Production M-Pesa and card payments are disabled. The M-Pesa code only calls
Daraja Sandbox and refuses a production environment setting. See
[Daraja Sandbox setup](./docs/MPESA_SANDBOX_SETUP.md) for credentials, local
callback setup, and test instructions.

No payment system should be considered production-ready until payment
verification, security, callbacks/webhooks, and order confirmation are
implemented and reviewed for the target production provider.

---

# Promo Codes

The platform will eventually support:

* Percentage discounts
* Fixed discounts
* Expiry dates
* Minimum order values
* Usage limits
* Product/category restrictions
* Active/inactive codes

---

# SEO

Production SEO requirements:

* Metadata
* Open Graph
* Twitter/X cards
* Product metadata
* Sitemap
* Robots.txt
* Structured data
* Search-friendly URLs
* Proper page titles
* Descriptions
* Image alt text

---

# Performance

Before deployment:

* Optimize images
* Minimize unnecessary client components
* Reduce JavaScript
* Avoid unnecessary re-renders
* Optimize fonts
* Use caching appropriately
* Test production build
* Remove debugging code
* Check Core Web Vitals

---

# Security

Production requirements:

* Secure authentication
* Environment variables
* Server-side payment verification
* Input validation
* Secure API routes
* Rate limiting where required
* Protection against common web vulnerabilities
* Secure database access
* No secret keys exposed to the client

---

# Development Roadmap

## Phase 1 — Stabilisation

* [x] Next.js foundation
* [x] Git repository
* [x] GitHub repository
* [x] Basic application structure
* [ ] Resolve remaining architectural inconsistencies
* [ ] Remove duplicate components
* [ ] Fix all imports
* [ ] Ensure clean production build

## Phase 2 — Global UI

* [ ] Global Navbar
* [ ] Global Footer
* [ ] Shared layout
* [ ] Responsive navigation
* [ ] Consistent page transitions
* [ ] Final design system

## Phase 3 — Homepage

* [ ] Complete hero
* [ ] Featured products
* [ ] Collections
* [ ] Best sellers
* [ ] Brand story
* [ ] Lookbook
* [ ] Journal
* [ ] Newsletter
* [ ] Social section
* [ ] Footer

## Phase 4 — Commerce

* [ ] Complete product pages
* [ ] Cart
* [ ] Wishlist
* [ ] Search
* [ ] Filters
* [ ] Sorting
* [ ] Product variants
* [ ] Inventory

## Phase 5 — Checkout

* [ ] Customer details
* [ ] Shipping
* [ ] Promo codes
* [ ] Order summary
* [ ] Payment selection
* [ ] Payment integration
* [ ] Payment verification
* [ ] Order creation
* [ ] Confirmation

## Phase 6 — Accounts

* [ ] Authentication
* [ ] Profiles
* [ ] Orders
* [ ] Wishlist
* [ ] Addresses
* [ ] Account settings

## Phase 7 — Backend

* [ ] Database
* [ ] Authentication backend
* [ ] Product database
* [ ] Orders database
* [ ] Inventory
* [ ] Customer records
* [ ] API/backend services

## Phase 8 — Admin

* [ ] Admin authentication
* [ ] Dashboard
* [ ] Product management
* [ ] Inventory management
* [ ] Order management
* [ ] Customer management
* [ ] Analytics

## Phase 9 — Production

* [ ] SEO
* [ ] Security audit
* [ ] Performance optimisation
* [ ] Accessibility
* [ ] Testing
* [ ] Production build
* [ ] Environment configuration
* [ ] Vercel deployment
* [ ] Custom domain

---

# Development Rules

This repository is the source of truth for IRG.

Developers and AI coding agents working on this project must:

1. Analyse the existing architecture before changing it.
2. Reuse existing components whenever possible.
3. Avoid duplicate components.
4. Avoid unnecessary rewrites.
5. Fix broken imports immediately.
6. Keep TypeScript strict and clean.
7. Keep shared functionality centralized.
8. Do not create temporary architecture that is intentionally expected to be fixed later.
9. Complete connected functionality before moving to unrelated features.
10. Test affected routes after significant changes.
11. Run the production build before deployment.
12. Preserve existing working functionality when adding features.

---

# Git Workflow

Before major changes:

```bash
git status
```

Create a meaningful commit after a completed milestone:

```bash
git add .
git commit -m "feat: complete shopping cart functionality"
git push origin main
```

Keep commits descriptive and milestone-oriented.

---

# Development Commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## AI Customer Assistant

The site-wide **test** customer assistant uses Google's Gemini API. Add these server-side variables to `.env.local` for local development and to the production deployment's environment settings:

```dotenv
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash-lite"
```

Create a key in [Google AI Studio](https://aistudio.google.com/apikey). The default model is `gemini-2.5-flash-lite`; only use a model available on the project's Gemini API tier. Keep the key server-side and never expose it through a `NEXT_PUBLIC_` variable. The Gemini free tier has quotas, and Google may use free-tier content to improve its products. Do not use this test assistant for sensitive customer information.

Admins can teach the assistant by opening **Admin → Site Content → Assistant** and editing its welcome message, instructions, and verified store knowledge. The assistant also uses the current product catalog and contact-page details. It cannot look up a customer's private orders.

Customer messages are sent to Google to generate replies. The assistant is unavailable until a valid Gemini API key is configured.

# Deployment

The final application is intended to be deployed using **Vercel**.

Before deployment:

```bash
npm run build
```

The build must complete successfully before considering a milestone production-ready.

---

# Project Status

**Status:** Active Development

**Repository:** GitHub

**Framework:** Next.js

**Language:** TypeScript

**UI:** Tailwind CSS

**Deployment Target:** Vercel

IRG is being developed incrementally toward a complete, production-ready luxury fashion e-commerce platform.
