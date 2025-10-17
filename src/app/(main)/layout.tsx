import COREAuthenticationProvider from '@/@core/authentication/AuthenticationProvider';
import { AuthenticationProvider } from '@/context/AuthenticationProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthenticationProvider>
            <COREAuthenticationProvider>
                {children}
            </COREAuthenticationProvider>
        </AuthenticationProvider>
    );
}
