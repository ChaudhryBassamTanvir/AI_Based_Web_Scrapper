import asyncio
import sys
from typing import Any, Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request

import os
from dotenv import load_dotenv
load_dotenv()

PORT = int(os.environ.get("PORT", 8000))  # default to 8000 if not set

if __name__ == "__main__":
    import uvicorn
    PORT = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)


if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.scraper import scrape_website
from app.gemini_client import call_gemini
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-based-web-scrapper.vercel.app"],
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
@limiter.limit("5/minute")
async def scrape_endpoint(request: Request, payload: ScrapeRequest):
    try:
        data = await scrape_website(payload.url)
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/format")
@limiter.limit("3/minute")
async def format_endpoint(request: Request, req: FormatRequest):
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


@app.get("/")
def health():
    return {"status": "Backend live 🚀"}

@app.get("/test")
def test():
    return {"message": "Hello from FastAPI"}


