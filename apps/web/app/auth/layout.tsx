export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Primary Background Layer: Radial Gradient and Grid */}
      <div className="fixed inset-0 auth-gradient pointer-events-none" />
      <div className="fixed inset-0 bg-grid-white pointer-events-none opacity-[0.2]" />

      {/* Atmospheric Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Glows */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-primary/25 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "15s", animationDelay: "2s" }}
        />

        {/* Secondary Accents */}
        <div
          className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-[20%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[110px] animate-pulse"
          style={{ animationDuration: "18s", animationDelay: "1s" }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>

      {/* Subtle Grain Overlay - CSS-only for reliability */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.4] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
