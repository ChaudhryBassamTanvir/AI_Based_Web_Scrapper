import asyncio
import sys
import openai  # or google Gemini API
from typing import Any

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.scraper import scrape_website
from app.gemini_client import call_gemini
import asyncio
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScrapeRequest(BaseModel):
    url: str

@app.post("/scrape")
async def scrape_endpoint(request: ScrapeRequest):
    try:
        data = await scrape_website(request.url)
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}


class FormatRequest(BaseModel):
    data: Any
    format_type: str
    
@app.post("/format")
async def format_endpoint(req: FormatRequest):
    try:
        print("🔥 Format request received")
        print("Data size:", len(str(req.data)))

        content = str(req.data)
        user_prompt = f"{req.data}\n\nConvert this into {req.format_type} format."

        print("🚀 Calling Gemini...")
        formatted_result = await call_gemini(user_prompt)
        print("✅ Gemini returned")

        return {"success": True, "formatted": formatted_result}

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"success": False, "error": str(e)}
