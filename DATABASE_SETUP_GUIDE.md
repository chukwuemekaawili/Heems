# Heems Platform - Database Setup Guide
**Quick Reference for Supabase Configuration**

---

## Step 1: Execute SQL Schema

### Option A: Using Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `osmrtnhdtmxvrvtmuqnz`
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `SCHEMA_UPDATE_v2_FIXED.sql`
6. Paste into the editor
7. Click "Run" or press `Ctrl+Enter`
8. Verify success message

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref osmrtnhdtmxvrvtmuqnz

# Run the migration
supabase db push
```

---

## Step 2: Verify Tables Created

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profiles',
  'carer_details',
  'carer_verification',
  'carer_referrals',
  'organisation_details',
  'system_config',
  'bookings',
  'care_plans'
)
ORDER BY table_name;
```

**Expected Result:** 8 tables

---

## Step 3: Create Storage Bucket

### Using Supabase Dashboard
1. Go to "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Bucket name: `verification-documents`
4. Set to **Private** (not public)
5. Click "Create bucket"

### Configure RLS Policies for Storage

Go to "Storage" → "Policies" → "verification-documents" → "New Policy"

#### Policy 1: Carers Can Upload Own Documents
```sql
CREATE POLICY "Carers can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Carers Can View Own Documents
```sql
CREATE POLICY "Carers can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Admins Can View All Documents
```sql
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### Policy 4: Admins Can Delete Documents
```sql
CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## Step 4: Seed Initial Data

### Create System Config for Pricing Phase
```sql
INSERT INTO public.system_config (id, value, description)
VALUES ('active_phase', '1', 'Current pricing phase (1 or 2)')
ON CONFLICT (id) DO NOTHING;
```

### Create Test Admin User (Optional)
```sql
-- First, sign up a user through your app
-- Then run this to make them an admin:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

---

## Step 5: Verify RLS Policies

Run this query to check all RLS policies:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Policies:**
- profiles (3 policies)
- carer_details (2 policies)
- carer_verification (2 policies)
- carer_referrals (1 policy)
- organisation_details (2 policies)
- bookings (2 policies)
- care_plans (1 policy)

---

## Step 6: Test Database Connection

Create a test file: `test-db-connection.ts`

```typescript
import { supabase } from './src/integrations/supabase/client';

async function testConnection() {
  // Test 1: Check connection
  const { data, error } = await supabase
    .from('profiles')
    .select('count');
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Connection successful');
  }

  // Test 2: Check carer_verification table
  const { data: verification, error: verError } = await supabase
    .from('carer_verification')
    .select('*')
    .limit(1);
  
  if (verError) {
    console.error('❌ carer_verification table error:', verError);
  } else {
    console.log('✅ carer_verification table exists');
  }

  // Test 3: Check system_config
  const { data: config, error: configError } = await supabase
    .from('system_config')
    .select('*')
    .eq('id', 'active_phase')
    .single();
  
  if (configError) {
    console.error('❌ system_config error:', configError);
  } else {
    console.log('✅ system_config exists, active phase:', config?.value);
  }

  // Test 4: Check storage bucket
  const { data: buckets, error: bucketError } = await supabase
    .storage
    .listBuckets();
  
  if (bucketError) {
    console.error('❌ Storage error:', bucketError);
  } else {
    const verificationBucket = buckets?.find(b => b.name === 'verification-documents');
    if (verificationBucket) {
      console.log('✅ verification-documents bucket exists');
    } else {
      console.error('❌ verification-documents bucket not found');
    }
  }
}

testConnection();
```

---

## Common Issues & Solutions

### Issue 1: "relation does not exist"
**Solution:** The table hasn't been created. Re-run the SQL schema.

### Issue 2: "permission denied for table"
**Solution:** RLS policies are blocking access. Check your policies or temporarily disable RLS for testing:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Issue 3: "bucket not found"
**Solution:** Create the storage bucket in Supabase Dashboard.

### Issue 4: "policy already exists"
**Solution:** Use the FIXED version of the schema which includes `DROP POLICY IF EXISTS`.

### Issue 5: Storage upload fails
**Solution:** 
1. Check bucket exists
2. Verify RLS policies on storage.objects
3. Ensure user is authenticated
4. Check file size (max 5MB in our validation)

---

## Verification Checklist

Before testing the application, verify:

- [ ] All 8 tables created in database
- [ ] RLS enabled on all tables
- [ ] All RLS policies created
- [ ] `verification-documents` storage bucket created
- [ ] Storage bucket is set to Private
- [ ] Storage RLS policies configured
- [ ] `system_config` seeded with active_phase
- [ ] At least one admin user exists
- [ ] Database connection test passes
- [ ] Storage bucket test passes

---

## Quick SQL Queries for Debugging

### Check all carers and their verification status
```sql
SELECT 
  p.full_name,
  p.email,
  cv.overall_status,
  cv.dbs_status,
  cv.id_status,
  cv.rtw_status,
  cv.insurance_status,
  COUNT(cr.id) as referral_count
FROM profiles p
LEFT JOIN carer_verification cv ON p.id = cv.id
LEFT JOIN carer_referrals cr ON p.id = cr.carer_id
WHERE p.role = 'carer'
GROUP BY p.id, p.full_name, p.email, cv.overall_status, 
         cv.dbs_status, cv.id_status, cv.rtw_status, cv.insurance_status;
```

### Check pending verifications
```sql
SELECT 
  p.full_name,
  p.email,
  cv.dbs_status,
  cv.id_status,
  cv.rtw_status,
  cv.insurance_status
FROM profiles p
JOIN carer_verification cv ON p.id = cv.id
WHERE p.role = 'carer'
AND (
  cv.dbs_status = 'pending' OR
  cv.id_status = 'pending' OR
  cv.rtw_status = 'pending' OR
  cv.insurance_status = 'pending'
);
```

### Check expiring documents
```sql
SELECT 
  p.full_name,
  p.email,
  cv.dbs_expiry,
  cv.rtw_expiry,
  cv.insurance_expiry
FROM profiles p
JOIN carer_verification cv ON p.id = cv.id
WHERE p.role = 'carer'
AND (
  cv.dbs_expiry < NOW() + INTERVAL '30 days' OR
  cv.rtw_expiry < NOW() + INTERVAL '30 days' OR
  cv.insurance_expiry < NOW() + INTERVAL '30 days'
);
```

### Reset a carer's verification (for testing)
```sql
UPDATE carer_verification
SET 
  dbs_status = 'pending',
  id_status = 'pending',
  rtw_status = 'pending',
  insurance_status = 'pending',
  overall_status = 'unverified'
WHERE id = 'carer-user-id-here';
```

---

## Next Steps After Database Setup

1. ✅ Run `npm run dev` to start the development server
2. ✅ Create a test carer account
3. ✅ Navigate to `/carer/verification`
4. ✅ Upload test documents
5. ✅ Submit test referrals
6. ✅ Create an admin account
7. ✅ Navigate to `/admin/verification-queue`
8. ✅ Approve the test documents
9. ✅ Verify the carer's status changes to "verified"

---

**Database setup is complete! You're ready to test the verification system.** 🎉
