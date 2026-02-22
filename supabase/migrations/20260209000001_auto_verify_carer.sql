-- Add care_training_url column to carer_verification
ALTER TABLE public.carer_verification 
ADD COLUMN IF NOT EXISTS care_training_url TEXT;

-- Function to check all documents and auto-verify
CREATE OR REPLACE FUNCTION auto_verify_carer()
RETURNS TRIGGER AS $$
DECLARE
  has_id BOOLEAN;
  has_dbs BOOLEAN;
  has_rtw BOOLEAN;
  has_training BOOLEAN;
BEGIN
  -- Check for ID (Passport OR (Front & Back))
  -- Simplify: Just check if we have distinct ID URLs or a Passport URL. 
  -- Current logic uses 'id_document_url' for Passport/ID Front and 'id_document_back_url' for Back.
  -- Let's assume verifying 'id_document_url' is enough for "presence" or stricter: needs back if it's not a passport (but we don't know type here easily without extra cols).
  -- Let's enforce: Must have id_document_url.
  has_id := NEW.id_document_url IS NOT NULL; 
  
  -- Check for DBS
  has_dbs := NEW.dbs_certificate_url IS NOT NULL;

  -- Check for Care Training
  has_training := NEW.care_training_url IS NOT NULL;

  -- Check for Right to Work
  -- Either rtw_document_url is present OR (birth_cert + ni_proof + photo_id)
  has_rtw := (NEW.rtw_document_url IS NOT NULL) OR 
             (NEW.birth_cert_url IS NOT NULL AND NEW.ni_proof_url IS NOT NULL AND NEW.photo_id_url IS NOT NULL);

  -- If ALL are present, update status to 'verified'
  IF has_id AND has_dbs AND has_training AND has_rtw THEN
    -- Update local statuses if they are pending/missing
    NEW.id_status := 'verified';
    NEW.dbs_status := 'verified';
    NEW.rtw_status := 'verified';
    NEW.overall_status := 'verified';
    
    -- Update the main profile status in carer_details
    UPDATE public.carer_details
    SET verification_status = 'verified'
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run on update of carer_verification
DROP TRIGGER IF EXISTS trigger_auto_verify_carer ON public.carer_verification;
CREATE TRIGGER trigger_auto_verify_carer
BEFORE UPDATE ON public.carer_verification
FOR EACH ROW
EXECUTE FUNCTION auto_verify_carer();
