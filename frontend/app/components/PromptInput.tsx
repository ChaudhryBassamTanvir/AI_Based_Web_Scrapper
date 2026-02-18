interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptInput({ value, onChange }: Props) {
  return (
    <section className="relative w-full py-12 sm:py-16 px-4 sm:px-6 bg-white overflow-hidden mt-8 sm:mt-12">
      
      {/* Grey grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-xl sm:max-w-2xl mx-auto space-y-4 sm:space-y-6">

        {/* Heading */}
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-black">
            AI Extraction Instructions
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-black/60">
            Guide the AI on how to extract, format, or filter the product data.
            You can specify fields, structure, or Shopify-ready output.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          placeholder={`Example:
- Extract title, price, SKU, images
- Clean HTML and remove symbols
- Return Shopify-compatible JSON
- By Default it will generate Shopify compatible data`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full bg-white border border-black rounded-lg
                     px-3 sm:px-4 py-3 text-xs sm:text-sm
                     resize-none focus:outline-none focus:border-black
                     transition-all"
        />

        {/* Helper text */}
        <p className="text-[10px] sm:text-xs text-black/50 text-center">
          Leave empty to use the default intelligent extraction.
        </p>
      </div>
    </section>
  );
}
