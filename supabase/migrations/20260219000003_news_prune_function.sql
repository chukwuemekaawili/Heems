-- Helper function to keep only the 200 most recent articles
-- Called by fetch-news Edge Function after each upsert
CREATE OR REPLACE FUNCTION prune_old_news_articles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.news_articles
    WHERE id NOT IN (
        SELECT id FROM public.news_articles
        ORDER BY published_at DESC
        LIMIT 200
    );
END;
$$;
