"use client";

import { useState } from "react";
import UrlInput from "./components/UrlInput";
import ScrapeButton from "./components/ScrapeButton";
import PromptInput from "./components/PromptInput";
import JsonViewer from "./components/JsonViewer";
import { scrapeWebsite, formatScrapedData } from "./lib/api";
import { FancySpinner } from "./components/FancySpinner";
import FormattedOutput from "./components/FormattedOutput";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  const handleScrape = async () => {
    setScrapeLoading(true);
    const res = await scrapeWebsite(url);
    if (res.success) {
      setScrapedData(res.data);
      setFormattedText("");
    } else {
      alert("Scraping failed: " + res.error);
    }
    setScrapeLoading(false);
  };

  // const handleFormat = async () => {
  //   if (!scrapedData || !userPrompt) return;
  //   setProcessLoading(true);
  //   const res = await formatScrapedData(scrapedData, userPrompt);
  //   if (res.success) {
  //     setFormattedText(res.formatted);
  //   } else {
  //     alert("Processing failed: " + res.error);
  //   }
  //   setProcessLoading(false);
  // };
const handleFormat = async () => {
  if (!scrapedData) return; // Only require scrapedData
  setProcessLoading(true);

  const res = await formatScrapedData(scrapedData, userPrompt); // userPrompt can be empty now
  if (res.success) {
    setFormattedText(res.formatted);
  } else {
    alert("Processing failed: " + res.error);
  }
  setProcessLoading(false);
};


  return (
    <div className="p-6 space-y-4">
      <UrlInput value={url} onChange={setUrl} />

      <div className="relative inlock flex justify-center items-center">
        {/* Fancy spinner only for scraping */}
        <FancySpinner loading={scrapeLoading} />

        {/* Scrape button */}
        <ScrapeButton onClick={handleScrape} loading={scrapeLoading} />
      </div>

      {scrapedData && (
        <>
          <JsonViewer data={scrapedData} />
          <PromptInput value={userPrompt} onChange={setUserPrompt} />
<div className="flex justify-center items-center">

      <button
  onClick={handleFormat}
  disabled={processLoading}
  className="bg-black text-white px-4 py-2 rounded mt-2 hover:cursor-pointer"
>
  {processLoading ? "Processing..." : "Process with Gemini"}
</button>
  </div>

        </>
      )}

      {formattedText && <FormattedOutput formattedText={formattedText} />}
    </div>
  );
}
