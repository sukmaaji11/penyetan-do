'use client';

type Settings = {
  do_enabled: boolean;
  message: string;
};

type ProductListProps = {
  products: any[];
  settings: Settings;
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductList({ products, settings }: ProductListProps) {
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item,
        ),
      );

      return;
    }

    setCart([
      ...cart,
      {
        ...product,
        qty: 1,
      },
    ]);
  };

  const increaseQty = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item,
      ),
    );
  };

  const decreaseQty = (id: number) => {
    const updated = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty - 1,
            }
          : item,
      )
      .filter((item) => item.qty > 0);

    setCart(updated);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const total = subtotal + shippingCost;

  const makanan = products.filter((item: any) => item.category === 'makanan');

  const additional = products.filter(
    (item: any) => item.category === 'additional',
  );

  const minuman = products.filter((item: any) => item.category === 'minuman');

  const renderCard = (item: any) => (
    <div
      key={item.id}
      className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg duration-300"
    >
      <div className="w-full h-[110px] overflow-hidden">
        <img
          src={'/menu/placeholder.png'}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 duration-500 transition"
        />
      </div>

      <div className="p-3">
        <h2 className="font-semibold text-sm min-h-[40px] leading-5 text-black">
          {item.name}
        </h2>

        <p className="text-red-500 font-bold text-lg mt-1">
          Rp {item.price.toLocaleString('id-ID')}
        </p>

        {cart.find((cartItem) => cartItem.id === item.id) ? (
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => decreaseQty(item.id)}
              className="w-9 h-9 rounded-full bg-red-100 text-red-500 font-bold flex items-center justify-center"
            >
              −
            </button>

            <span className="font-bold text-lg">
              {cart.find((cartItem) => cartItem.id === item.id)?.qty}
            </span>

            <button
              onClick={() => increaseQty(item.id)}
              className="w-9 h-9 rounded-full bg-red-500 text-white font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(item)}
            className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white text-sm font-medium shadow-sm"
          >
            + Tambah
          </button>
        )}
      </div>
    </div>
  );

  async function handleCheckout() {
    if (!customerName || !phone || !address) {
      alert('Lengkapi data terlebih dahulu');
      return;
    }

    try {
      const payload = {
        customer_name: customerName,

        phone: phone,

        address: address,

        total: total,

        notes: notes,

        items: cart.map((item) => ({
          product_id: item.id,

          qty: item.qty,

          price: item.price,
        })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const orderList = cart
        .map((item) => {
          return `• ${item.name} - x${item.qty}`;
        })
        .join('\n');

      const mapsUrl = location
        ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
        : 'Lokasi tidak tersedia';

      const message = `
*PESANAN BARU - PENYETAN KIRANA*
━━━━━━━━━━━━━━
*Customer*
${customerName}

*No HP*
${phone}
━━━━━━━━━━━━━━
*Pesanan*
${cart
  .map(
    (item) =>
      `• ${item.name} x${item.qty}
  Rp ${(item.price * item.qty).toLocaleString('id-ID')}`,
  )
  .join('\n\n')}
━━━━━━━━━━━━━━
*Subtotal*
Rp ${subtotal.toLocaleString('id-ID')}

*Ongkir*
Rp ${shippingCost.toLocaleString('id-ID')}

*Total*
Rp ${total.toLocaleString('id-ID')}
━━━━━━━━━━━━━━
*Alamat*
${address}

${mapsUrl !== 'Lokasi tidak tersedia' ? `📌 Lokasi:\n${mapsUrl}` : ''}
━━━━━━━━━━━━━━
*Catatan*
${notes || '-'}
━━━━━━━━━━━━━━

Mohon segera diproses 🙏
`;

      const ownerPhone = '6289633414555'; // Ganti dengan nomor WhatsApp pemilik

      window.open(
        `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`,
        '_blank',
      );

      alert(`Pesanan berhasil 🔥`);

      setCart([]);

      setCustomerName('');
      setPhone('');
      setAddress('');
      setNotes('');

      setLocation(null);
      setShippingCost(0);
      setShowCheckout(false);
    } catch (error) {
      console.log(error);

      alert('Gagal membuat pesanan');
    }
  }

  async function getLocation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;

      const lng = position.coords.longitude;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shipping/calculate`,
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              lat,
              lng,
            }),
          },
        );

        const data = await res.json();

        setShippingCost(data.shipping);

        setLocation({
          lat,
          lng,
          distance: data.distance,
        });
      } catch (err) {
        console.log(err);

        alert('Gagal mengambil lokasi');
      }
    });
  }

  if (!settings.do_enabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-8">
        <div className="text-7xl mb-5">😔</div>

        <h1 className="text-3xl font-bold text-center">Delivery Order Tutup</h1>

        <p className="text-gray-500 text-center mt-3">{settings.message}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}

      <div className="sticky top-0 bg-white z-50 shadow-sm px-5 py-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 flex items-center justify-center text-lg shadow">
                🍗
              </div>

              <div>
                <h1 className="text-2xl font-bold text-red-500">
                  Penyetan Kirana
                </h1>

                <p className="text-xs text-gray-500">
                  Gurih • Meresap • Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Right action */}
        </div>
      </div>

      {/* Hero */}

      <div className="p-4">
        <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-[35px] p-6 text-white shadow-lg relative overflow-hidden">
          {/* Badge */}

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
            🚀 Delivery Order
          </div>

          {/* Title */}

          <h1 className="text-3xl font-bold leading-tight mt-5">
            Bumbu Meresap,
            <br />
            Gurihnya Bikin Nagih 🤤
          </h1>

          {/* Description */}

          <p className="mt-4 text-sm text-red-100 max-w-[240px] leading-6">
            Pesan menu favoritmu dan kami siap antar langsung ke lokasi kamu
          </p>

          {/* Mini features */}

          <div className="flex gap-2 mt-5 flex-wrap">
            <div className="bg-white/15 px-3 py-2 rounded-full text-xs">
              🔥 Sambal Khas
            </div>
            <div className="bg-white/15 px-3 py-2 rounded-full text-xs">
              🛵 Delivery
            </div>
            <div className="bg-white/15 px-3 py-2 rounded-full text-xs">
              🍗 Gurih
            </div>
          </div>

          {/* Background decoration */}

          <div className="absolute right-[-20px] bottom-[-10px] text-[150px] opacity-10">
            🍗
          </div>
        </div>
      </div>

      {/* MAKANAN */}

      <div className="px-4 mt-8">
        <h2 className="text-xl text-black font-bold mb-4">🍗 Makanan</h2>

        <div className="grid grid-cols-2 gap-4">{makanan.map(renderCard)}</div>
      </div>

      {/* ADDITIONAL */}

      <div className="px-4 mt-8">
        <h2 className="text-xl text-black font-bold mb-4">➕ Additional</h2>

        <div className="grid grid-cols-2 gap-4">
          {additional.map(renderCard)}
        </div>
      </div>

      {/* MINUMAN */}

      <div className="px-4 mt-8">
        <h2 className="text-xl text-black font-bold mb-4">🥤 Minuman</h2>

        <div className="grid grid-cols-2 gap-4">{minuman.map(renderCard)}</div>
      </div>

      <AnimatePresence>
        {showCart && (
          <div
            onClick={() => setShowCart(false)}
            className="fixed inset-0 bg-black/50 flex items-end z-50"
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 300 }}
              dragElastic={0.2}
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 120) {
                  setShowCart(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full rounded-t-[35px] p-5 max-h-[85vh] overflow-auto"
            >
              {/* Drag Handle */}

              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5"></div>

              {/* Header */}

              <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-xl text-black">Keranjang 🛒</h2>
              </div>

              {/* Cart Item */}

              {cart.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-5"
                >
                  <div>
                    <h3 className="font-medium text-black">{item.name}</h3>

                    <p className="text-sm text-gray-500">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </p>

                    <button
                      onClick={() =>
                        setCart(cart.filter((x) => x.id !== item.id))
                      }
                      className="text-xs text-red-400 mt-1"
                    >
                      Hapus
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-500 font-bold flex items-center justify-center"
                    >
                      −
                    </button>

                    <span className="font-bold min-w-[20px] text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <hr className="my-4" />

              {/* Total */}

              <div className="flex justify-between items-center mb-5">
                <span className="font-medium text-black">Subtotal</span>

                <span className="font-bold text-lg text-red-500">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Checkout */}

              <button
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold"
              >
                Checkout 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Bottom Cart */}

      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-3xl shadow-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-black">🛒 Keranjang</h3>

            <p className="text-sm text-gray-500">
              {cart.length} item • Rp {subtotal.toLocaleString('id-ID')}
            </p>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-full"
          >
            Lihat Pesanan
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-[35px] p-5 w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-black">Checkout 🧾</h2>

              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama"
              className="w-full border border-gray-200 rounded-xl p-3 mb-3 text-gray-500"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nomor WhatsApp"
              className="w-full border rounded-xl p-3 mb-3 border-gray-200 text-gray-500"
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap"
              className="w-full border rounded-xl p-3 mb-3 border-gray-200 text-gray-500"
            ></textarea>

            <div className="mb-4">
              <button
                onClick={getLocation}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium"
              >
                📍 Ambil Lokasi Saya
              </button>

              {location && (
                <div className="bg-blue-50 rounded-xl p-3 mt-3">
                  <p className="text-sm text-gray-500">
                    Jarak : <b>{location.distance} km</b>
                  </p>

                  <p className="text-sm text-emerald-500">
                    Ongkir : <b>Rp {shippingCost.toLocaleString('id-ID')}</b>
                  </p>
                </div>
              )}
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan (opsional)"
              className="w-full border rounded-xl p-3 mb-4 border-gray-200 text-gray-500"
            ></textarea>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between mb-2 text-gray-500">
                <span>Subtotal</span>

                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between mb-2 text-gray-500">
                <span>Ongkir</span>

                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg text-gray-500">
                <span>Total</span>

                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-5 py-4 rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold"
            >
              Pesan Sekarang 🚀
            </button>
          </div>
        </div>
      )}
      {/* Footer */}

      <footer className="mt-14 bg-white rounded-t-[35px] px-6 py-8 shadow-inner">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 flex items-center justify-center text-xl">
            🍗
          </div>

          <div>
            <h2 className="font-bold text-lg text-red-500">Penyetan Kirana</h2>

            <p className="text-sm text-gray-500">Gurih • Meresap • Delivery</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>📍</span>

            <span>Banjarnegara, Indonesia</span>
          </div>

          <div className="flex items-center gap-2">
            <span>📞</span>

            <span>0896-3341-4555</span>
          </div>

          <div className="flex items-center gap-2">
            <span>🕒</span>

            <span>Buka 10:00 - 22:00</span>
          </div>
        </div>

        <div className="border-t mt-6 pt-4 text-center">
          <p className="text-xs text-gray-400">
            Dibuat dengan ❤️ untuk pelanggan Penyetan Kirana
          </p>
        </div>
      </footer>
    </div>
  );
}
