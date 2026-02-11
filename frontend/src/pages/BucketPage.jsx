import Header from '../components/Header';
import ItemRow from '../components/ItemRow';
import { useItems } from '../context/ItemsContext';

export default function BucketPage() {
  const { items, loading } = useItems();

  return (
    <div className="min-h-screen bg-cream">
      <Header pageTitle="Your bucket" />
      <main className="pt-20 px-4 pb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your bucket</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No items yet. Upload a screenshot from the home page.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item._id} className="px-4">
                <ItemRow item={item} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
