const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BASE_URL = "https://railway.com/project/26ec6265-cf89-45c7-8d08-618f6606b596?environmentId=ebc801e4-0128-410d-ba96-9ec58c45a2b7";

export async function scrapeWebsite(url: string) {
  const res = await fetch(`${BASE_URL}/scrape`, {
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

  const res = await fetch(`${BASE_URL}/format`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return await res.json();
}