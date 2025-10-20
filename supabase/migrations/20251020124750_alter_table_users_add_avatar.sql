ALTER TABLE public.users
    ADD COLUMN avatar TEXT;

UPDATE public.users
SET avatar = 'https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'
WHERE role IN ('admin', 'recruiter');

UPDATE public.users
SET avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdtzBNsSdmB-VbUBj3HhwvWhgVnbqd7AR9GQ&s'
WHERE email = 'recruiter.account1@gmail.com';

UPDATE public.users
SET avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyzalzSz8l7EmP5SS5bLKmNYQmLKJjvq1Seg&s'
WHERE email = 'recruiter.account4@gmail.com';

UPDATE public.users
SET avatar = 'https://play-lh.googleusercontent.com/-ZjkSwGmqHf-J1Z4G6AfpxOJOy-fVClb9EMFkfdOZAtgGx6jfq0JiTu8or23xmKRNEQ'
WHERE email = 'recruiter.account3@gmail.com';