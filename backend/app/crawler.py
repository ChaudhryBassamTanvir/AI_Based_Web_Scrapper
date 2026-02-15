import asyncio
from urllib.parse import urljoin, urlparse
import httpx
from bs4 import BeautifulSoup

visited = set()
MAX_PAGES = 100  # Limit to avoid crawling entire Internet

async def fetch(url):
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.get(url)
        return r.text

async def extract_links(base_url, html):
    soup = BeautifulSoup(html, "html.parser")
    links = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("/"):
            href = urljoin(base_url, href)
        if urlparse(href).netloc == urlparse(base_url).netloc:
            links.add(href)
    return links

async def scrape_page(url):
    html = await fetch(url)
    soup = BeautifulSoup(html, "html.parser")
    
    # Extract images
    images = [{"src": img["src"]} for img in soup.find_all("img", src=True)]

    # Extract body content
    body_html = str(soup.body) if soup.body else ""

    # Detect product type
    product_type = "Homepage" if url.rstrip("/") == urlparse(url).scheme + "://" + urlparse(url).netloc else "Page"

    product = {
        "title": soup.title.string if soup.title else "No Title",
        "body_html": body_html,
        "vendor": urlparse(url).netloc,
        "product_type": product_type,
        "variants": [],
        "images": images,
        "links": list(await extract_links(url, html))
    }
    return product

async def crawl_site(start_url):
    to_visit = [start_url]
    all_products = []
    while to_visit and len(all_products) < MAX_PAGES:
        url = to_visit.pop(0)
        if url in visited:
            continue
        visited.add(url)
        try:
            product = await scrape_page(url)
            all_products.append(product)
            to_visit.extend([l for l in product["links"] if l not in visited])
        except Exception as e:
            print(f"Failed {url}: {e}")
    return all_products

# Example usage
if __name__ == "__main__":
    start_url = "https://www.bbqguys.com/i/3192992/napoleon/rogue-pro-625-5-burner-natural-gas-grill-stainless-steel"
    products = asyncio.run(crawl_site(start_url))
    import json
    print(json.dumps(products, indent=2))
