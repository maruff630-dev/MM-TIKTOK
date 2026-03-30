export default function StoriesSkeleton() {
  return (
    <div className="w-full py-4 flex gap-4 overflow-hidden border-b border-white/5 pb-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full shimmer-dark border-2 border-[#1a1a1a]" />
          <div className="w-14 h-3 rounded-md shimmer-dark" />
        </div>
      ))}
    </div>
  );
}
