import COREAuthenticationProvider from "@/@core/authentication/AuthenticationProvider";
import { AuthenticationProvider } from "@/context/AuthenticationProvider";
import LayoutMain from "@/@core/layouts/Main";
import MainLayoutProvider from "@/context/MainLayoutProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticationProvider>
      <COREAuthenticationProvider>
        <MainLayoutProvider>
          <LayoutMain>{children}</LayoutMain>
        </MainLayoutProvider>
      </COREAuthenticationProvider>
    </AuthenticationProvider>
  );
}
