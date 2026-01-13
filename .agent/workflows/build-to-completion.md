---
description: Build Heems Platform to 100% Completion
---

# Heems Platform - Build to 100% Completion Workflow

This workflow implements all features from the COMPLETION_PLAN.md and PRD v2.3.2 to achieve 100% completion.

## Phase 1: Database & Infrastructure ✅

### Step 1: Execute Database Schema
// turbo
1. Run the fixed schema update in Supabase
```bash
# The SCHEMA_UPDATE_v2_FIXED.sql needs to be executed in Supabase SQL Editor
```

### Step 2: Verify Database Tables
2. Verify all tables are created:
   - organisation_details
   - carer_verification
   - carer_referrals
   - system_config
   - Updated bookings table with fee columns

## Phase 2: Verification System (CRITICAL)

### Step 3: Implement Document Upload System
3. Create Supabase Storage buckets for documents
4. Build document upload component with file validation
5. Store document metadata in carer_verification table
6. Implement expiry date tracking

### Step 4: Build Referral System
7. Create referral form (2 mandatory referrals)
8. Store referrals in carer_referrals table
9. Implement email notification system for referees
10. Build referee verification interface

### Step 5: Admin Verification Dashboard
11. Create admin verification queue UI
12. Implement approve/reject document logic
13. Build badge assignment system ("Insured & Vetted")
14. Add verification status tracking

## Phase 3: Rate Enforcement & Pricing

### Step 6: Implement £15/Hour Minimum
15. Add validation to booking creation
16. Add validation to carer profile setup
17. Add database constraint
18. Implement UI warnings

### Step 7: Dynamic Fee Calculation
19. Implement phase-based fee calculation:
    - Phase 1: 10% client / 0% carer
    - Phase 2: 12% client / 5% carer
20. Store fees in bookings table
21. Build phase management interface

## Phase 4: Payment System (Stripe Connect)

### Step 8: Stripe Connect Integration
22. Set up Stripe Connect accounts for carers
23. Implement onboarding flow
24. Store stripe_account_id in database
25. Build payment splitting logic
26. Implement automatic transfers

### Step 9: Payment Dashboards
27. Build client payment history
28. Build carer earnings dashboard with fee breakdown
29. Build admin payment monitoring

## Phase 5: Messaging System

### Step 10: Real-time Messaging
30. Implement Supabase Realtime subscriptions
31. Build message storage and retrieval
32. Add keyword filtering for CQC compliance
33. Implement unread message counts
34. Add message notifications

## Phase 6: Enhanced Marketplace

### Step 11: Advanced Search & Filters
35. Implement postcode-based distance search
36. Add specialization filters
37. Add availability filters
38. Implement "Badge-Only" display
39. Filter by verification status
40. Add minimum rate filter

## Phase 7: Booking System Enhancement

### Step 12: Complete Booking Flow
41. Implement message-first discovery
42. Add rate agreement workflow
43. Build locked booking system
44. Add booking confirmation emails
45. Implement booking modification/cancellation
46. Add recurring booking support

## Phase 8: Organisation Features

### Step 13: Organisation Management
47. Build postcode management interface
48. Implement service area configuration
49. Add staff bank management
50. Build bulk booking capabilities
51. Create organisation analytics dashboard

## Phase 9: Admin Control Center

### Step 14: Complete Admin Tools
52. Build comprehensive verification queue
53. Implement dispute management system
54. Add phase control toggle (Phase 1 ↔ Phase 2)
55. Build user management (suspend/activate)
56. Create platform analytics
57. Add referral email triggers

## Phase 10: Automation & Notifications

### Step 15: Automated Systems
58. Build Supabase Edge Function for expiry checking
59. Implement daily cron job
60. Add automatic status updates
61. Build email notification system
62. Add SMS alerts (optional)

## Phase 11: Polish & Testing

### Step 16: Final Polish
63. Mobile responsiveness audit
64. Performance optimization
65. Security audit
66. User acceptance testing
67. Bug fixes and refinements

## Success Criteria Checklist

- [ ] Database schema fully executed
- [ ] Document upload system working
- [ ] 2 mandatory referrals enforced
- [ ] Admin can approve/reject verifications
- [ ] "Insured & Vetted" badges display correctly
- [ ] £15/hour minimum enforced
- [ ] Stripe Connect payments working
- [ ] Fee splits calculated correctly (Phase 1 & 2)
- [ ] Real-time messaging functional
- [ ] Keyword filtering active
- [ ] Postcode-based search working
- [ ] Only verified carers appear in marketplace
- [ ] Booking flow complete
- [ ] Organisation features functional
- [ ] Admin control center complete
- [ ] Automatic expiry checking active
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] All CRUD operations functional

## Estimated Timeline
- Phase 1-2: 1 week (Critical Infrastructure)
- Phase 3-4: 1 week (Payments)
- Phase 5-6: 1 week (Messaging & Search)
- Phase 7-9: 1 week (Bookings & Management)
- Phase 10-11: 1 week (Automation & Polish)

**Total: 5 weeks to 100% completion**
