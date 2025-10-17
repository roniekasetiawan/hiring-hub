'use client';
import AuthSplit from '@/@core/layouts/AuthSplit';
import { Alert, Button, Stack, TextField, Link, InputAdornment } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/services/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Schema = z.object({
    full_name: z.string().min(2, 'Too short').max(60).optional(),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'At least 6 characters'),
});
type FormValues = z.infer<typeof Schema>;

export default function RegisterPage() {
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [infoMsg, setInfoMsg] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<FormValues>({ resolver: zodResolver(Schema) });
    const router = useRouter();

    const onSubmit = async (v: FormValues) => {
        setErrMsg(null);
        setInfoMsg(null);
        const { data, error } = await supabase.auth.signUp({
            email: v.email,
            password: v.password,
            options: { data: { full_name: v.full_name } },
        });
        if (error) {
            const map: Record<string, string> = {
                'User already registered': 'Email sudah terdaftar.',
                'Password should be at least 6 characters': 'Password minimal 6 karakter.',
                'Over Email Rate Limit': 'Terlalu banyak percobaan. Coba lagi nanti.',
            };
            setErrMsg(map[error.message] ?? error.message);
            return;
        }
        if (!data.session) { setInfoMsg('Account created. Please check your email to confirm.'); return; }
        router.replace('/dashboard');
    };

    return (
        <AuthSplit title="Create your account" subtitle="It’s fast and free.">
            <Stack component="form" gap={2} onSubmit={handleSubmit(onSubmit)} noValidate>
                {errMsg && <Alert severity="error">{errMsg}</Alert>}
                {infoMsg && <Alert severity="info">{infoMsg}</Alert>}

                <TextField
                    {...register('full_name')}
                    error={!!errors.full_name}
                    placeholder='Full Name (Optional)'
                    helperText={errors.full_name?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon fontSize="small"/></InputAdornment> }}
                />
                <TextField
                    type="email"
                    placeholder='E-mail'
                    autoComplete="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlineIcon fontSize="small"/></InputAdornment> }}
                />
                <TextField
                    type="password"
                    placeholder='Password'
                    autoComplete="new-password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message ?? 'Minimum 6 characters.'}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small"/></InputAdornment> }}
                />

                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create account'}
                </Button>

                <Stack direction="row" gap={1} justifyContent="center" sx={{ mt: 1 }}>
                    <span>Already have an account?</span>
                    <Link href="/(auth)/login" underline="hover">Sign in</Link>
                </Stack>
            </Stack>
        </AuthSplit>
    );
}
