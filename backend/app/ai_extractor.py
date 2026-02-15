import google.genai as genai  # replace generativeai
from app.schemas import ShopifyProduct
from app.config import GEMINI_API_KEY
import json

genai.configure(api_key=GEMINI_API_KEY)

model = genai.configure("gemini-3-flash-preview")


async def extract_product_data(html: str) -> dict:
    prompt = f"""
Extract product data from the following HTML and return ONLY valid JSON.

Schema:
{ShopifyProduct.model_json_schema()}

Rules:
- Do not include explanations
- Return strictly valid JSON
- Fill missing fields with empty string or empty list

HTML:
{html[:20000]}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown if Gemini adds ```json
    if text.startswith("```"):
        text = text.split("```")[1]

    data = json.loads(text)

    validated = ShopifyProduct(**data)

    return validated.model_dump()
