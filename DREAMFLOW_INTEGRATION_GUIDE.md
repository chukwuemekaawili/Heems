# Heems Mobile App - Dreamflow Integration Guide

## 🎯 Overview

This guide provides step-by-step instructions for building the Heems mobile app using Dreamflow, an AI-powered mobile app development platform.

---

## 📋 Prerequisites

1. **Dreamflow Account** - Sign up at dreamflow.ai
2. **Supabase Credentials:**
   - Project URL: `https://osmrtnhdtmxvrvtmuqnz.supabase.co`
   - Anon Key: `[Your Supabase Anon Key]`
3. **Stripe Keys** (for payments):
   - Publishable Key: `pk_test_...`

---

## 🏗️ App Structure

### User Roles
1. **Client** - Books care services
2. **Carer** - Provides care services

### Main Features
1. Authentication (Sign Up, Sign In, Sign Out)
2. Profile Management
3. Marketplace (Search & Browse Carers)
4. Booking Management
5. Real-Time Messaging
6. Payments (Stripe)
7. Notifications

---

## 🎨 Screen Flow

### Authentication Flow
```
Splash Screen
  ↓
Onboarding (First Time)
  ↓
Login/Sign Up
  ↓
Role Selection (Client/Carer)
  ↓
Dashboard
```

### Client Flow
```
Client Dashboard
  ├── Search Carers
  │     ├── Filter by Postcode
  │     ├── Filter by Specialization
  │     ├── Filter by Rate
  │     └── View Carer Profile
  │           └── Book Carer
  ├── My Bookings
  │     ├── Upcoming
  │     ├── Completed
  │     └── Cancelled
  ├── Messages
  │     ├── Conversations List
  │     └── Chat Screen
  └── Profile
        ├── Edit Profile
        └── Settings
```

### Carer Flow
```
Carer Dashboard
  ├── My Bookings
  │     ├── Pending (Accept/Decline)
  │     ├── Confirmed
  │     └── Completed
  ├── Earnings
  │     ├── Total Earnings
  │     ├── Payment History
  │     └── Stripe Connect
  ├── Messages
  │     ├── Conversations List
  │     └── Chat Screen
  ├── Verification
  │     ├── Upload Documents
  │     └── Add Referrals
  └── Profile
        ├── Edit Profile
        ├── Set Hourly Rate
        └── Specializations
```

---

## 🔧 Dreamflow Configuration

### 1. Project Setup

**In Dreamflow:**
1. Create New Project: "Heems Care"
2. Select Template: "Blank App" or "Marketplace App"
3. Set Primary Color: `#1a9e8c` (Teal)
4. Set Secondary Color: `#111827` (Dark Navy)

### 2. Supabase Integration

**Add Supabase Backend:**
```yaml
Backend Type: Supabase
Project URL: https://osmrtnhdtmxvrvtmuqnz.supabase.co
Anon Key: [Your Anon Key]
```

**Enable Features:**
- ✅ Authentication
- ✅ Database
- ✅ Storage
- ✅ Realtime

### 3. Authentication Setup

**Configure Auth Providers:**
- ✅ Email/Password
- ✅ Google Sign-In (Optional)
- ✅ Apple Sign-In (Optional)

**User Metadata Fields:**
```yaml
- full_name: String (Required)
- role: String (Required) # 'client' or 'carer'
- phone: String (Optional)
```

---

## 📱 Screen Implementations

### 1. Splash Screen

**Design:**
- Logo: Heems logo centered
- Background: Gradient (Navy to Teal)
- Duration: 2 seconds

**Logic:**
```dart
// Check if user is logged in
if (user != null) {
  // Navigate to Dashboard
  navigateTo(DashboardScreen);
} else {
  // Navigate to Login
  navigateTo(LoginScreen);
}
```

### 2. Login Screen

**UI Components:**
- Email Input Field
- Password Input Field
- "Sign In" Button
- "Sign Up" Link
- "Forgot Password" Link

**API Call:**
```yaml
Endpoint: POST /auth/v1/token?grant_type=password
Body:
  email: {email_input}
  password: {password_input}
On Success:
  - Store access_token
  - Navigate to Dashboard
On Error:
  - Show error message
```

### 3. Sign Up Screen

**UI Components:**
- Full Name Input
- Email Input
- Password Input
- Confirm Password Input
- Role Selection (Client/Carer)
- "Create Account" Button

**API Call:**
```yaml
Endpoint: POST /auth/v1/signup
Body:
  email: {email_input}
  password: {password_input}
  data:
    full_name: {name_input}
    role: {selected_role}
On Success:
  - Navigate to Dashboard
On Error:
  - Show error message
```

### 4. Client Dashboard

**UI Components:**
- Welcome Message: "Hello, {user_name}"
- Stats Cards:
  - Total Bookings
  - Upcoming Bookings
  - Messages Count
- Quick Actions:
  - "Find a Carer" Button
  - "My Bookings" Button
  - "Messages" Button

**Data Loading:**
```yaml
On Screen Load:
  - Fetch user profile
  - Fetch booking count
  - Fetch unread messages count
```

### 5. Search Carers Screen

**UI Components:**
- Search Bar (Postcode)
- Filter Chips:
  - Specializations
  - Experience Level
  - Hourly Rate
  - Verified Only Toggle
- Carer Cards List:
  - Avatar
  - Name
  - Verification Badge
  - Hourly Rate
  - Specializations
  - "View Profile" Button

**API Call:**
```yaml
Endpoint: GET /rest/v1/profiles
Query:
  role: eq.carer
  carer_verification.overall_status: eq.verified
  carer_details.postcode: like.*{postcode}*
  select: *, carer_details(*), carer_verification(*)
Display: List of carer cards
```

### 6. Carer Profile Screen

**UI Components:**
- Avatar (Large)
- Name
- Verification Badge
- Hourly Rate (Prominent)
- Years of Experience
- Bio
- Specializations (Chips)
- "Book Now" Button

**API Call:**
```yaml
Endpoint: GET /rest/v1/profiles?id=eq.{carer_id}
Query:
  select: *, carer_details(*), carer_verification(*)
Display: Carer details
```

### 7. Create Booking Screen

**UI Components:**
- Carer Info (Avatar, Name, Rate)
- Date Picker
- Start Time Picker
- End Time Picker
- Duration Display
- Fee Breakdown:
  - Subtotal
  - Platform Fee
  - Total
- "Confirm Booking" Button

**Calculations:**
```dart
hours = (endTime - startTime) / 3600;
subtotal = hourlyRate * hours;
platformFee = subtotal * 0.10; // Phase 1: 10%
total = subtotal + platformFee;
```

**API Call:**
```yaml
Endpoint: POST /rest/v1/bookings
Body:
  carer_id: {carer_id}
  client_id: {user_id}
  start_time: {selected_start_time}
  end_time: {selected_end_time}
  rate_per_hour: {hourly_rate}
  total_price: {calculated_total}
  client_fee: {platform_fee}
  status: pending
On Success:
  - Navigate to Payment Screen
```

### 8. My Bookings Screen (Client)

**UI Components:**
- Tabs: All, Upcoming, Completed, Cancelled
- Booking Cards:
  - Carer Avatar & Name
  - Date & Time
  - Status Badge
  - Total Price
  - "Message" Button
  - "Cancel" Button (if pending/confirmed)

**API Call:**
```yaml
Endpoint: GET /rest/v1/bookings
Query:
  client_id: eq.{user_id}
  select: *, carer:profiles(full_name, avatar_url)
  order: start_time.desc
Display: List of bookings
```

### 9. Messages Screen

**UI Components:**
- Conversations List:
  - User Avatar
  - User Name
  - Last Message Preview
  - Timestamp
  - Unread Badge

**API Call:**
```yaml
Endpoint: GET /rest/v1/conversations
Query:
  or: (participant_1_id.eq.{user_id}, participant_2_id.eq.{user_id})
  order: last_message_at.desc
Display: List of conversations
```

### 10. Chat Screen

**UI Components:**
- Message Bubbles:
  - Sent (Right, Teal)
  - Received (Left, Gray)
- Message Input
- Send Button
- Timestamp

**API Calls:**

**Load Messages:**
```yaml
Endpoint: GET /rest/v1/messages
Query:
  or: (and(sender_id.eq.{user_id}, receiver_id.eq.{other_user_id}), and(sender_id.eq.{other_user_id}, receiver_id.eq.{user_id}))
  select: *, sender:profiles(full_name, avatar_url)
  order: created_at.asc
Display: Message list
```

**Send Message:**
```yaml
Endpoint: POST /rest/v1/messages
Body:
  sender_id: {user_id}
  receiver_id: {other_user_id}
  content: {message_text}
On Success:
  - Add to message list
  - Clear input
```

**Real-Time Updates:**
```yaml
Subscribe: messages table
Filter: receiver_id = {user_id}
On New Message:
  - Add to message list
  - Play notification sound
```

### 11. Carer Earnings Screen

**UI Components:**
- Stats Cards:
  - Total Earnings
  - Pending Earnings
  - Paid Earnings
- Stripe Connect Status
- "Connect Stripe" Button (if not connected)
- Payment History List

**API Call:**
```yaml
Endpoint: GET /rest/v1/bookings
Query:
  carer_id: eq.{user_id}
  status: eq.completed
  payment_status: eq.paid
Calculate: Sum of (total_price - carer_fee)
Display: Total earnings
```

### 12. Document Upload Screen (Carer)

**UI Components:**
- Document Types:
  - DBS Certificate
  - ID Document
  - Right to Work
  - Insurance Certificate
- For Each:
  - Upload Button
  - Expiry Date Picker
  - Preview
- "Submit for Review" Button

**API Calls:**

**Upload File:**
```yaml
Endpoint: POST /storage/v1/object/verification-documents/{file_path}
File: {selected_image}
On Success:
  - Get file URL
  - Save to verification record
```

**Create Verification:**
```yaml
Endpoint: POST /rest/v1/carer_verification
Body:
  carer_id: {user_id}
  dbs_document_url: {uploaded_url}
  dbs_expiry_date: {selected_date}
  dbs_status: pending
On Success:
  - Show success message
```

---

## 🎨 Design System

### Colors
```yaml
Primary: #1a9e8c (Teal)
Secondary: #111827 (Dark Navy)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
Background: #ffffff (White)
Surface: #f8fafc (Light Gray)
Text Primary: #111827 (Dark)
Text Secondary: #64748b (Gray)
```

### Typography
```yaml
Heading 1: 32px, Bold
Heading 2: 24px, Bold
Heading 3: 20px, Bold
Body: 16px, Regular
Caption: 14px, Regular
Small: 12px, Regular
```

### Spacing
```yaml
XS: 4px
S: 8px
M: 16px
L: 24px
XL: 32px
XXL: 48px
```

### Border Radius
```yaml
Small: 8px
Medium: 12px
Large: 16px
XLarge: 24px
Circle: 50%
```

---

## 🔔 Push Notifications

### Setup
1. Configure Firebase Cloud Messaging
2. Add FCM token to user profile
3. Send notifications for:
   - New booking
   - Booking confirmed
   - New message
   - Payment received
   - Document expiring soon

### Implementation
```yaml
On Notification Received:
  Type: new_booking
    - Navigate to Bookings Screen
  Type: new_message
    - Navigate to Chat Screen
  Type: payment_received
    - Navigate to Earnings Screen
```

---

## 💳 Stripe Integration

### Carer Onboarding
```yaml
Screen: Stripe Connect
Button: "Connect Stripe Account"
On Click:
  - Call Edge Function: stripe-connect-account
  - Get onboarding URL
  - Open in WebView
  - On Return: Refresh account status
```

### Client Payment
```yaml
Screen: Payment
Button: "Pay {amount}"
On Click:
  - Call Edge Function: stripe-checkout-session
  - Get checkout URL
  - Open in WebView
  - On Success: Update booking status
  - On Cancel: Show retry option
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up as client
- [ ] Sign up as carer
- [ ] Sign in
- [ ] Sign out
- [ ] Forgot password

### Client Features
- [ ] Search carers
- [ ] Filter by postcode
- [ ] Filter by specialization
- [ ] View carer profile
- [ ] Create booking
- [ ] View my bookings
- [ ] Cancel booking
- [ ] Send message
- [ ] Make payment

### Carer Features
- [ ] Upload documents
- [ ] Add referrals
- [ ] View pending bookings
- [ ] Accept booking
- [ ] Complete booking
- [ ] View earnings
- [ ] Connect Stripe
- [ ] Send message

### Real-Time
- [ ] Receive messages instantly
- [ ] Booking status updates
- [ ] Unread count updates

---

## 🚀 Deployment

### iOS
1. Build in Dreamflow
2. Download IPA
3. Upload to App Store Connect
4. Submit for review

### Android
1. Build in Dreamflow
2. Download APK/AAB
3. Upload to Google Play Console
4. Submit for review

---

## 📊 Analytics

### Track Events
```yaml
- user_signup
- user_login
- carer_search
- booking_created
- booking_confirmed
- booking_completed
- message_sent
- payment_completed
- document_uploaded
```

---

## 🎯 Success Metrics

**Track:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Bookings per user
- Messages per user
- Payment success rate
- Document approval rate
- User retention rate

---

## 📚 Resources

- [Dreamflow Documentation](https://docs.dreamflow.ai)
- [Supabase Flutter SDK](https://supabase.com/docs/reference/dart)
- [Stripe Flutter SDK](https://stripe.com/docs/payments/accept-a-payment?platform=flutter)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/flutter/client)

---

**Ready to build with Dreamflow!** 🚀

**This guide provides everything needed to create the Heems mobile app using Dreamflow's AI-powered platform!**
