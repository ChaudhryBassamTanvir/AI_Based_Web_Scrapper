from fastapi import APIRouter
from fastapi.responses import JSONResponse
from .crawler import crawl_site
import asyncio

router = APIRouter()

@router.post("/scrape-site")
async def scrape_site(url: str):
    try:
        products = await crawl_site(url)
        return JSONResponse(content={"products": products})
    except Exception as e:
        return JSONResponse(content={"detail": str(e)}, status_code=500)
