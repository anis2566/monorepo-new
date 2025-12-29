import { DashboardLayout } from "@/modules/layout/ui/views/dashboard-layout";
import { ModalProvider } from "@/providers/modal-provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
      {children}
      <ModalProvider />
    </DashboardLayout>
  );
};

export default RootLayout;
