-- Create news_articles table for server-fetched UK care sector news
CREATE TABLE IF NOT EXISTS public.news_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,   -- unique constraint prevents duplicates
    snippet TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'Market Outlook',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast sorted reads
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles (category);

-- RLS: public can read, only service role can write
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news articles"
    ON public.news_articles FOR SELECT
    USING (true);

-- Only service role (Edge Functions) can insert/update
CREATE POLICY "Service role can insert news articles"
    ON public.news_articles FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update news articles"
    ON public.news_articles FOR UPDATE
    USING (auth.role() = 'service_role');

-- Schedule daily fetch at 8:00 AM UTC using pg_cron
-- (pg_cron must be enabled in Supabase dashboard: Database > Extensions > pg_cron)
SELECT cron.schedule(
    'fetch-care-news-daily',          -- job name
    '0 8 * * *',                       -- every day at 08:00 UTC
    $$
    SELECT net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/fetch-news',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.supabase_service_key')
        ),
        body := '{}'::jsonb
    );
    $$
);
