# Phase A: Wine With Pete Redesign Blueprint

## 1. Framework & Tooling Audit

### Current Stack
- **Framework**: Next.js 15.5.7 (App Router)
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: Radix UI primitives (Navigation Menu, Separator, Slot)
- **Typography**: Google Fonts (Inter, Playfair Display, Crimson Text)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email Services**: Multiple integrations (Kit.co, Loops, ConvertKit, Resend)
- **Type Safety**: TypeScript 5
- **Forms**: React Hook Form + Zod validation

### Styling Approach
- Custom CSS variables for brand colors (ember, gold, cream, charcoal)
- Tailwind utility classes with custom extensions
- Custom animations (fadeIn, slideUp, scaleIn)
- Mobile-first responsive design
- Custom button and card styles with hover effects

### Routing
- App Router structure (`src/app/`)
- Current routes:
  - `/` - Home
  - `/about` - About page
  - `/events` - Events page
  - `/archive` - Essays (Substack embed)
  - `/store` - Store/Products
  - `/support` - Support/Donations
  - `/join` - Newsletter signup
  - `/wine-with` - Host application (likely)
  - `/december-reset` - Special landing page
  - `/admin` - Admin dashboard
  - `/store/success` - Checkout success

### CMS/Substack Integration
- **Substack**: External link to `winewithpete.substack.com`
- **Archive page**: Uses Substack embed iframe
- **No direct API integration** - essays are hosted externally
- **Newsletter**: Separate from Substack, stored in Supabase

### Store Integration
- Products stored in Supabase `products` table
- API endpoint: `/api/products` (fetches active products)
- Stripe checkout flow via `/api/checkout`
- **Current Issue**: Store page shows "Loading products..." indefinitely if:
  - API fails silently
  - Products array is empty
  - No fallback UI for empty state

## 2. Current Routes & Key Components

### Routes
```
/                    → Home (hero, pathways, what to expect)
/about              → About (mission, Pete story, values)
/events             → Events (Open Fire Sundays, Salon Dinners)
/archive            → Essays (Substack embed)
/store              → Store (products grid, checkout modal)
/store/success      → Checkout success page
/support            → Support (donation tiers)
/join               → Newsletter signup
/wine-with          → Host application (likely)
/december-reset      → Special landing page
/admin               → Admin dashboard
```

### Key Components
- `SiteHeader` - Navigation with mobile menu
- `SiteFooter` - Footer with links
- `EventCard` - Event display card
- `EventsList` - Events listing (commented out in events page)
- `HostApplicationModal` - Host application form
- UI components: Button, Card, Input, Badge, Textarea, NavigationMenu, Separator

## 3. Current Issues Hurting Conversion & Trust

### Critical Issues
1. **Store Loading State**: Shows "Loading products..." with no timeout or empty state fallback
2. **No Clear Primary CTA**: "Join the Circle" exists but not prominently featured on all pages
3. **Missing "Start Here" Path**: No onboarding flow for new visitors
4. **Events Page Incomplete**: Events list is commented out, no interest collection form
5. **Archive Page**: Just an iframe embed - no featured essays or clear value prop
6. **Support Page**: Has TODO comments for email/name collection
7. **Home Page**: Hero is beautiful but pathways are equal weight - no clear hierarchy
8. **No Lead Magnet**: Newsletter signup lacks compelling incentive
9. **Store Empty State**: If products fail to load or are empty, user sees nothing useful

### Trust Issues
- Store appears broken if products don't load
- No clear social proof beyond hardcoded numbers
- Events page doesn't show upcoming events or collect interest
- Support page has incomplete payment flow (hardcoded email)

### Conversion Issues
- Newsletter signup buried in navigation
- No email capture on home page (only in /join)
- Store doesn't guide users to newsletter if empty
- Events page doesn't convert interest into leads

## 4. Proposed Information Architecture

### Navigation Structure
```
Primary Nav:
- Home
- Start Here (NEW)
- Essays
- Gatherings (renamed from Events)
- Recipes (renamed from Store)
- About
- Join (primary CTA - always visible)

Footer:
- Explore: Start Here, Essays, Gatherings, Recipes, About
- Connect: Join Newsletter, Support, Contact
- Social links (if applicable)
```

### URL Structure (Preserve Existing)
- `/` → Home (redesigned)
- `/start-here` → NEW - Onboarding path
- `/essays` → Rename from `/archive` (add redirect)
- `/gatherings` → Rename from `/events` (add redirect)
- `/recipes` → Rename from `/store` (add redirect)
- `/about` → About (enhanced)
- `/join` → Newsletter (enhanced)
- `/support` → Support (fixed)

## 5. Page-by-Page Plan

### HOME PAGE (`/`)

**Hero Section**
- Short positioning statement (1-2 lines)
- Primary CTA: "Join the Circle" (newsletter)
- Secondary CTA: "Start Here" (onboarding)
- Optional: Subtle background image (existing campfire image)

**Social Proof / Credibility**
- "What this is" - 2-3 sentence description
- "Who it's for" - Target audience clarity
- "How it works" - Simple 3-step process
- Optional: Real testimonials or community stats (if available)

**Featured Pathways (3 Cards)**
1. **Read** - Essays (link to /essays)
2. **Gather** - Events/Gatherings (link to /gatherings)
3. **Cook** - Recipes (link to /recipes)

**Featured Essay Section**
- Pull from Substack if possible (via RSS or manual curation)
- Or: Show 2-3 curated essay links with titles + excerpts
- Clear CTA to read more on Substack
- TODO: Add Substack RSS integration or manual curation system

**Email Capture Section**
- Compelling lead magnet: "Get a free Fire Ritual recipe card"
- Simple email form (inline, not modal)
- Clear value prop: "Join 200+ people exploring slow living"
- Link to full newsletter benefits

**Footer**
- Simple nav + social links
- Newsletter signup reminder

### START HERE PAGE (`/start-here`) - NEW

**Purpose**: Onboarding path for new visitors

**Structure**:
1. **Welcome Section**
   - "Welcome to Wine With Pete"
   - Brief orientation (what this is, why it matters)

2. **Step 1: Read One Essay**
   - Featured essay link (curated flagship piece)
   - Or: Link to Substack with specific essay highlighted
   - "Start here to understand what we're about"

3. **Step 2: Join the Circle**
   - Newsletter signup form (inline)
   - Clear benefits: weekly insights, recipes, event invites
   - Lead magnet: "Get your free Fire Ritual recipe card"

4. **Step 3: Try One Recipe**
   - Link to recipes page
   - Or: Featured recipe card preview
   - "Experience the practice"

5. **Step 4: Express Interest in Gathering**
   - Link to gatherings page
   - Interest form (name, email, location, interest type)
   - "Join us around the fire"

**Design**: Progressive disclosure, step-by-step feel, completion checkmarks

### GATHERINGS PAGE (`/gatherings` - renamed from `/events`)

**Hero**
- "Gatherings" title
- Brief description of event types

**Event Types** (keep existing content)
- Open Fire Sundays
- Salon Dinners

**Upcoming Events Section**
- If events exist: Display upcoming events from API
- If no events: Show "Upcoming gatherings are seasonal and location-based"
- Clear messaging about timing

**Interest Collection Form** (NEW)
- Fields: Name, Email, Location (city/state), Interest Type (attend/host/collaborate)
- Submit to `/api/events/rsvp` or new `/api/gatherings/interest` endpoint
- Success message: "We'll notify you when gatherings are announced in your area"

**Host Application** (if applicable)
- Link to host application page or modal
- "Interested in hosting? Apply here"

### RECIPES PAGE (`/recipes` - renamed from `/store`)

**Hero**
- "Recipes & Guides" title
- Description: Digital resources for fire cooking and community building

**Products Display**
- If products exist: Show product grid (existing design)
- If products empty/fail: Show "Recipe Bundles Coming Soon" section
  - 3-6 placeholder product cards with:
    - Title (e.g., "Fire Ritual Recipe Bundle")
    - Description
    - "Coming Soon" badge
    - CTA: "Join newsletter for release announcements"
  - Clear messaging: "We're curating our first recipe bundles. Join the newsletter to be notified when they're available."

**Never Show Empty State**
- Always show meaningful content
- Guide users to newsletter if products unavailable
- Maintain trust with clear communication

**Philosophy Section** (keep existing)
- Why we build this
- Values around fire, connection, community

### ESSAYS PAGE (`/essays` - renamed from `/archive`)

**Hero**
- "Essays & Writings" title
- Description of essay style and topics

**Featured Essays Section** (NEW)
- 3-5 curated essay links (manual or RSS)
- Title, excerpt, read time
- Link to Substack
- TODO: Add Substack RSS integration or manual curation

**Substack Embed** (keep existing)
- Full Substack embed for browsing

**Newsletter CTA**
- "Get weekly essays delivered" section
- Link to /join

### ABOUT PAGE (`/about`)

**Enhancements**:
- More personal founder story
- Specific values (authenticity, slow connection, community)
- What the project is becoming (essays + gatherings + recipes + media)
- Warm, grounded tone (maintain existing style)
- Clear CTAs: Join, Host, Support

### SUPPORT PAGE (`/support`)

**Fixes**:
- Remove TODO comments
- Add proper email/name collection form before payment
- Clear options: Share, Subscribe, Attend, Buy, Donate
- Gracious tone (avoid guilt)
- Thank you messaging

### JOIN PAGE (`/join`)

**Enhancements**:
- Keep existing structure (it's good)
- Add lead magnet prominently: "Get a free Fire Ritual recipe card"
- Ensure email capture is primary focus
- Success state is good (keep it)

## 6. Copy Outlines (Brand Voice)

### Home Page

**Hero Headline**:
"Fire, food, and the slow unfolding of conversation."

**Subheadline**:
"We gather around open flames to pause, listen, and turn toward what matters."

**Primary CTA**: "Join the Circle"
**Secondary CTA**: "Start Here"

**What This Is**:
"Wine With Pete is a community built around open-fire food, thoughtful wine, and salon-style conversation. We create spaces where people can slow down, share stories, and build genuine connections."

**Who It's For**:
"For those who feel disconnected in a hyper-connected world. For people who value depth over breadth, quality over quantity, and conversations that stay with you long after the fire burns out."

**How It Works**:
"Read our weekly essays. Join our newsletter for recipes and insights. Attend gatherings in your area. Cook together. Talk honestly. Build something real."

**Featured Essay Section**:
"Start with one essay"
[Featured essay title + excerpt]
"Read on Substack →"

**Email Capture**:
"Get a free Fire Ritual recipe card"
"Join 200+ people exploring slow living, one fire at a time."

### Start Here Page

**Welcome**:
"Welcome to Wine With Pete. Here's how to begin."

**Step 1**:
"Read one essay"
"Start with [Featured Essay Title]. This piece captures what we're about."
[Link to essay]

**Step 2**:
"Join the Circle"
"Get weekly insights, recipe cards, and invitations to gather."
[Email form]
"Get your free Fire Ritual recipe card when you join."

**Step 3**:
"Try one recipe"
"Experience the practice of fire cooking with our curated recipes."
[Link to recipes]

**Step 4**:
"Express interest in a gathering"
"Let us know if you'd like to attend, host, or collaborate on a gathering in your area."
[Interest form]

### Gatherings Page

**Hero**:
"Gatherings"
"Wine With Pete events are an invitation to slow down. We host two types of gatherings."

**No Events State**:
"Upcoming gatherings are seasonal and location-based. We'll announce dates and locations as they're confirmed."

**Interest Form**:
"Let us know you're interested"
"We'll notify you when gatherings are announced in your area. You can also express interest in hosting or collaborating."

### Recipes Page

**Hero**:
"Recipes & Guides"
"Digital resources for fire cooking and building community around honest conversation."

**Empty State**:
"Recipe Bundles Coming Soon"
"We're curating our first collection of fire-friendly recipes and guides. Join the newsletter to be notified when they're available."

**Placeholder Products**:
- "Fire Ritual Recipe Bundle" - "Essential recipes for your first gathering"
- "Conversation Starters Guide" - "Questions and prompts for deeper dialogue"
- "Hosting Handbook" - "How to create meaningful gatherings in your community"

### Essays Page

**Hero**:
"Essays & Writings"
"Weekly philosophical essays exploring disconnection, truth, and the search for something real."

**Featured Section**:
"Start Here"
[3-5 curated essays with titles and excerpts]

### About Page

**Founder Story** (enhance existing):
"After years of feeling disconnected in a hyper-connected world, I started hosting small gatherings around fire and food. What began as informal beach fires with friends has grown into a community of people who value depth, authenticity, and the kind of conversations that matter."

**What We're Becoming**:
"Wine With Pete is evolving into a platform for essays, gatherings, recipes, and media that support slow living and genuine connection. We're building something that extends beyond individual events into a movement toward more meaningful relationships."

### Support Page

**Opening**:
"This work is built on stories, sips, firelight, and real support. If you've ever read something here that made you pause, breathe, or feel a little less alone, thank you. That means we met."

**Options**:
- Share with others
- Subscribe to newsletter
- Attend a gathering
- Buy a recipe bundle
- Support financially (donation tiers)

**Tone**: Gracious, not guilt-inducing

## 7. Implementation Plan

### File Map

#### New Files to Create
```
src/app/start-here/page.tsx                    → New onboarding page
src/app/essays/page.tsx                        → Renamed from archive (with redirect)
src/app/gatherings/page.tsx                    → Renamed from events (with redirect)
src/app/recipes/page.tsx                       → Renamed from store (with redirect)
src/app/api/gatherings/interest/route.ts       → New interest collection endpoint
src/components/gathering-interest-form.tsx     → Interest form component
src/components/featured-essay-card.tsx        → Essay card component
src/components/recipe-placeholder-card.tsx     → Placeholder product card
```

#### Files to Modify
```
src/app/page.tsx                                → Redesign home page
src/app/about/page.tsx                          → Enhance about page
src/app/join/page.tsx                           → Add lead magnet prominently
src/app/support/page.tsx                        → Fix payment form, improve copy
src/components/site-header.tsx                  → Update nav (Start Here, rename routes)
src/components/site-footer.tsx                  → Update footer links
src/app/layout.tsx                              → Update metadata if needed
```

#### Redirects to Add
```
/archive → /essays (301 redirect)
/events → /gatherings (301 redirect)
/store → /recipes (301 redirect)
```

### Implementation Steps

1. **Create redirects** (next.config.ts or middleware)
2. **Update navigation** (header + footer)
3. **Redesign home page** (hero, pathways, email capture)
4. **Create Start Here page** (onboarding flow)
5. **Rename and enhance Essays page** (add featured section)
6. **Rename and enhance Gatherings page** (add interest form)
7. **Rename and enhance Recipes page** (fix empty state, add placeholders)
8. **Enhance About page** (more personal, clearer vision)
9. **Fix Support page** (proper form, better copy)
10. **Enhance Join page** (lead magnet)
11. **Create interest collection API** (gatherings interest form)
12. **Test all routes** (ensure redirects work, no broken links)

### Design System Refinements

**Typography Scale** (existing is good):
- Display: `clamp(2.5rem, 5vw, 4rem)` - Playfair Display
- Hero: `clamp(1.875rem, 4vw, 3rem)` - Playfair Display
- Section: `clamp(1.5rem, 3vw, 2.25rem)` - Playfair Display
- Body: Inter (default)

**Spacing** (existing is good):
- Section: `clamp(4rem, 8vw, 8rem)` vertical padding
- Content: `clamp(2rem, 4vw, 4rem)` vertical padding

**Button Styles** (existing is good):
- Primary: `btn-ember` (ember background, white text)
- Secondary: Outline variant with ember border
- Rounded-full for primary CTAs

**Card Styles** (existing is good):
- `card-enhanced` with hover effects
- White background, subtle shadow, rounded-2xl

**Color Palette** (existing is good):
- Ember: `#5b2320` (primary)
- Gold: `#c98a2b` (accent)
- Cream: `#f6f3ef` (background)
- Charcoal: `#1f1f1f` (text)

### TODOs for Future Implementation

1. **Substack RSS Integration** (`src/lib/substack.ts`)
   - Fetch latest essays via RSS
   - Display on home and essays pages
   - Location: Create new file, integrate into pages

2. **Manual Essay Curation** (if RSS not available)
   - Create `src/data/featured-essays.ts`
   - Manually maintain list of featured essays
   - Update periodically

3. **Product Feed Hookup** (when ready)
   - Ensure `/api/products` returns data
   - Test store page with real products
   - Remove placeholder products when live

4. **Gathering Interest Database**
   - Create `gathering_interests` table in Supabase
   - Store: name, email, location, interest_type, created_at
   - Add to admin dashboard for viewing

5. **Lead Magnet Delivery**
   - Create "Fire Ritual Recipe Card" PDF
   - Set up email automation to send on newsletter signup
   - Or: Direct download link after signup

## Summary

This blueprint provides:
- Complete audit of current stack and structure
- Identification of conversion and trust issues
- New information architecture with preserved URLs
- Detailed page-by-page redesign plan
- Copy outlines matching brand voice
- Implementation plan with file map
- Clear TODOs for future work

Ready to proceed to Phase B: Implementation.

