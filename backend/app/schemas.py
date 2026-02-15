from pydantic import BaseModel, Field
from typing import List, Optional


class ProductVariant(BaseModel):
    price: str
    sku: Optional[str] = None
    inventory_quantity: Optional[int] = 0


class ShopifyImage(BaseModel):
    src: str


class ShopifyProduct(BaseModel):
    title: str
    body_html: str
    vendor: str
    product_type: str
    variants: List[ProductVariant]
    images: List[ShopifyImage]
