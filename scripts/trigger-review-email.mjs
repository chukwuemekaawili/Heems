import fetch from 'node-fetch';

const SUPABASE_URL = "https://cfxmrckrzfocmdtnstwx.supabase.co";
const ANON_KEY = "sb_publishable_Nf_VBgP_3NE3occ14d8YYA_U40U5X1R";

async function triggerEmail() {
    console.log("Triggering email...");
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ANON_KEY}`,
            },
            body: JSON.stringify({
                type: "job_completed_review",
                email: "chukwuemekaawili@gmail.com",
                name: "Antigravity Tester",
                data: {
                    bookingId: "test-booking-id-123",
                    carerName: "Test Carer Name"
                }
            }),
        });

        const text = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Body:", text);
    } catch (error) {
        console.error("Error triggering email:", error);
        if (error.cause) console.error("Cause:", error.cause);
    }
}

triggerEmail();
