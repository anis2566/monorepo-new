import { ResponsiveLayout } from "@/modules/layout/ui/views/dashboard-layout";
import { ModalProvider } from "@/providers/modal-provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ResponsiveLayout>
      {children}
      <ModalProvider />
    </ResponsiveLayout>
  );
}
