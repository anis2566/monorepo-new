import { Footer } from "@/modules/home/ui/components/footer";
import { Header } from "@/modules/home/ui/components/header";
import { WhatsAppButton } from "@/modules/home/ui/components/whatsapp-button";
import { ModalProvider } from "@/providers/modal-provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-background w-full max-w-7xl mx-auto relative">
      <Header />
      {children}
      <Footer />
      <ModalProvider />
      <WhatsAppButton />
    </div>
  );
}
