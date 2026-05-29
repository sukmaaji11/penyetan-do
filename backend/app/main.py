from fastapi import FastAPI
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware

# MODELS
from app.models.base import Base
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.settings import Settings

# ROUTES
from app.routers import products
from app.routers import orders
from app.routers import shipping
from app.routers import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://penyetan-do.bra-dev.com",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    products.router,
    prefix="/products",
    tags=["Products"]
)

app.include_router(
    orders.router,
    prefix="/orders",
    tags=["Orders"]
)

app.include_router(
    shipping.router,
    prefix="/shipping",
    tags=["Shipping"]
)

app.include_router(
    settings.router
)
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {
        "message": "API Running 🔥"
    }