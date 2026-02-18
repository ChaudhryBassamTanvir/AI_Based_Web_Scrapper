interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function UrlInput({ value, onChange }: Props) {
  const isEmpty = value.trim() === "";

  return (
    <section className="relative w-full py-14 sm:py-20 px-4 sm:px-6 bg-white overflow-hidden">
      
      {/* Grey grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-xl sm:max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Heading */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-black">
            Paste Product URL
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-black/60">
            Enter a product page URL to start intelligent scraping
          </p>
        </div>

        {/* Input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter product URL..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border border-black rounded-lg
                       px-3 sm:px-4 py-3 text-sm sm:text-base
                       focus:outline-none focus:border-black transition-all"
          />
        </div>

        {/* Spinner + Hint (ONLY when empty) */}
        {isEmpty && (
          <>
            <div className="flex justify-center pt-2 sm:pt-4">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                {/* Wheel */}
                <div className="absolute inset-0 rounded-full border-4 border-black/10" />
                <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin" />

                {/* Rider */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full animate-bounce" />
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-black/50">
              Waiting for input…
            </p>
          </>
        )}
      </div>
    </section>
  );
}
