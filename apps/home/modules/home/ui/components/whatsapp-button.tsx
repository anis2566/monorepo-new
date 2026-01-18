import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phoneNumber = "8801XXXXXXXXX"; // Replace with actual WhatsApp number
  const message = "হ্যালো! Mr. Dr. মেডিকেল অ্যাডমিশন কোচিং সম্পর্কে জানতে চাই।";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 right-6 z-50 group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation ring */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />

        {/* Main button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <MessageCircle className="h-7 w-7 text-white fill-white" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          WhatsApp এ মেসেজ করুন
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-foreground" />
        </div>
      </div>
    </a>
  );
};
