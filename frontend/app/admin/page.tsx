import AdminOrders from '@/components/AdminOrders';

async function getOrders() {
  const res = await fetch('http://127.0.0.1:8000/orders', {
    cache: 'no-store',
  });

  return res.json();
}

export default async function Admin() {
  const orders = await getOrders();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Order 📦</h1>

      <AdminOrders initialOrders={orders} />
    </main>
  );
}
