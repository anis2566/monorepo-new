import { Metadata } from "next";

import { ContactView } from "@/modules/contact/ui/views/contact-view";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact",
};

const Contact = () => {
  return <ContactView />;
};

export default Contact;
