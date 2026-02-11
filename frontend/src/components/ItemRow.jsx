import { useState } from 'react';
import { addItemToCalendar, deleteItem } from '../lib/api';
import { useItems } from '../context/ItemsContext';
import { CalendarPlus, Check, Trash2, Square, CheckSquare } from 'lucide-react';

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
  const { refetch, updateItem } = useItems();

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

  const handleToggleComplete = async () => {
    try {
      await updateItem(item._id, { completed: !item.completed });
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  // Only show calendar button for events and reminders
  const showCalendarButton = item.type === 'event' || item.type === 'reminder';

  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Task checkbox */}
          {item.type === 'task' && (
            <button
              onClick={handleToggleComplete}
              className="mt-1 text-slate-400 hover:text-slate-900 transition-colors"
            >
              {item.completed ? (
                <CheckSquare className="w-5 h-5 text-green-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 ${typeColors[item.type]}`}>
                {typeLabels[item.type] || item.type}
              </span>
            </div>
            <h3 className={`text-base font-semibold text-slate-900 mb-1 ${item.completed ? 'line-through text-slate-400' : ''}`}>
              {item.title}
            </h3>
            {(item.date || item.time || item.location) && (
              <p className="text-sm text-slate-600 mt-1.5">
                {[item.date, item.time, item.location].filter(Boolean).join(' · ')}
              </p>
            )}
            {item.description && (
              <p className={`text-sm text-slate-700 mt-1.5 leading-relaxed ${item.completed ? 'line-through text-slate-400' : ''}`}>
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showCalendarButton && (
            <>
              {item.addedToCalendar ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                  <Check className="w-4 h-4" /> Added
                </span>
              ) : (
                <button
                  onClick={handleAddToCalendar}
                  disabled={adding}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {adding ? 'Adding...' : (
                    <>
                      <CalendarPlus className="w-4 h-4" /> Add
                    </>
                  )}
                </button>
              )}
            </>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-2 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
    </div>
  );
}
