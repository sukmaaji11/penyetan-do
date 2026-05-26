from sqlalchemy import Column, Integer, Boolean, String
from app.models.base import Base


class Settings(Base):

    __tablename__ = "settings"

    id = Column(
        Integer,
        primary_key=True
    )

    do_enabled = Column(
        Boolean,
        default=True
    )

    message = Column(
        String
    )