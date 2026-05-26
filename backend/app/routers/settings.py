from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.settings import Settings

router = APIRouter()


@router.get("/settings")

def get_settings(
    db: Session = Depends(get_db)
):

    settings = db.query(
        Settings
    ).first()

    return settings