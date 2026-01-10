import { AdminLayout } from "@/modules/layout/ui/views/admin-layout";
import { ModalProvider } from "@/providers/modal-provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminLayout>
      {children}
      <ModalProvider />
    </AdminLayout>
  );
};

export default RootLayout;
