import httpx
from bs4 import BeautifulSoup

import httpx
from bs4 import BeautifulSoup

async def scrape_website(url: str):
    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            response = await client.get(url)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove scripts/styles
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        data = {
            "url": url,
            "title": soup.title.string.strip() if soup.title else "",
            "meta_description": "",
            "headings": [],
            "paragraphs": [],
            "links": [],
            "lists": []
        }

        # Meta description
        meta = soup.find("meta", attrs={"name": "description"})
        if meta and meta.get("content"):
            data["meta_description"] = meta["content"]

        # Headings
        for tag in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
            data["headings"].append(tag.get_text(strip=True))

        # Paragraphs
        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if text:
                data["paragraphs"].append(text)

        # Links
        for a in soup.find_all("a", href=True):
            data["links"].append(a["href"])

        # Lists
        for ul in soup.find_all(["ul", "ol"]):
            items = [li.get_text(strip=True) for li in ul.find_all("li")]
            if items:
                data["lists"].append(items)

        return {"success": True, "data": data}

    except Exception as e:
        return {"success": False, "error": str(e)}
