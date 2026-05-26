from pydantic import BaseModel


class OrderItemCreate(
    BaseModel
):
    product_id:int
    qty:int
    price:int


class OrderCreate(
    BaseModel
):

    customer_name:str
    phone:str
    address:str
    total:int

    items:list[
        OrderItemCreate
    ]