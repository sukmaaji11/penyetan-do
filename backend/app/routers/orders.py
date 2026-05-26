from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.schemas.order import OrderCreate
from app.models.order_item import OrderItem
from app.models.product import Product

router = APIRouter()


# Ambil semua order
@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):

    orders = db.query(
        Order
    ).all()

    result = []

    for order in orders:

        items = (
            db.query(
                OrderItem,
                Product
            )
            .join(
                Product,
                Product.id ==
                OrderItem.product_id
            )
            .filter(
                OrderItem.order_id ==
                order.id
            )
            .all()
        )

        order_items = []

        for item,product in items:

            order_items.append({

                "name":
                product.name,

                "qty":
                item.qty,

                "price":
                item.price

            })

        result.append({

            "id":
            order.id,

            "order_number":
            order.order_number,

            "customer_name":
            order.customer_name,

            "total":
            order.total,

            "status":
            order.status,

            "items":
            order_items

        })

    return result

# Buat order
@router.post("/")
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db)
):

    order = Order(
        customer_name=payload.customer_name,
        phone=payload.phone,
        address=payload.address,
        total=payload.total
    )

    db.add(order)
    db.commit()
    db.refresh(order)
    for item in payload.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            qty=item.qty,
            price=item.price
        )

        db.add(order_item)
    db.commit()

    return {
        "message":"Order berhasil dibuat 🔥",
        "order_id": order.id
    }


@router.put("/{order_id}")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    order = db.query(Order)\
        .filter(
            Order.id == order_id
        )\
        .first()

    if not order:
        return {
            "message":"Order tidak ditemukan"
        }

    order.status = status

    db.commit()

    return {
        "message":"Status berhasil diubah"
    }