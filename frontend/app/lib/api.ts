export async function scrapeWebsite(url: string) {
  const res = await fetch("http://localhost:8000/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return await res.json();
}

export async function formatScrapedData(data: any, formatType?: string) {
  const payload: any = { data };
  if (formatType && formatType.trim() !== "") {
    payload.format_type = formatType.trim();
  }

  const res = await fetch("http://localhost:8000/format", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return await res.json();
}
