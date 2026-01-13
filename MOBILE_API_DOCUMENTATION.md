# Heems Platform - Complete API Documentation for Mobile App Development

## 📱 Overview

This documentation provides all API endpoints, authentication flows, and data models needed to build the Heems mobile app using Flutter/Dreamflow.

**Base URL:** `https://osmrtnhdtmxvrvtmuqnz.supabase.co`  
**API Version:** v1  
**Authentication:** Supabase Auth (JWT)

---

## 🔐 Authentication

### Supabase Configuration

```dart
// Supabase Client Setup
final supabase = SupabaseClient(
  'https://osmrtnhdtmxvrvtmuqnz.supabase.co',
  'YOUR_SUPABASE_ANON_KEY',
);
```

### 1. Sign Up

**Endpoint:** `POST /auth/v1/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "data": {
    "full_name": "John Doe",
    "role": "client" // or "carer"
  }
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "role": "client"
    }
  }
}
```

### 2. Sign In

**Endpoint:** `POST /auth/v1/token?grant_type=password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** Same as Sign Up

### 3. Sign Out

**Endpoint:** `POST /auth/v1/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

### 4. Refresh Token

**Endpoint:** `POST /auth/v1/token?grant_type=refresh_token`

**Request Body:**
```json
{
  "refresh_token": "your_refresh_token"
}
```

---

## 👤 User Profile APIs

### 1. Get Current User Profile

**Endpoint:** `GET /rest/v1/profiles?id=eq.{user_id}`

**Headers:**
```
Authorization: Bearer {access_token}
apikey: {supabase_anon_key}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "client",
    "avatar_url": "https://...",
    "phone": "+44123456789",
    "created_at": "2026-01-10T12:00:00Z",
    "updated_at": "2026-01-10T12:00:00Z"
  }
]
```

### 2. Update Profile

**Endpoint:** `PATCH /rest/v1/profiles?id=eq.{user_id}`

**Headers:**
```
Authorization: Bearer {access_token}
apikey: {supabase_anon_key}
Content-Type: application/json
Prefer: return=representation
```

**Request Body:**
```json
{
  "full_name": "John Updated",
  "phone": "+44987654321",
  "avatar_url": "https://new-avatar-url.com"
}
```

---

## 🔍 Marketplace APIs (Client)

### 1. Search Carers

**Endpoint:** `GET /rest/v1/profiles?role=eq.carer&select=*,carer_details(*),carer_verification(*)`

**Query Parameters:**
- `carer_details.postcode=like.*{postcode}*` - Filter by postcode
- `carer_details.specializations=cs.{specialization}` - Filter by specialization
- `carer_details.years_experience=gte.{years}` - Minimum experience
- `carer_details.hourly_rate=lte.{rate}` - Maximum rate
- `carer_verification.overall_status=eq.verified` - Verified only

**Example:**
```
GET /rest/v1/profiles?role=eq.carer&carer_verification.overall_status=eq.verified&carer_details.postcode=like.*M1*&select=*,carer_details(*),carer_verification(*)
```

**Response:**
```json
[
  {
    "id": "uuid",
    "full_name": "Jane Smith",
    "avatar_url": "https://...",
    "carer_details": {
      "hourly_rate": 20.00,
      "years_experience": 5,
      "bio": "Experienced carer...",
      "specializations": ["Dementia Care", "Personal Care"],
      "postcode": "M1 1AB"
    },
    "carer_verification": {
      "overall_status": "verified"
    }
  }
]
```

### 2. Get Carer Details

**Endpoint:** `GET /rest/v1/profiles?id=eq.{carer_id}&select=*,carer_details(*),carer_verification(*)`

**Response:** Single carer object (same structure as above)

---

## 📅 Booking APIs

### 1. Create Booking

**Endpoint:** `POST /rest/v1/bookings`

**Headers:**
```
Authorization: Bearer {access_token}
apikey: {supabase_anon_key}
Content-Type: application/json
Prefer: return=representation
```

**Request Body:**
```json
{
  "carer_id": "uuid",
  "client_id": "uuid",
  "start_time": "2026-01-15T09:00:00Z",
  "end_time": "2026-01-15T17:00:00Z",
  "rate_per_hour": 20.00,
  "total_price": 176.00,
  "client_fee": 16.00,
  "carer_fee": 0.00,
  "status": "pending",
  "payment_status": "pending"
}
```

**Response:**
```json
{
  "id": "uuid",
  "carer_id": "uuid",
  "client_id": "uuid",
  "start_time": "2026-01-15T09:00:00Z",
  "end_time": "2026-01-15T17:00:00Z",
  "rate_per_hour": 20.00,
  "total_price": 176.00,
  "status": "pending",
  "created_at": "2026-01-10T12:00:00Z"
}
```

### 2. Get My Bookings (Client)

**Endpoint:** `GET /rest/v1/bookings?client_id=eq.{user_id}&select=*,carer:profiles!bookings_carer_id_fkey(id,full_name,avatar_url)&order=start_time.desc`

**Response:**
```json
[
  {
    "id": "uuid",
    "start_time": "2026-01-15T09:00:00Z",
    "end_time": "2026-01-15T17:00:00Z",
    "status": "confirmed",
    "payment_status": "paid",
    "total_price": 176.00,
    "rate_per_hour": 20.00,
    "carer": {
      "id": "uuid",
      "full_name": "Jane Smith",
      "avatar_url": "https://..."
    }
  }
]
```

### 3. Get My Bookings (Carer)

**Endpoint:** `GET /rest/v1/bookings?carer_id=eq.{user_id}&select=*,client:profiles!bookings_client_id_fkey(id,full_name,avatar_url)&order=start_time.desc`

### 4. Update Booking Status

**Endpoint:** `PATCH /rest/v1/bookings?id=eq.{booking_id}`

**Request Body:**
```json
{
  "status": "confirmed" // or "completed", "cancelled"
}
```

### 5. Cancel Booking

**Endpoint:** `PATCH /rest/v1/bookings?id=eq.{booking_id}`

**Request Body:**
```json
{
  "status": "cancelled"
}
```

---

## 💬 Messaging APIs

### 1. Get Conversations

**Endpoint:** `GET /rest/v1/conversations?or=(participant_1_id.eq.{user_id},participant_2_id.eq.{user_id})&select=*&order=last_message_at.desc`

**Response:**
```json
[
  {
    "id": "uuid",
    "participant_1_id": "uuid",
    "participant_2_id": "uuid",
    "last_message_at": "2026-01-10T12:00:00Z",
    "created_at": "2026-01-10T10:00:00Z"
  }
]
```

### 2. Get Messages in Conversation

**Endpoint:** `GET /rest/v1/messages?or=(and(sender_id.eq.{user_id},receiver_id.eq.{other_user_id}),and(sender_id.eq.{other_user_id},receiver_id.eq.{user_id}))&select=*,sender:profiles!messages_sender_id_fkey(full_name,avatar_url)&order=created_at.asc`

**Response:**
```json
[
  {
    "id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "content": "Hello, how are you?",
    "is_read": false,
    "is_flagged": false,
    "created_at": "2026-01-10T12:00:00Z",
    "sender": {
      "full_name": "John Doe",
      "avatar_url": "https://..."
    }
  }
]
```

### 3. Send Message

**Endpoint:** `POST /rest/v1/messages`

**Request Body:**
```json
{
  "sender_id": "uuid",
  "receiver_id": "uuid",
  "content": "Hello, how are you?",
  "is_read": false
}
```

### 4. Mark Messages as Read

**Endpoint:** `PATCH /rest/v1/messages?sender_id=eq.{other_user_id}&receiver_id=eq.{user_id}&is_read=eq.false`

**Request Body:**
```json
{
  "is_read": true
}
```

### 5. Get Unread Count

**Endpoint:** `GET /rest/v1/messages?receiver_id=eq.{user_id}&is_read=eq.false&select=count`

**Response:**
```json
[
  {
    "count": 5
  }
]
```

---

## 🔔 Real-Time Subscriptions

### 1. Subscribe to New Messages

```dart
final subscription = supabase
  .from('messages')
  .stream(primaryKey: ['id'])
  .eq('receiver_id', userId)
  .listen((data) {
    // Handle new message
    print('New message: ${data}');
  });
```

### 2. Subscribe to Booking Updates

```dart
final subscription = supabase
  .from('bookings')
  .stream(primaryKey: ['id'])
  .or('client_id.eq.$userId,carer_id.eq.$userId')
  .listen((data) {
    // Handle booking update
    print('Booking updated: ${data}');
  });
```

---

## 💳 Payment APIs (Stripe)

### 1. Create Stripe Connect Account

**Endpoint:** `POST /functions/v1/stripe-connect-account`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "carerId": "uuid",
  "email": "carer@example.com",
  "refreshUrl": "heems://stripe-refresh",
  "returnUrl": "heems://stripe-success"
}
```

**Response:**
```json
{
  "accountId": "acct_...",
  "onboardingUrl": "https://connect.stripe.com/..."
}
```

### 2. Create Payment Session

**Endpoint:** `POST /functions/v1/stripe-checkout-session`

**Request Body:**
```json
{
  "bookingId": "uuid",
  "carerId": "uuid",
  "clientId": "uuid",
  "amount": 17600, // in pence
  "applicationFeeAmount": 1600, // in pence
  "stripeAccountId": "acct_...",
  "successUrl": "heems://payment-success",
  "cancelUrl": "heems://payment-cancelled"
}
```

**Response:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

## 📄 Document Upload APIs

### 1. Upload Document to Storage

**Endpoint:** `POST /storage/v1/object/verification-documents/{file_path}`

**Headers:**
```
Authorization: Bearer {access_token}
apikey: {supabase_anon_key}
Content-Type: image/jpeg (or appropriate type)
```

**File Path Format:** `{user_id}/{document_type}_{timestamp}.jpg`

**Response:**
```json
{
  "Key": "verification-documents/{user_id}/dbs_1234567890.jpg"
}
```

### 2. Get Document URL

**Endpoint:** `POST /storage/v1/object/sign/verification-documents/{file_path}`

**Request Body:**
```json
{
  "expiresIn": 3600 // seconds
}
```

**Response:**
```json
{
  "signedURL": "https://...?token=..."
}
```

### 3. Create Verification Record

**Endpoint:** `POST /rest/v1/carer_verification`

**Request Body:**
```json
{
  "carer_id": "uuid",
  "dbs_document_url": "verification-documents/...",
  "dbs_expiry_date": "2027-01-10",
  "dbs_status": "pending",
  "id_document_url": "verification-documents/...",
  "id_expiry_date": "2030-01-10",
  "id_status": "pending"
}
```

---

## 📊 Data Models

### Profile
```dart
class Profile {
  final String id;
  final String email;
  final String fullName;
  final String role; // 'client', 'carer', 'organisation', 'admin'
  final String? avatarUrl;
  final String? phone;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### Carer Details
```dart
class CarerDetails {
  final String id;
  final double hourlyRate;
  final int yearsExperience;
  final String bio;
  final List<String> specializations;
  final String postcode;
  final String? stripeAccountId;
  final bool stripeOnboardingComplete;
}
```

### Booking
```dart
class Booking {
  final String id;
  final String carerId;
  final String clientId;
  final DateTime startTime;
  final DateTime endTime;
  final double ratePerHour;
  final double totalPrice;
  final double clientFee;
  final double carerFee;
  final String status; // 'pending', 'confirmed', 'completed', 'cancelled'
  final String paymentStatus; // 'pending', 'paid', 'failed'
  final DateTime createdAt;
}
```

### Message
```dart
class Message {
  final String id;
  final String senderId;
  final String receiverId;
  final String content;
  final bool isRead;
  final bool isFlagged;
  final List<String>? flaggedKeywords;
  final DateTime createdAt;
}
```

### Conversation
```dart
class Conversation {
  final String id;
  final String participant1Id;
  final String participant2Id;
  final DateTime lastMessageAt;
  final int unreadCount;
  final String? lastMessage;
}
```

---

## 🔄 Common Query Patterns

### Pagination
```
GET /rest/v1/bookings?limit=20&offset=0&order=created_at.desc
```

### Filtering
```
GET /rest/v1/profiles?role=eq.carer&carer_details.hourly_rate=gte.15
```

### Nested Select
```
GET /rest/v1/bookings?select=*,carer:profiles(full_name,avatar_url)
```

### Count
```
GET /rest/v1/messages?receiver_id=eq.{user_id}&is_read=eq.false&select=count
```

### Range
```
GET /rest/v1/bookings?start_time=gte.2026-01-01&start_time=lte.2026-01-31
```

---

## 🛡️ Error Handling

### Common Error Codes

**401 Unauthorized:**
```json
{
  "message": "Invalid JWT token",
  "code": "PGRST301"
}
```

**403 Forbidden:**
```json
{
  "message": "Permission denied",
  "code": "42501"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found",
  "code": "PGRST116"
}
```

**409 Conflict:**
```json
{
  "message": "Duplicate key value violates unique constraint",
  "code": "23505"
}
```

---

## 📱 Mobile App Specific Considerations

### 1. Token Storage
```dart
// Store tokens securely
await FlutterSecureStorage().write(
  key: 'access_token',
  value: accessToken,
);
```

### 2. Automatic Token Refresh
```dart
// Implement token refresh logic
if (tokenExpired) {
  final newToken = await refreshToken(refreshToken);
  // Update stored token
}
```

### 3. Offline Support
```dart
// Cache data locally
await Hive.box('bookings').put(bookingId, booking);
```

### 4. Push Notifications
```dart
// Handle FCM tokens
await supabase.from('user_devices').insert({
  'user_id': userId,
  'fcm_token': fcmToken,
  'platform': 'android', // or 'ios'
});
```

---

## 🎯 Recommended Flutter Packages

```yaml
dependencies:
  supabase_flutter: ^2.0.0
  flutter_secure_storage: ^9.0.0
  cached_network_image: ^3.3.0
  intl: ^0.18.0
  provider: ^6.1.0
  go_router: ^13.0.0
  image_picker: ^1.0.0
  file_picker: ^6.0.0
  flutter_stripe: ^10.0.0
  firebase_messaging: ^14.0.0
```

---

## 📝 Example Implementation (Dreamflow)

### Authentication Flow
```dart
// Sign In
final response = await supabase.auth.signInWithPassword(
  email: email,
  password: password,
);

// Store user data
final user = response.user;
final profile = await supabase
  .from('profiles')
  .select()
  .eq('id', user!.id)
  .single();
```

### Search Carers
```dart
final carers = await supabase
  .from('profiles')
  .select('*, carer_details(*), carer_verification(*)')
  .eq('role', 'carer')
  .eq('carer_verification.overall_status', 'verified')
  .ilike('carer_details.postcode', '%M1%');
```

### Create Booking
```dart
final booking = await supabase
  .from('bookings')
  .insert({
    'carer_id': carerId,
    'client_id': userId,
    'start_time': startTime.toIso8601String(),
    'end_time': endTime.toIso8601String(),
    'rate_per_hour': rate,
    'total_price': total,
    'status': 'pending',
  })
  .select()
  .single();
```

### Real-Time Messages
```dart
supabase
  .from('messages')
  .stream(primaryKey: ['id'])
  .eq('receiver_id', userId)
  .listen((messages) {
    setState(() {
      this.messages = messages;
    });
  });
```

---

## 🚀 Ready for Dreamflow!

This API documentation provides everything needed to build the Heems mobile app with Dreamflow or any Flutter development tool.

**Next Steps:**
1. Set up Supabase client in Flutter
2. Implement authentication flow
3. Build UI screens
4. Connect to APIs
5. Add real-time features
6. Integrate Stripe payments
7. Test thoroughly
8. Deploy to stores

**Happy Building!** 🎉
