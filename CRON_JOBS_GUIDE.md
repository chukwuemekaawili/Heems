# Automated Tasks & Cron Jobs - Deployment Guide

## 🎯 OVERVIEW

This guide covers setting up automated tasks for the Heems platform, including the daily document expiry check.

---

## 📋 AUTOMATED TASKS

### 1. Daily Document Expiry Check
**Purpose:** Automatically de-verify carers with expired documents  
**Frequency:** Daily at midnight (00:00 UTC)  
**Edge Function:** `check-document-expiry`

**What it does:**
- Checks all verified carers
- Identifies expired documents (DBS, ID, RTW, Insurance)
- Automatically de-verifies carers with expired docs
- Identifies documents expiring within 30 days
- Logs all activity to `system_logs` table
- (Future) Sends email notifications

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Create System Logs Table

```bash
# Run in Supabase SQL Editor
SYSTEM_LOGS_TABLE.sql
```

This creates the `system_logs` table for tracking automated tasks.

### Step 2: Deploy Edge Function

```bash
# Deploy the expiry check function
supabase functions deploy check-document-expiry --no-verify-jwt
```

### Step 3: Set Up Cron Job

**Option A: Supabase Cron (Recommended)**

1. Go to Supabase Dashboard → Database → Cron Jobs
2. Click "Create a new cron job"
3. Configure:
   ```
   Name: Daily Document Expiry Check
   Schedule: 0 0 * * * (Daily at midnight UTC)
   Command: SELECT net.http_post(
     url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-document-expiry',
     headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
   );
   ```

**Option B: External Cron Service**

Use services like:
- GitHub Actions
- Vercel Cron
- AWS EventBridge
- Google Cloud Scheduler

Example GitHub Action (`.github/workflows/daily-expiry-check.yml`):
```yaml
name: Daily Document Expiry Check

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC

jobs:
  check-expiry:
    runs-on: ubuntu-latest
    steps:
      - name: Call Expiry Check Function
        run: |
          curl -X POST \
            https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-document-expiry \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

### Step 4: Test the Function

```bash
# Manual test
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-document-expiry \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2026-01-10T12:00:00.000Z",
  "total_checked": 50,
  "expired_count": 2,
  "expiring_soon_count": 5,
  "de_verified_carers": ["uuid1", "uuid2"],
  "message": "Checked 50 carers. 2 de-verified, 5 expiring soon."
}
```

---

## 📊 MONITORING

### View Logs in Admin Dashboard

Navigate to `/admin/system-logs` to view:
- Recent expiry checks
- Number of carers checked
- Expired documents count
- De-verified carers list
- Expiring soon warnings

### Query Logs Directly

```sql
-- View today's expiry checks
SELECT * FROM system_logs 
WHERE event_type = 'document_expiry_check' 
AND created_at >= CURRENT_DATE 
ORDER BY created_at DESC;

-- Count total de-verifications
SELECT 
  SUM((details->>'expired_count')::int) as total_de_verified
FROM system_logs 
WHERE event_type = 'document_expiry_check';

-- View carers de-verified in last 7 days
SELECT 
  created_at,
  details->'de_verified_carers' as carers
FROM system_logs 
WHERE event_type = 'document_expiry_check' 
AND created_at >= NOW() - INTERVAL '7 days'
AND (details->>'expired_count')::int > 0;
```

---

## 🔔 EMAIL NOTIFICATIONS (Future Enhancement)

### When to Send
1. **Document Expired** - Immediate notification
2. **Expiring in 30 days** - First warning
3. **Expiring in 7 days** - Final warning

### Email Templates

**Expired Document:**
```
Subject: Action Required: Document Expired

Dear [Carer Name],

Your [Document Type] has expired as of [Date]. Your profile has been 
temporarily de-verified until you upload a new, valid document.

Please upload a new document at: [Link to verification page]

Best regards,
Heems Team
```

**Expiring Soon:**
```
Subject: Reminder: Document Expiring Soon

Dear [Carer Name],

Your [Document Type] will expire on [Date] ([Days] days remaining).

Please upload a renewed document to avoid profile de-verification.

Upload here: [Link to verification page]

Best regards,
Heems Team
```

### Implementation

Add to Edge Function:
```typescript
// After de-verifying
await sendEmail({
  to: carerEmail,
  subject: 'Action Required: Document Expired',
  template: 'document-expired',
  data: { carerName, documentType, expiryDate }
});
```

---

## 🧪 TESTING CHECKLIST

### Before Production
- [ ] Deploy Edge Function
- [ ] Create system_logs table
- [ ] Set up cron job
- [ ] Test manual function call
- [ ] Verify logs are created
- [ ] Check admin dashboard displays logs
- [ ] Test with expired document
- [ ] Verify carer gets de-verified
- [ ] Check email notifications (when implemented)

### Production Monitoring
- [ ] Check logs daily for first week
- [ ] Verify cron runs at midnight
- [ ] Monitor de-verification rate
- [ ] Track expiring soon warnings
- [ ] Review carer complaints
- [ ] Adjust timing if needed

---

## ⚙️ CONFIGURATION

### Cron Schedule Options

```
0 0 * * *     # Daily at midnight UTC
0 2 * * *     # Daily at 2 AM UTC
0 0 * * 0     # Weekly on Sunday at midnight
0 0 1 * *     # Monthly on 1st at midnight
*/30 * * * *  # Every 30 minutes (testing only)
```

### Environment Variables

```env
# In Supabase Edge Functions
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Email service
SENDGRID_API_KEY=your_sendgrid_key
RESEND_API_KEY=your_resend_key
```

---

## 🚨 TROUBLESHOOTING

### Function Not Running
**Check:**
- Cron job is active
- Function is deployed
- Environment variables set
- Service role key has permissions

### No Logs Created
**Check:**
- system_logs table exists
- RLS policies allow service role
- Function completed successfully
- Check function logs: `supabase functions logs check-document-expiry`

### Carers Not De-verified
**Check:**
- Document expiry dates are correct
- Carer verification status is 'verified'
- Function logic is correct
- Database updates are working

---

## 📈 PERFORMANCE

### Expected Load
- 100 carers: ~2 seconds
- 1000 carers: ~15 seconds
- 10000 carers: ~2 minutes

### Optimization Tips
1. Add database indexes (already done)
2. Batch updates (100 at a time)
3. Use parallel processing
4. Cache verification data
5. Run during off-peak hours

---

## 🎯 SUCCESS METRICS

**Track:**
- Total carers checked
- Documents expired per day
- De-verification rate
- Expiring soon warnings
- Email open rates (future)
- Document renewal rate

**Goals:**
- 100% of carers checked daily
- <5% de-verification rate
- >80% document renewal before expiry
- <24 hour response time to expiry

---

## 📚 ADDITIONAL RESOURCES

- [Supabase Cron Jobs](https://supabase.com/docs/guides/database/extensions/pg_cron)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [GitHub Actions Cron](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)

---

**Automated tasks are ready for deployment!** 🚀

**Next Steps:**
1. Execute SYSTEM_LOGS_TABLE.sql
2. Deploy check-document-expiry function
3. Set up cron job
4. Test and monitor
5. Add email notifications (optional)
