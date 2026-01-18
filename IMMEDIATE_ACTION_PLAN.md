# 🚨 IMMEDIATE ACTION PLAN - Heartful Care Connect
**Created:** January 18, 2026  
**Priority:** CRITICAL  
**Timeline:** Complete within 7 days

---

## ⚠️ CRITICAL SECURITY ISSUE - DO THIS FIRST (30 minutes)

### 🔴 STEP 1: Secure Exposed Credentials

**Problem:** Your `.env` file with API keys is committed to git and publicly visible.

**Actions:**
```bash
# 1. Add .env to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# 2. Remove from git history
git rm --cached .env
git commit -m "security: Remove exposed credentials from version control"
git push

# 3. Create .env.example (safe template)
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
EOF

git add .env.example
git commit -m "docs: Add .env.example template"
git push
```

**4. Rotate Supabase Keys (if repository was public):**
- Go to Supabase Dashboard → Settings → API
- Click "Reset" on anon key
- Update your local `.env` file with new key

---

## 🗄️ STEP 2: Execute Database Schema (1-2 hours)

**Problem:** All SQL files exist but haven't been executed. Platform won't work without database tables.

### Execution Order (IMPORTANT - Follow this sequence)

**Go to:** Supabase Dashboard → SQL Editor

**Execute in this exact order:**

#### 1. Base Schema
```sql
-- File: SUPABASE_SETUP.sql
-- Creates: profiles, carer_details, bookings, care_plans
-- Time: ~2 minutes
```
Copy entire contents of `SUPABASE_SETUP.sql` → Paste → Run

#### 2. Advanced Features
```sql
-- File: SCHEMA_UPDATE_v2_FIXED.sql
-- Creates: organisation_details, carer_verification, carer_referrals, system_config
-- Time: ~2 minutes
```
Copy entire contents → Paste → Run

#### 3. Verification Column
```sql
-- File: ADD_VERIFIED_COLUMN.sql
-- Adds: verified column to profiles table
-- Time: ~30 seconds
```
Copy entire contents → Paste → Run

#### 4. Stripe Fields
```sql
-- File: ADD_STRIPE_FIELDS.sql
-- Adds: Stripe Connect fields to carer_details
-- Time: ~30 seconds
```
Copy entire contents → Paste → Run

#### 5. Client Settings
```sql
-- File: CLIENT_SETTINGS_SETUP.sql
-- Creates: client_details table with payment settings
-- Time: ~1 minute
```
Copy entire contents → Paste → Run

#### 6. Messaging System
```sql
-- File: MESSAGING_SCHEMA.sql
-- Creates: messages, conversations tables
-- Time: ~1 minute
```
Copy entire contents → Paste → Run

#### 7. Security Fixes
```sql
-- File: FIX_RLS_RECURSION.sql
-- Fixes: Admin RLS infinite loop
-- Time: ~1 minute
```
Copy entire contents → Paste → Run

```sql
-- File: FIX_RLS_POLICIES.sql
-- Fixes: Organisation RLS policies
-- Time: ~1 minute
```
Copy entire contents → Paste → Run

#### 8. User Details Trigger
```sql
-- File: FIX_USER_DETAILS_TRIGGER.sql
-- Fixes: User names not showing in admin dashboard
-- Time: ~30 seconds
```
Copy entire contents → Paste → Run

### Verification Checklist
After executing all SQL files, verify:

```sql
-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- bookings, call_logs, care_plans, carer_details, carer_referrals,
-- carer_verification, client_details, conversations, messages,
-- organisation_details, platform_settings, profiles, system_config, system_logs

-- Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- All should show rowsecurity = true

-- Check system_config seeded
SELECT * FROM system_config WHERE id = 'active_phase';
-- Should return: id='active_phase', value='1'
```

---

## 📦 STEP 3: Create Storage Bucket (15 minutes)

**Problem:** Document uploads will fail without storage bucket.

### Actions:
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `verification-documents`
4. Set to **Private** (not public)
5. Click "Create bucket"

### Apply Storage Policies:
Go to SQL Editor and execute:
```sql
-- File: STORAGE_RLS_POLICIES.sql
-- Creates: Storage access policies for document uploads
```

### Test Upload:
```sql
-- Verify bucket exists
SELECT * FROM storage.buckets WHERE name = 'verification-documents';
```

---

## 🔧 STEP 4: Fix Admin Dashboard (30 minutes)

**Problem:** Admin dashboard has several bugs preventing use.

### Quick Test:
1. Start dev server: `npm run dev`
2. Go to: http://localhost:5173/login
3. Login with admin account
4. Navigate to: http://localhost:5173/admin/dashboard

### If you see errors:

**Error: "Cannot read properties of undefined"**
- Already fixed in code
- Just need to test after SQL migrations

**Error: "Column 'verified' does not exist"**
- Fixed by executing `ADD_VERIFIED_COLUMN.sql` (Step 2.3)

**Error: "Column 'email' does not exist in bookings"**
- Already fixed in code
- Clear browser cache and refresh

### Create Admin Account (if needed):
```sql
-- In Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## ✅ STEP 5: Verification Tests (30 minutes)

After completing Steps 1-4, test these critical flows:

### Test 1: Authentication
- [ ] Can sign up as client
- [ ] Can sign up as carer
- [ ] Can login
- [ ] Redirects to correct dashboard based on role

### Test 2: Admin Dashboard
- [ ] Dashboard loads without errors
- [ ] Users tab shows real data
- [ ] Bookings tab loads
- [ ] Organisations tab loads
- [ ] Can click "Add User"

### Test 3: Database
- [ ] All tables exist (run verification query from Step 2)
- [ ] RLS enabled on all tables
- [ ] system_config has active_phase = '1'

### Test 4: Storage
- [ ] verification-documents bucket exists
- [ ] Bucket is set to Private
- [ ] Storage policies applied

---

## 📊 SUCCESS CRITERIA

After completing all 5 steps, you should have:

✅ Credentials secured (not in git)  
✅ All database tables created  
✅ RLS policies active  
✅ Storage bucket configured  
✅ Admin dashboard working  
✅ Authentication working  
✅ No console errors on dashboard load

---

## 🚫 COMMON ERRORS & FIXES

### Error: "relation 'profiles' does not exist"
**Fix:** Execute `SUPABASE_SETUP.sql` first

### Error: "infinite recursion detected in policy"
**Fix:** Execute `FIX_RLS_RECURSION.sql`

### Error: "new row violates row-level security policy"
**Fix:** Execute `FIX_RLS_POLICIES.sql`

### Error: "column 'verified' does not exist"
**Fix:** Execute `ADD_VERIFIED_COLUMN.sql`

### Error: "bucket 'verification-documents' does not exist"
**Fix:** Create bucket manually in Supabase Dashboard → Storage

---

## 📞 NEXT STEPS (After This Week)

Once immediate actions are complete, proceed to:

1. **Week 2:** Implement document upload functionality
2. **Week 3:** Deploy Stripe Edge Functions
3. **Week 4:** Implement real-time messaging
4. **Week 5:** Security hardening and testing

See `COMPREHENSIVE_PROJECT_AUDIT.md` for detailed roadmap.

---

**IMPORTANT:** Do not skip Step 1 (security). Exposed credentials are a critical vulnerability.


