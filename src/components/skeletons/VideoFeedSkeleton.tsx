export default function VideoFeedSkeleton() {
  return (
    <div className="relative w-full max-w-[400px] aspect-[9/16] bg-[#1a1a1a] rounded-[20px] overflow-hidden flex shrink-0 mb-8 border border-white/5 shadow-2xl">
      {/* Background Shimmer */}
      <div className="absolute inset-0 shimmer-dark opacity-50" />

      {/* Overlay Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        
        {/* Left Info: Avatar, Username, Caption */}
        <div className="flex flex-col gap-3 flex-1 pr-12">
          {/* Avatar & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full shimmer-dark shrink-0 border border-white/10" />
            <div className="w-28 h-4 rounded-md shimmer-dark" />
          </div>
          {/* Caption */}
          <div className="w-[85%] h-3 rounded-md shimmer-dark" />
          <div className="w-[60%] h-3 rounded-md shimmer-dark" />
          {/* Music Track */}
          <div className="w-[50%] h-3 rounded-md shimmer-dark mt-1" />
        </div>

        {/* Right Actions: Like, Comment, Bookmark, Share */}
        <div className="flex flex-col items-center gap-4 pb-2 z-10 shrink-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full shimmer-dark bg-black/50" />
              <div className="w-6 h-2 rounded-full shimmer-dark" />
            </div>
          ))}
          {/* Audio Disc */}
          <div className="w-10 h-10 rounded-full shimmer-dark border-[6px] border-[#2a2a2a] mt-2" />
        </div>
      </div>
    </div>
  );
}
