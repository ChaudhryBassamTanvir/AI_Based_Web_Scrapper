const BASE_URL = "https://aibasedwebscrapper-production.up.railway.app";

export async function scrapeWebsite(url: string) {
  const res = await fetch(`${BASE_URL}/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error(`Scrape failed: ${res.statusText}`);
  }

  return await res.json();
}

export async function formatScrapedData(data: any, formatType?: string) {
  const payload: any = { data };
  if (formatType && formatType.trim() !== "") {
    payload.format_type = formatType.trim();
  }

  const res = await fetch(`${BASE_URL}/format`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Format failed: ${res.statusText}`);
  }

  return await res.json();
}
