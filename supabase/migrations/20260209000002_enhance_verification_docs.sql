-- Add supporting document columns for Verification v2
ALTER TABLE public.carer_verification 
ADD COLUMN IF NOT EXISTS id_document_back_url TEXT,
ADD COLUMN IF NOT EXISTS birth_cert_url TEXT,
ADD COLUMN IF NOT EXISTS ni_proof_url TEXT,
ADD COLUMN IF NOT EXISTS photo_id_url TEXT;

-- Update status handling to be more granular if needed, but for now we rely on the URLs presence
-- and the existing boolean flags (e.g. right_to_work_verified) which can be toggled by admins
-- after reviewing the new documents.
