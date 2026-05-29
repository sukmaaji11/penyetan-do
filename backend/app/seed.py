from app.database import SessionLocal
from app.models.product import Product
from app.models.settings import Settings

db = SessionLocal()

# ==================================
# Hapus data lama
# ==================================

db.query(Product).delete()
db.query(Settings).delete()

# ==================================
# Settings Delivery Order
# ==================================

settings = Settings(
    do_enabled=True,
    message="Delivery Order tersedia 🚀"
)

db.add(settings)

# ==================================
# Product Data
# ==================================

products = [

    # ==========================
    # MENU UTAMA
    # ==========================

    Product(
        name="Ayam Goreng",
        price=14000,
        category="makanan",
        image="/menu/ayam-goreng.png"
    ),

    Product(
        name="Lele Goreng",
        price=10000,
        category="makanan",
        image="/menu/lele-goreng.png"
    ),

    Product(
        name="Kepala Goreng",
        price=5000,
        category="makanan",
        image="/menu/kepala-goreng.png"
    ),

    Product(
        name="Rempela Goreng",
        price=8000,
        category="makanan",
        image="/menu/rempela-goreng.png"
    ),

    Product(
        name="Ayam Puyuh Goreng",
        price=12000,
        category="makanan",
        image="/menu/ayam-puyuh-goreng.png"
    ),

    Product(
        name="Telur Goreng",
        price=6000,
        category="makanan",
        image="/menu/telur-goreng.png"
    ),

    # ==========================
    # TAMBAHAN
    # ==========================

    Product(
        name="Tahu Goreng",
        price=1500,
        category="additional",
        image="/menu/tahu-goreng.png"
    ),

    Product(
        name="Tempe Goreng",
        price=1500,
        category="additional",
        image="/menu/tempe-goreng.png"
    ),

    Product(
        name="Usus Goreng",
        price=4000,
        category="additional",
        image="/menu/usus-goreng.png"
    ),

    Product(
        name="Nasi Putih",
        price=3000,
        category="additional",
        image="/menu/nasi-putih.png"
    ),

    # ==========================
    # MINUMAN
    # ==========================

    Product(
        name="Es Teh",
        price=4000,
        category="minuman",
        image="/menu/placeholder.jpg"
    ),

    Product(
        name="Teh Manis",
        price=4000,
        category="minuman",
        image="/menu/placeholder.jpg"
    ),

    Product(
        name="Teh Tawar",
        price=2000,
        category="minuman",
        image="/menu/placeholder.jpg"
    ),

    Product(
        name="Es Jeruk",
        price=6000,
        category="minuman",
        image="/menu/placeholder.jpg"
    ),

    Product(
        name="Jeruk Panas",
        price=6000,
        category="minuman",
        image="/menu/placeholder.jpg"
    ),

    Product(
        name="Air Es",
        price=1000,
        category="minuman",
        image="/menu/placeholder.jpg"
    )

]

# ==================================
# Insert Product
# ==================================

db.add_all(products)

db.commit()

print("✅ Seed berhasil")
print(f"🍗 Product : {len(products)}")
print("⚙️ Delivery Order aktif")