export default function ProfileSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-[24px] bg-[#121212] border border-white/5 p-6 flex flex-col gap-6">
      {/* Header Avatar & Info */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full shimmer-dark shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-3/4 h-5 rounded-md shimmer-dark" />
          <div className="w-1/2 h-3 rounded-md shimmer-dark" />
        </div>
      </div>
      
      {/* Stats row */}
      <div className="flex justify-between px-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 w-1/3">
            <div className="w-10 h-5 rounded-md shimmer-dark" />
            <div className="w-14 h-3 rounded-md shimmer-dark" />
          </div>
        ))}
      </div>

      {/* Edit Profile Button */}
      <div className="w-full h-10 rounded-xl shimmer-dark bg-white/5" />

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-1 mt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square shimmer-dark rounded-sm" />
        ))}
      </div>
    </div>
  );
}
