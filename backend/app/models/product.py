from sqlalchemy import Column,Integer,String
from app.models.base import Base


class Product(Base):

    __tablename__="products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String
    )

    price = Column(
        Integer
    )

    image = Column(
        String
    )

    category = Column(
        String
    )