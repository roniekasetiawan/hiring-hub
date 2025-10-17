'use client';
import {Button} from "@mui/material";
import {useRouter} from "next/navigation";
import {authService} from "@/services/auth.service";

export default function DashboardPage() {
    const router = useRouter();
    return (
        <main style={{ padding: 24 }}>
            <Button onClick={async () => { await authService.logout(); router.replace('/login'); }}>
                Logout
            </Button>
            <h1>asd</h1>
        </main>
    );
}
