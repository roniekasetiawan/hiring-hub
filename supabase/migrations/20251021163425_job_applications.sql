CREATE TABLE public.job_applications (
                                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                         job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
                                         full_name TEXT NOT NULL,
                                         email TEXT NOT NULL,
                                         phone_number TEXT,
                                         date_of_birth DATE,
                                         domicile TEXT,
                                         gender TEXT,
                                         linkedin_url TEXT,
                                         photo_profile_url TEXT,
                                         created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert applications"
ON public.job_applications
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow recruiters and admins to view applications"
ON public.job_applications
FOR SELECT
                      TO authenticated
                      USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public read access to avatars"
ON storage.objects
FOR SELECT
                      USING (bucket_id = 'avatars');