import { useState } from 'react';
import { addItemToCalendar } from '../lib/api';
import { useItems } from '../context/ItemsContext';
import { CalendarPlus, Check } from 'lucide-react';

const typeColors = {
  event: 'text-lavender',
  note: 'text-soft-pink',
  task: 'text-warm-orange',
};

const typeLabels = {
  event: 'Event',
  note: 'Reminder',
  task: 'Task',
};

export default function ItemRow({ item }) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const { refetch } = useItems();

  const handleAddToCalendar = async () => {
    if (item.addedToCalendar) return;
    setAdding(true);
    setError(null);
    try {
      await addItemToCalendar(item._id);
      refetch();
    } catch (err) {
      if (err.message?.includes('refresh')) {
        window.location.href = '/api/auth/google';
        return;
      }
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-gray-900">{item.title}</h3>
          <p className={`text-sm ${typeColors[item.type] || 'text-gray-500'}`}>
            {typeLabels[item.type] || item.type}
          </p>
          {(item.date || item.time || item.location) && (
            <p className="text-sm text-gray-500 mt-1">
              {[item.date, item.time, item.location].filter(Boolean).join(' · ')}
            </p>
          )}
          {item.description && (
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          )}
        </div>
        <div>
          {item.addedToCalendar ? (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Check className="w-4 h-4" /> Added
            </span>
          ) : (
            <button
              onClick={handleAddToCalendar}
              disabled={adding}
              className="flex items-center gap-1 text-sm text-lavender hover:underline disabled:opacity-50"
            >
              {adding ? 'Adding...' : (
                <>
                  <CalendarPlus className="w-4 h-4" /> Add to Calendar
                </>
              )}
            </button>
          )}
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
