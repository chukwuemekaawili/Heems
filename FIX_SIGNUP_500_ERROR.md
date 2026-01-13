# 🚨 URGENT FIX: Sign Up Failing (500 Error)

## 🐛 **Error**

**Message:** `500 Internal Server Error` from Supabase signup endpoint

**When:** Users try to sign up on the signup page

**Cause:** The database trigger (`handle_new_user`) is likely failing and causing signup to fail

---

## ✅ **IMMEDIATE FIX (Choose One)**

### **Option 1: Replace with Safe Trigger (Recommended)**

Run `FIX_USER_DETAILS_TRIGGER_SAFE.sql` in Supabase SQL Editor

**What it does:**
- Drops the old trigger
- Creates new trigger with error handling
- Won't cause signup to fail even if profile creation fails
- Includes `EXCEPTION` block to catch errors

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy `FIX_USER_DETAILS_TRIGGER_SAFE.sql`
3. Paste and run
4. Test signup immediately

---

### **Option 2: Disable Trigger Temporarily (Quick Fix)**

Run `DISABLE_TRIGGER_EMERGENCY.sql` in Supabase SQL Editor

**What it does:**
- Disables the triggers causing the issue
- Allows signups to work immediately
- Profiles won't auto-populate (but signups work)

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy `DISABLE_TRIGGER_EMERGENCY.sql`
3. Paste and run
4. Test signup immediately

**Note:** With this option, user details won't auto-save. You'll need to manually update profiles or re-enable the safe trigger later.

---

## 🔍 **Why It's Failing**

### **Possible Causes:**

1. **Missing Columns**
   - Trigger tries to insert into columns that don't exist
   - Example: `email` column might not exist in `profiles` table

2. **Permission Issues**
   - Trigger doesn't have permission to insert into `profiles`
   - RLS policies blocking the insert

3. **Data Type Mismatch**
   - Trying to insert wrong data type
   - Example: String into a UUID field

4. **Constraint Violations**
   - Unique constraint on email
   - Foreign key constraint failing

---

## 🔧 **What the Safe Trigger Does Differently**

### **Old Trigger (Causes Failures):**
```sql
INSERT INTO profiles (...)
VALUES (...);

-- If this fails, signup fails!
```

### **New Safe Trigger:**
```sql
BEGIN
  INSERT INTO profiles (...)
  VALUES (...);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail signup
    RAISE WARNING 'Error: %', SQLERRM;
    RETURN NEW;  -- Signup still succeeds!
END;
```

**Key Differences:**
- ✅ Has `EXCEPTION` block
- ✅ Catches all errors
- ✅ Logs warning instead of failing
- ✅ Returns NEW even on error
- ✅ Signup always succeeds

---

## 🧪 **Testing After Fix**

### **Test Signup:**

1. Go to signup page
2. Fill in form:
   - First Name: "Test"
   - Last Name: "User"
   - Email: "test123@example.com"
   - Password: "Test123!"
3. Click "Sign Up"
4. Should succeed (no 500 error)
5. Check if user was created

### **Check Profile:**

```sql
-- Check if profile was created
SELECT * FROM profiles 
WHERE email = 'test123@example.com';
```

**Expected:**
- User should exist in auth.users
- Profile should exist in profiles table
- Details should be populated

---

## 📊 **Debugging Steps**

If signup still fails after running the safe trigger:

### **1. Check Trigger Status**
```sql
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  tgenabled
FROM information_schema.triggers
WHERE trigger_name LIKE '%user%';
```

### **2. Check Profiles Table Structure**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

### **3. Check RLS Policies**
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';
```

### **4. Test Trigger Manually**
```sql
-- Try to insert a test profile
INSERT INTO profiles (id, email, first_name, last_name, role)
VALUES (
  gen_random_uuid(),
  'test@test.com',
  'Test',
  'User',
  'client'
);
```

---

## 🎯 **Quick Decision Guide**

### **Need signups to work RIGHT NOW?**
→ Run `DISABLE_TRIGGER_EMERGENCY.sql`

### **Want proper fix with auto-profile creation?**
→ Run `FIX_USER_DETAILS_TRIGGER_SAFE.sql`

### **Still failing after safe trigger?**
→ Disable trigger and investigate profiles table structure

---

## 📝 **Common Issues & Fixes**

### **Issue: "column 'email' does not exist"**
**Fix:** Add email column to profiles:
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email TEXT;
```

### **Issue: "duplicate key value violates unique constraint"**
**Fix:** The trigger is trying to insert twice. Check if you have multiple triggers.

### **Issue: "permission denied for table profiles"**
**Fix:** Grant permissions:
```sql
GRANT ALL ON profiles TO postgres, anon, authenticated, service_role;
```

### **Issue: "null value in column 'id' violates not-null constraint"**
**Fix:** The trigger isn't getting NEW.id properly. Check trigger code.

---

## 🎊 **Summary**

**Problem:** Trigger causing 500 error on signup

**Quick Fix:** Disable trigger (`DISABLE_TRIGGER_EMERGENCY.sql`)

**Proper Fix:** Safe trigger with error handling (`FIX_USER_DETAILS_TRIGGER_SAFE.sql`)

**Result:** Signups work without errors

---

## 🚀 **Recommended Action**

1. **Run `FIX_USER_DETAILS_TRIGGER_SAFE.sql`** first
2. **Test signup** immediately
3. **If still fails**, run `DISABLE_TRIGGER_EMERGENCY.sql`
4. **Debug** using the steps above
5. **Re-enable** safe trigger once issue is found

---

**Choose your fix and run it now to restore signups!** ⚡
