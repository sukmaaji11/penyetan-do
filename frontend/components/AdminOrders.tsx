'use client';

import { useState } from 'react';

export default function AdminOrders({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  async function updateStatus(orderId: number, status: string) {
    await fetch(`http://127.0.0.1:8000/orders/${orderId}?status=${status}`, {
      method: 'PUT',
    });

    setOrders(
      orders.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
  }

  function notifyCustomer(item: any) {
    const message = `
    Halo ${item.customer_name} 
    Pesanan kamu:
    ${item.order_number || item.id}
    =========================
    Status saat ini: ${item.status}
    =========================
    Terima kasih 🙏`;
    window.open(
      `https://wa.me/${item.phone}?text=${encodeURIComponent(message)}`,
    );
  }

  return (
    <table className="w-full border">
      <thead>
        <tr className="border">
          <th>ID</th>
          <th>Nama</th>
          <th>Total</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((item) => (
          <tr key={item.id} className="border">
            <td>{item.id}</td>
            <td>{item.customer_name}</td>
            <td>
              {' '}
              <div className="space-y-1">
                {item.items?.map((food: any, index: number) => (
                  <div key={index} className="text-sm">
                    🍗 {food.name} x{food.qty}
                  </div>
                ))}
              </div>
            </td>
            <td>Rp {item.total.toLocaleString('id-ID')}</td>
            <td>
              <select
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value)}
                className="border rounded p-2"
              >
                <option>Pending</option>
                <option>Diproses</option>
                <option>Dikirim</option>
                <option>Selesai</option>
              </select>
            </td>
            <td>
              <button
                onClick={() => notifyCustomer(item)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                WA Customer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
