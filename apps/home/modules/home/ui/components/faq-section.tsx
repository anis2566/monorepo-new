import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

interface FAQItem {
  question: string;
  answer: string;
  category: "admission" | "fees" | "programs" | "general";
}

const faqItems: FAQItem[] = [
  {
    question: "ভর্তির জন্য কী কী যোগ্যতা প্রয়োজন?",
    answer:
      "HSC পরীক্ষার্থী বা উত্তীর্ণ শিক্ষার্থীরা আমাদের প্রোগ্রামে ভর্তি হতে পারবে। মেডিকেল অ্যাডমিশন কোর্সের জন্য বিজ্ঞান বিভাগ থেকে HSC পাস হতে হবে।",
    category: "admission",
  },
  {
    question: "ভর্তি প্রক্রিয়া কীভাবে সম্পন্ন করতে হয়?",
    answer:
      "অনলাইনে বা সরাসরি আমাদের অফিসে এসে ভর্তি ফর্ম পূরণ করতে হবে। ফর্ম জমা দেওয়ার পর ফি পরিশোধ করলেই ভর্তি নিশ্চিত হবে। প্রয়োজনীয় কাগজপত্র: জাতীয় পরিচয়পত্র/জন্ম সনদ, পাসপোর্ট সাইজ ছবি, এবং আগের পরীক্ষার সার্টিফিকেট।",
    category: "admission",
  },
  {
    question: "কোর্স ফি কত এবং কিস্তিতে দেওয়া যায় কি?",
    answer:
      "কোর্স ফি প্রোগ্রাম অনুযায়ী ভিন্ন হয়। HSC একাডেমিক প্রোগ্রাম: ৳১৫,০০০, মেডিকেল ক্র্যাশ কোর্স: ৳১২,০০০, এবং কম্বাইন্ড প্রোগ্রাম: ৳২২,০০০। হ্যাঁ, সুবিধাজনক কিস্তিতে ফি পরিশোধের সুযোগ রয়েছে।",
    category: "fees",
  },
  {
    question: "কোনো ছাড় বা বৃত্তির সুযোগ আছে কি?",
    answer:
      "মেধাবী শিক্ষার্থীদের জন্য ১০-৩০% পর্যন্ত বৃত্তির সুযোগ রয়েছে। এছাড়া ভাই-বোন একসাথে ভর্তি হলে ১০% পারিবারিক ছাড় এবং প্রাক্তন শিক্ষার্থীদের রেফারেলে ৫% ছাড় প্রযোজ্য।",
    category: "fees",
  },
  {
    question: "কোন কোন প্রোগ্রাম চালু আছে?",
    answer:
      "আমাদের তিনটি প্রধান প্রোগ্রাম রয়েছে: (১) HSC একাডেমিক প্রোগ্রাম - সম্পূর্ণ HSC সিলেবাস কভার করে, (২) মেডিকেল অ্যাডমিশন ক্র্যাশ কোর্স - শুধুমাত্র ভর্তি পরীক্ষার প্রস্তুতি, এবং (৩) কম্বাইন্ড প্রোগ্রাম - HSC + মেডিকেল ভর্তি একসাথে।",
    category: "programs",
  },
  {
    question: "ক্লাসের সময়সূচী কেমন?",
    answer:
      "সকাল ব্যাচ: সকাল ৮টা - দুপুর ১২টা, দিবা ব্যাচ: দুপুর ২টা - সন্ধ্যা ৬টা, এবং সন্ধ্যা ব্যাচ: সন্ধ্যা ৬টা - রাত ১০টা। শিক্ষার্থীরা তাদের সুবিধামতো ব্যাচ বেছে নিতে পারে।",
    category: "programs",
  },
  {
    question: "অনলাইন ক্লাসের সুবিধা আছে কি?",
    answer:
      "হ্যাঁ, আমরা হাইব্রিড মডেলে ক্লাস পরিচালনা করি। শিক্ষার্থীরা চাইলে অফলাইন ক্লাসে অংশ নিতে পারে অথবা লাইভ অনলাইন ক্লাসে জয়েন করতে পারে। সব ক্লাসের রেকর্ডিং আমাদের অ্যাপে পাওয়া যায়।",
    category: "programs",
  },
  {
    question: "পরীক্ষা ও মূল্যায়ন ব্যবস্থা কেমন?",
    answer:
      "প্রতিদিন ডেইলি এক্সাম, সাপ্তাহিক মডেল টেস্ট এবং মাসিক ফুল সিলেবাস পরীক্ষা অনুষ্ঠিত হয়। প্রতিটি পরীক্ষার পর বিস্তারিত পারফরম্যান্স রিপোর্ট ও র‍্যাঙ্কিং প্রদান করা হয়।",
    category: "general",
  },
  {
    question: "শিক্ষার্থী সহায়তা কেমন?",
    answer:
      "২৪/৭ অনলাইন সাপোর্ট, প্রতিটি বিষয়ে ডেডিকেটেড মেন্টর, ডাউট ক্লিয়ারিং সেশন, এবং অভিভাবক-শিক্ষক মিটিং এর ব্যবস্থা রয়েছে। শিক্ষার্থীদের যেকোনো সমস্যায় আমরা সর্বদা পাশে আছি।",
    category: "general",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            সাধারণ জিজ্ঞাসা
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ভর্তি, ফি, প্রোগ্রাম এবং অন্যান্য বিষয়ে সাধারণ প্রশ্নের উত্তর এখানে
            পাবেন
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground text-base md:text-lg">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-11 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            আপনার প্রশ্নের উত্তর খুঁজে পাননি?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <HelpCircle className="h-4 w-4" />
            আমাদের সাথে যোগাযোগ করুন
          </a>
        </div>
      </div>
    </section>
  );
};
