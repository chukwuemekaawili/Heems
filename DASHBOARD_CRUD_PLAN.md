# 📋 Dashboard CRUD Implementation Plan

## 🎯 **Objective**
Convert all dashboard pages from mock/demo data to real database data with full CRUD operations.

---

## 📊 **Current Status Analysis**

### **Admin Dashboard** ✅ (Mostly Complete)
| Page | Status | Notes |
|------|--------|-------|
| Dashboard.tsx | ✅ Real Data | Fetches from Supabase |
| Users.tsx | ✅ Real Data | Full CRUD |
| Bookings.tsx | ✅ Real Data | Full CRUD |
| Carers.tsx | ✅ Real Data | Full CRUD |
| Organisations.tsx | ✅ Real Data | Full CRUD |
| Disputes.tsx | ✅ Real Data | Actions working |
| Profile.tsx | ✅ Real Data | Edit working |
| Reports.tsx | ✅ Real Data | Export working |
| Settings.tsx | ⚠️ Demo Data | Needs conversion |
| SystemLogs.tsx | ⚠️ Demo Data | Needs conversion |
| PhaseControl.tsx | ⚠️ Demo Data | Needs conversion |
| Verifications.tsx | ⚠️ Demo Data | Needs conversion |

### **Client Dashboard** ⚠️ (Partial)
| Page | Status | Notes |
|------|--------|-------|
| Dashboard.tsx | ✅ Real Data | Fetches profile & bookings |
| SearchCarers.tsx | ⚠️ Demo Data | Needs real carer data |
| Bookings.tsx | ⚠️ Demo Data | Needs real booking data |
| CarePlans.tsx | ⚠️ Demo Data | Needs conversion |
| Messages.tsx | ⚠️ Demo Data | Needs conversion |
| Payments.tsx | ⚠️ Demo Data | Needs conversion |
| Profile.tsx | ⚠️ Demo Data | Needs real profile editing |
| Settings.tsx | ⚠️ Demo Data | Needs conversion |

### **Carer Dashboard** ❌ (Mostly Mock Data)
| Page | Status | Notes |
|------|--------|-------|
| Dashboard.tsx | ❌ Demo Data | Hardcoded visits/requests |
| Availability.tsx | ❌ Demo Data | Needs conversion |
| Earnings.tsx | ❌ Demo Data | Needs real earnings data |
| Documents.tsx | ❌ Demo Data | Needs real document data |
| Profile.tsx | ❌ Demo Data | Needs real profile editing |
| BookingsEnhanced.tsx | ❌ Demo Data | Needs conversion |

### **Organisation Dashboard** ❌ (All Mock Data)
| Page | Status | Notes |
|------|--------|-------|
| Dashboard.tsx | ❌ Demo Data | All hardcoded |
| Staff.tsx | ❌ Demo Data | Needs conversion |
| Jobs.tsx | ❌ Demo Data | Needs conversion |
| Compliance.tsx | ❌ Demo Data | Needs conversion |
| Analytics.tsx | ❌ Demo Data | Needs conversion |

---

## 🚀 **Priority Implementation Order**

### **Phase 1: Core Dashboards (High Priority)**
1. ✅ Fix Carer Dashboard - Real bookings, earnings, profile
2. ✅ Fix Client Bookings - Real booking data
3. ✅ Fix Client Profile - Real profile editing
4. ✅ Fix Organisation Dashboard - Real data

### **Phase 2: Secondary Pages**
5. Client Payments - Real transaction data
6. Client Messages - Real messaging
7. Carer Earnings - Real earnings from bookings
8. Carer Documents - Real document verification

### **Phase 3: Advanced Features**
9. Organisation Staff Management
10. Organisation Jobs
11. Admin Phase Control
12. Admin System Logs

---

## 🔧 **Database Tables Required**

### **Existing Tables:**
- ✅ profiles - User profiles
- ✅ bookings - All bookings
- ✅ organisation_details - Org info
- ✅ carer_verification - Document status
- ✅ carer_details - Carer specifics

### **May Need to Create:**
- ❓ messages - For messaging system
- ❓ payments/transactions - For payment history
- ❓ care_plans - For care plan management
- ❓ staff - For organisation staff
- ❓ jobs - For job postings
- ❓ system_logs - For admin logs
- ❓ availability - For carer schedules

---

## 📝 **Implementation Pattern**

Each page conversion follows this pattern:

```typescript
// 1. Import Supabase
import { supabase } from "@/integrations/supabase/client";

// 2. Add state for real data
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

// 3. Fetch on mount
useEffect(() => {
  fetchData();
}, []);

// 4. Fetch function
const fetchData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('user_id', user.id);
  setData(data || []);
};

// 5. CRUD operations
const handleCreate = async (newItem) => { ... }
const handleUpdate = async (id, updates) => { ... }
const handleDelete = async (id) => { ... }

// 6. Replace mock data with real data in JSX
```

---

## ⏱️ **Estimated Time**

| Task | Time |
|------|------|
| Carer Dashboard | 30 min |
| Client Bookings | 20 min |
| Client Profile | 15 min |
| Client Payments | 20 min |
| Carer Earnings | 20 min |
| Organisation Dashboard | 30 min |
| Total | ~2-3 hours |

---

## 🎯 **Next Steps**

Starting with the highest priority items:

1. **Carer Dashboard.tsx** - Replace mock data with real bookings
2. **Client Bookings.tsx** - Fetch real bookings
3. **Client Profile.tsx** - Enable real profile editing

Let me proceed with the implementation...
