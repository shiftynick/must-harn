# Mustache Harnesses Store - Build Plan

## Project Summary

A mock e-commerce store selling fictional mustache harnesses. Built with vanilla HTML/CSS/JS, using localStorage for persistence, deployed to Netlify. The tone is deadpan serious—treating absurd products as completely normal.

---

## Phase 1: Project Setup & Brand Foundation

### 1.1 Project Structure
- [ ] Create folder structure:
  ```
  /must-harn
  ├── index.html
  ├── /pages
  │   ├── shop.html
  │   ├── product.html
  │   ├── cart.html
  │   ├── checkout.html
  │   ├── confirmation.html
  │   ├── about.html
  │   ├── faq.html
  │   ├── contact.html
  │   └── returns.html
  ├── /css
  │   ├── main.css
  │   ├── components.css
  │   └── pages.css
  ├── /js
  │   ├── main.js
  │   ├── products.js
  │   ├── cart.js
  │   ├── filters.js
  │   └── checkout.js
  ├── /images
  │   └── /placeholders
  ├── /data
  │   └── products.json
  └── netlify.toml
  ```
- [ ] Initialize git repository
- [ ] Create `.gitignore` file
- [ ] Create `netlify.toml` with basic config

### 1.2 Brand Identity Definition
- [ ] Define brand name: "Mustache Harnesses Co." (or similar)
- [ ] Define color palette:
  - Primary: Rich burgundy (#722F37)
  - Secondary: Gold/mustard (#D4A844)
  - Accent: Cream (#FDF5E6)
  - Text: Charcoal (#2D2D2D)
  - Background: Off-white (#FAFAFA)
- [ ] Define typography:
  - Headings: Serif font (e.g., Playfair Display)
  - Body: Clean sans-serif (e.g., Inter or system fonts)
- [ ] Create simple text-based logo/wordmark
- [ ] Define tagline: "Dignified Solutions for Distinguished Facial Hair"

### 1.3 Base CSS Setup
- [ ] CSS reset/normalize
- [ ] CSS custom properties (variables) for colors, fonts, spacing
- [ ] Base typography styles
- [ ] Utility classes (spacing, flexbox helpers, grid)
- [ ] Button styles (primary, secondary, outline variants)
- [ ] Form input styles
- [ ] Card component base styles

---

## Phase 2: Product Data & Categories

### 2.1 Define Product Categories
Create 4 categories with 3 products each (12 total):

**Category 1: Precision Shapers**
- Devices that mold and train mustache shape

**Category 2: Croc-Style Fun-cessories**
- Wearable face accessories with holes for hair to grow through

**Category 3: Support & Lift Systems**
- Structural harnesses that provide lift and definition

**Category 4: Night Guards & Sleepwear**
- Protective gear for maintaining mustache integrity while sleeping

### 2.2 Create Product Data File
- [ ] Create `/data/products.json` with 12 products
- [ ] Each product includes:
  - `id` (unique identifier)
  - `name`
  - `category`
  - `description` (2-3 sentences, deadpan serious)
  - `price` (number)
  - `images` (array of image paths - placeholders for now)
  - `sizes` (array: S, M, L, XL or specific measurements)
  - `colors` (array of available colors)
  - `reviews` (array of fake review objects with name, rating, text, date)
  - `rating` (average rating number)
  - `reviewCount` (total reviews)
  - `inStock` (boolean)
  - `stockCount` (number)
  - `isNew` (boolean for "newest" sorting)
  - `salesCount` (fake number for "best seller" sorting)
  - `dateAdded` (ISO date string)

### 2.3 Write All Product Content
- [ ] Product 1: The Executive Shaper Pro
- [ ] Product 2: Contour Master 3000
- [ ] Product 3: Precision Arc Trainer
- [ ] Product 4: The Handlebar Croc
- [ ] Product 5: Ventilated Fun-Stache
- [ ] Product 6: Swiss Cheese Whisker Wear
- [ ] Product 7: The Elevate X1 Harness
- [ ] Product 8: Anti-Gravity Curl System
- [ ] Product 9: Dual-Point Lift Apparatus
- [ ] Product 10: The DreamGuard Deluxe
- [ ] Product 11: Nocturnal Curl Protector
- [ ] Product 12: SleepSecure Mustache Bonnet

### 2.4 Generate Placeholder Images
- [ ] Create colored placeholder boxes (400x400) for each product
- [ ] Use category-specific colors for easy identification
- [ ] Add text overlay with product name

---

## Phase 3: Core JavaScript Modules

### 3.1 Product Data Module (`products.js`)
- [ ] Function to load products from JSON
- [ ] Function to get product by ID
- [ ] Function to get products by category
- [ ] Function to search products
- [ ] Function to sort products (price, name, newest, best sellers, rating)
- [ ] Function to filter products (category, price range, color, size, stock)

### 3.2 Cart Module (`cart.js`)
- [ ] Initialize cart from localStorage
- [ ] Add item to cart (with size, color, quantity)
- [ ] Remove item from cart
- [ ] Update item quantity
- [ ] Calculate subtotal
- [ ] Apply promo code ("AIForHumans" = 10% off)
- [ ] Validate promo code
- [ ] Calculate discount amount
- [ ] Calculate total (subtotal - discount)
- [ ] Save cart to localStorage
- [ ] Clear cart
- [ ] Get cart item count (for header badge)

### 3.3 Checkout Module (`checkout.js`)
- [ ] Form validation functions:
  - Email validation
  - Phone validation
  - Credit card number validation (fake - just format check)
  - Expiry date validation
  - CVV validation
  - Required field validation
  - Zip code validation
- [ ] Save order to localStorage (order history)
- [ ] Generate order confirmation number
- [ ] Clear cart after successful checkout

### 3.4 Filter Module (`filters.js`)
- [ ] Parse URL query parameters for filter state
- [ ] Update URL when filters change
- [ ] Combine multiple filters
- [ ] Reset filters function
- [ ] Get available filter options from product data

### 3.5 Main Module (`main.js`)
- [ ] Header cart count updater
- [ ] Mobile menu toggle
- [ ] Common utility functions
- [ ] Page initialization router

---

## Phase 4: Shared Components & Layout

### 4.1 Header Component
- [ ] Logo/brand name (links to home)
- [ ] Main navigation:
  - Shop
  - About
  - FAQ
  - Contact
- [ ] Cart icon with item count badge
- [ ] Mobile hamburger menu
- [ ] Promo banner: "Free shipping on all orders | Use code AIForHumans for 10% off"

### 4.2 Footer Component
- [ ] Brand name and tagline
- [ ] Navigation links:
  - Shop All
  - About Us
  - FAQ
  - Contact
  - Return Policy
- [ ] Fake social media icons
- [ ] Copyright notice
- [ ] "Satisfaction Guaranteed" badge

### 4.3 Product Card Component
- [ ] Product image (with hover effect)
- [ ] Product name
- [ ] Price
- [ ] Star rating display
- [ ] "New" badge (conditional)
- [ ] "Out of Stock" overlay (conditional)
- [ ] Quick "Add to Cart" button

### 4.4 Reusable UI Components
- [ ] Star rating display (filled/empty stars)
- [ ] Quantity selector (+/- buttons)
- [ ] Price display (with currency formatting)
- [ ] Badge component (New, Sale, Out of Stock)
- [ ] Loading spinner
- [ ] Toast/notification for "Added to cart"
- [ ] Modal component (for size guide, etc.)

---

## Phase 5: Landing Page (index.html)

### 5.1 Hero Section
- [ ] Large headline: "Dignified Solutions for Distinguished Facial Hair"
- [ ] Subheadline about quality and craftsmanship
- [ ] "Shop Now" CTA button
- [ ] Hero image placeholder

### 5.2 Trust Badges Section
- [ ] "Free Shipping on All Orders"
- [ ] "100% Satisfaction Guaranteed"
- [ ] "Expert Mustache Support"
- [ ] "30-Day Returns"

### 5.3 Featured Products Section
- [ ] Section heading: "Customer Favorites"
- [ ] Display 4 "best seller" products in grid
- [ ] "View All Products" link

### 5.4 Category Showcase
- [ ] Display 4 category cards with images
- [ ] Each links to shop page filtered by category

### 5.5 Promo Banner
- [ ] Highlight "AIForHumans" discount code
- [ ] Visually prominent design

### 5.6 Testimonials Section
- [ ] 3 fake customer testimonials
- [ ] Customer name, photo placeholder, quote, rating
- [ ] Deadpan serious quotes about mustache harness life-changing benefits

### 5.7 Newsletter Signup (Fake)
- [ ] Email input field
- [ ] Submit button
- [ ] Just shows "Thank you for subscribing!" - doesn't actually do anything

---

## Phase 6: Shop/Browse Page (shop.html)

### 6.1 Page Layout
- [ ] Page title: "Shop All Mustache Harnesses"
- [ ] Sidebar for filters (desktop)
- [ ] Collapsible filter panel (mobile)
- [ ] Product grid (main content)
- [ ] Results count display

### 6.2 Filter Sidebar
- [ ] **Category Filter**
  - Checkbox for each category
  - Show count of products per category
- [ ] **Price Range Filter**
  - Preset ranges: Under $25, $25-$50, $50-$100, Over $100
  - Or min/max input fields
- [ ] **Color Filter**
  - Color swatches with checkboxes
- [ ] **Size Filter**
  - Checkboxes for each size
- [ ] **Availability Filter**
  - "In Stock Only" toggle
- [ ] "Clear All Filters" button

### 6.3 Sorting Controls
- [ ] Dropdown with options:
  - "Featured" (default)
  - "Price: Low to High"
  - "Price: High to Low"
  - "Name: A-Z"
  - "Newest Arrivals"
  - "Best Sellers"
  - "Customer Rating"

### 6.4 Product Grid
- [ ] Responsive grid (4 cols desktop, 3 tablet, 2 mobile)
- [ ] Product cards for all matching products
- [ ] "No products found" state when filters return empty

### 6.5 URL State Management
- [ ] Filters reflected in URL query params
- [ ] Shareable/bookmarkable filter states
- [ ] Back/forward browser navigation works

---

## Phase 7: Product Detail Page (product.html)

### 7.1 Product Images Section
- [ ] Main large image display
- [ ] Thumbnail gallery (click to change main image)
- [ ] Image zoom on hover (optional enhancement)

### 7.2 Product Info Section
- [ ] Product name (h1)
- [ ] Price display
- [ ] Star rating with review count link
- [ ] Short description
- [ ] Color selector (swatches)
- [ ] Size selector (buttons/dropdown)
- [ ] Size guide link (opens modal)
- [ ] Quantity selector
- [ ] "Add to Cart" button (large, prominent)
- [ ] Stock status indicator
- [ ] "Free shipping" reminder

### 7.3 Product Details Tabs/Accordion
- [ ] **Description Tab**: Full product description
- [ ] **Specifications Tab**: Dimensions, materials, care instructions
- [ ] **Reviews Tab**: Customer reviews with:
  - Overall rating summary
  - Rating breakdown (5-star, 4-star, etc.)
  - Individual review cards (name, date, rating, text)

### 7.4 Related Products Section
- [ ] "You May Also Like" heading
- [ ] 4 products from same category
- [ ] Product cards

---

## Phase 8: Cart Page (cart.html)

### 8.1 Cart Items List
- [ ] For each item display:
  - Product image (thumbnail)
  - Product name (links to product page)
  - Selected color
  - Selected size
  - Unit price
  - Quantity selector (editable)
  - Line item total
  - Remove button
- [ ] Empty cart state with "Continue Shopping" link

### 8.2 Promo Code Section
- [ ] Input field for promo code
- [ ] "Apply" button
- [ ] Success/error message display
- [ ] Show applied discount with "Remove" option

### 8.3 Order Summary
- [ ] Subtotal
- [ ] Discount (if promo applied, show code and amount)
- [ ] Shipping: "FREE"
- [ ] Estimated Total
- [ ] "Proceed to Checkout" button

### 8.4 Continue Shopping
- [ ] "Continue Shopping" link back to shop page

---

## Phase 9: Checkout Page (checkout.html)

### 9.1 Checkout Layout
- [ ] Two-column layout: Form (left), Order Summary (right)
- [ ] Progress indicator (optional): Cart > Checkout > Confirmation

### 9.2 Contact Information Section
- [ ] Email address input
- [ ] Phone number input (optional)

### 9.3 Shipping Address Section
- [ ] First name
- [ ] Last name
- [ ] Address line 1
- [ ] Address line 2 (optional)
- [ ] City
- [ ] State/Province dropdown
- [ ] Zip/Postal code
- [ ] Country dropdown

### 9.4 Payment Information Section
- [ ] Card number input (with formatting)
- [ ] Cardholder name
- [ ] Expiry date (MM/YY)
- [ ] CVV
- [ ] Fake "secure payment" badges

### 9.5 Order Summary Sidebar
- [ ] List of items (mini view)
- [ ] Subtotal
- [ ] Discount (if applied)
- [ ] Shipping: FREE
- [ ] Total

### 9.6 Form Validation
- [ ] Real-time validation as user types
- [ ] Error messages below each field
- [ ] Highlight invalid fields
- [ ] Disable submit until form is valid
- [ ] "Place Order" button

---

## Phase 10: Order Confirmation Page (confirmation.html)

### 10.1 Success Message
- [ ] Checkmark icon
- [ ] "Thank You for Your Order!"
- [ ] "Confirmation #" display (generated number)
- [ ] "A confirmation email has been sent to [email]"

### 10.2 Order Details
- [ ] Shipping address display
- [ ] Payment method (masked card number)
- [ ] Order items list
- [ ] Order total

### 10.3 Next Steps
- [ ] "Continue Shopping" button
- [ ] Estimated delivery message (fake: "3-5 business days")

---

## Phase 11: Informational Pages

### 11.1 About Us Page (about.html)
- [ ] Hero section with company "history"
- [ ] Founder story (comically serious origin story)
- [ ] Mission statement about mustache dignity
- [ ] "Our Team" section with fake team members and absurd titles
- [ ] Company values (quality, precision, mustache excellence)

### 11.2 FAQ Page (faq.html)
- [ ] Accordion-style Q&A format
- [ ] Categories:
  - Ordering & Shipping
  - Product Information
  - Returns & Exchanges
  - Mustache Care
- [ ] 12-15 questions with deadpan serious answers
- [ ] Questions like "Will this work with a handlebar mustache?" answered earnestly

### 11.3 Contact Page (contact.html)
- [ ] Contact form (fake - just shows success message):
  - Name
  - Email
  - Subject dropdown
  - Message
  - Submit button
- [ ] "Contact Information":
  - Fake address
  - Fake phone number
  - Fake email
- [ ] Business hours
- [ ] Embedded map placeholder

### 11.4 Return Policy Page (returns.html)
- [ ] Clear heading: "Return Policy"
- [ ] 30-day return policy details
- [ ] Conditions for returns
- [ ] How to initiate a return (fake process)
- [ ] Refund timeline
- [ ] Exchange policy
- [ ] "Satisfaction Guaranteed" emphasis

---

## Phase 12: Polish & Final Touches

### 12.1 Responsive Design Audit
- [ ] Test all pages at mobile breakpoint (320px-480px)
- [ ] Test all pages at tablet breakpoint (768px)
- [ ] Test all pages at desktop (1024px+)
- [ ] Fix any layout issues
- [ ] Ensure touch targets are adequate on mobile

### 12.2 Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

### 12.3 Performance Optimization
- [ ] Minify CSS
- [ ] Minify JavaScript
- [ ] Optimize any images
- [ ] Add loading="lazy" to images below fold

### 12.4 Final Content Review
- [ ] Proofread all copy
- [ ] Ensure consistent tone throughout
- [ ] Check all links work
- [ ] Verify promo code works correctly

### 12.5 Deployment
- [ ] Connect repository to Netlify
- [ ] Configure build settings (if any)
- [ ] Deploy to production
- [ ] Test live site
- [ ] Set up custom domain (if applicable)

---

## Phase 13: Image Generation (Future Phase)

### 13.1 Prepare Image Prompts
- [ ] Write detailed prompts for each of the 12 products
- [ ] Define consistent style guidelines for all images
- [ ] Specify dimensions and format requirements

### 13.2 Generate Images
- [ ] Generate images using Google Imagen API
- [ ] Generate 2-3 images per product (different angles)
- [ ] Review and regenerate any unsatisfactory images

### 13.3 Integrate Images
- [ ] Replace placeholder images with generated images
- [ ] Optimize images for web (compress, resize)
- [ ] Update product data with new image paths
- [ ] Test all image displays

### 13.4 Additional Images
- [ ] Generate hero image for landing page
- [ ] Generate category images
- [ ] Generate About page team photos (comical AI portraits)
- [ ] Generate any other needed imagery

---

## Appendix A: Product Data Reference

### Category 1: Precision Shapers
| # | Name | Price | Colors | Sizes |
|---|------|-------|--------|-------|
| 1 | The Executive Shaper Pro | $49.99 | Black, Mahogany, Silver | S, M, L, XL |
| 2 | Contour Master 3000 | $34.99 | Onyx, Walnut | One Size |
| 3 | Precision Arc Trainer | $42.99 | Chrome, Matte Black, Rose Gold | S, M, L |

### Category 2: Croc-Style Fun-cessories
| # | Name | Price | Colors | Sizes |
|---|------|-------|--------|-------|
| 4 | The Handlebar Croc | $24.99 | Classic Black, Racing Red, Ocean Blue, Neon Green | S, M, L |
| 5 | Ventilated Fun-Stache | $19.99 | White, Pink, Camo, Tie-Dye | One Size |
| 6 | Swiss Cheese Whisker Wear | $22.99 | Yellow, White, Orange | S, M, L, XL |

### Category 3: Support & Lift Systems
| # | Name | Price | Colors | Sizes |
|---|------|-------|--------|-------|
| 7 | The Elevate X1 Harness | $89.99 | Professional Black, Executive Brown | M, L, XL |
| 8 | Anti-Gravity Curl System | $74.99 | Stealth Black, Champagne | S, M, L |
| 9 | Dual-Point Lift Apparatus | $64.99 | Black, Tan, Gray | S, M, L, XL |

### Category 4: Night Guards & Sleepwear
| # | Name | Price | Colors | Sizes |
|---|------|-------|--------|-------|
| 10 | The DreamGuard Deluxe | $54.99 | Midnight Blue, Lavender, Charcoal | S, M, L |
| 11 | Nocturnal Curl Protector | $39.99 | Black, Navy | M, L, XL |
| 12 | SleepSecure Mustache Bonnet | $29.99 | Silk White, Blush, Slate | One Size |

---

## Appendix B: Page Routes

| Page | File | URL Path |
|------|------|----------|
| Home | index.html | / |
| Shop | pages/shop.html | /pages/shop.html |
| Product Detail | pages/product.html | /pages/product.html?id={productId} |
| Cart | pages/cart.html | /pages/cart.html |
| Checkout | pages/checkout.html | /pages/checkout.html |
| Confirmation | pages/confirmation.html | /pages/confirmation.html |
| About | pages/about.html | /pages/about.html |
| FAQ | pages/faq.html | /pages/faq.html |
| Contact | pages/contact.html | /pages/contact.html |
| Returns | pages/returns.html | /pages/returns.html |

---

## Appendix C: LocalStorage Keys

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `mh_cart` | Shopping cart items | Array of cart item objects |
| `mh_promo` | Applied promo code | String or null |
| `mh_orders` | Order history | Array of order objects |

---

## Estimated Task Count Summary

| Phase | Tasks |
|-------|-------|
| Phase 1: Setup & Brand | 15 |
| Phase 2: Product Data | 20 |
| Phase 3: JS Modules | 25 |
| Phase 4: Components | 18 |
| Phase 5: Landing Page | 12 |
| Phase 6: Shop Page | 14 |
| Phase 7: Product Page | 12 |
| Phase 8: Cart Page | 8 |
| Phase 9: Checkout Page | 12 |
| Phase 10: Confirmation | 6 |
| Phase 11: Info Pages | 16 |
| Phase 12: Polish | 14 |
| Phase 13: Images | 12 |
| **TOTAL** | **~184 tasks** |
