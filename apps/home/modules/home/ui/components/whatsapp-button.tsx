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
      className="fixed bottom-18 right-4 z-50 group"
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
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          WhatsApp এ মেসেজ করুন
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-gray-800" />
        </div>
      </div>
    </a>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">WhatsApp Button Demo</h1>
        <p className="text-gray-600 mb-4">
          The WhatsApp button is now consistently positioned at bottom-6 on all
          screen sizes.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">What changed?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Removed{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                bottom-24 md:bottom-6
              </code>
            </li>
            <li>
              Now uses{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">bottom-6</code> on
              all screen sizes
            </li>
            <li>
              The button is fixed positioned, so it won't take up layout space
            </li>
            <li>Hover over the button to see the tooltip</li>
          </ul>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  );
}
