import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RSSArticle {
    id: string;
    title: string;
    source: string;
    date: string;
    isoDate: string;
    link: string;
    category: string;
    snippet: string;
    image: string | null;
    isExternal: true;
}

function fromDBRow(row: any): RSSArticle {
    const d = new Date(row.published_at);
    return {
        id: row.id,
        title: row.title,
        source: row.source,
        date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        isoDate: row.published_at,
        link: row.link || "#",
        category: row.category || "News",
        snippet: row.snippet || "",
        image: row.image_url || null,
        isExternal: true,
    };
}

export function useRSSFeed() {
    const [articles, setArticles] = useState<RSSArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);

            // Read from news_articles DB table
            const { data: dbRows, error: dbError } = await supabase
                .from("news_articles")
                .select("*")
                .order("published_at", { ascending: false })
                .limit(200);

            if (!cancelled) {
                if (!dbError && dbRows && dbRows.length > 0) {
                    setArticles(dbRows.map(fromDBRow));
                    setLastUpdated(new Date(dbRows[0].published_at));
                } else {
                    setArticles([]);
                }
                setLoading(false);
            }

            // In background: invoke Edge Function to refresh the DB
            supabase.functions.invoke("fetch-rss-news").then(({ data, error }) => {
                if (error) {
                    console.warn("Feed refresh error:", error);
                    return;
                }
                if (data?.fetched > 0 && !cancelled) {
                    supabase
                        .from("news_articles")
                        .select("*")
                        .order("published_at", { ascending: false })
                        .limit(200)
                        .then(({ data: fresh }) => {
                            if (fresh && fresh.length > 0 && !cancelled) {
                                setArticles(fresh.map(fromDBRow));
                                setLastUpdated(new Date());
                            }
                        });
                }
            }).catch(() => { /* silent */ });
        }

        load();
        return () => { cancelled = true; };
    }, []);

    return { articles, loading, lastUpdated };
}
