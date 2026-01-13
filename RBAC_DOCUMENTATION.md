# 🔐 Heems Platform - RBAC (Role-Based Access Control) Documentation

## 📋 User Roles Overview

The Heems platform has **4 distinct user roles**, each with specific permissions and access levels:

### 1. **Client** 👤
**Purpose:** Individuals or families seeking care services

**Access:**
- ✅ Search and browse carers
- ✅ Book care sessions
- ✅ Manage bookings
- ✅ Send/receive messages
- ✅ Make payments
- ✅ View own profile

**Dashboard:** `/client/dashboard`

**Permissions:**
- Can search verified carers
- Can create bookings
- Can cancel own bookings
- Can message carers
- Can view own payment history
- Cannot access admin functions
- Cannot view other users' data

---

### 2. **Carer** 🩺
**Purpose:** Self-employed care professionals providing services

**Access:**
- ✅ Manage profile and rates
- ✅ Upload verification documents
- ✅ Add work referrals
- ✅ View and manage bookings
- ✅ Accept/decline bookings
- ✅ Send/receive messages
- ✅ View earnings
- ✅ Connect Stripe account

**Dashboard:** `/carer/dashboard`

**Permissions:**
- Can set own hourly rate (£15+ minimum)
- Can upload DBS, ID, RTW, Insurance documents
- Can add 2 work referrals
- Can accept/decline booking requests
- Can mark bookings as complete
- Can view own earnings
- Can message clients
- Cannot access admin functions
- Cannot view other carers' data

---

### 3. **Organisation** 🏢
**Purpose:** Care homes, NHS trusts, local authorities

**Access:**
- ✅ Manage organisation profile
- ✅ Access talent pool
- ✅ Bulk booking capabilities
- ✅ Compliance tracking
- ✅ Team management
- ✅ Analytics and reports

**Dashboard:** `/organisation/dashboard`

**Permissions:**
- Can access pre-verified carers
- Can create multiple bookings
- Can view compliance reports
- Can manage team members
- Can view analytics
- Cannot access admin functions
- Cannot modify platform settings

---

### 4. **Admin** 👑
**Purpose:** Platform administrators and support staff

**Access:**
- ✅ **Full platform access**
- ✅ User management
- ✅ Verification queue
- ✅ Document review
- ✅ Phase control (pricing)
- ✅ System logs
- ✅ Message monitoring
- ✅ Reports & analytics
- ✅ Platform settings

**Dashboard:** `/admin/dashboard`

**Permissions:**
- Can view all users
- Can approve/reject verifications
- Can view all documents
- Can access all messages
- Can toggle pricing phases
- Can view system logs
- Can manage platform settings
- **Full database access**

---

## 🗂️ Database Schema

### Profiles Table Structure

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('client', 'carer', 'organisation', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Role Column Values:**
- `'client'` - Regular users seeking care
- `'carer'` - Care professionals
- `'organisation'` - Care organizations
- `'admin'` - Platform administrators

---

## 🔒 Row-Level Security (RLS) Policies

### Profiles Table

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Bookings Table

```sql
-- Clients can view their own bookings
CREATE POLICY "Clients can view own bookings"
ON bookings FOR SELECT
USING (client_id = auth.uid());

-- Carers can view their bookings
CREATE POLICY "Carers can view own bookings"
ON bookings FOR SELECT
USING (carer_id = auth.uid());

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Verification Documents

```sql
-- Carers can upload their own documents
CREATE POLICY "Carers can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all documents
CREATE POLICY "Admins can view documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Clients CANNOT view documents
-- (CQC Compliance - badge only)
```

---

## 🛣️ Route Protection

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign up page
- `/about` - About page
- `/contact` - Contact page

### Client Routes
- `/client/dashboard`
- `/client/search`
- `/client/search-enhanced`
- `/client/book/:carerId`
- `/client/bookings`
- `/client/bookings-enhanced`
- `/client/messages`
- `/client/profile`

### Carer Routes
- `/carer/dashboard`
- `/carer/profile`
- `/carer/profile-enhanced`
- `/carer/documents`
- `/carer/documents-new`
- `/carer/bookings`
- `/carer/bookings-enhanced`
- `/carer/earnings`
- `/carer/messages`

### Organisation Routes
- `/organisation/dashboard`
- `/organisation/profile`
- `/organisation/carers`
- `/organisation/bookings`
- `/organisation/analytics`
- `/organisation/messages`

### Admin Routes
- `/admin/dashboard`
- `/admin/users`
- `/admin/verifications`
- `/admin/verification-queue`
- `/admin/organisations`
- `/admin/reports`
- `/admin/phase-control`
- `/admin/system-logs`
- `/admin/messages`

---

## 🔄 Login Redirect Logic

```typescript
// After successful login, redirect based on role:

if (profile?.role === 'admin') {
  navigate('/admin/dashboard');
} else if (profile?.role === 'carer') {
  navigate('/carer/dashboard');
} else if (profile?.role === 'organisation') {
  navigate('/organisation/dashboard');
} else {
  navigate('/client/dashboard'); // Default for 'client' role
}
```

---

## 🧪 Testing RBAC

### Test Admin Access

```sql
-- 1. Check your role
SELECT id, full_name, role 
FROM profiles 
WHERE id = auth.uid();

-- 2. Verify admin role
SELECT role FROM profiles WHERE id = auth.uid();
-- Should return: 'admin'

-- 3. Test admin permissions
SELECT COUNT(*) FROM profiles; 
-- Admins should see all profiles

SELECT COUNT(*) FROM bookings;
-- Admins should see all bookings
```

### Test Client Access

```sql
-- Clients should only see their own data
SELECT * FROM bookings WHERE client_id = auth.uid();
-- Should only return their bookings

SELECT * FROM profiles WHERE id != auth.uid();
-- Should return empty (no access to other profiles)
```

---

## 🚨 Common Issues & Solutions

### Issue: Logged in as admin but redirected to client dashboard

**Cause:** Login.tsx was checking wrong column (`user_type` instead of `role`)

**Solution:** ✅ FIXED - Now checks `role` column

**Verify:**
```sql
SELECT role FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

### Issue: Can't access admin routes

**Cause:** Role is not set to 'admin'

**Solution:**
```sql
UPDATE profiles 
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

### Issue: RLS blocking admin access

**Cause:** Missing admin RLS policies

**Solution:** Run `SCHEMA_UPDATE_v2_FIXED.sql` which includes admin policies

---

## 📊 Role Comparison Matrix

| Feature | Client | Carer | Organisation | Admin |
|---------|--------|-------|--------------|-------|
| Search Carers | ✅ | ❌ | ✅ | ✅ |
| Create Bookings | ✅ | ❌ | ✅ | ✅ |
| Upload Documents | ❌ | ✅ | ❌ | ✅ |
| View All Users | ❌ | ❌ | ❌ | ✅ |
| Approve Verifications | ❌ | ❌ | ❌ | ✅ |
| Toggle Pricing Phase | ❌ | ❌ | ❌ | ✅ |
| View System Logs | ❌ | ❌ | ❌ | ✅ |
| Set Own Rate | ❌ | ✅ | ❌ | ✅ |
| Connect Stripe | ❌ | ✅ | ❌ | ✅ |
| View Earnings | ❌ | ✅ | ✅ | ✅ |
| Send Messages | ✅ | ✅ | ✅ | ✅ |

---

## 🔧 How to Change User Role

### Via SQL (Recommended)

```sql
-- Make user an admin
UPDATE profiles 
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Make user a carer
UPDATE profiles 
SET role = 'carer'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Make user a client
UPDATE profiles 
SET role = 'client'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Make user an organisation
UPDATE profiles 
SET role = 'organisation'
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Verify Change

```sql
SELECT au.email, p.full_name, p.role, p.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'user@example.com';
```

---

## ✅ Current Status

**Your Account:**
- Email: techfieldstechnologies@gmail.com
- Role: admin ✅
- Dashboard: /admin/dashboard

**Login Fix:** ✅ Applied
- Changed `user_type` to `role` in Login.tsx
- Now correctly redirects admins to admin dashboard

---

## 🎯 Next Steps

1. **Logout** from current session
2. **Login again** at `/login`
3. You should now be redirected to `/admin/dashboard`
4. Verify you can access all admin routes

---

**RBAC is now properly configured!** 🎉
