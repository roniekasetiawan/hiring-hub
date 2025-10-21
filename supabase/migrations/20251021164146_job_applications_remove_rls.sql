ALTER TABLE public.job_applications DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to insert applications" ON public.job_applications;
DROP POLICY IF EXISTS "Allow recruiters and admins to view applications" ON public.job_applications;

DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;

CREATE POLICY "Allow public upload access to avatars"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars');