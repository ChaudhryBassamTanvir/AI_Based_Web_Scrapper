interface FancySpinnerProps {
  loading: boolean;
}

export function FancySpinner({ loading }: FancySpinnerProps) {
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg z-20">
      <div className="flex flex-col items-center gap-4">

        {/* Main spinning ring */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />

          {/* Center AI dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
          </div>
        </div>

        {/* Icon row */}
        <div className="flex gap-3 text-white text-lg animate-pulse">
          <span>⚙️</span>
          <span>⚡</span>
          <span>🤖</span>
        </div>

        <p className="text-xs text-white/70 tracking-wide">
          Scraping intelligently…
        </p>
      </div>
    </div>
  );
}
