import Header from '../components/Header';
import ItemRow from '../components/ItemRow';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  const { items, loading } = useItems();
  const { isCalendarConnected } = useAuth();
  const tasks = items.filter((i) => i.type === 'task');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        pageTitle="Tasks"
        action={
          isCalendarConnected ? (
            <span className="flex items-center gap-1.5 text-sm text-green-600">Connected ✔</span>
          ) : (
            <a href="/api/auth/google" className="flex items-center gap-1.5 text-sm text-lavender hover:underline">
              Connect Google Calendar
            </a>
          )
        }
      />
      <main className="pt-20 px-4 pb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-warm-orange" /> Tasks
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {tasks.map((item) => (
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
