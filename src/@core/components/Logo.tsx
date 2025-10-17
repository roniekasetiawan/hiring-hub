'use client';
import { Stack, Avatar, Typography } from '@mui/material';

export default function Logo() {
    return (
        <Stack direction="row" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, fontWeight: 800 }}>H</Avatar>
            <Typography variant="subtitle1" fontWeight={800}>Hiring Hub</Typography>
        </Stack>
    );
}
