-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author TEXT,
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'Draft',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
-- Public can view published posts
CREATE POLICY "Public can view published posts" 
ON public.blog_posts FOR SELECT 
USING (status = 'Published');

-- Admins can view all posts (including drafts)
CREATE POLICY "Admins can view all posts" 
ON public.blog_posts FOR SELECT 
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- Admins can insert/update/delete
CREATE POLICY "Admins can manage posts" 
ON public.blog_posts FOR ALL 
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- Create storage bucket for blog images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'blog-images' );

-- Admins can upload
CREATE POLICY "Admins can upload blog images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'blog-images' AND 
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

-- Admins can update/delete
CREATE POLICY "Admins can update/delete blog images" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'blog-images' AND 
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);

CREATE POLICY "Admins can delete blog images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'blog-images' AND 
    auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    )
);
