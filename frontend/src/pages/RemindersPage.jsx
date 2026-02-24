import Header from '../components/Header';
import ItemRow from '../components/ItemRow';
import { useItems } from '../context/ItemsContext';
import { Bell } from 'lucide-react';

export default function RemindersPage() {
  const { items, loading } = useItems();
  const reminders = items.filter((i) => i.type === 'reminder');

  return (
    <div className="min-h-screen bg-cream">
      <Header pageTitle="Reminders" />
      <main className="pt-20 px-4 pb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-soft-pink" /> Reminders
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : reminders.length === 0 ? (
          <p className="text-gray-500">No reminders yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {reminders.map((item) => (
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
