import { useState } from 'react';
import Header from '../components/Header';
import ItemRow from '../components/ItemRow';
import { useItems } from '../context/ItemsContext';
import { Inbox, FileText, Calendar, Bell, CheckSquare } from 'lucide-react';

export default function BucketPage() {
  const { items, loading } = useItems();
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.type === filter);

  const counts = {
    all: items.length,
    note: items.filter(i => i.type === 'note').length,
    event: items.filter(i => i.type === 'event').length,
    reminder: items.filter(i => i.type === 'reminder').length,
    task: items.filter(i => i.type === 'task').length,
  };

  const filters = [
    { id: 'all', label: 'All', icon: Inbox, count: counts.all },
    { id: 'note', label: 'Notes', icon: FileText, count: counts.note },
    { id: 'event', label: 'Events', icon: Calendar, count: counts.event },
    { id: 'reminder', label: 'Reminders', icon: Bell, count: counts.reminder },
    { id: 'task', label: 'Tasks', icon: CheckSquare, count: counts.task },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Header pageTitle="Your bucket" />
      <main className="pt-20 px-4 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-semibold text-slate-900 mb-8">Your Bucket</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${filter === id ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Items List */}
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {filter === 'all'
                ? 'No items yet. Upload a screenshot from the home page.'
                : `No ${filter}s found.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
            {filteredItems.map((item) => (
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
