# 🚀 Sunday Launch Checklist - Wine With Pete

## ✅ **COMPLETED ITEMS**
- ✅ Complete Stripe integration with checkout flow
- ✅ All pages built and functional
- ✅ Database schema and API routes
- ✅ SEO optimization with meta tags
- ✅ 404 page and sitemap
- ✅ Admin dashboard
- ✅ Newsletter signup functionality

## 🎯 **CRITICAL ITEMS TO COMPLETE**

### **1. Environment Setup (30 mins)**
```bash
# Create .env.local with these variables:
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **2. Database Setup (15 mins)**
```sql
-- Run this in Supabase SQL editor:
INSERT INTO products (id, name, description, price, product_type, file_path, is_active) VALUES
('open-fire-collection', 'Open Fire Sunday Collection', '5 carefully crafted recipes designed for cooking over open fire. Includes wine pairings and conversation starters.', 12.99, 'recipe_card', 'recipe-cards/open-fire-collection.pdf', true),
('pre-prep-cards', 'Pre-Prep Recipe Cards', '3 recipes designed to be prepped the night before and cooked at the fire. Perfect for busy schedules.', 8.99, 'recipe_card', 'recipe-cards/pre-prep-cards.pdf', true);
```

### **3. Supabase Storage Setup (20 mins)**
1. Create bucket: `digital-products`
2. Upload your recipe card PDFs
3. Set RLS policies for secure access

### **4. Stripe Webhook Setup (15 mins)**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
3. Enable events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook secret

### **5. Testing Checklist (45 mins)**

#### **Core Functionality**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Events page displays events
- [ ] RSVP form submits successfully
- [ ] Store page loads with products
- [ ] Newsletter signup works
- [ ] About, Support, Join pages load

#### **Stripe Integration**
- [ ] "Buy Now" buttons work
- [ ] Stripe checkout opens
- [ ] Test payment completes (use 4242 4242 4242 4242)
- [ ] Success page displays
- [ ] Order created in Supabase
- [ ] Webhook processes payment

#### **Mobile Testing**
- [ ] All pages responsive on mobile
- [ ] Checkout flow works on mobile
- [ ] Forms are mobile-friendly

#### **SEO & Performance**
- [ ] Meta tags display correctly
- [ ] Open Graph images show
- [ ] Sitemap accessible at /sitemap.xml
- [ ] 404 page works
- [ ] Page load speeds acceptable

### **6. Content Completion (30 mins)**
- [ ] Add real product images to store
- [ ] Complete any placeholder content
- [ ] Verify all links work
- [ ] Check for typos

### **7. Deployment Setup (60 mins)**

#### **Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add custom domain in Vercel dashboard
# Point winewithpete.me to your Vercel app
```

#### **Option B: Netlify**
```bash
# Build
npm run build

# Deploy to Netlify
# Connect GitHub repo or upload dist folder
```

### **8. Domain Configuration (30 mins)**
1. **In your domain registrar:**
   - Update DNS to point to Vercel/Netlify
   - Add CNAME record if needed

2. **In hosting platform:**
   - Add custom domain: `winewithpete.me`
   - Add `www.winewithpete.me` (optional)
   - Enable SSL certificate

### **9. Final Testing (30 mins)**
- [ ] Test on live domain
- [ ] Verify Stripe webhook works with live URL
- [ ] Test complete purchase flow
- [ ] Check email delivery (if Kit is set up)
- [ ] Verify all pages load correctly

## 🚨 **CRITICAL SUCCESS FACTORS**

### **Must Work Before Launch:**
1. **Stripe payments** - Revenue depends on this
2. **All pages load** - Basic functionality
3. **Mobile responsive** - Most users are mobile
4. **SEO meta tags** - Search visibility
5. **Domain pointing** - Users can find you

### **Nice to Have (Can Add Later):**
1. Kit email integration
2. Advanced admin features
3. Analytics tracking
4. Performance optimizations

## ⏰ **TIME ESTIMATE**
- **Total time needed**: 4-5 hours
- **Critical path**: Environment setup → Database → Testing → Deployment
- **Can be done in one day** if you focus on essentials

## 🎯 **SUNDAY GOAL**
By Sunday evening, you should have:
- ✅ Live website at winewithpete.me
- ✅ Working Stripe payments
- ✅ All core functionality tested
- ✅ Ready to take down Squarespace

## 🆘 **IF YOU GET STUCK**
1. **Stripe issues**: Check webhook URL and test keys
2. **Database issues**: Verify Supabase connection
3. **Deployment issues**: Try Vercel first (easiest)
4. **Domain issues**: DNS changes can take 24-48 hours

## 🚀 **POST-LAUNCH PRIORITIES**
1. Set up Kit email integration
2. Add real product images
3. Set up analytics
4. Create more content
5. Optimize for conversions

**You've got this! The hard work is done - now it's just deployment and testing.** 🎉
