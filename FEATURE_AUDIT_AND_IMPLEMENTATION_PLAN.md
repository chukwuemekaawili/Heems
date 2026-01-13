# Heems Platform - Comprehensive Feature Audit & Implementation Plan
## Based on PRD v2.3.2 Compliance Review

**Audit Date:** 2026-01-09  
**Current Status:** ~40% Complete  
**Target:** 100% PRD v2.3.2 Compliance

---

## 🔴 CRITICAL MISSING FEATURES (Phase 1 - Must Implement)

### 1. **DATABASE SCHEMA - NOT EXECUTED**
**Status:** ❌ SQL files exist but NOT run in Supabase  
**Impact:** HIGH - All advanced features depend on this

**Required Actions:**
- [ ] Execute `SCHEMA_UPDATE_v2.sql` in Supabase SQL Editor
- [ ] Verify tables created:
  - `organisation_details`
  - `carer_verification` (with expiry tracking)
  - `carer_referrals` (2 mandatory referrals)
  - `system_config` (pricing phase tracking)
- [ ] Verify RLS policies applied
- [ ] Test all foreign key relationships

**Files:** 
- `SCHEMA_UPDATE_v2.sql` (ready to execute)
- `SUPABASE_SETUP.sql` (base schema - may already be run)

---

### 2. **VERIFICATION SYSTEM - NOT IMPLEMENTED**
**Status:** ❌ UI exists, no backend logic  
**Impact:** CRITICAL - Core compliance requirement

**Missing Components:**

#### A. Carer Document Upload (Step 2 of Signup)
- [ ] File upload component for:
  - Enhanced DBS Certificate
  - ID/Passport
  - Right to Work document
  - Public Liability Insurance
- [ ] Supabase Storage bucket setup
- [ ] Document metadata storage in `carer_verification` table
- [ ] Expiry date capture for DBS, Insurance, RTW

#### B. Referral System (Step 3 of Signup)
- [ ] Form to collect 2 work referrals:
  - Referee name, email, phone
  - Relationship (e.g., "Previous Employer")
- [ ] Insert into `carer_referrals` table
- [ ] Email notification to referees (Supabase Edge Function or Resend.com)
- [ ] Referee verification link/form

#### C. Admin Verification Dashboard
- [ ] Page: `/admin/verifications`
- [ ] View pending document uploads
- [ ] Approve/Reject documents
- [ ] Update `carer_verification` statuses
- [ ] Trigger "Insured & Vetted" badge when all approved

#### D. Automatic Expiry Checking
- [ ] Supabase Edge Function (daily cron)
- [ ] Check `dbs_expiry`, `insurance_expiry`, `rtw_expiry`
- [ ] If expired: Set `overall_status` = 'expired'
- [ ] Hide carer from marketplace search
- [ ] Send email alert to carer

**PRD Requirement:**  
> "Carers move from 'Pending' to 'Insured & Vetted' only after Admin approval. If any document expires, the Carer is automatically unverified and hidden from search."

---

### 3. **£15/HOUR MINIMUM RATE ENFORCEMENT - NOT IMPLEMENTED**
**Status:** ❌ No validation exists  
**Impact:** HIGH - Core business rule

**Required Actions:**
- [ ] Add validation in `CreateBooking.tsx`
- [ ] Add validation in carer profile setup
- [ ] Database constraint on `carer_details.hourly_rate`
- [ ] UI warning if carer tries to set rate below £15

**PRD Requirement:**  
> "Hard floor of £15.00/hour for all hourly care roles."

---

### 4. **STRIPE CONNECT INTEGRATION - NOT IMPLEMENTED**
**Status:** ❌ Payment UI exists, no Stripe backend  
**Impact:** CRITICAL - Cannot process real payments

**Missing Components:**

#### A. Stripe Connect Onboarding
- [ ] Carer onboarding to Stripe Connect (Express/Standard)
- [ ] Store `stripe_account_id` in `carer_details`
- [ ] Verification status sync

#### B. Payment Flow
- [ ] Stripe Checkout integration
- [ ] Calculate fees based on `system_config.active_phase`:
  - **Phase 1:** Client pays +10%, Carer receives 100%
  - **Phase 2:** Client pays +12%, Carer receives -5%
- [ ] Store `client_fee`, `carer_fee`, `stripe_transfer_id` in bookings
- [ ] Automatic payment splitting to carer's Connect account

#### C. Payment Dashboard
- [ ] Client payment history
- [ ] Carer earnings dashboard
- [ ] Admin payment monitoring

**PRD Requirement:**  
> "Stripe Connect: Integration for automated payment splits and fee deductions."

---

### 5. **MESSAGING SYSTEM - PARTIALLY IMPLEMENTED**
**Status:** ⚠️ UI exists, no real-time functionality  
**Impact:** HIGH - Core discovery mechanism

**Missing Components:**
- [ ] Real-time messaging (Supabase Realtime subscriptions)
- [ ] Message storage in `messages` table
- [ ] Keyword filtering for CQC compliance:
  - Block: "employ", "staff", "hire", "payroll"
  - Warn users about introductory agency model
- [ ] Message notifications
- [ ] Unread message counts

**PRD Requirement:**  
> "Message-first discovery → Rate agreement → Locked Booking. Secure Messaging: Filter out employment/staffing keywords to maintain CQC introductory agency status."

---

## 🟡 IMPORTANT INCOMPLETE FEATURES (Phase 2)

### 6. **MARKETPLACE SEARCH - PARTIALLY IMPLEMENTED**
**Status:** ⚠️ Basic search exists, missing filters  
**Impact:** MEDIUM

**Missing:**
- [ ] Postcode-based search (distance calculation)
- [ ] Filter by specializations (Dementia, Palliative, etc.)
- [ ] Filter by availability
- [ ] "Badge-Only" display (hide raw documents)
- [ ] Only show carers with `overall_status = 'verified'`
- [ ] Minimum rate filter (£15 floor)

**Current File:** `src/pages/client/SearchCarers.tsx`

---

### 7. **ORGANISATION FEATURES - MINIMAL IMPLEMENTATION**
**Status:** ⚠️ Signup exists, no management tools  
**Impact:** MEDIUM

**Missing:**
- [ ] Postcode management page (service delivery areas)
- [ ] Staff bank management
- [ ] Bulk booking capabilities
- [ ] Organisation analytics dashboard
- [ ] CQC number verification

**Current Files:**
- `src/pages/organisation/Dashboard.tsx` (basic)
- `src/pages/organisation/Staff.tsx` (basic)

---

### 8. **ADMIN CONTROL CENTER - MINIMAL IMPLEMENTATION**
**Status:** ⚠️ Dashboard exists, no tools  
**Impact:** MEDIUM

**Missing:**
- [ ] Verification queue (see #2C above)
- [ ] Dispute management system
- [ ] Phase control toggle (Phase 1 ↔ Phase 2)
- [ ] User management (suspend/activate accounts)
- [ ] Platform analytics
- [ ] Referral email triggers

**Current File:** `src/pages/admin/Dashboard.tsx`

---

### 9. **BOOKING SYSTEM - PARTIALLY IMPLEMENTED**
**Status:** ⚠️ Basic booking exists, no fee calculation  
**Impact:** MEDIUM

**Missing:**
- [ ] Dynamic fee calculation based on active phase
- [ ] Booking confirmation emails
- [ ] Booking modification/cancellation
- [ ] Recurring booking support
- [ ] Care plan integration

**Current File:** `src/pages/client/CreateBooking.tsx`

---

### 10. **CARER DASHBOARD - BASIC IMPLEMENTATION**
**Status:** ⚠️ UI exists, limited functionality  
**Impact:** MEDIUM

**Missing:**
- [ ] Earnings breakdown (with fee deductions)
- [ ] Document expiry alerts
- [ ] Availability calendar management
- [ ] Booking requests inbox
- [ ] Performance metrics

**Current Files:**
- `src/pages/carer/Dashboard.tsx`
- `src/pages/carer/Earnings.tsx`
- `src/pages/carer/Documents.tsx` (UI only)

---

## 🟢 COMPLETED FEATURES

### ✅ Authentication System
- [x] Supabase auth integration
- [x] Client signup
- [x] Carer signup (Step 1 - basic info)
- [x] Organisation signup
- [x] Login with role-based redirection
- [x] Password validation

### ✅ UI/UX Design
- [x] Modern home page with premium aesthetics
- [x] Circular carer photo cluster
- [x] Enhanced parallax section
- [x] Gradient cards and animations
- [x] Responsive layouts
- [x] Brand colors (Navy #111827, Teal #1a9e8c)

### ✅ Basic Pages
- [x] Landing page
- [x] For Carers page
- [x] Solutions page
- [x] Pricing page (Phase 1 model displayed)
- [x] Marketplace page (basic)

---

## 📋 IMPLEMENTATION PRIORITY ORDER

### **PHASE 1: CRITICAL INFRASTRUCTURE (Week 1-2)**
1. Execute database schema (`SCHEMA_UPDATE_v2.sql`)
2. Implement document upload system
3. Build admin verification dashboard
4. Add £15/hour rate validation
5. Implement referral system

### **PHASE 2: PAYMENT SYSTEM (Week 3-4)**
6. Stripe Connect integration
7. Dynamic fee calculation
8. Payment splitting logic
9. Earnings dashboard

### **PHASE 3: CORE FEATURES (Week 5-6)**
10. Real-time messaging
11. Enhanced marketplace search
12. Booking flow refinement
13. Automatic expiry checking

### **PHASE 4: ADVANCED FEATURES (Week 7-8)**
14. Organisation management tools
15. Admin control center
16. Analytics dashboards
17. Email notifications

### **PHASE 5: POLISH & TESTING (Week 9-10)**
18. Mobile responsiveness
19. Performance optimization
20. Security audit
21. User acceptance testing

---

## 🎯 PRD v2.3.2 COMPLIANCE CHECKLIST

### Core Business Model
- [ ] Transactional Introductory Agency (not staffing)
- [ ] "Badge-Only" verification display
- [ ] No raw document exposure to clients
- [ ] CQC-compliant messaging (keyword filtering)

### Verification Requirements
- [ ] Enhanced DBS check
- [ ] ID verification
- [ ] Right to Work verification
- [ ] Public Liability Insurance
- [ ] 2 verified work referrals
- [ ] Automatic expiry checking

### Pricing Model
- [ ] £15/hour minimum enforced
- [ ] Phase 1: 10% client / 0% carer
- [ ] Phase 2: 12% client / 5% carer
- [ ] Automatic phase switching at 30+ verified carers

### User Flows
- [ ] Carer: Signup → Document Upload → Referrals → Admin Approval → Marketplace
- [ ] Client: Signup → Search → Message → Book → Pay
- [ ] Organisation: Signup → Postcode Setup → Staff Management → Bulk Booking

---

## 📊 COMPLETION METRICS

**Current Status:**
- Database Schema: 0% (not executed)
- Verification System: 10% (UI only)
- Payment System: 5% (UI only)
- Messaging: 20% (UI only)
- Search/Discovery: 40%
- Booking System: 50%
- Admin Tools: 15%
- Organisation Features: 20%

**Overall Completion: ~40%**

**Target for v2.3.2 Compliance: 100%**

---

## 🚀 NEXT IMMEDIATE STEPS

1. **Execute Database Schema** (30 minutes)
   - Run `SCHEMA_UPDATE_v2.sql` in Supabase
   - Verify all tables created

2. **Implement Document Upload** (2-3 days)
   - Supabase Storage setup
   - File upload component
   - Metadata storage

3. **Build Admin Verification** (2-3 days)
   - Verification queue UI
   - Approve/reject logic
   - Badge assignment

4. **Add Rate Validation** (1 day)
   - £15 minimum enforcement
   - UI warnings

5. **Stripe Connect Setup** (3-5 days)
   - Account onboarding
   - Payment flow
   - Fee calculation

---

**This audit provides a complete roadmap to achieve 100% PRD v2.3.2 compliance.**
