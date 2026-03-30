export default function NavbarSkeleton() {
  return (
    <div className="w-full h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-50 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full shimmer-dark shrink-0" />
        <div className="w-24 h-6 rounded-md shimmer-dark hidden md:block" />
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="w-full h-10 rounded-full shimmer-dark" />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full shimmer-dark hidden sm:block" />
        <div className="w-9 h-9 rounded-full shimmer-dark hidden sm:block" />
        <div className="w-10 h-10 rounded-full shimmer-dark" />
      </div>
    </div>
  );
}
