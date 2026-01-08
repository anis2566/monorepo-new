import { AuthGuard } from "@/modules/layout/ui/components/auth-guard";
import { ResponsiveLayout } from "@/modules/layout/ui/views/dashboard-layout";
import { ModalProvider } from "@/providers/modal-provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthGuard>
      <ResponsiveLayout>
        {children}
        <ModalProvider />
      </ResponsiveLayout>
    </AuthGuard>
  );
}
