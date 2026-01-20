import { Check, X, Star, Zap, Crown } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

import { FadeUp, StaggerContainer } from "@/components/scroll-animation";

interface PricingFeature {
  name: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  period: string;
  icon: typeof Star;
  popular: boolean;
  color: string;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "বেসিক",
    subtitle: "শুরুর জন্য পারফেক্ট",
    price: "৳৫,০০০",
    originalPrice: "৳৭,০০০",
    period: "৬ মাস",
    icon: Star,
    popular: false,
    color: "from-blue-500 to-blue-600",
    features: [
      "১৫০+ রেকর্ডেড ভিডিও",
      "সাপ্তাহিক লাইভ ক্লাস",
      "PDF নোট ও শীট",
      "MCQ প্র্যাকটিস",
      "গ্রুপ সাপোর্ট",
    ],
  },
  {
    id: "standard",
    name: "স্ট্যান্ডার্ড",
    subtitle: "সবচেয়ে জনপ্রিয়",
    price: "৳৮,০০০",
    originalPrice: "৳১০,০০০",
    period: "১ বছর",
    icon: Zap,
    popular: true,
    color: "from-red-700 to-red-600",
    features: [
      "৩০০+ রেকর্ডেড ভিডিও",
      "দৈনিক লাইভ ক্লাস",
      "PDF নোট ও শীট",
      "MCQ + CQ প্র্যাকটিস",
      "মাসিক মক টেস্ট",
      "১:১ মেন্টরিং",
      "প্রশ্ন ব্যাংক অ্যাক্সেস",
    ],
  },
  {
    id: "premium",
    name: "প্রিমিয়াম",
    subtitle: "সম্পূর্ণ প্রস্তুতি",
    price: "৳১২,০০০",
    originalPrice: "৳১৫,০০০",
    period: "ভর্তি পর্যন্ত",
    icon: Crown,
    popular: false,
    color: "from-amber-500 to-orange-500",
    features: [
      "৫০০+ রেকর্ডেড ভিডিও",
      "দৈনিক লাইভ ক্লাস",
      "PDF নোট ও শীট",
      "MCQ + CQ প্র্যাকটিস",
      "সাপ্তাহিক মক টেস্ট",
      "ব্যক্তিগত মেন্টর",
      "সম্পূর্ণ প্রশ্ন ব্যাংক",
      "অ্যাডমিশন গাইডেন্স",
      "২৪/৭ সাপোর্ট",
    ],
  },
];

const comparisonFeatures: PricingFeature[] = [
  { name: "রেকর্ডেড ভিডিও", basic: "১৫০+", standard: "৩০০+", premium: "৫০০+" },
  {
    name: "লাইভ ক্লাস",
    basic: "সাপ্তাহিক",
    standard: "দৈনিক",
    premium: "দৈনিক",
  },
  { name: "PDF নোট", basic: true, standard: true, premium: true },
  { name: "MCQ প্র্যাকটিস", basic: true, standard: true, premium: true },
  { name: "CQ প্র্যাকটিস", basic: false, standard: true, premium: true },
  { name: "মক টেস্ট", basic: false, standard: "মাসিক", premium: "সাপ্তাহিক" },
  { name: "মেন্টরিং", basic: false, standard: "১:১", premium: "ব্যক্তিগত" },
  {
    name: "প্রশ্ন ব্যাংক",
    basic: false,
    standard: "আংশিক",
    premium: "সম্পূর্ণ",
  },
  { name: "অ্যাডমিশন গাইডেন্স", basic: false, standard: false, premium: true },
  { name: "২৪/৭ সাপোর্ট", basic: false, standard: false, premium: true },
];

export const PricingSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeUp className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-0 mb-4 px-4 py-2">
            প্যাকেজ সমূহ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            তোমার জন্য সেরা প্ল্যান বেছে নাও
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            সব প্যাকেজেই ১০০% মানি ব্যাক গ্যারান্টি। প্রথম ৭ দিনের মধ্যে
            সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত।
          </p>
        </FadeUp>

        {/* Pricing Cards */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                className={`relative overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular
                    ? "ring-2 ring-primary shadow-xl scale-[1.02]"
                    : "border shadow-lg"
                }`}
                key={plan.id}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary/10 text-primary text-center text-sm font-medium py-1.5">
                    ⭐ সবচেয়ে জনপ্রিয়
                  </div>
                )}

                <CardHeader className={`pt-${plan.popular ? "10" : "6"} pb-4`}>
                  <div
                    className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.subtitle}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.period}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full bg-primary text-white ${plan.popular ? "" : "bg-primary hover:bg-primary/90 hover:text-white"}`}
                    size="lg"
                    variant="secondary"
                  >
                    এখনই ভর্তি হন
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </StaggerContainer>

        {/* Comparison Table */}
        <FadeUp delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground text-center mb-8">
              বিস্তারিত তুলনা
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold text-foreground border-b">
                      ফিচার
                    </th>
                    <th className="text-center p-4 font-semibold text-foreground border-b">
                      বেসিক
                    </th>
                    <th className="text-center p-4 font-semibold text-primary border-b bg-primary/5">
                      স্ট্যান্ডার্ড
                    </th>
                    <th className="text-center p-4 font-semibold text-foreground border-b">
                      প্রিমিয়াম
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-foreground font-medium">
                        {feature.name}
                      </td>
                      <td className="p-4 text-center">
                        {renderFeatureValue(feature.basic)}
                      </td>
                      <td className="p-4 text-center text-primary bg-primary/5">
                        {renderFeatureValue(feature.standard)}
                      </td>
                      <td className="p-4 text-center">
                        {renderFeatureValue(feature.premium)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        {/* Bottom CTA */}
        <FadeUp delay={0.3} className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            কোন প্ল্যান বেছে নেবেন বুঝতে পারছেন না?
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/90"
          >
            ফ্রি কনসালটেশন নিন
          </Button>
        </FadeUp>
      </div>
    </section>
  );
};

const renderFeatureValue = (value: boolean | string) => {
  if (value === true) {
    return (
      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
        <Check className="h-4 w-4 text-green-600" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center mx-auto">
        <X className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
};
