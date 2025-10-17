'use client';
import { useState } from 'react';
import AuthSplit from '@/@core/layouts/AuthSplit';
import {
    Alert, Button, IconButton,
    InputAdornment, Link, Stack, TextField
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/services/supabase';
import { useRouter } from 'next/navigation';

const Schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'At least 6 characters'),
    remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof Schema>;

export default function LoginPage() {
    const [showPwd, setShowPwd] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<FormValues>({ resolver: zodResolver(Schema), defaultValues: { remember: true } });

    const onSubmit = async (v: FormValues) => {
        setErrMsg(null);
        const { error } = await supabase.auth.signInWithPassword({ email: v.email, password: v.password });
        if (error) {
            const map: Record<string, string> = {
                'Invalid login credentials': 'Email atau password salah.',
                'Email not confirmed': 'Email belum dikonfirmasi. Cek inbox kamu.',
                'Over Email Rate Limit': 'Terlalu banyak percobaan. Coba lagi nanti.',
            };
            setErrMsg(map[error.message] ?? error.message);
            return;
        }
        router.replace('/dashboard');
    };

    return (
        <AuthSplit title="Welcome Back!" subtitle="Sign in to access your dashboard.">
            <Stack component="form" gap={2} onSubmit={handleSubmit(onSubmit)} noValidate>
                {errMsg && <Alert severity="error">{errMsg}</Alert>}

                <TextField
                    type="email"
                    autoComplete="email"
                    error={!!errors.email}
                    placeholder='E-mail'
                    helperText={errors.email?.message ?? 'Use your work email if possible.'}
                    {...register('email')}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MailOutlineIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder='Password'
                    error={!!errors.password}
                    helperText={errors.password?.message ?? 'Minimum 6 characters.'}
                    {...register('password')}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPwd(s => !s)} edge="end" aria-label="toggle password">
                                    {showPwd ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>

                <Stack direction="row" gap={1} justifyContent="center" sx={{ mt: 1 }}>
                    <span>Don't have an account?</span>
                    <Link href="/(auth)/register" underline="hover">Sign up</Link>
                </Stack>
            </Stack>
        </AuthSplit>
    );
}
