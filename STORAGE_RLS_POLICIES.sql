-- HEEMS - SUPABASE STORAGE RLS POLICIES
-- Execute this AFTER creating the 'verification-documents' bucket

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- Policy 1: Carers can upload documents to their own folder
-- Folder structure: {carer_id}/document_type_timestamp.ext
CREATE POLICY "Carers can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);

-- Policy 2: Carers can view their own documents
CREATE POLICY "Carers can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);

-- Policy 3: Carers can update/replace their own documents
CREATE POLICY "Carers can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);

-- Policy 4: Carers can delete their own documents (optional - for re-upload)
CREATE POLICY "Carers can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);

-- Policy 5: Admins can view ALL documents (for verification)
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

-- Policy 6: Admins can delete documents (for moderation)
CREATE POLICY "Admins can delete any document"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy 7: Prevent clients from viewing raw documents (CQC compliance)
-- This is implicit - no policy means no access
-- Clients will only see verification badges, never raw documents

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify policies are created
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%documents%'
ORDER BY policyname;

-- ============================================
-- NOTES
-- ============================================

-- Folder Structure Example:
-- verification-documents/
--   ├── {carer_id_1}/
--   │   ├── dbs_1704902400000.pdf
--   │   ├── id_1704902500000.jpg
--   │   ├── rtw_1704902600000.pdf
--   │   └── insurance_1704902700000.pdf
--   └── {carer_id_2}/
--       └── ...

-- File Naming Convention:
-- {document_type}_{timestamp}.{extension}
-- Example: dbs_1704902400000.pdf

-- Security Features:
-- ✅ Carers can only access their own folder
-- ✅ Admins can access all folders for verification
-- ✅ Clients CANNOT access any raw documents
-- ✅ Documents are private by default
-- ✅ Badge-only display to clients (PRD v2.3.2 compliant)
