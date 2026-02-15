# backend/run.py
import asyncio
import sys
from uvicorn import run

# MUST BE FIRST
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Run the app WITHOUT reload
if __name__ == "__main__":
    run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,  # important!
        loop="asyncio",
        http="h11"
    )
