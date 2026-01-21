"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Fade up animation
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// Fade in animation
const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: delay,
    },
  }),
};

// Scale up animation
const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: delay,
      ease: "easeOut",
    },
  }),
};

// Slide from left
const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// Slide from right
const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// Stagger container
const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item
const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const FadeUp = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={fadeUpVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={fadeInVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleUp = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={scaleUpVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideLeft = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={slideLeftVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideRight = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={slideRightVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({
  children,
  className = "",
}: Omit<AnimatedSectionProps, "delay">) => (
  <motion.div
    initial="visible"
    animate="visible"
    variants={staggerContainerVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className = "",
}: Omit<AnimatedSectionProps, "delay">) => (
  <motion.div variants={staggerItemVariants} className={className}>
    {children}
  </motion.div>
);

// Hero text animation
export const HeroText = ({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.8,
      delay: delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className={className}
  >
    {children}
  </motion.div>
);
