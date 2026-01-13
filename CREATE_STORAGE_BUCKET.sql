-- HEEMS - CREATE STORAGE BUCKETS
-- Run this in the Supabase SQL Editor to initialize the necessary storage buckets

-- Create the verification-documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies (re-applying for the specific bucket)
-- Enable RLS on storage.objects if not already enabled
-- (Storage objects usually have RLS enabled by default in new projects)

-- Clean up existing policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Carers can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Carers can view own documents" ON storage.objects;
DROP POLICY IF EXISTS "Carers can update own documents" ON storage.objects;
DROP POLICY IF EXISTS "Carers can delete own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

-- Policy 1: Carers can upload documents to their own folder
CREATE POLICY "Carers can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Carers can view their own documents
CREATE POLICY "Carers can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Admins can view ALL documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 4: Carers can delete their own documents
CREATE POLICY "Carers can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
