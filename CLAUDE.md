# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mustache Harnesses Co. - A mock e-commerce store selling fictional mustache harnesses. Built with vanilla HTML/CSS/JavaScript, using localStorage for persistence, deployed to Netlify. The brand voice is deadpan serious, treating absurd products as completely legitimate.

## Development Commands

**No build step required** - This is vanilla HTML/CSS/JS. Open HTML files directly in browser or use a local server.

**Deployment**: Netlify auto-deploys from the main branch. Configuration in `netlify.toml`.

**Testing**: Browser-based manual testing. No automated test framework configured.

## Architecture

### Tech Stack
- Vanilla HTML5, CSS3, JavaScript (ES6+)
- JSON-based product catalog (no backend)
- Browser localStorage for cart/orders
- Netlify deployment

### Key Files
- `/js/products.js` - Product data loading, filtering, sorting, search
- `/js/cart.js` - Cart operations, promo codes, total calculations
- `/js/checkout.js` - Form validation (email, phone, credit card, address)
- `/js/filters.js` - URL query parameter parsing for shareable filter states
- `/js/main.js` - Header cart badge, mobile menu, page initialization
- `/data/products.json` - Product catalog (12 products, 4 categories)
- `/css/main.css` - CSS variables, base styles
- `/css/components.css` - Reusable UI components
- `/css/pages.css` - Page-specific styles

### LocalStorage Keys
- `mh_cart` - Shopping cart items
- `mh_promo` - Applied promo code
- `mh_orders` - Order history

### Promo Code
`AIFORHUMANS` gives 10% discount

### Brand Colors (CSS Variables)
- Primary: Burgundy (#722F37)
- Secondary: Gold (#D4A844)
- Accent: Cream (#FDF5E6)
- Text: Charcoal (#2D2D2D)

### Category Colors
- Precision Shapers: Burgundy
- Croc-Style Fun-cessories: Gold
- Support & Lift Systems: Charcoal
- Night Guards & Sleepwear: Midnight Blue

## Conventions

- **Commit format**: `feat: [US-XXX] - Description`
- **Product IDs**: kebab-case for URL friendliness
- **Review dates**: ISO 8601 format (YYYY-MM-DD)
- **Form validation**: Functions return `{valid, message}` objects
- **Responsive breakpoints**: 768px (tablet), 1024px (desktop)
- **Images**: SVG placeholders in `/images/placeholders/` (400x400px)

## Build Plan Reference

See `BUILD-PLAN.md` for the complete 13-phase development plan. Completed phases include project setup, brand identity, product data, placeholder images, all JS modules, CSS components, and pages (index, shop, product). Cart page is partially complete. Remaining: checkout, confirmation, informational pages, testing, and image generation.
