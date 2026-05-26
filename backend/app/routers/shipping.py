from fastapi import APIRouter
from pydantic import BaseModel
from math import radians, sin, cos, sqrt, atan2

router = APIRouter()

# Lokasi toko Penyetan Kirana
STORE_LAT = -7.392577051977056
STORE_LNG = 109.69238572820545

class ShippingRequest(BaseModel):
    lat: float
    lng: float


def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    R = 6371

    dlat = radians(lat2-lat1)
    dlon = radians(lon2-lon1)

    a = (
        sin(dlat/2)**2
        +
        cos(radians(lat1))
        *
        cos(radians(lat2))
        *
        sin(dlon/2)**2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1-a)
    )

    return R*c


@router.post("/calculate")
def calculate_shipping(
    payload: ShippingRequest
):

    distance = calculate_distance(
        STORE_LAT,
        STORE_LNG,
        payload.lat,
        payload.lng
    )

    if distance <= 2:
        shipping = 5000

    elif distance <= 5:
        shipping = 8000

    elif distance <= 8:
        shipping = 12000

    else:
        shipping = 15000

    return {
        "distance":
        round(distance,2),

        "shipping":
        shipping
    }