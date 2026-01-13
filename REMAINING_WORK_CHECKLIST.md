# Heems Platform - Remaining Work Checklist
**Track progress to 100% completion**

---

## ✅ PHASE 1 & 2: COMPLETE (Critical Infrastructure + Verification)

- [x] Database types system
- [x] Fee calculation utilities
- [x] CQC compliance utilities
- [x] Document upload component
- [x] Referral form component
- [x] Enhanced carer verification page
- [x] Enhanced admin verification queue
- [x] Database schema (ready for execution)
- [x] App routes updated

---

## ⏳ PHASE 3: Rate Enforcement & Pricing

### Booking Creation Updates
- [ ] Open `src/pages/client/CreateBooking.tsx`
- [ ] Import `validateMinimumRate` from `@/lib/fees`
- [ ] Add rate validation before booking creation
- [ ] Display error if rate < £15
- [ ] Show fee breakdown using `calculateFees`
- [ ] Display client total and carer earnings

### Carer Profile Updates
- [ ] Open `src/pages/carer/Profile.tsx`
- [ ] Add rate validation on hourly_rate input
- [ ] Show warning if rate < £15
- [ ] Prevent saving if rate < £15
- [ ] Display recommended rate range

### Database Constraint
- [ ] Add CHECK constraint to carer_details table:
```sql
ALTER TABLE carer_details
ADD CONSTRAINT hourly_rate_minimum
CHECK (hourly_rate >= 15.00);
```

### Phase Management Interface
- [ ] Create `src/pages/admin/PhaseControl.tsx`
- [ ] Display current phase from system_config
- [ ] Show verified carer/client counts
- [ ] Add toggle to switch Phase 1 ↔ Phase 2
- [ ] Update system_config.active_phase
- [ ] Show fee breakdown for each phase

---

## ⏳ PHASE 4: Stripe Connect Integration

### Stripe Setup
- [ ] Create Stripe account
- [ ] Get Stripe API keys
- [ ] Add to .env:
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY` (server-side)
- [ ] Install Stripe libraries:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Carer Onboarding
- [ ] Create `src/components/payments/StripeConnectOnboarding.tsx`
- [ ] Implement Connect account creation
- [ ] Store `stripe_account_id` in carer_details
- [ ] Handle onboarding completion webhook
- [ ] Display onboarding status in carer dashboard

### Payment Checkout
- [ ] Create `src/components/payments/BookingCheckout.tsx`
- [ ] Implement Stripe Checkout Session
- [ ] Calculate fees using `calculateFees` function
- [ ] Pass current phase to fee calculation
- [ ] Create payment intent with fee split
- [ ] Handle successful payment
- [ ] Store payment details in bookings table

### Payment Transfer
- [ ] Create Supabase Edge Function: `stripe-transfer`
- [ ] Implement automatic transfer to carer
- [ ] Deduct carer fee if Phase 2
- [ ] Store `stripe_transfer_id` in bookings
- [ ] Handle transfer failures

### Earnings Dashboard
- [ ] Update `src/pages/carer/Earnings.tsx`
- [ ] Fetch bookings with payment data
- [ ] Display earnings with fee breakdown
- [ ] Show Phase 1 vs Phase 2 earnings
- [ ] Add filters (date range, status)
- [ ] Export earnings report

### Payment History
- [ ] Update `src/pages/client/Payments.tsx`
- [ ] Fetch payment history from bookings
- [ ] Display fee breakdown
- [ ] Show payment status
- [ ] Add receipt download

---

## ⏳ PHASE 5: Messaging System

### Database Setup
- [ ] Create messages table:
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- [ ] Enable RLS on messages table
- [ ] Add RLS policies for sender/receiver access

### Messaging Components
- [ ] Create `src/components/messaging/MessageThread.tsx`
- [ ] Create `src/components/messaging/MessageInput.tsx`
- [ ] Create `src/components/messaging/MessageList.tsx`
- [ ] Create `src/components/messaging/ConversationList.tsx`

### Real-time Integration
- [ ] Implement Supabase Realtime subscription
- [ ] Listen for new messages
- [ ] Update UI in real-time
- [ ] Show typing indicators
- [ ] Play notification sound

### Keyword Filtering
- [ ] Import `checkMessageCompliance` from `@/lib/compliance`
- [ ] Validate message before sending
- [ ] Show warning if prohibited keywords detected
- [ ] Suggest alternative wording
- [ ] Display compliance notice

### Unread Counts
- [ ] Create hook: `useUnreadMessages`
- [ ] Display badge in navigation
- [ ] Update count in real-time
- [ ] Mark as read when viewed

---

## ⏳ PHASE 6: Enhanced Marketplace

### Postcode Search
- [ ] Install postcode library:
```bash
npm install postcodes.io-client
```
- [ ] Create `src/lib/postcode.ts` utilities
- [ ] Implement distance calculation
- [ ] Add postcode input to search
- [ ] Filter carers by radius

### Specialization Filters
- [ ] Add specialization checkboxes
- [ ] Filter carers by skills array
- [ ] Display matching specializations

### Availability Filter
- [ ] Add availability status filter
- [ ] Only show available carers
- [ ] Display availability badge

### Verification Filter
- [ ] Add "Verified Only" toggle
- [ ] Filter by `overall_status = 'verified'`
- [ ] Hide unverified carers by default
- [ ] Display verification badges

### Badge Display
- [ ] Import `getVerificationBadges` from `@/lib/compliance`
- [ ] Display badges on carer cards
- [ ] Never show raw documents
- [ ] Show expiry warnings (admin only)

---

## ⏳ PHASE 7: Booking System Enhancement

### Message-First Discovery
- [ ] Add "Message" button to carer profiles
- [ ] Open messaging interface
- [ ] Discuss rate and requirements
- [ ] Agree on rate before booking

### Rate Agreement
- [ ] Create `src/components/bookings/RateAgreement.tsx`
- [ ] Display agreed rate
- [ ] Show fee breakdown
- [ ] Require confirmation from both parties

### Locked Booking
- [ ] Prevent rate changes after agreement
- [ ] Store agreed rate in bookings
- [ ] Display locked status
- [ ] Show fee breakdown

### Booking Confirmation
- [ ] Create email template
- [ ] Send to client and carer
- [ ] Include booking details
- [ ] Include fee breakdown
- [ ] Add calendar invite

### Modification/Cancellation
- [ ] Add "Modify" button to bookings
- [ ] Allow time/date changes
- [ ] Require approval from both parties
- [ ] Handle cancellations
- [ ] Implement refund policy

### Recurring Bookings
- [ ] Add "Repeat" option
- [ ] Select frequency (daily, weekly, monthly)
- [ ] Set end date
- [ ] Create multiple bookings
- [ ] Link recurring bookings

---

## ⏳ PHASE 8: Organisation Features

### Postcode Management
- [ ] Create `src/pages/organisation/ServiceAreas.tsx`
- [ ] Add postcode input
- [ ] Set service radius
- [ ] Display coverage map
- [ ] Save to organisation_details

### Staff Bank
- [ ] Create organisation_staff table
- [ ] Add carers to staff bank
- [ ] Display staff list
- [ ] Show availability
- [ ] Assign to bookings

### Bulk Booking
- [ ] Create `src/pages/organisation/BulkBooking.tsx`
- [ ] Select multiple carers
- [ ] Set recurring schedule
- [ ] Calculate total cost
- [ ] Create multiple bookings

### Organisation Analytics
- [ ] Update `src/pages/organisation/Analytics.tsx`
- [ ] Display booking statistics
- [ ] Show spending breakdown
- [ ] Staff utilization metrics
- [ ] Export reports

---

## ⏳ PHASE 9: Admin Control Center

### Phase Control
- [ ] Add to `src/pages/admin/Dashboard.tsx`
- [ ] Display current phase
- [ ] Show trigger conditions (30+ verified carers)
- [ ] Add manual override toggle
- [ ] Log phase changes

### User Management
- [ ] Update `src/pages/admin/Users.tsx`
- [ ] Add suspend/activate buttons
- [ ] Display user statistics
- [ ] Filter by role
- [ ] Search users

### Platform Analytics
- [ ] Create `src/pages/admin/PlatformAnalytics.tsx`
- [ ] Total users by role
- [ ] Verification statistics
- [ ] Booking statistics
- [ ] Revenue metrics
- [ ] Growth charts

### Dispute Management
- [ ] Create `src/pages/admin/Disputes.tsx`
- [ ] List disputed bookings
- [ ] Hold/release payments
- [ ] Add notes
- [ ] Resolve disputes

### Referral Email Triggers
- [ ] Create Supabase Edge Function: `send-referral-email`
- [ ] Trigger when referral created
- [ ] Send email to referee
- [ ] Include verification link
- [ ] Track email status

---

## ⏳ PHASE 10: Automation & Notifications

### Expiry Checking Edge Function
- [ ] Create `supabase/functions/check-expiry/index.ts`
- [ ] Query all carer_verification records
- [ ] Check dbs_expiry, rtw_expiry, insurance_expiry
- [ ] If expired, set overall_status = 'expired'
- [ ] Send email alert to carer
- [ ] Log expiry events

### Daily Cron Job
- [ ] Set up cron schedule in Supabase
- [ ] Run expiry check daily at 00:00 UTC
- [ ] Monitor execution logs
- [ ] Handle failures

### Email Notification System
- [ ] Choose email service (Resend, SendGrid, etc.)
- [ ] Create email templates
- [ ] Implement notification types:
  - [ ] Verification approved
  - [ ] Verification rejected
  - [ ] Document expiring soon
  - [ ] Document expired
  - [ ] Booking confirmation
  - [ ] Payment received
  - [ ] Referral request

### SMS Alerts (Optional)
- [ ] Choose SMS service (Twilio, etc.)
- [ ] Implement SMS for urgent alerts
- [ ] Document expiry warnings
- [ ] Booking reminders

---

## ⏳ PHASE 11: Polish & Testing

### Mobile Responsiveness
- [ ] Test all pages on mobile
- [ ] Fix layout issues
- [ ] Optimize touch targets
- [ ] Test on iOS and Android
- [ ] Verify forms work on mobile

### Performance Optimization
- [ ] Implement lazy loading
- [ ] Optimize images
- [ ] Add loading states
- [ ] Implement pagination
- [ ] Cache frequently accessed data
- [ ] Optimize database queries

### Security Audit
- [ ] Review all RLS policies
- [ ] Test authentication flows
- [ ] Verify file upload security
- [ ] Check for SQL injection
- [ ] Test XSS prevention
- [ ] Review API security

### User Acceptance Testing
- [ ] Create test scenarios
- [ ] Test carer flow end-to-end
- [ ] Test client flow end-to-end
- [ ] Test organisation flow
- [ ] Test admin flow
- [ ] Gather feedback

### Bug Fixes
- [ ] Fix reported bugs
- [ ] Handle edge cases
- [ ] Improve error messages
- [ ] Add input validation
- [ ] Test error handling

---

## 📊 PROGRESS TRACKER

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| Phase 1-2 | 9 | 9 | 100% ✅ |
| Phase 3 | 6 | 0 | 0% |
| Phase 4 | 7 | 0 | 0% |
| Phase 5 | 5 | 0 | 0% |
| Phase 6 | 5 | 0 | 0% |
| Phase 7 | 6 | 0 | 0% |
| Phase 8 | 4 | 0 | 0% |
| Phase 9 | 5 | 0 | 0% |
| Phase 10 | 4 | 0 | 0% |
| Phase 11 | 5 | 0 | 0% |
| **TOTAL** | **56** | **9** | **16%** |

---

## 🎯 WEEKLY GOALS

### Week 1 (Current)
- [x] Complete Phase 1 & 2
- [ ] Execute database schema
- [ ] Test verification flow
- [ ] Complete Phase 3 (Rate Enforcement)

### Week 2
- [ ] Complete Phase 4 (Stripe Connect)
- [ ] Test payment flow end-to-end

### Week 3
- [ ] Complete Phase 5 (Messaging)
- [ ] Complete Phase 6 (Marketplace)

### Week 4
- [ ] Complete Phase 7 (Bookings)
- [ ] Complete Phase 8 (Organisations)

### Week 5
- [ ] Complete Phase 9 (Admin Tools)
- [ ] Complete Phase 10 (Automation)

### Week 6
- [ ] Complete Phase 11 (Polish & Testing)
- [ ] Launch preparation

---

**Use this checklist to track your progress. Check off items as you complete them!** ✅
