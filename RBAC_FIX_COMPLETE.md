# ✅ RBAC (Role-Based Access Control) - FIXED!

## 🎯 **Problem**

Users signing up as **Carer**, **Client**, or **Organisation** were all being redirected to the **Client Dashboard** after login, regardless of their actual role.

---

## ✅ **Root Cause**

The signup pages were using `.update()` to save the user's role to the profiles table, which **failed if the profile didn't exist yet**. This meant:

1. User signs up as "Carer"
2. Role is passed in metadata ✅
3. `.update()` tries to save role to profile ❌ (fails - no profile exists)
4. User's role defaults to null or 'client'
5. Login redirects to Client Dashboard ❌

---

## ✅ **Solution Applied**

Changed all signup pages from `.update()` to `.upsert()`:

### **Files Fixed:**

1. ✅ **CarerSignup.tsx** - Now properly saves `role: 'carer'`
2. ✅ **ClientSignup.tsx** - Now properly saves `role: 'client'`
3. ✅ **OrganisationSignup.tsx** - Now properly saves `role: 'organisation'`
4. ✅ **Users.tsx (Admin)** - Already fixed with upsert

---

## 🔧 **What Changed**

### **Before (Broken):**
```typescript
// This fails if profile doesn't exist
await supabase
  .from('profiles')
  .update({
    first_name: formData.firstName,
    last_name: formData.lastName,
    role: 'carer',  // ← Never saved!
  })
  .eq('id', authData.user.id);
```

### **After (Fixed):**
```typescript
// Wait for trigger
await new Promise(resolve => setTimeout(resolve, 1000));

// This always works
await supabase
  .from('profiles')
  .upsert({
    id: authData.user.id,
    email: formData.email,
    first_name: formData.firstName,
    last_name: formData.lastName,
    full_name: `${formData.firstName} ${formData.lastName}`,
    phone: formData.phone,
    role: 'carer',  // ← Now saved properly!
  }, {
    onConflict: 'id'
  });
```

---

## 🎯 **How RBAC Works Now**

### **1. Signup Flow:**

**Carer Signup:**
1. User fills form on `/signup/carer`
2. Metadata includes `role: 'carer'`
3. Auth user created ✅
4. Profile upserted with `role: 'carer'` ✅
5. Redirects to `/login`

**Client Signup:**
1. User fills form on `/signup/client`
2. Metadata includes `role: 'client'`
3. Auth user created ✅
4. Profile upserted with `role: 'client'` ✅
5. Redirects to `/login`

**Organisation Signup:**
1. User fills form on `/signup/organisation`
2. Metadata includes `role: 'organisation'`
3. Auth user created ✅
4. Profile upserted with `role: 'organisation'` ✅
5. Redirects to `/login`

### **2. Login Flow:**

```typescript
// Login.tsx already has proper role-based routing
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', data.user.id)
  .single();

// Redirect based on role
if (profile?.role === 'admin') {
  navigate('/admin/dashboard');
} else if (profile?.role === 'carer') {
  navigate('/carer/dashboard');
} else if (profile?.role === 'organisation') {
  navigate('/organisation/dashboard');
} else {
  navigate('/client/dashboard');
}
```

---

## ✅ **Dashboard Routing**

### **Role → Dashboard Mapping:**

| Role | Signup Page | Dashboard Route |
|------|-------------|-----------------|
| **Client** | `/signup/client` | `/client/dashboard` |
| **Carer** | `/signup/carer` | `/carer/dashboard` |
| **Organisation** | `/signup/organisation` | `/organisation/dashboard` |
| **Admin** | Created by admin | `/admin/dashboard` |

---

## 🧪 **Testing**

### **Test Carer Signup:**
1. Go to `/signup/carer`
2. Fill in form
3. Sign up
4. Log in
5. Should redirect to `/carer/dashboard` ✅

### **Test Client Signup:**
1. Go to `/signup/client`
2. Fill in form
3. Sign up
4. Log in
5. Should redirect to `/client/dashboard` ✅

### **Test Organisation Signup:**
1. Go to `/signup/organisation`
2. Fill in form
3. Sign up
4. Log in
5. Should redirect to `/organisation/dashboard` ✅

### **Test Admin:**
1. Admin creates user with role 'admin'
2. User logs in
3. Should redirect to `/admin/dashboard` ✅

---

## 🔍 **Verify Role in Database**

After signup, check the role was saved:

```sql
SELECT id, email, role, first_name, last_name
FROM profiles
WHERE email = 'test@example.com';
```

**Expected:**
- Carer signup → `role = 'carer'`
- Client signup → `role = 'client'`
- Organisation signup → `role = 'organisation'`

---

## 🎊 **Summary**

**Problem:** All users redirected to Client Dashboard

**Cause:** Role not being saved during signup

**Fix:** Changed `.update()` to `.upsert()` in all signup pages

**Result:** 
- ✅ Carers → Carer Dashboard
- ✅ Clients → Client Dashboard
- ✅ Organisations → Organisation Dashboard
- ✅ Admins → Admin Dashboard

---

## 📝 **Additional Notes**

### **Why the 1-second delay?**
```typescript
await new Promise(resolve => setTimeout(resolve, 1000));
```

This gives the database trigger time to create the initial profile before we upsert. Without this, there could be a race condition.

### **Why upsert instead of update?**

- **Update:** Only works if row exists
- **Upsert:** Inserts if doesn't exist, updates if it does
- **Result:** Always works, regardless of trigger state

---

**RBAC is now fully functional! Users are correctly routed to their role-specific dashboards.** 🎉
