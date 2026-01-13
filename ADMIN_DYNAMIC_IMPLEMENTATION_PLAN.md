# 🎯 Admin Dashboard - Full Dynamic Implementation Plan

## 📋 Objective
Convert all admin dashboard pages from demo/mock data to fully dynamic, database-driven pages with complete CRUD operations.

---

## 📊 Pages to Update

### 1. **Dashboard.tsx** (Main Overview)
**Current:** Mock data for stats and verifications
**Target:** Real-time data from database

**Data Sources:**
- Total users count → `profiles` table
- Verified carers → `profiles` where `role='carer'` and verified
- Pending verifications → `verifications` table where `status='pending'`
- Bookings stats → `bookings` table
- Revenue calculations → `bookings` with completed status

**Features:**
- ✅ Real-time stats
- ✅ Live verification queue
- ✅ Recent activity feed
- ✅ System health indicators

---

### 2. **Users.tsx**
**Current:** Mock user data
**Target:** Full CRUD for all users

**Operations:**
- **Read:** Fetch all users from `profiles`
- **Update:** Edit user details, change roles, suspend accounts
- **Delete:** Soft delete or hard delete users
- **Search:** Filter by name, email, role, status
- **Pagination:** Handle large datasets

**Features:**
- ✅ User list with real data
- ✅ Search and filter
- ✅ Edit user modal
- ✅ Role management
- ✅ Account status toggle
- ✅ Delete confirmation

---

### 3. **Carers.tsx**
**Current:** Mock carer data
**Target:** Full carer management

**Operations:**
- **Read:** Fetch carers from `profiles` where `role='carer'`
- **Update:** Edit carer details, verification status
- **Filter:** By verification, status, rating, location

**Features:**
- ✅ Carer directory
- ✅ Verification management
- ✅ Stats (total, verified, pending)
- ✅ Rating display
- ✅ Quick actions

---

### 4. **Bookings.tsx**
**Current:** Mock booking data
**Target:** Full booking management

**Operations:**
- **Read:** Fetch all bookings
- **Update:** Change booking status
- **Filter:** By status, date, client, carer
- **Search:** By booking ID

**Features:**
- ✅ Booking list
- ✅ Status management
- ✅ Revenue tracking
- ✅ Date filtering
- ✅ Export functionality

---

### 5. **Organisations.tsx**
**Current:** Mock organisation data
**Target:** Full organisation management

**Operations:**
- **Read:** Fetch organisations
- **Create:** Add new organisation
- **Update:** Edit organisation details
- **Delete:** Remove organisation

**Features:**
- ✅ Organisation list
- ✅ Staff count
- ✅ Verification status
- ✅ CRUD operations

---

### 6. **Verifications.tsx / VerificationsEnhanced.tsx**
**Current:** Mock verification data
**Target:** Full verification workflow

**Operations:**
- **Read:** Fetch pending verifications
- **Update:** Approve/reject verifications
- **Document viewing:** View uploaded documents

**Features:**
- ✅ Verification queue
- ✅ Document preview
- ✅ Approve/reject actions
- ✅ Verification history
- ✅ Bulk actions

---

### 7. **Disputes.tsx**
**Current:** Mock dispute data
**Target:** Full dispute management

**Operations:**
- **Read:** Fetch active disputes
- **Update:** Resolve disputes, change status
- **Create:** Manual dispute creation

**Features:**
- ✅ Dispute list
- ✅ Resolution actions
- ✅ Status tracking
- ✅ Communication logs

---

### 8. **Reports.tsx**
**Current:** Mock report data
**Target:** Real analytics and reports

**Operations:**
- **Read:** Generate reports from database
- **Export:** Download reports as CSV/PDF

**Features:**
- ✅ Revenue reports
- ✅ User growth analytics
- ✅ Booking statistics
- ✅ Export functionality

---

### 9. **PhaseControl.tsx**
**Current:** Mock phase data
**Target:** Dynamic fee management

**Operations:**
- **Read:** Fetch current phase settings
- **Update:** Change phase and fees

**Features:**
- ✅ Current phase display
- ✅ Fee configuration
- ✅ Phase transition

---

### 10. **SystemLogs.tsx**
**Current:** Mock log data
**Target:** Real system activity logs

**Operations:**
- **Read:** Fetch system logs
- **Filter:** By type, user, date

**Features:**
- ✅ Activity log
- ✅ Filtering
- ✅ Search

---

### 11. **Settings.tsx**
**Current:** Static settings
**Target:** Dynamic platform configuration

**Operations:**
- **Read:** Fetch platform settings
- **Update:** Save configuration changes

**Features:**
- ✅ Platform settings
- ✅ Notification preferences
- ✅ API key management
- ✅ Database settings

---

### 12. **Profile.tsx**
**Current:** Static admin profile
**Target:** Dynamic admin profile

**Operations:**
- **Read:** Fetch admin profile
- **Update:** Edit admin details

**Features:**
- ✅ Profile editing
- ✅ Password change
- ✅ Permissions display

---

## 🗄️ Database Tables Required

### Existing Tables:
- ✅ `profiles` - User data
- ✅ `bookings` - Booking data
- ✅ `verifications` - Verification requests
- ✅ `organisations` - Organisation data

### May Need to Create:
- `disputes` - Dispute management
- `system_logs` - Activity logging
- `platform_settings` - Configuration
- `phases` - Phase and fee management

---

## 🔧 Implementation Strategy

### Phase 1: Core Data Fetching (Priority)
1. Dashboard.tsx - Real stats
2. Users.tsx - User list
3. Carers.tsx - Carer list
4. Bookings.tsx - Booking list

### Phase 2: CRUD Operations
5. Users.tsx - Full CRUD
6. Verifications.tsx - Approve/reject
7. Disputes.tsx - Resolution

### Phase 3: Advanced Features
8. Reports.tsx - Analytics
9. SystemLogs.tsx - Activity tracking
10. Settings.tsx - Configuration

---

## 📝 Code Pattern

### Standard Pattern for Each Page:
```typescript
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PageName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('table_name')
        .select('*');
      
      if (error) throw error;
      setData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations...
};
```

---

## ✅ Success Criteria

Each page must have:
- ✅ Real data from Supabase
- ✅ Loading states
- ✅ Error handling
- ✅ CRUD operations (where applicable)
- ✅ Search/filter functionality
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Optimistic updates

---

## 🚀 Next Steps

1. Start with Dashboard.tsx (most visible)
2. Then Users.tsx (most critical)
3. Then Carers.tsx and Bookings.tsx
4. Continue with remaining pages
5. Test all CRUD operations
6. Add loading skeletons
7. Implement error boundaries

---

**Let's build a fully dynamic, production-ready admin dashboard!** 🎉
