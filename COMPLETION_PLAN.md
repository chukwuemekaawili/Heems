# Heems Platform Completion Plan

This plan outlines the steps required to bring the Heems Marketplace to 100% completion, strictly following the **Product Requirements Document v2.3.2**. Heems operates as a **Transactional Introductory Agency**, connecting families and organisations with self-employed carers.

## Phase 1: Database & Infrastructure (Detailed Schema)
We need to evolve the schema to support the complex verification and fee-splitting requirements.

- [ ] **Profiles & Role Expansion**:
    - Update `profiles` table to include organisation-specific fields (legal name, registration number).
    - Add `postcode` and `service_radius` tracking for Organisations.
- [ ] **Carer Verification Vault**:
    - Create `carer_verification` table:
        - `dbs_status`, `id_status`, `rtw_status` (Right to Work), `insurance_status`.
        - `dbs_expiry`, `insurance_expiry`.
        - `verified_badges` (JSONB): tracking 'Insured', 'Vetted', etc.
- [ ] **Work Referrals System**:
    - Create `carer_referrals` table:
        - Two mandatory referral entries per carer.
        - Status: `pending`, `sent`, `verified`.
- [ ] **Pricing Phase Management**:
    - Create `system_config` table to track:
        - Total verified carers/families.
        - Current Phase (Phase 1 vs Phase 2 triggers).

## Phase 2: Mandatory Verification & Onboarding
Following the "Badge-Only" and "Strict Verification" rules.

- [ ] **Carer Onboarding (v2.3 compliance)**:
    - Step 1: Basic Info & Bio.
    - Step 2: Document Upload (DBS, ID, RTW, Insurance).
    - Step 3: Referral Entry (Names/Emails for 2 work referrals).
- [ ] **Verification Logic**:
    - Implement background worker (Supabase Edge Function) to check for document expiry daily.
    - **Rule**: If Insurance or RTW expires, status $\rightarrow$ `unverified` and hidden from marketplace.
- [ ] **Organisation Onboarding**:
    - Implement Postcode management page allowing Partners to edit service delivery areas post-signup.

## Phase 3: Transactional Marketplace & Booking
Implementing the fixed pricing floor and locked rate discovery.

- [ ] **Marketplace Search**:
    - Filter by Postcode and Specialisms (Dementia, Elderly Care, etc.).
    - Display "Insured & Vetted" badges. **Never display raw documents.**
- [ ] **Rate Enforcement**:
    - Implement a hard floor of **£15.00/hour** on all booking creation flows.
- [ ] **Booking Flow**:
    - Message-first discovery $\rightarrow$ Rate agreement $\rightarrow$ Locked Booking.
    - Secure Messaging: Filter out employment/staffing keywords to maintain CQC introductory agency status.

## Phase 4: Payment System (Stripe Connect)
Automating the fee-split based on active pricing phases.

- [ ] **Stripe Connect Integration**:
    - Setup "Standard" or "Express" accounts for Carers.
- [ ] **Dynamic Fee Calculation**:
    - **Phase 1**: 10% Client Fee / 0% Carer Fee.
    - **Phase 2**: 12% Client Fee / 5% Carer Fee.
    - Automated split logic during checkout.

## Phase 5: Admin Control Center
The "Engine Room" for manual oversight.

- [ ] **Verification Tool**:
    - Interface for Admins to view uploaded docs and approve/reject.
    - Interface to trigger Referral emails if not automated.
- [ ] **Dispute Management**:
    - Tools to hold/release payments in case of care delivery issues.
- [ ] **Phase Control**:
    - Visual counters for Carers/Families to signal when to switch from Phase 1 to Phase 2.

## Success Criteria (100% Completion)
- [ ] Carers can sign up but **cannot** appear in search until 2 referrals + Docs are approved.
- [ ] Clients pay £X + 10/12% fee; Carers receive £X - 0/5% fee.
- [ ] Automated email/SMS alerts for document expiry.
- [ ] Mobile responsive dashboards for all three roles.
