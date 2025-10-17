'use client';
import { Box, Paper, Stack, Typography, Avatar, Divider } from '@mui/material';
import Logo from '@/@core/components/Logo';
import { themeHelpers } from '@/@core/theme';
import GoogleIcon from '@mui/icons-material/Google';
import ShopIcon from '@mui/icons-material/Shop';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function AuthSplit({
    title,
    subtitle,
    children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: { xs: 1.5, md: 4 }, bgcolor: '#dcdcdc' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 1180,
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '520px 1fr' },
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: 'background.paper' }}>
                    <Stack gap={3}>
                        <Logo />
                        <Stack gap={0.5}>
                            <Typography variant="h4" fontWeight={800}>{title}</Typography>
                            {!!subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
                        </Stack>
                        {children}
                    </Stack>
                </Box>

                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'stretch',
                        p: 5,
                        background: themeHelpers.gradients.authRight,
                        color: 'common.white',
                        position: 'relative',
                    }}
                >
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27><filter id=%27n%27 x=%270%27 y=%270%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%271%27 stitchTiles=%27stitch%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.03%27/></svg>")',
                    }} />
                    <Stack gap={4} justifyContent="space-between" width="100%" position="relative">
                        <Stack gap={10}>
                            <Typography variant="h4" fontWeight={500} sx={{ letterSpacing: -.5 }}>
                                Revolutionize hiring with smarter automation
                            </Typography>

                            <Stack
                                sx={{
                                    p: 2.5,
                                    borderRadius: 5,
                                    backdropFilter: 'blur(8px)',
                                    backgroundColor: 'rgba(255,255,255,.08)',
                                    border: '1px solid rgba(255,255,255,.18)',
                                }}
                            >
                                <Typography variant="body2" sx={{ opacity: .9 }}>
                                    “HiringHub helps us streamline the recruitment funnel. It’s reliable, efficient, and our releases are always top-notch.”
                                </Typography>
                                <Stack direction="row" alignItems="center" gap={1.5} mt={2}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,.25)' }}>M</Avatar>
                                    <Stack>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'white' }}>Michael Carter</Typography>
                                        <Typography variant="caption" sx={{ opacity: .8, color: 'white' }}>Software Engineer @ SoftQA</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack gap={1}>
                            <Divider sx={{ borderColor: 'rgba(255,255,255,.25)' }} />
                            <Typography variant="caption" sx={{ opacity: .85 }}>Join teams at</Typography>
                            <Stack direction="row" gap={3} flexWrap="wrap" alignItems="center">
                                <GoogleIcon />
                                <ShopIcon />
                                <YouTubeIcon />
                                <FacebookIcon />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}
