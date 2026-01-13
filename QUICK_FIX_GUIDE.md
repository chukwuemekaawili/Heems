# 🚀 Quick Fix Guide - Admin Dashboard Issues

## 📋 **Two SQL Files to Run**

---

## 1️⃣ **ADD_VERIFIED_COLUMN.sql**

### **What it fixes:**
❌ Error: "Could not find the 'verified' column"
❌ Verify/Unverify buttons not working

### **How to run:**
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open `ADD_VERIFIED_COLUMN.sql`
4. Copy all contents
5. Paste in SQL Editor
6. Click **Run** (or Ctrl+Enter)

### **Expected result:**
✅ Column "verified" added to profiles table
✅ Verify/Unverify buttons work
✅ User filtering by status works

---

## 2️⃣ **FIX_USER_DETAILS_TRIGGER.sql**

### **What it fixes:**
❌ User names not showing in admin dashboard
❌ Phone numbers missing
❌ New signups don't save personal details

### **How to run:**
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Open `FIX_USER_DETAILS_TRIGGER.sql`
4. Copy all contents
5. Paste in SQL Editor
6. Click **Run** (or Ctrl+Enter)

### **Expected result:**
✅ Trigger created to auto-save user details
✅ Future signups will save names/phone
✅ Admin-created users will have details

---

## 🔍 **Check Current User Data**

Before fixing, check what data you have:

```sql
SELECT 
  email,
  first_name,
  last_name,
  full_name,
  phone,
  role,
  verified
FROM profiles 
ORDER BY created_at DESC;
```

---

## 🛠️ **Fix Existing Users (Optional)**

If your 3 existing users have missing names, update them manually:

```sql
-- Example: Update user 1
UPDATE profiles 
SET 
  first_name = 'John',
  last_name = 'Doe',
  full_name = 'John Doe',
  phone = '+44 7700 900000'
WHERE email = 'john@example.com';

-- Example: Update user 2
UPDATE profiles 
SET 
  first_name = 'Jane',
  last_name = 'Smith',
  full_name = 'Jane Smith',
  phone = '+44 7700 900001'
WHERE email = 'jane@example.com';

-- Example: Update user 3
UPDATE profiles 
SET 
  first_name = 'Bob',
  last_name = 'Johnson',
  full_name = 'Bob Johnson',
  phone = '+44 7700 900002'
WHERE email = 'bob@example.com';
```

Replace the names and emails with your actual user data.

---

## ✅ **Verification Steps**

### **After running both SQL files:**

1. **Check verified column exists:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'verified';
```
Should return: `verified`

2. **Check trigger exists:**
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```
Should return: `on_auth_user_created`

3. **Test in admin dashboard:**
   - Refresh the page
   - Go to Users tab
   - User names should show
   - Click "Verify" on a user
   - Should work without error

4. **Test user creation:**
   - Click "Add User"
   - Fill in form
   - Create user
   - User should appear with all details

---

## 🎯 **Complete Checklist**

- [ ] Run `ADD_VERIFIED_COLUMN.sql`
- [ ] Run `FIX_USER_DETAILS_TRIGGER.sql`
- [ ] Check current user data
- [ ] Update existing users (if needed)
- [ ] Refresh admin dashboard
- [ ] Test verify/unverify
- [ ] Test user creation
- [ ] Verify all details show

---

## 🚨 **Troubleshooting**

### **"Permission denied" error:**
- You need admin/owner access to your Supabase project
- Ask the project owner to run the SQL

### **"Column already exists" error:**
- This is fine! It means the column is already there
- Just continue with the next SQL file

### **"Trigger already exists" error:**
- This is fine! The trigger is already created
- The SQL will drop and recreate it

### **Users still don't show names:**
- Check if the trigger ran successfully
- Manually update existing users with SQL
- Test by creating a new user

---

## 📞 **Need Help?**

If you encounter any issues:

1. Check the Supabase logs (Dashboard → Logs)
2. Verify you have the correct permissions
3. Make sure you're in the right project
4. Try running each SQL statement separately

---

## 🎊 **Summary**

**Files to run:** 2
**Time needed:** 5-10 minutes
**Difficulty:** Easy (just copy/paste SQL)

**After completion:**
✅ Verify/Unverify works
✅ User details show
✅ New signups save properly
✅ Admin dashboard fully functional

---

**Run both SQL files and your admin dashboard will be 100% functional!** 🚀
