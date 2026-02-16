import asyncio
import sys
from typing import Any, Optional

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.scraper import scrape_website
from app.gemini_client import call_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Request Schemas ------------------- #
class ScrapeRequest(BaseModel):
    url: str

class FormatRequest(BaseModel):
    data: Any
    format_type: Optional[str] = None  # optional now

# ------------------- Endpoints ------------------- #
@app.post("/scrape")
async def scrape_endpoint(request: ScrapeRequest):
    try:
        data = await scrape_website(request.url)
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/format")
async def format_endpoint(req: FormatRequest):
    try:
        print("🔥 Format request received")
        print("Data size:", len(str(req.data)))

        # Use default if no format_type provided
        if req.format_type and req.format_type.strip() != "":
            format_type = req.format_type.strip()
            user_prompt = f"{req.data}\n\nConvert this into {format_type} format."
        else:
            # Default Shopify-compatible CSV
            user_prompt = (
                f"{req.data}\n\nConvert this scraped data into a Shopify-compatible CSV format "
                "(columns: Title, Description, Price, SKU, Stock, Image URL)."
            )

        print("🚀 Calling Gemini...")
        formatted_result = await call_gemini(user_prompt)
        print("✅ Gemini returned")

        return {"success": True, "formatted": formatted_result}

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"success": False, "error": str(e)}
