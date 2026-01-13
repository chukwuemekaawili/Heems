# Storage RLS Setup - Quick Guide

## Step 1: Create the Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `osmrtnhdtmxvrvtmuqnz`
3. Click **Storage** in the left sidebar
4. Click **"New bucket"** button
5. Enter bucket details:
   - **Name:** `verification-documents`
   - **Public:** ❌ **OFF** (Keep it private!)
   - **File size limit:** 5MB (optional)
   - **Allowed MIME types:** Leave empty or add: `application/pdf, image/jpeg, image/png`
6. Click **"Create bucket"**

## Step 2: Execute Storage RLS Policies

1. Go to **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `STORAGE_RLS_POLICIES.sql`
4. Paste into the editor
5. Click **"Run"** or press `Ctrl+Enter`
6. Verify you see success messages for all 6 policies

## Step 3: Verify Policies Are Active

Run this query to check:

```sql
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;
```

**Expected Output:** 6 policies related to verification-documents

## Step 4: Test Upload (Optional)

You can test the upload functionality:

1. Create a test carer account in your app
2. Navigate to `/carer/verification`
3. Try uploading a test PDF or image
4. Check in Supabase Dashboard → Storage → verification-documents
5. You should see a folder with the carer's ID containing the file

## Troubleshooting

### Issue: "new row violates row-level security policy"
**Solution:** Make sure you're logged in as a carer when uploading

### Issue: "bucket not found"
**Solution:** Create the bucket first (Step 1)

### Issue: "permission denied for schema storage"
**Solution:** You need to be the project owner or have proper permissions

### Issue: Policies not showing up
**Solution:** Refresh the page or check the SQL Editor for errors

## What These Policies Do

| Policy | Who | What |
|--------|-----|------|
| Upload own documents | Carers | Can upload to their own folder only |
| View own documents | Carers | Can view their uploaded documents |
| Update own documents | Carers | Can replace/update their documents |
| Delete own documents | Carers | Can delete and re-upload |
| View all documents | Admins | Can view all carer documents for review |
| Delete any document | Admins | Can remove inappropriate documents |

## Security Features ✅

- ✅ **Carers** can only access their own folder (by user ID)
- ✅ **Admins** can access all folders for verification
- ✅ **Clients** CANNOT access any raw documents
- ✅ Documents are **private** by default
- ✅ **Badge-only** display to clients (PRD v2.3.2 compliant)

## Next Steps

Once storage is configured:
1. ✅ Test document upload as a carer
2. ✅ Test document review as an admin
3. ✅ Move to **Phase 3: Rate Enforcement**

---

**Storage RLS is now configured! Ready to move to Phase 3.** 🚀
