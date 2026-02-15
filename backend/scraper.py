# scraper.py
import asyncio
import json
from urllib.parse import urlparse, urljoin
from playwright.async_api import async_playwright

# Maximum depth to crawl
MAX_DEPTH = 2

# To keep track of visited URLs per request
visited_urls = set()


async def scrape_page(page, url):
    """Scrape title, headings, paragraphs, images, and links from a page."""
    await page.goto(url, timeout=120000)  # 2-minute timeout
    title = await page.title()
    body_html = await page.content()

    # Extract images
    image_elements = await page.query_selector_all("img")
    images = []
    for img in image_elements:
        src = await img.get_attribute("src")
        if src:
            images.append({"src": urljoin(url, src)})

    # Extract headings
    headings = await page.eval_on_selector_all("h1, h2, h3", "els => els.map(e => e.innerText)")

    # Extract paragraphs
    paragraphs = await page.eval_on_selector_all("p", "els => els.map(e => e.innerText)")

    # Extract links with text
    link_elements = await page.query_selector_all("a")
    links = []
    domain = urlparse(url).netloc
    for link in link_elements:
        href = await link.get_attribute("href")
        text = await link.inner_text()
        if href:
            full_url = urljoin(url, href)
            links.append({"url": full_url, "text": text})
    
    return {
        "url": url,
        "title": title,
        "headings": headings,
        "paragraphs": paragraphs,
        "images": images,
        "links": links,
        "vendor": domain,
        "product_type": "Page"
    }


async def crawl(url, page, depth=0, results=None):
    """Recursively crawl pages up to MAX_DEPTH."""
    if results is None:
        results = []

    if url in visited_urls or depth > MAX_DEPTH:
        return results

    visited_urls.add(url)
    print(f"Crawling ({depth}): {url}")

    try:
        page_data = await scrape_page(page, url)
        results.append(page_data)

        # Crawl internal links only
        for link in page_data["links"]:
            link_url = link["url"]
            if urlparse(link_url).netloc == urlparse(url).netloc:
                await asyncio.sleep(1)  # polite delay
                await crawl(link_url, page, depth + 1, results)

    except Exception as e:
        print(f"Failed to scrape {url}: {e}")

    return results


async def run_scraper(start_url):
    """Main entry point for scraping a user-provided URL."""
    global visited_urls
    visited_urls = set()  # reset visited URLs for each request

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        all_results = await crawl(start_url, page)
        await browser.close()
        return all_results


# If running directly for testing
if __name__ == "__main__":
    url = input("Enter the URL to scrape: ").strip()
    if url:
        results = asyncio.run(run_scraper(url))
        with open("scraped_data.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print("Scraping complete! Saved to scraped_data.json")
