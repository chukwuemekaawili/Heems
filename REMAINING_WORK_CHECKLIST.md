# Heems Platform - Remaining Work Checklist
**Track progress to 100% completion** | Last Updated: 2026-02-18

---

## ✅ PHASE 1 & 2: COMPLETE (Critical Infrastructure + Verification)

- [x] Database types system
- [x] Fee calculation utilities (`src/lib/fees.ts`)
- [x] CQC compliance utilities (`src/lib/compliance.ts`)
- [x] Document upload component
- [x] Referral form component
- [x] Enhanced carer verification page (`VerificationsEnhanced.tsx`)
- [x] Enhanced admin verification queue
- [x] Database schema (ready for execution)
- [x] App routes updated

---

## ✅ PHASE 3: COMPLETE (Rate Enforcement & Pricing)

- [x] `validateMinimumRate` imported and used in `CreateBooking.tsx`
- [x] Rate validation before booking creation (throws error if < £15)
- [x] Fee breakdown displayed using `calculateFees` in booking flow
- [x] Carer profile rate validation on `hourly_rate` input
- [x] Warning displayed if rate < £15 in `Profile.tsx`
- [x] Save prevented if rate < £15 in `handleSave`
- [x] `PhaseControl.tsx` admin page created with full UI
- [x] Phase toggle (Phase 1 ↔ Phase 2) connected to `system_config`
- [x] Verified carer/client counts displayed
- [x] Fee comparison table (Phase 1 vs Phase 2)
- [x] Route `/admin/phase-control` registered in `App.tsx`
- [ ] **TODO:** Add database CHECK constraint to `carer_details`:
  ```sql
  ALTER TABLE carer_details
  ADD CONSTRAINT hourly_rate_minimum
  CHECK (hourly_rate >= 15.00);
  ```

---

## ✅ PHASE 4: COMPLETE (Stripe Connect Integration)

- [x] `PaymentCheckout.tsx` component built
- [x] `StripeConnectOnboarding.tsx` component built
- [x] `stripe-checkout-session` Edge Function deployed
- [x] `stripe-connect-account` Edge Function deployed
- [x] `stripe-webhook` Edge Function deployed
- [x] `process-payouts` Edge Function deployed
- [x] `approve-refund` Edge Function deployed
- [x] `BookingsEnhanced.tsx` with "Pay Now" button wired to Stripe
- [x] Payment modal with fee breakdown
- [x] Payment success/cancel URL handling
- [x] `ClientPayments.tsx` payment history page
- [x] `CarerEarnings.tsx` earnings dashboard
- [x] Route `/client/payments` registered
- [x] Route `/carer/earnings` registered
- [ ] **TODO:** Set Stripe API keys in Supabase secrets:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] **TODO:** Set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env`

---

## ✅ PHASE 5: COMPLETE (Messaging System)

- [x] `Messages.tsx` shared page built (`src/pages/shared/Messages.tsx`)
- [x] Real-time Supabase subscription implemented
- [x] Keyword filtering for CQC compliance integrated
- [x] Routes registered for all roles:
  - `/client/messages`
  - `/carer/messages`
  - `/organisation/messages`
  - `/admin/messages`
- [x] `notify-chat-message` Edge Function deployed
- [x] `chat-agent` Edge Function deployed
- [ ] **TODO:** Verify `messages` table exists in Supabase with RLS policies

---

## ✅ PHASE 6: COMPLETE (Enhanced Marketplace)

- [x] `SearchEnhanced.tsx` built with advanced filters
- [x] Specialization filters
- [x] Availability filters
- [x] Verification status filter ("Verified Only" toggle)
- [x] Badge display on carer cards
- [x] Route `/client/search-enhanced` registered
- [ ] **TODO:** Postcode-based distance search (requires postcodes.io API)

---

## ⏳ PHASE 7: Booking System Enhancement (PARTIAL)

- [x] Booking modification (edit date/time) in `BookingsEnhanced.tsx`
- [x] Booking cancellation via `cancel-booking` Edge Function
- [x] Rate agreement shown in booking flow
- [x] Fee breakdown in booking confirmation
- [x] Booking confirmation emails (client + carer)
- [x] Recurring booking support (create multiple linked bookings)
- [ ] Calendar invite attachment in emails

---

## ⏳ PHASE 8: Organisation Features (PARTIAL)

- [x] Organisation dashboard exists (`src/pages/organisation/`)
- [x] Organisation messages route registered
- [x] Postcode/service area management (`ServiceAreas.tsx`)
- [x] Staff bank management
- [ ] Bulk booking capabilities
- [ ] Organisation analytics dashboard

---

## ✅ PHASE 9: COMPLETE (Admin Control Center)

- [x] `PhaseControl.tsx` with phase toggle and stats
- [x] `Users.tsx` admin user management
- [x] `Verifications.tsx` + `VerificationsEnhanced.tsx`
- [x] `Disputes.tsx` dispute management page
- [x] `Reports.tsx` platform reports
- [x] `SystemLogs.tsx` system logs
- [x] `Bookings.tsx` admin bookings view
- [x] `Carers.tsx` admin carer management
- [x] `Organisations.tsx` admin org management
- [x] `BlogManagement.tsx` blog admin
- [x] `Settings.tsx` admin settings
- [x] Admin dashboard with phase control link

---

## ✅ PHASE 10: COMPLETE (Automation & Notifications)

- [x] `check-document-expiry` Edge Function deployed
- [x] `send-account-approved-email` Edge Function deployed
- [x] `send-contact-email` Edge Function deployed
- [x] `send-promo-expiry-email` Edge Function deployed
- [x] `send-transactional-email` Edge Function deployed
- [x] Review automation system (Resend integration)
- [ ] **TODO:** Verify cron job is active in Supabase for daily expiry checks
- [ ] **TODO:** SMS alerts (optional - Twilio)

---

## ⏳ PHASE 11: Polish & Testing

- [x] About Us page content integrated
- [x] Footer updated with correct contact info
- [x] Chat widget visibility (auth-gated)
- [x] Admin redirect fix
- [x] Lazy loading implemented in `App.tsx`
- [x] Loading skeletons (`BookingSkeleton.tsx`)
- [ ] Full mobile responsiveness audit
- [ ] Performance optimization (image optimization, pagination)
- [ ] Security audit (RLS policies review)
- [ ] User acceptance testing (end-to-end flows)
- [ ] Production build verification

---

## 📊 PROGRESS TRACKER (Updated)

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1-2 | Infrastructure + Verification | ✅ 100% |
| Phase 3 | Rate Enforcement & Pricing | ✅ 95% (DB constraint pending) |
| Phase 4 | Stripe Connect Payments | ✅ 90% (API keys config pending) |
| Phase 5 | Messaging System | ✅ 90% (DB table verify pending) |
| Phase 6 | Enhanced Marketplace | ✅ 85% (postcode search pending) |
| Phase 7 | Booking Enhancements | ⏳ 60% |
| Phase 8 | Organisation Features | ⏳ 30% |
| Phase 9 | Admin Control Center | ✅ 95% |
| Phase 10 | Automation & Notifications | ✅ 85% |
| Phase 11 | Polish & Testing | ⏳ 50% |
| **OVERALL** | | **~78%** |

---

## 🎯 IMMEDIATE NEXT PRIORITIES

### High Priority (Blockers)
1. **Stripe API Keys** — Set `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` to enable live payments
2. **DB Constraint** — Add `hourly_rate >= 15.00` CHECK constraint in Supabase SQL editor
3. **Messages Table** — Verify `messages` table exists with correct RLS policies

### Medium Priority
4. ~~**Booking Confirmation Emails** — Wire `send-transactional-email` to booking creation~~ (COMPLETED)
5. ~~**Recurring Bookings** — Add repeat booking support to `CreateBooking.tsx`~~ (COMPLETED)
6. ~~**Organisation Service Areas** — Build `ServiceAreas.tsx` page~~ (COMPLETED)

### Lower Priority
7. ~~**Postcode Search** — Integrate postcodes.io for distance-based carer search~~ (COMPLETED)
8. **Mobile Audit** — Test all pages on mobile devices
9. ~~**Organisation Staff Bank** — Build staff management for organisations~~ (COMPLETED)
10. **Production Deployment** — Final build and cPanel deployment

---

**Use this checklist to track your progress. Check off items as you complete them!** ✅
