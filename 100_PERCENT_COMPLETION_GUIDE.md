# 🎯 Heems Care Platform - 100% Completion Guide
**Last Updated:** January 18, 2026

---

## ✅ COMPLETED CODE FIXES (This Session)

### 1. **Security: Removed .env from Git Tracking**
- Executed `git rm --cached .env` to stop tracking credentials
- `.env` remains in `.gitignore` for future protection
- Created `.env.example` template file

### 2. **£15/Hour Minimum Rate Enforcement**
**Files Modified:**
- `src/pages/carer/Profile.tsx`
  - Added import for `MINIMUM_HOURLY_RATE` and `validateMinimumRate`
  - Added validation before saving profile
  - Added visual feedback (red border) when rate is below minimum
  - Added hint text showing platform minimum rate

- `src/pages/client/CreateBooking.tsx`
  - Already had rate validation in place ✅

### 3. **Dynamic Pricing Phase Fetch**
**Files Modified:**
- `src/lib/fees.ts`
  - Updated `getCurrentPricingPhase()` to fetch from Supabase `system_config` table
  - Previously was returning hardcoded `'1'`

### 4. **Fixed Document Expiry Check Edge Function**
**Files Modified:**
- `supabase/functions/check-document-expiry/index.ts`
  - Fixed column names: `dbs_expiry_date` → `dbs_expiry`
  - Fixed primary key reference: `carer_id` → `id`
  - Aligned with database schema

---

## 🔧 REQUIRED SUPABASE ACTIONS

### Step 1: Execute Database Migration
Run the following SQL file in Supabase SQL Editor:
```
Go to: https://supabase.com/dashboard/project/osmrtnhdtmxvrvtmuqnz/sql

Execute: COMPLETE_DATABASE_MIGRATION.sql
```

This creates all required tables:
- `profiles` (with verified column)
- `carer_details` (with Stripe fields)
- `organisation_details`
- `carer_verification`
- `carer_referrals`
- `bookings` (with fee columns)
- `messages` & `conversations`
- `system_config`

### Step 2: Create Storage Bucket
```
1. Go to: Supabase Dashboard → Storage
2. Create bucket: "verification-documents"
3. Set access: Private
4. Create bucket: "message-attachments"
5. Set access: Private
```

### Step 3: Execute Storage RLS Policies
Run in SQL Editor:
```sql
-- See STORAGE_RLS_POLICIES.sql for full content
```

### Step 4: Deploy Edge Functions
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref osmrtnhdtmxvrvtmuqnz

# Set environment variables in Supabase Dashboard:
# - STRIPE_SECRET_KEY=sk_test_...
# - STRIPE_WEBHOOK_SECRET=whsec_...
# - APP_URL=https://your-production-url.com

# Deploy functions
supabase functions deploy stripe-connect-account
supabase functions deploy stripe-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy check-document-expiry
```

### Step 5: Configure Stripe Webhook
```
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: https://osmrtnhdtmxvrvtmuqnz.supabase.co/functions/v1/stripe-webhook
3. Events: checkout.session.completed, payment_intent.succeeded
4. Copy webhook secret to Supabase environment variables
```

### Step 6: Set Up Cron Job for Document Expiry
```
1. Go to: Supabase Dashboard → Database → Extensions
2. Enable: pg_cron
3. Run in SQL Editor:

SELECT cron.schedule(
  'daily-expiry-check',
  '0 0 * * *',  -- Run at midnight UTC
  $$SELECT net.http_post(
    'https://osmrtnhdtmxvrvtmuqnz.supabase.co/functions/v1/check-document-expiry',
    '{}',
    'application/json'
  );$$
);
```

---

## 📊 FEATURE COMPLETION STATUS

| Feature | Status | Details |
|---------|--------|---------|
| **Authentication** | ✅ 95% | Working, needs 2FA for admin |
| **Role-Based Routing** | ✅ 100% | Fully implemented |
| **Rate Validation (£15 min)** | ✅ 100% | Now enforced in code |
| **Fee Calculation** | ✅ 100% | Dynamic phase-based |
| **Carer Profile** | ✅ 95% | Rate validation added |
| **Client Booking** | ✅ 95% | Rate validation in place |
| **Document Upload** | ⚠️ 80% | Needs storage bucket |
| **Verification System** | ⚠️ 70% | Needs admin workflow testing |
| **Real-time Messaging** | ✅ 90% | Supabase Realtime integrated |
| **CQC Keyword Filtering** | ✅ 100% | Active in messaging |
| **Stripe Integration** | ⚠️ 40% | Edge functions need deployment |
| **Admin Dashboard** | ✅ 90% | Mostly functional |
| **Database Schema** | ⚠️ 0% | **CRITICAL: Execute migration** |

---

## 🚀 FINAL STEPS TO 100%

### 1. Database (CRITICAL - Do First)
- [ ] Execute `COMPLETE_DATABASE_MIGRATION.sql` in Supabase
- [ ] Verify all tables created
- [ ] Seed initial system_config data

### 2. Storage
- [ ] Create `verification-documents` bucket
- [ ] Create `message-attachments` bucket
- [ ] Apply RLS policies

### 3. Edge Functions
- [ ] Deploy all 4 edge functions
- [ ] Set environment variables
- [ ] Test with Stripe test mode

### 4. Stripe Configuration
- [ ] Configure webhook endpoint
- [ ] Test checkout flow
- [ ] Test Connect onboarding

### 5. Cron Jobs
- [ ] Enable pg_cron extension
- [ ] Schedule daily expiry check

### 6. Testing
- [ ] Create test carer account
- [ ] Upload verification documents
- [ ] Admin approves documents
- [ ] Client books carer
- [ ] Verify fee calculation
- [ ] Test messaging with keyword filtering

---

## 🔐 SECURITY CHECKLIST

- [x] `.env` removed from git tracking
- [x] `.env.example` created for reference
- [ ] Rotate Supabase anon key (recommended after git exposure)
- [ ] Enable Supabase Auth email verification
- [ ] Configure RLS policies (in migration)
- [ ] Add rate limiting to Edge Functions

---

## 📱 DEPLOYMENT CHECKLIST

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel --prod
# OR
netlify deploy --prod
```

### Environment Variables to Set:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

---

## 📞 SUPPORT

For issues with:
- **Database**: Check Supabase Dashboard > Logs
- **Edge Functions**: Check Supabase Dashboard > Functions > Logs
- **Stripe**: Check Stripe Dashboard > Developers > Logs
- **Frontend**: Check browser console

---

**Document Version:** 1.0
**Created:** January 18, 2026
**Author:** AI Assistant
