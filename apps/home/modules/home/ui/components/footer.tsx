import { Stethoscope } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Mr. Dr.</h3>
                <p className="text-xs text-background/60">
                  মেডিকেল অ্যাডমিশন কোচিং
                </p>
              </div>
            </div>
            <p className="text-sm text-background/70">
              ২০০৯ সাল থেকে বাংলাদেশের ভবিষ্যৎ ডাক্তার তৈরি করছি।
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a
                  href="#courses"
                  className="hover:text-background transition-colors"
                >
                  কোর্সসমূহ
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-background transition-colors"
                >
                  আমাদের সম্পর্কে
                </a>
              </li>
              <li>
                <a
                  href="#success"
                  className="hover:text-background transition-colors"
                >
                  সাফল্যের গল্প
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-background transition-colors"
                >
                  যোগাযোগ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">কোর্সসমূহ</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  HSC ব্যাচ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  প্রি-মেডিকেল
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  ক্র্যাশ কোর্স
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  অনলাইন ক্লাস
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">সাপোর্ট</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-background transition-colors"
                >
                  স্টুডেন্ট পোর্টাল
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  স্টাডি মেটেরিয়াল
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  হেল্প সেন্টার
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} Mr. Dr. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-6 text-sm text-background/60">
            <a href="#" className="hover:text-background transition-colors">
              প্রাইভেসি পলিসি
            </a>
            <a href="#" className="hover:text-background transition-colors">
              টার্মস অফ সার্ভিস
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
