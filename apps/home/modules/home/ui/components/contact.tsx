import {
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

export const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary bg-primary/10"
            >
              যোগাযোগ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              আমাদের সাথে যোগাযোগ করুন
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">ঠিকানা</p>
                  <p className="text-muted-foreground">
                    ১২৩ মেডিকেল লেন, ধানমন্ডি, ঢাকা-১২০৫
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">ফোন</p>
                  <p className="text-muted-foreground">
                    01XXX-XXXXXX, 01XXX-XXXXXX
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">ইমেইল</p>
                  <p className="text-muted-foreground">info@mrdr.edu.bd</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <a
                href="#"
                className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">
                মেসেজ পাঠান
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      নাম
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="আপনার নাম"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      ফোন
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="01XXX-XXXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    ইমেইল
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    মেসেজ
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="আপনার মেসেজ..."
                  />
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/80 text-white"
                  size="lg"
                  variant="secondary"
                >
                  মেসেজ পাঠান
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
