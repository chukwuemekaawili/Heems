# Phase 4: Stripe Connect Integration - Implementation Plan

## 🎯 OBJECTIVE
Implement complete Stripe Connect payment system with automatic fee splitting based on pricing phases.

---

## 📋 REQUIREMENTS

### Stripe Account Setup
- [ ] Create Stripe account (or use existing)
- [ ] Enable Stripe Connect
- [ ] Get API keys (publishable & secret)
- [ ] Set up webhooks
- [ ] Configure Connect settings

### Environment Variables Needed
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...  # Server-side only
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🏗️ ARCHITECTURE

### Components to Build
1. **Stripe Connect Onboarding** - Carer account setup
2. **Payment Checkout** - Client payment flow
3. **Fee Splitting** - Automatic transfer to carers
4. **Earnings Dashboard** - Carer earnings view
5. **Payment History** - Client payment records
6. **Admin Monitoring** - Payment oversight

### Database Changes Needed
```sql
-- Already have these columns in bookings table:
-- rate_per_hour, client_fee, carer_fee, stripe_transfer_id

-- Need to add to carer_details:
ALTER TABLE carer_details
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false;
```

---

## 📦 PACKAGES TO INSTALL

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

---

## 🔄 IMPLEMENTATION FLOW

### 1. Carer Onboarding Flow
```
1. Carer clicks "Connect Stripe" in dashboard
2. Create Stripe Connect Express account
3. Redirect to Stripe onboarding
4. Stripe redirects back to app
5. Store stripe_account_id in database
6. Mark onboarding_complete = true
```

### 2. Payment Flow
```
1. Client creates booking
2. Calculate fees using calculateFees()
3. Create Stripe Checkout Session
4. Include application_fee_amount (platform fee)
5. Set destination to carer's Stripe account
6. Client completes payment
7. Stripe automatically:
   - Charges client total amount
   - Deducts platform fee
   - Transfers remainder to carer
8. Store payment details in bookings table
```

### 3. Fee Splitting Logic
```
Phase 1 (10% client / 0% carer):
- Client pays: £44 (£40 + £4 platform fee)
- Platform keeps: £4
- Carer receives: £40 (100% of base)

Phase 2 (12% client / 5% carer):
- Client pays: £44.80 (£40 + £4.80 platform fee)
- Platform keeps: £6.80 (£4.80 from client + £2 from carer)
- Carer receives: £38 (95% of base)
```

---

## 📝 IMPLEMENTATION STEPS

### Step 1: Install Stripe Libraries
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

### Step 2: Add Environment Variables
Create `.env.local`:
```
VITE_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

### Step 3: Create Stripe Client
`src/lib/stripe.ts`:
```typescript
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
```

### Step 4: Build Stripe Connect Onboarding Component
`src/components/payments/StripeConnectOnboarding.tsx`

### Step 5: Build Payment Checkout Component
`src/components/payments/BookingCheckout.tsx`

### Step 6: Create Supabase Edge Functions
- `stripe-connect-account` - Create Connect account
- `stripe-checkout-session` - Create payment session
- `stripe-webhook` - Handle Stripe webhooks

### Step 7: Update Carer Dashboard
Add Stripe onboarding status and earnings

### Step 8: Update Earnings Page
Show detailed payment history with fees

### Step 9: Update Admin Dashboard
Add payment monitoring and statistics

---

## 🔐 SECURITY CONSIDERATIONS

1. **Never expose secret key in frontend**
2. **Use Supabase Edge Functions for server-side operations**
3. **Validate webhook signatures**
4. **Store minimal payment data**
5. **Use Stripe's test mode during development**

---

## 🧪 TESTING PLAN

### Test Mode
- Use Stripe test keys
- Use test card: 4242 4242 4242 4242
- Test all payment flows
- Verify fee calculations
- Check webhook handling

### Production Checklist
- [ ] Switch to live keys
- [ ] Test with real bank account
- [ ] Verify webhook endpoints
- [ ] Test payout schedule
- [ ] Monitor first transactions

---

## 📊 SUCCESS METRICS

- [ ] Carers can complete Stripe onboarding
- [ ] Clients can make payments
- [ ] Fees split correctly (Phase 1 & 2)
- [ ] Carers receive payouts
- [ ] Payment history displays correctly
- [ ] Admin can monitor all payments
- [ ] Webhooks process successfully

---

## 🚀 ESTIMATED TIMELINE

- **Day 1-2:** Stripe setup & environment configuration
- **Day 3-4:** Connect onboarding implementation
- **Day 5-7:** Payment checkout & fee splitting
- **Day 8-9:** Earnings dashboard & payment history
- **Day 10:** Testing & bug fixes

**Total: 10-14 days**

---

## 📚 RESOURCES

- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Ready to start Phase 4 implementation!** 🚀
