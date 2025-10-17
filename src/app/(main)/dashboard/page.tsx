'use client';

import { Box, Card, CardContent, Stack, Typography, Button, Alert } from '@mui/material';
import { Can } from '@/context/AccessControlProvider';
import { useAuthenticationProvider } from '@/context/AuthenticationProvider';
import { useAccessControl } from '@/context/AccessControlProvider';
import {authService} from "@/services/auth.service";
import {useRouter} from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuthenticationProvider();
    const { isAllowed } = useAccessControl();

    return (
        <Box p={3}>
            <Button onClick={async () => { await authService.logout(); router.replace('/login'); }}>
                Logout
            </Button>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                Logged in as <b>{user?.email}</b> ({user?.role})
            </Alert>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Can I="create" a="Job">
                    <Card sx={{ minWidth: 280 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Create Job</Typography>
                            <Typography variant="body2" gutterBottom>
                                Only <b>recruiter</b> and <b>admin</b> can see this.
                            </Typography>
                            <Button variant="contained" href="/jobs/new">Create a new job</Button>
                        </CardContent>
                    </Card>
                </Can>

                {isAllowed('application.create') && (
                    <Card sx={{ minWidth: 280 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Apply to Job</Typography>
                            <Typography variant="body2" gutterBottom>
                                Only <b>applicant</b> (dan admin jika kamu izinkan) dapat melihat ini.
                            </Typography>
                            <Button variant="outlined" href="/jobs">Browse jobs</Button>
                        </CardContent>
                    </Card>
                )}

                <Can I="read" a="User">
                    <Card sx={{ minWidth: 280 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Users</Typography>
                            <Typography variant="body2" gutterBottom>
                                Hanya <b>admin</b> yang bisa melihat ini.
                            </Typography>
                            <Button variant="contained" color="secondary" href="/users">Go to Users</Button>
                        </CardContent>
                    </Card>
                </Can>
            </Stack>
        </Box>
    );
}
