-- Create a new public bucket for carer videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carer-videos', 'carer-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Everyone can view videos (Public Access)
CREATE POLICY "Public Videos Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'carer-videos' );

-- Policy 2: Carers can upload their own videos
CREATE POLICY "Carers Upload Videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'carer-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);

-- Policy 3: Carers can update their own videos
CREATE POLICY "Carers Update Videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'carer-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);

-- Policy 4: Carers can delete their own videos
CREATE POLICY "Carers Delete Videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'carer-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'carer'
  )
);
