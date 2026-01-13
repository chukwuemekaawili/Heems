# 🔐 Admin Dashboard Access Guide

## 📋 Prerequisites

Before accessing the admin dashboard, ensure you've completed these steps:

1. ✅ Executed all SQL migrations in Supabase
2. ✅ Created Supabase storage bucket
3. ✅ App is running (`npm run dev`)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Execute Database Schemas

Go to your Supabase project → SQL Editor and run these files **in order**:

```sql
1. SCHEMA_UPDATE_v2_FIXED.sql
2. STORAGE_RLS_POLICIES.sql
3. ADD_RATE_CONSTRAINT.sql
4. ADD_STRIPE_FIELDS.sql
5. MESSAGING_SCHEMA.sql
6. SYSTEM_LOGS_TABLE.sql
```

### Step 2: Create Your Account

**Option A: Via the App (Recommended)**

1. Go to `http://localhost:5173/signup`
2. Fill in the form:
   - **Email:** techfieldstechnologies@gmail.com
   - **Password:** (your secure password)
   - **Full Name:** Admin User
   - **Role:** Select "Client" (we'll upgrade it to admin)
3. Click "Sign Up"

**Option B: Via Supabase Dashboard**

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter:
   - **Email:** techfieldstechnologies@gmail.com
   - **Password:** (your secure password)
4. Click "Create User"

### Step 3: Upgrade to Admin

Go to Supabase SQL Editor and run:

```sql
-- Upgrade your account to admin
UPDATE profiles 
SET role = 'admin'
WHERE email = 'techfieldstechnologies@gmail.com';

-- Verify it worked
SELECT id, email, full_name, role 
FROM profiles 
WHERE email = 'techfieldstechnologies@gmail.com';
```

You should see `role: 'admin'` in the result.

---

## 🎯 Accessing the Admin Dashboard

### Method 1: Direct URL

1. Open your browser
2. Go to: `http://localhost:5173/admin/dashboard`
3. If not logged in, you'll be redirected to login
4. Login with: **techfieldstechnologies@gmail.com**
5. You'll be redirected to the admin dashboard

### Method 2: Via Login Page

1. Go to: `http://localhost:5173/login`
2. Enter credentials:
   - **Email:** techfieldstechnologies@gmail.com
   - **Password:** (your password)
3. Click "Sign In"
4. You'll be redirected to `/admin/dashboard`

---

## 📊 Admin Dashboard Features

Once logged in, you'll have access to:

### Main Dashboard (`/admin/dashboard`)
- Platform statistics
- Recent activity
- Quick actions

### Users Management (`/admin/users`)
- View all users (clients, carers, organisations)
- Filter by role
- User details

### Verification Queue (`/admin/verification-queue`)
- Review carer documents
- Approve/reject verifications
- View document expiry
- Check referrals

### Phase Control (`/admin/phase-control`)
- Toggle between Phase 1 & Phase 2 pricing
- View fee statistics
- Auto-switch recommendations

### System Logs (`/admin/system-logs`)
- View automated task logs
- Monitor expiry checks
- Track system events

### Messages (`/admin/messages`)
- View all platform messages
- Monitor CQC compliance
- Review flagged messages

---

## 🔍 Troubleshooting

### Issue: "Access Denied" or redirected to home

**Solution:**
```sql
-- Check your role
SELECT email, role FROM profiles 
WHERE email = 'techfieldstechnologies@gmail.com';

-- If role is not 'admin', update it
UPDATE profiles 
SET role = 'admin'
WHERE email = 'techfieldstechnologies@gmail.com';
```

### Issue: Profile doesn't exist

**Solution:**
```sql
-- Check if profile exists
SELECT * FROM profiles 
WHERE email = 'techfieldstechnologies@gmail.com';

-- If no results, check auth.users
SELECT id, email FROM auth.users 
WHERE email = 'techfieldstechnologies@gmail.com';

-- Create profile manually (use the ID from auth.users)
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_ID_HERE', -- from auth.users
  'techfieldstechnologies@gmail.com',
  'Admin User',
  'admin'
);
```

### Issue: Can't login

**Possible causes:**
1. Database schemas not executed
2. Supabase credentials incorrect in `.env`
3. Profile not created

**Check `.env` file:**
```env
VITE_SUPABASE_URL=https://osmrtnhdtmxvrvtmuqnz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🎨 Admin Routes Available

```
/admin/dashboard          - Main dashboard
/admin/users              - User management
/admin/verifications      - Basic verification view
/admin/verification-queue - Enhanced verification queue
/admin/organisations      - Organisation management
/admin/reports            - Reports & analytics
/admin/phase-control      - Fee phase management
/admin/system-logs        - System monitoring
/admin/messages           - Message monitoring
```

---

## 🔐 Security Notes

### Admin Permissions

Admins can:
- ✅ View all users
- ✅ Approve/reject verifications
- ✅ View all documents
- ✅ Access all messages
- ✅ Manage platform settings
- ✅ View system logs
- ✅ Toggle pricing phases

### RLS Policies

The database has Row-Level Security (RLS) policies that:
- Restrict non-admins from admin routes
- Protect sensitive data
- Ensure data privacy

---

## 📝 Quick Reference

**Admin Email:** techfieldstechnologies@gmail.com  
**Admin Dashboard:** http://localhost:5173/admin/dashboard  
**Login Page:** http://localhost:5173/login  

**SQL to make admin:**
```sql
UPDATE profiles SET role = 'admin' 
WHERE email = 'techfieldstechnologies@gmail.com';
```

---

## ✅ Verification Checklist

Before accessing admin dashboard:

- [ ] Executed `SCHEMA_UPDATE_v2_FIXED.sql`
- [ ] Executed other SQL migrations
- [ ] Created account via signup
- [ ] Ran admin upgrade SQL
- [ ] Verified role is 'admin'
- [ ] Logged in successfully
- [ ] Can access `/admin/dashboard`

---

## 🆘 Still Having Issues?

1. **Check browser console** for errors (F12)
2. **Check Supabase logs** in dashboard
3. **Verify database** tables exist
4. **Check `.env`** file has correct credentials
5. **Restart dev server** (`npm run dev`)

---

**You're all set! Access your admin dashboard at:**
👉 **http://localhost:5173/admin/dashboard**

**Login with:** techfieldstechnologies@gmail.com
