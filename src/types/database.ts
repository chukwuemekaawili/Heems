// Database types for Heems Platform (PRD v2.3.2 Compliant)

export type UserRole = 'client' | 'carer' | 'organisation' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type OverallVerificationStatus = 'unverified' | 'pending' | 'verified' | 'expired';
export type ReferralStatus = 'pending' | 'notified' | 'verified' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AvailabilityStatus = 'available' | 'busy' | 'away';
export type PricingPhase = '1' | '2';

// Core Tables
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarerDetails {
  id: string;
  bio: string | null;
  years_experience: number;
  skills: string[];
  hourly_rate: number;
  live_in_rate_weekly?: number;
  live_in_rate_daily?: number;
  overnight_sleeping_rate?: number;
  overnight_waking_rate?: number;
  verification_status: VerificationStatus;
  dbs_check_date: string | null;
  availability_status: AvailabilityStatus;
  stripe_account_id: string | null;
  onboarded_at: string | null; // For 6-month commission-free promo
  created_at: string;
}

// New Tables from SCHEMA_UPDATE_v2
export interface OrganisationDetails {
  id: string;
  company_name: string;
  registration_number: string | null;
  postcode: string | null;
  service_radius_miles: number;
  is_verified: boolean;
  created_at: string;
}

export interface CarerVerification {
  id: string;
  id_status: VerificationStatus;
  dbs_status: VerificationStatus;
  rtw_status: VerificationStatus; // Right to Work
  insurance_status: VerificationStatus;
  dbs_expiry: string | null;
  insurance_expiry: string | null;
  rtw_expiry: string | null;
  last_vetted_at: string | null;
  overall_status: OverallVerificationStatus;

  // Document URLs (stored in Supabase Storage)
  dbs_document_url: string | null;
  id_document_url: string | null;
  rtw_document_url: string | null;
  insurance_document_url: string | null;
}

export interface CarerReferral {
  id: string;
  carer_id: string;
  referee_name: string;
  referee_email: string;
  referee_phone: string | null;
  relationship: string | null;
  status: ReferralStatus;
  verification_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface SystemConfig {
  id: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  carer_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  notes: string | null;

  // New fee fields
  rate_per_hour: number;
  client_fee: number; // Amount client pays extra (10% or 12%)
  carer_fee: number; // Amount carer pays (0% or 5%)
  stripe_transfer_id: string | null;

  created_at: string;
}

export interface CarePlan {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  medications: any[];
  routines: any[];
  emergency_contact: any;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Fee Calculation Types
export interface FeeCalculation {
  baseRate: number;
  hours: number;
  subtotal: number;
  clientFee: number;
  clientFeePercentage: number;
  carerFee: number;
  carerFeePercentage: number;
  clientTotal: number;
  carerEarnings: number;
  platformRevenue: number;
}

// Document Upload Types
export interface DocumentUpload {
  file: File;
  type: 'dbs' | 'id' | 'rtw' | 'insurance';
  expiryDate?: string;
}

export interface DocumentMetadata {
  url: string;
  uploadedAt: string;
  expiryDate?: string;
  status: VerificationStatus;
}

// Verification Badge Types
export type VerificationBadge = 'Insured' | 'Vetted' | 'DBS Checked' | 'Right to Work';

// Search & Filter Types
export interface CarerSearchFilters {
  postcode?: string;
  radius?: number; // in miles
  specializations?: string[];
  minRate?: number;
  maxRate?: number;
  availability?: AvailabilityStatus;
  verifiedOnly?: boolean;
}

export interface CarerSearchResult extends Profile {
  carer_details: CarerDetails;
  verification: CarerVerification;
  badges: VerificationBadge[];
  distance?: number; // calculated distance from search postcode
}

// Stripe Types
export interface StripeConnectAccount {
  account_id: string;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
}

// Admin Types
export interface VerificationQueueItem {
  carer_id: string;
  carer_name: string;
  submitted_at: string;
  documents: {
    dbs: DocumentMetadata | null;
    id: DocumentMetadata | null;
    rtw: DocumentMetadata | null;
    insurance: DocumentMetadata | null;
  };
  referrals: CarerReferral[];
  overall_status: OverallVerificationStatus;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'message' | 'verification' | 'payment' | 'expiry';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

// Analytics Types
export interface PlatformAnalytics {
  totalCarers: number;
  verifiedCarers: number;
  totalClients: number;
  totalOrganisations: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  currentPhase: PricingPhase;
}

// Organisation Types
export interface OrganisationStaffMember {
  id: string;
  organisation_id: string;
  carer_id: string;
  added_at: string;
  status: 'active' | 'inactive';
}

// Postcode & Distance Types
export interface PostcodeCoordinates {
  postcode: string;
  latitude: number;
  longitude: number;
}

// Compliance Types
export interface ComplianceCheck {
  type: 'keyword_filter' | 'rate_minimum' | 'verification_status';
  passed: boolean;
  message?: string;
}

// Email Template Types
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  type: 'referral_request' | 'verification_approved' | 'verification_rejected' | 'booking_confirmation' | 'expiry_warning';
}

export interface SystemLog {
  id: string;
  event_type: string;
  details: any;
  created_at: string;
}
