# GitHub Secrets Setup Guide

## ✅ What You've Done So Far:
- Code is in YOUR GitHub: https://github.com/chukwuemekaawili/Heems
- GitHub Actions workflow is ready
- Dev server running at http://localhost:8080

## 🔐 Next Step: Add GitHub Secrets

GitHub Secrets keep your passwords safe. You need to add these to enable auto-deployment.

---

## Step 1: Get Your Namecheap FTP Credentials

1. Log into **Namecheap**
2. Go to **cPanel**
3. Find **FTP Accounts**
4. You need:
   - **FTP Server** (like `ftp.yourdomain.com`)
   - **FTP Username** (your cPanel username)
   - **FTP Password** (your FTP password)

---

## Step 2: Add Secrets to GitHub

1. Go to: **https://github.com/chukwuemekaawili/Heems**
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** (green button)

### Add These 5 Secrets:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `FTP_SERVER` | Your FTP host | Namecheap cPanel → FTP Accounts |
| `FTP_USERNAME` | Your FTP username | Namecheap cPanel → FTP Accounts |
| `FTP_PASSWORD` | Your FTP password | Namecheap cPanel → FTP Accounts |
| `VITE_SUPABASE_URL` | `https://osmrtnhdtmxvrvtmuqnz.supabase.co` | Already configured in .env |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_Nf_VBgP_3NE3occ14d8YYA_U40U5X1R` | Already configured in .env |

**For each secret:**
1. Click "New repository secret"
2. Enter the name (exactly as shown above)
3. Paste the value
4. Click "Add secret"
5. Repeat for all 5 secrets

---

## Step 3: Test Auto-Deployment

Once all secrets are added:

1. Make a small change (like editing README.md)
2. Run:
   ```bash
   git add .
   git commit -m "Testing auto-deployment"
   git push
   ```
3. Go to GitHub → **Actions** tab
4. Watch your deployment run (should turn green ✅)
5. Check your live Namecheap site - it should update!

---

## 🎉 After Setup:

**Future workflow:**
```bash
# Make changes locally
# Test at localhost:8080
git add .
git commit -m "Description of changes"
git push
# Automatically deploys to live site! 🚀
```

---

## Need Help?

- Can't find FTP credentials? Contact Namecheap support
- Deployment failing? Check GitHub Actions logs
- Ask me any questions!
