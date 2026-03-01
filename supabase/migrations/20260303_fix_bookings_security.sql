-- Fix RLS and Trigger for bookings table payout logic
-- Secures payout_status and payout_due_at against direct manipulation
-- Automatically sets payout_due_at when booking status changes to 'completed'

CREATE OR REPLACE FUNCTION secure_booking_payouts()
RETURNS TRIGGER AS $$
DECLARE
  jwt_role text := current_setting('request.jwt.claims', true)::jsonb->>'role';
BEGIN
  -- If updated via PostgREST by a client/carer (authenticated or anon roles)
  IF jwt_role IN ('authenticated', 'anon') THEN
     -- Prevent manual manipulation of payout related fields
     NEW.payout_status = OLD.payout_status;
     NEW.payout_due_at = OLD.payout_due_at;
     NEW.stripe_payment_intent_id = OLD.stripe_payment_intent_id;
     NEW.stripe_transfer_id = OLD.stripe_transfer_id;
  END IF;
  
  -- Automatically set payout info when booking finishes
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
     NEW.payout_due_at = NEW.end_time + interval '48 hours';
     NEW.payout_status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payout_due_date ON bookings;
CREATE TRIGGER update_payout_due_date
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION secure_booking_payouts();
