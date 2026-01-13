# ✅ Fix: "verified" Column Missing Error

## 🐛 **Error**

**Message:** `Could not find the 'verified' column of profiles in the schema cache`

**When:** Admin clicks "Verify" or "Unverify" on a user

**Cause:** The `profiles` table doesn't have a `verified` column

---

## ✅ **Solution**

I've created a SQL migration file to add the `verified` column to your database.

---

## 🔧 **How to Fix**

### **Step 1: Open Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)

### **Step 2: Run the Migration**

1. Click **"New Query"**
2. Copy the contents of `ADD_VERIFIED_COLUMN.sql`
3. Paste into the SQL editor
4. Click **"Run"** or press `Ctrl+Enter`

### **Step 3: Verify**

1. Go to **Table Editor** → **profiles**
2. Check that the `verified` column now exists
3. It should be a `BOOLEAN` type with default value `false`

---

## 📝 **What the Migration Does**

### **1. Adds the Column**
```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
```
- Adds `verified` column
- Type: BOOLEAN
- Default: false
- Safe to run (won't fail if column exists)

### **2. Adds Documentation**
```sql
COMMENT ON COLUMN public.profiles.verified IS 'Indicates whether the user has been verified by an admin';
```
- Adds helpful comment to the column

### **3. Syncs Existing Carers**
```sql
UPDATE public.profiles p
SET verified = true
WHERE p.role = 'carer' 
AND EXISTS (
  SELECT 1 FROM public.carer_verification cv 
  WHERE cv.id = p.id 
  AND cv.overall_status = 'verified'
);
```
- Updates existing verified carers
- Sets their `verified` column to `true`
- Based on `carer_verification.overall_status`

### **4. Creates Index**
```sql
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
```
- Improves query performance
- Faster filtering by verification status

### **5. Adds Auto-Sync Trigger**
```sql
CREATE TRIGGER trigger_sync_carer_verification
AFTER UPDATE ON public.carer_verification
FOR EACH ROW
EXECUTE FUNCTION sync_carer_verification_status();
```
- Automatically syncs `profiles.verified` when `carer_verification.overall_status` changes
- Keeps data consistent

---

## ✅ **After Running Migration**

### **What Will Work:**

1. **Verify User** ✅
   - Admin can click "Verify" on any user
   - Sets `verified = true` in database
   - Shows success message

2. **Unverify User** ✅
   - Admin can click "Unverify" on verified users
   - Sets `verified = false` in database
   - Shows success message

3. **Filter by Status** ✅
   - Filter users by "Verified" or "Unverified"
   - Uses the new `verified` column

4. **Stats** ✅
   - "Verified" and "Pending" counts work correctly
   - Based on `verified` column

---

## 📊 **Database Schema**

### **Before:**
```
profiles table:
- id
- email
- first_name
- last_name
- role
- ... (no verified column)
```

### **After:**
```
profiles table:
- id
- email
- first_name
- last_name
- role
- verified ✅ (NEW)
- ... 
```

---

## 🎯 **Quick Fix Steps**

1. ✅ Open Supabase Dashboard
2. ✅ Go to SQL Editor
3. ✅ Copy `ADD_VERIFIED_COLUMN.sql` contents
4. ✅ Paste and run
5. ✅ Refresh your admin dashboard
6. ✅ Try clicking "Verify" on a user
7. ✅ Should work now!

---

## 🔍 **Verification**

### **Check if Migration Worked:**

**Option 1: SQL Editor**
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'verified';
```
Should return:
- column_name: verified
- data_type: boolean
- column_default: false

**Option 2: Table Editor**
- Go to Table Editor → profiles
- Look for `verified` column
- Should be there with type BOOLEAN

**Option 3: Test in App**
- Go to admin dashboard
- Click "Verify" on a user
- Should work without error
- User should show as "Verified"

---

## 🚨 **Troubleshooting**

### **If Migration Fails:**

**Error: "column already exists"**
- ✅ This is fine! The column is already there
- ✅ Just refresh your app

**Error: "permission denied"**
- ❌ You need admin/owner access to run migrations
- ❌ Contact your Supabase project owner

**Error: "syntax error"**
- ❌ Make sure you copied the entire SQL file
- ❌ Check for any copy/paste issues

---

## 💡 **Alternative: Manual Column Addition**

If you prefer to add just the column without the trigger:

```sql
-- Simple version (just adds the column)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
```

This is the minimum required to fix the error.

---

## 🎊 **Summary**

**Problem:** `verified` column missing from `profiles` table

**Solution:** Run `ADD_VERIFIED_COLUMN.sql` migration

**Result:** 
- ✅ Column added
- ✅ Verify/Unverify buttons work
- ✅ Filtering works
- ✅ Stats work
- ✅ Auto-sync with carer_verification

**Status:** ✅ **READY TO FIX**

---

**Run the migration and the verification feature will work perfectly!** 🎉
