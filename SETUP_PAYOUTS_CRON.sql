-- Enable the required extensions for Cron Jobs and HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the 'process-payouts' Edge Function to run every hour
-- We wrap it in a DO block to prevent errors if the job already exists.
SELECT cron.schedule(
    'process-payouts-hourly', -- Job Name
    '0 * * * *',              -- Schedule: Every hour at minute 0
    $$
    SELECT
        net.http_post(
            -- Your Project Ref from the URL
            url:='https://osmrtnhdtmxvrvtmuqnz.supabase.co/functions/v1/process-payouts',
            
            -- Your Service Role Key (JWT)
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zbXJ0bmhkdG14dnJ2dG11cW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk1MzUwNCwiZXhwIjoyMDgzNTI5NTA0fQ.DnuE_RQWc57CY7NCWASfQ5G9ZvOdl752LWkW1znFWS8"}'::jsonb
        ) as request_id;
    $$
);

/*
    VERIFICATION:
    To verify the job is scheduled, run:
    SELECT * FROM cron.job;

    To check run logs, run:
    SELECT * FROM cron.job_run_details ORDER BY start_time DESC;

    To stop/remove the job, run:
    SELECT cron.unschedule('process-payouts-hourly');
*/
