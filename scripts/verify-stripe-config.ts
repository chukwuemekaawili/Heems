
/**
 * Stripe Integration Verification Script
 * Run with: npx tsx scripts/verify-stripe-config.ts
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_ENV_VARS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    // Note: STRIPE keys are usually backend-only or injected via Vite, checking for their presence in .env if possible
];

const CRITICAL_FILES = [
    'src/components/payments/PaymentCheckout.tsx',
    'src/pages/client/BookingsEnhanced.tsx',
    'src/pages/carer/Earnings.tsx',
    'supabase/functions/stripe-connect-account/index.ts',
    'supabase/functions/stripe-checkout-session/index.ts',
    'supabase/functions/stripe-webhook/index.ts',
    'supabase/functions/process-payouts/index.ts',
];

async function verify() {
    console.log("🔍 Starting Stripe Integration Verification...\n");

    let checksPassed = 0;
    let checksTotal = 0;

    // 1. Verify Critical Files Exist
    console.log("Checking Critical Files...");
    const rootDir = process.cwd();

    CRITICAL_FILES.forEach(file => {
        checksTotal++;
        const filePath = path.join(rootDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ Found: ${file}`);
            checksPassed++;
        } else {
            console.error(`❌ MISSING: ${file}`);
        }
    });

    console.log("\n--------------------------------------------------\n");

    // 2. Check for PaymentCheckout usage in BookingsEnhanced
    console.log("Checking PaymentCheckout Integration...");
    const bookingsPath = path.join(rootDir, 'src/pages/client/BookingsEnhanced.tsx');
    if (fs.existsSync(bookingsPath)) {
        checksTotal++;
        const content = fs.readFileSync(bookingsPath, 'utf-8');
        if (content.includes('PaymentCheckout') && content.includes('stripe_account_id')) {
            console.log("✅ PaymentCheckout is imported and used in BookingsEnhanced.tsx");
            checksPassed++;
        } else {
            console.error("❌ PaymentCheckout usage NOT FOUND in BookingsEnhanced.tsx");
        }
    }

    console.log("\n--------------------------------------------------\n");

    // 3. Environment Variable Hint
    console.log("⚠️  Manual Environment Check Required:");
    console.log("   Ensure the following secrets are set in your Supabase project:");
    console.log("   - STRIPE_SECRET_KEY");
    console.log("   - STRIPE_WEBHOOK_SECRET");
    console.log("   - APP_URL (for redirects)");

    console.log("\n--------------------------------------------------\n");
    console.log(`Verification Summary: ${checksPassed}/${checksTotal} checks passed.`);

    if (checksPassed === checksTotal) {
        console.log("\n✅ Static Verification Passed. Proceed to Manual Testing (see walkthrough.md).");
    } else {
        console.log("\n❌ Verification FAILED. Please fix missing files.");
        process.exit(1);
    }
}

verify().catch(console.error);
