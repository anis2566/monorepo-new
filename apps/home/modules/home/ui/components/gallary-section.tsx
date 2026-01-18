"use client";

import { useState } from "react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogContent } from "@workspace/ui/components/dialog";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: "classroom" | "lab" | "events";
  title: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
    alt: "Modern classroom",
    category: "classroom",
    title: "আধুনিক শ্রেণীকক্ষ",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
    alt: "Science laboratory",
    category: "lab",
    title: "বিজ্ঞান ল্যাবরেটরি",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop",
    alt: "Student event",
    category: "events",
    title: "বার্ষিক অনুষ্ঠান",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop",
    alt: "Interactive session",
    category: "classroom",
    title: "ইন্টারেক্টিভ ক্লাস",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
    alt: "Chemistry lab",
    category: "lab",
    title: "কেমিস্ট্রি ল্যাব",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    alt: "Award ceremony",
    category: "events",
    title: "পুরস্কার বিতরণী",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&h=400&fit=crop",
    alt: "Study room",
    category: "classroom",
    title: "স্টাডি রুম",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1581093458791-9f3c3250a8f0?w=600&h=400&fit=crop",
    alt: "Biology lab",
    category: "lab",
    title: "বায়োলজি ল্যাব",
  },
];

const categories = [
  { key: "all", label: "সব" },
  { key: "classroom", label: "শ্রেণীকক্ষ" },
  { key: "lab", label: "ল্যাবরেটরি" },
  { key: "events", label: "অনুষ্ঠান" },
];

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const handlePrev = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedImage
    );
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedImage(filteredItems[prevIndex]?.id ?? null);
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedImage
    );
    const nextIndex =
      currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredItems[nextIndex]?.id ?? null);
  };

  const selectedItem = galleryItems.find((item) => item.id === selectedImage);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-700/10 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            ফটো গ্যালারি
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            আমাদের ক্যাম্পাস দেখুন
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            আধুনিক শ্রেণীকক্ষ, সুসজ্জিত ল্যাবরেটরি এবং বিভিন্ন শিক্ষামূলক
            অনুষ্ঠানের মুহূর্ত
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-red-700 text-white shadow-md"
                  : "bg-background text-muted-foreground hover:bg-red-700/10 hover:text-red-700 border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(item.id)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={400}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? "h-64 sm:h-full" : "h-48 lg:h-56"
                }`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {item.title}
                  </h3>
                  <span className="text-white/80 text-sm capitalize">
                    {item.category === "classroom"
                      ? "শ্রেণীকক্ষ"
                      : item.category === "lab"
                        ? "ল্যাবরেটরি"
                        : "অনুষ্ঠান"}
                  </span>
                </div>
              </div>
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <Camera className="h-4 w-4 text-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog
          open={selectedImage !== null}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Image */}
              {selectedItem && (
                <div className="flex flex-col">
                  <Image
                    src={selectedItem.src}
                    alt={selectedItem.alt}
                    width={1200}
                    height={800}
                    className="w-full max-h-[70vh] object-contain"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-white font-semibold text-xl">
                      {selectedItem.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
