from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product

router = APIRouter()

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    return [
        {
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "image": item.image,
            "category": item.category
        }
        for item in products
    ]