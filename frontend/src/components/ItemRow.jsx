import { useState } from 'react';
import { deleteItem, updateItem, addItemToCalendar } from '../lib/api';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Square, CheckSquare, CalendarPlus } from 'lucide-react';

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
  const { isCalendarConnected } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [addingToCalendar, setAddingToCalendar] = useState(false);
  const [error, setError] = useState(null);
  const { refetch, updateItem: updateItemContext } = useItems(); // Renamed updateItem from context to avoid conflict with imported updateItem

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
      await updateItemContext(item._id, { completed: !item.completed });
      refetch();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddToCalendar = async () => {
    try {
      setAddingToCalendar(true);
      setError(null);
      await addItemToCalendar(item._id);
      // Optional: show success state or toast
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingToCalendar(false);
    }
  };

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
              <span className={`text - xs font - semibold px - 2.5 py - 1 rounded - full bg - slate - 100 ${typeColors[item.type]} `}>
                {typeLabels[item.type] || item.type}
              </span>
            </div>
            <h3 className={`text - base font - semibold text - slate - 900 mb - 1 ${item.completed ? 'line-through text-slate-400' : ''} `}>
              {item.title}
            </h3>
            {(item.date || item.time || item.location) && (
              <p className="text-sm text-slate-600 mt-1.5">
                {[item.date, item.time, item.location].filter(Boolean).join(' · ')}
              </p>
            )}
            {item.description && (
              <p className={`text - sm text - slate - 700 mt - 1.5 leading - relaxed ${item.completed ? 'line-through text-slate-400' : ''} `}>
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.type !== 'task' && item.type !== 'note' && (
            <button
              onClick={handleAddToCalendar}
              disabled={addingToCalendar}
              className={`p - 2 rounded - lg transition - colors ${isCalendarConnected
                ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                : 'text-slate-300 cursor-not-allowed'
                } `}
              title={isCalendarConnected ? "Add to Google Calendar" : "Connect Google Calendar in Header"}
            >
              <CalendarPlus className={`w - 4 h - 4 ${addingToCalendar ? 'animate-spin' : ''} `} />
            </button>
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
