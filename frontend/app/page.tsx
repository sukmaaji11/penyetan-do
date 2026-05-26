import ProductList from '@/components/ProductList';
import { API_URL } from '@/lib/api';

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

async function getSettings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch settings');
  }

  return res.json();
}

export default async function Home() {
  const products = await getProducts();
  const settings = await getSettings();
  return (
    <main className="bg-white min-h-screen">
      <ProductList products={products} settings={settings} />
    </main>
  );
}
