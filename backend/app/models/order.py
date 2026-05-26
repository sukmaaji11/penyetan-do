from sqlalchemy import Column,Integer,String
from app.models.base import Base

class Order(Base):

    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_name = Column(
        String
    )

    phone = Column(
        String
    )

    address = Column(
        String
    )

    total = Column(
        Integer
    )

    status = Column(
        String,
        default="Pending"
    )

    latitude = Column(
        String
    )
    
    longitude = Column(
        String
    )