from pydantic import BaseModel

class Product(BaseModel):
    id: int
    name: str
    price: int
    image: str