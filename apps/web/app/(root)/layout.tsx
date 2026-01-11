import { AuthGuard } from "@/modules/layout/ui/components/auth-guard";
import { AdminLayout } from "@/modules/layout/ui/views/admin-layout";
import { ModalProvider } from "@/providers/modal-provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <AdminLayout>
        {children}
        <ModalProvider />
      </AdminLayout>
    </AuthGuard>
  );
};

export default RootLayout;
