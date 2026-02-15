"use client";

import { useState } from "react";
import UrlInput from "./components/UrlInput";
import ScrapeButton from "./components/ScrapeButton";
import PromptInput from "./components/PromptInput";
import JsonViewer from "./components/JsonViewer";
import { scrapeWebsite, formatScrapedData } from "./lib/api";
import { FancySpinner } from "./components/FancySpinner";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    const res = await scrapeWebsite(url);
    if (res.success) {
      setScrapedData(res.data);
      setFormattedText("");
    } else {
      alert("Scraping failed: " + res.error);
    }
    setLoading(false);
  };

  const handleFormat = async () => {
    if (!scrapedData || !userPrompt) return;
    setLoading(true);
    const res = await formatScrapedData(scrapedData, userPrompt);
    if (res.success) {
      setFormattedText(res.formatted);
    } else {
      alert("Processing failed: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <UrlInput value={url} onChange={setUrl} />
<div className="relative inline-block">
  {/* Fancy spinner overlay */}
  <FancySpinner loading={loading} />

  {/* Button stays EXACTLY the same */}
  <ScrapeButton onClick={handleScrape} loading={loading} />
</div>
      {scrapedData && (
        <>
          <JsonViewer data={scrapedData} />
          <PromptInput value={userPrompt} onChange={setUserPrompt} />
          <button
            onClick={handleFormat}
            disabled={loading || !userPrompt}
            className="bg-black text-white px-4 py-2 rounded mt-2"
          >
            {loading ? "Processing..." : "Process with Gemini"}
          </button>
        </>
      )}

      {formattedText && (
        <div className="bg-gray-900 text-white p-4 rounded max-h-[500px] overflow-auto">
          <pre>{formattedText}</pre>
        </div>
      )}
    </div>
  );
}
