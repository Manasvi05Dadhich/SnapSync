import { useState } from 'react';
import { addItemToCalendar, deleteItem } from '../lib/api';
import { useItems } from '../context/ItemsContext';
import { CalendarPlus, Check, Trash2 } from 'lucide-react';

const typeColors = {
  event: 'text-slate-700',
  note: 'text-slate-700',
  task: 'text-slate-700',
  reminder: 'text-slate-700',
};

const typeLabels = {
  event: 'Event',
  note: 'Note',
  task: 'Task',
  reminder: 'Reminder',
};

export default function ItemRow({ item }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteItem(item._id);
      refetch();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 ${typeColors[item.type]}`}>
              {typeLabels[item.type] || item.type}
            </span>
          </div>
          <h3 className="font-medium text-slate-900">{item.title}</h3>
          {(item.date || item.time || item.location) && (
            <p className="text-sm text-slate-500 mt-1">
              {[item.date, item.time, item.location].filter(Boolean).join(' · ')}
            </p>
          )}
          {item.description && (
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.addedToCalendar ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="w-3.5 h-3.5" /> Added
            </span>
          ) : (
            <button
              onClick={handleAddToCalendar}
              disabled={adding}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-50 transition-colors"
            >
              {adding ? 'Adding...' : (
                <>
                  <CalendarPlus className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
