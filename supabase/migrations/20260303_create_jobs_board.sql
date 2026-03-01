-- Phantom Job Board Migration

-- 1. Create jobs table for clients to broadcast their care needs
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    service_type TEXT NOT NULL,
    location TEXT NOT NULL,
    postcode TEXT,
    budget_range TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policies for jobs
CREATE POLICY "Anyone can view open jobs"
    ON jobs FOR SELECT
    USING (status = 'open' OR auth.uid() = client_id);

CREATE POLICY "Clients can insert their own jobs"
    ON jobs FOR INSERT
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own jobs"
    ON jobs FOR UPDATE
    USING (auth.uid() = client_id);

CREATE POLICY "Clients can delete their own jobs"
    ON jobs FOR DELETE
    USING (auth.uid() = client_id);


-- 2. Create job_applications table for carers to send offers
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    carer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_rate DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(job_id, carer_id) -- A carer can only apply once per job
);

-- Enable RLS for job applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job applications
CREATE POLICY "Carers can view their own applications, clients can view applications to their jobs"
    ON job_applications FOR SELECT
    USING (
        auth.uid() = carer_id OR 
        auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
    );

CREATE POLICY "Carers can insert their own applications"
    ON job_applications FOR INSERT
    WITH CHECK (auth.uid() = carer_id);

CREATE POLICY "Clients can update application status (accept/decline)"
    ON job_applications FOR UPDATE
    USING (
        auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id) OR
        auth.uid() = carer_id
    );

CREATE POLICY "Carers can delete their own applications"
    ON job_applications FOR DELETE
    USING (auth.uid() = carer_id);

-- Functions and Triggers for updated_at
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
