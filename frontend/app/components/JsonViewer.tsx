interface Props {
  data: any;
}

export default function JsonViewer({ data }: Props) {
  const handleDownload = () => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scraped-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative bg-black border border-white/10 rounded-2xl overflow-hidden">
      
      {/* White grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h3 className="text-sm font-medium text-white tracking-wide">
          Scraped JSON Output
        </h3>

        <button
          onClick={handleDownload}
          className="text-xs px-4 py-2 rounded-md bg-white text-black 
                     hover:bg-gray-200 cursor-pointer transition"
        >
          Download JSON
        </button>
      </div>

      {/* JSON body */}
      <div className="relative p-6 max-h-[500px] overflow-auto">
        <pre className="text-sm text-white/80 leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </section>
  );
}
