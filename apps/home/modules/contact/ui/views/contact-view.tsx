"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Facebook,
  Youtube,
  Building2,
  Navigation,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

const contactSchema = z.object({
  name: z.string().min(1, "নাম আবশ্যক").max(100),
  phone: z.string().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  subject: z.string().min(1, "বিষয় নির্বাচন করুন"),
  message: z
    .string()
    .min(10, "অন্তত ১০ অক্ষর লিখুন")
    .max(1000, "বার্তা ১০০০ অক্ষরের বেশি হতে পারবে না"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactMethods = [
  {
    icon: Phone,
    title: "ফোন",
    value: "০১৭০০-০০০০০০",
    subValue: "০১৮০০-০০০০০০",
    action: "tel:+8801700000000",
    color: "bg-green-500",
    description: "সকাল ৯টা - রাত ১০টা",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "০১৭০০-০০০০০০",
    subValue: "দ্রুত উত্তর পান",
    action:
      "https://wa.me/8801700000000?text=আসসালামু আলাইকুম, Mr. Dr. সম্পর্কে জানতে চাই",
    color: "bg-emerald-500",
    description: "২৪/৭ অনলাইন",
  },
  {
    icon: Mail,
    title: "ইমেইল",
    value: "info@mrdr.edu.bd",
    subValue: "support@mrdr.edu.bd",
    action: "mailto:info@mrdr.edu.bd",
    color: "bg-blue-500",
    description: "২৪ ঘণ্টার মধ্যে উত্তর",
  },
  {
    icon: Facebook,
    title: "Facebook",
    value: "Mr. Dr. Official",
    subValue: "@mrdr.official",
    action: "https://facebook.com/mrdr.official",
    color: "bg-indigo-500",
    description: "লাইভ আপডেট",
  },
];

const officeLocations = [
  {
    name: "প্রধান কার্যালয় - ঢাকা",
    address: "বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা-১২০৫",
    phone: "০১৭০০-০০০০০০",
    hours: "সকাল ৯টা - রাত ১০টা",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2684096699287!2d90.37469491498245!3d23.746511384589437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b7a55cd36f%3A0x1e8b5e2e7b7d7e7a!2sDhanmondi%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1234567890",
    isPrimary: true,
  },
  {
    name: "চট্টগ্রাম শাখা",
    address: "জিইসি সার্কেল, চট্টগ্রাম",
    phone: "০১৮০০-০০০০০০",
    hours: "সকাল ১০টা - রাত ৯টা",
    mapUrl: "",
    isPrimary: false,
  },
];

const inquirySubjects = [
  { value: "admission", label: "ভর্তি সংক্রান্ত" },
  { value: "course", label: "কোর্স সম্পর্কে জানতে" },
  { value: "fee", label: "ফি ও পেমেন্ট" },
  { value: "schedule", label: "ক্লাস সময়সূচী" },
  { value: "other", label: "অন্যান্য" },
];

export const ContactView = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success(
      "আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।",
    );
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <MessageCircle className="h-4 w-4 mr-2" />
              যোগাযোগ করুন
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              আমাদের সাথে কথা বলুন
            </h1>
            <p className="text-lg text-primary-foreground/80">
              যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা সবসময়
              আপনার পাশে আছি।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                target={method.action.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.action.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="block"
              >
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-5">
                    <div
                      className={`h-12 w-12 rounded-xl ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">
                      {method.title}
                    </h3>
                    <p className="text-primary font-medium">{method.value}</p>
                    {method.subValue && (
                      <p className="text-sm text-muted-foreground">
                        {method.subValue}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    বার্তা পাঠান
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>আপনার নাম *</FormLabel>
                              <FormControl>
                                <Input placeholder="সম্পূর্ণ নাম" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>মোবাইল নম্বর *</FormLabel>
                              <FormControl>
                                <Input placeholder="০১XXXXXXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ইমেইল (ঐচ্ছিক)</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="email@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>বিষয় *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {inquirySubjects.map((subject) => (
                                    <SelectItem
                                      key={subject.value}
                                      value={subject.value}
                                    >
                                      {subject.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>আপনার বার্তা *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="আপনার প্রশ্ন বা মন্তব্য লিখুন..."
                                className="min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "পাঠানো হচ্ছে..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            বার্তা পাঠান
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href="https://wa.me/8801700000000?text=আসসালামু আলাইকুম"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-12 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </Button>
                </a>
                <a href="tel:+8801700000000">
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-12 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  >
                    <Phone className="h-5 w-5" />
                    কল করুন
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Map & Address */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Primary Location Map */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <iframe
                    src={officeLocations[0]?.mapUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {officeLocations[0]?.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {officeLocations[0]?.address}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {officeLocations[0]?.phone}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {officeLocations[0]?.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Dhanmondi,Dhaka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Navigation className="h-4 w-4" />
                      দিকনির্দেশনা পান
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Other Locations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    অন্যান্য শাখা
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {officeLocations.slice(1).map((location, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <h4 className="font-medium text-foreground">
                        {location.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {location.address}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {location.phone}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {location.hours}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground mb-4">
                    সোশ্যাল মিডিয়াতে ফলো করুন
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com/mrdr.official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="https://youtube.com/@mrdr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-xl bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                    >
                      <Youtube className="h-6 w-6" />
                    </a>
                    <a
                      href="https://wa.me/8801700000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              দ্রুত উত্তর পেতে
            </h2>
            <p className="text-muted-foreground mt-2">
              সাধারণ প্রশ্নের উত্তর দেখুন অথবা আমাদের পেজগুলো ভিজিট করুন
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ssc-foundation">
              <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Badge className="mb-3 bg-green-500">SSC</Badge>
                  <h3 className="font-medium text-foreground">
                    SSC Foundation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ক্লাস ৭-৯ এর জন্য
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/hsc-academic">
              <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Badge className="mb-3 bg-blue-500">HSC</Badge>
                  <h3 className="font-medium text-foreground">HSC Academic</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    একাদশ-দ্বাদশ শ্রেণী
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/medical-admission">
              <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Badge className="mb-3">Medical</Badge>
                  <h3 className="font-medium text-foreground">
                    Medical Admission
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ক্র্যাশ কোর্স
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/success-stories">
              <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                <CardContent className="p-5 text-center">
                  <Badge className="mb-3 bg-yellow-500 text-yellow-950">
                    সাফল্য
                  </Badge>
                  <h3 className="font-medium text-foreground">
                    Success Stories
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    সফল শিক্ষার্থীরা
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
