# Stripe Connect - Deployment Guide

## 🚀 DEPLOYMENT STEPS

### 1. Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref osmrtnhdtmxvrvtmuqnz
```

### 2. Set Up Environment Variables

#### In Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Add the following secrets:

```bash
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret
APP_URL=http://localhost:5173  # Your app URL (change for production)
```

#### In Your Local `.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Deploy Edge Functions

```bash
# Deploy all functions at once
supabase functions deploy stripe-connect-account
supabase functions deploy stripe-checkout-session
supabase functions deploy stripe-webhook

# Or deploy individually
supabase functions deploy stripe-connect-account --no-verify-jwt
supabase functions deploy stripe-checkout-session --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
```

### 4. Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter webhook URL:
   ```
   https://osmrtnhdtmxvrvtmuqnz.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `transfer.created`
5. Copy the webhook signing secret
6. Add it to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### 5. Execute SQL Migrations

Run in Supabase SQL Editor:

```sql
-- 1. Add Stripe fields
-- Execute: ADD_STRIPE_FIELDS.sql

-- 2. Add payment status columns to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status 
ON bookings(payment_status);
```

### 6. Test in Development

#### Test Stripe Connect Onboarding:
1. Navigate to `/carer/earnings-enhanced`
2. Click "Connect Stripe Account"
3. Complete onboarding flow
4. Verify account status updates

#### Test Payment Flow:
1. Create a booking as a client
2. Ensure carer has Stripe account connected
3. Click "Pay Securely"
4. Use test card: `4242 4242 4242 4242`
5. Verify payment succeeds
6. Check webhook logs in Supabase

### 7. Verify Webhooks

```bash
# View webhook logs
supabase functions logs stripe-webhook

# Test webhook locally
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

---

## 🧪 TESTING

### Test Cards (Stripe Test Mode)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Test Scenarios

1. **Carer Onboarding**
   - [ ] Create Stripe account
   - [ ] Complete onboarding
   - [ ] Verify account status updates
   - [ ] Check charges_enabled = true
   - [ ] Check payouts_enabled = true

2. **Payment Flow**
   - [ ] Create booking
   - [ ] Initiate payment
   - [ ] Complete Stripe checkout
   - [ ] Verify booking status = confirmed
   - [ ] Verify payment_status = paid
   - [ ] Check carer receives correct amount

3. **Fee Splitting**
   - [ ] Phase 1: Verify 10% client fee, 0% carer fee
   - [ ] Phase 2: Verify 12% client fee, 5% carer fee
   - [ ] Check platform revenue calculation

4. **Webhooks**
   - [ ] Payment success updates booking
   - [ ] Payment failure cancels booking
   - [ ] Account update syncs status

---

## 🔐 SECURITY CHECKLIST

- [ ] Never expose `STRIPE_SECRET_KEY` in frontend
- [ ] Always verify webhook signatures
- [ ] Use HTTPS in production
- [ ] Validate all amounts server-side
- [ ] Store minimal payment data
- [ ] Use Stripe test mode during development
- [ ] Enable Stripe fraud detection
- [ ] Set up webhook retry logic

---

## 📊 MONITORING

### Stripe Dashboard
- Monitor payments
- View transfers
- Check disputes
- Analyze revenue

### Supabase Logs
```bash
# View Edge Function logs
supabase functions logs stripe-connect-account
supabase functions logs stripe-checkout-session
supabase functions logs stripe-webhook
```

### Database Queries
```sql
-- Check payment status
SELECT 
  id,
  status,
  payment_status,
  total_price,
  client_fee,
  carer_fee,
  stripe_payment_intent_id
FROM bookings
WHERE payment_status = 'paid'
ORDER BY created_at DESC;

-- Check Stripe accounts
SELECT 
  id,
  stripe_account_id,
  stripe_onboarding_complete,
  stripe_charges_enabled,
  stripe_payouts_enabled
FROM carer_details
WHERE stripe_account_id IS NOT NULL;
```

---

## 🚨 TROUBLESHOOTING

### Issue: "Function not found"
**Fix:** Deploy Edge Functions again

### Issue: "Webhook signature verification failed"
**Fix:** Check `STRIPE_WEBHOOK_SECRET` is correct

### Issue: "Account not found"
**Fix:** Ensure carer has completed Stripe onboarding

### Issue: "Payment fails"
**Fix:** Check Stripe logs for detailed error

### Issue: "Fee calculation incorrect"
**Fix:** Verify current phase in `system_config` table

---

## 📈 PRODUCTION CHECKLIST

Before going live:

- [ ] Switch to Stripe live keys
- [ ] Update webhook URL to production
- [ ] Set `APP_URL` to production domain
- [ ] Test with real bank account
- [ ] Verify payout schedule
- [ ] Enable Stripe Radar (fraud detection)
- [ ] Set up email notifications
- [ ] Configure dispute handling
- [ ] Test refund flow
- [ ] Monitor first transactions closely

---

## 💰 STRIPE FEES

**Standard Stripe Fees (UK):**
- Card payments: 1.4% + 20p
- Connect fee: None (included)
- Payout fee: None (included)

**Example Calculation:**
```
Booking: £40 (2 hours @ £20/hr)
Phase 1 (10% client / 0% carer):
  Client pays: £44.00
  Stripe fee: £0.82 (1.4% + 20p)
  Platform receives: £4.00
  Carer receives: £39.18 (£40 - Stripe fee)

Phase 2 (12% client / 5% carer):
  Client pays: £44.80
  Stripe fee: £0.83
  Platform receives: £6.80
  Carer receives: £37.17 (£38 - Stripe fee)
```

---

**Stripe integration is ready for deployment!** 🚀
