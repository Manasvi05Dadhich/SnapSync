import { useState, useCallback } from 'react';
import { useItems } from '../context/ItemsContext';
import { uploadImage, updateItem } from '../lib/api';
import { Loader2, Pencil, Check } from 'lucide-react';

export default function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState(null);
  const { refetch } = useItems();

  const handleFile = useCallback(
    async (file) => {
      if (!file?.type?.startsWith('image/')) return;
      setUploading(true);
      setResult(null);
      setEditing(false);
      setEditData(null);
      try {
        const data = await uploadImage(file);
        setResult(data);
        // Pre-fill edit form with extracted data
        setEditData({
          title: data.data?.title || '',
          type: data.data?.type || 'note',
          date: data.data?.date || '',
          time: data.data?.time || '',
          location: data.data?.location || '',
          description: data.data?.description || '',
        });
        setEditing(true); // start in edit mode so user can review/fix
        refetch();
      } catch (err) {
        setResult({ error: err.message });
      } finally {
        setUploading(false);
      }
    },
    [refetch]
  );

  const handleSaveEdits = async () => {
    if (!result?.item?._id || !editData) return;
    setSaving(true);
    try {
      await updateItem(result.item._id, editData);
      setEditing(false);
      // Update display result with edited values
      setResult((prev) => ({
        ...prev,
        data: { ...prev.data, ...editData },
      }));
      refetch();
    } catch (err) {
      setResult((prev) => ({ ...prev, error: err.message }));
    } finally {
      setSaving(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const fieldChanged = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-md">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          border-2 border-dashed rounded-xl py-16 px-6 text-center transition-colors
          ${dragging ? 'border-lavender bg-lavender-subtle' : 'border-gray-300 hover:border-lavender'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="upload"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <label htmlFor="upload" className="cursor-pointer block">
          {uploading ? (
            <Loader2 className="w-12 h-12 mx-auto text-lavender animate-spin" />
          ) : (
            <p className="text-gray-600 text-lg">
              Drop a screenshot here or <span className="text-lavender font-medium">click to upload</span>
            </p>
          )}
        </label>
        <p className="text-sm text-gray-500 mt-2">Processed once. Deleted immediately.</p>
      </div>

      {result?.error && (
        <p className="mt-3 text-sm text-red-600">{result.error}</p>
      )}

      {result?.item && !result.error && (
        <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-700">
              {editing ? 'Review & Edit Extracted Data:' : 'Extracted & Saved:'}
            </p>
            <div className="flex items-center gap-2">
              {editing ? (
                <select
                  value={editData?.type || 'note'}
                  onChange={(e) => fieldChanged('type', e.target.value)}
                  className="text-sm px-2.5 py-1 rounded-lg bg-lavender-subtle text-lavender font-medium border-0 focus:ring-2 focus:ring-lavender outline-none"
                >
                  <option value="event">Event</option>
                  <option value="reminder">Reminder</option>
                  <option value="note">Note</option>
                  <option value="task">Task</option>
                </select>
              ) : (
                <span className="px-3 py-1 rounded-lg text-sm bg-lavender-subtle text-lavender font-medium">
                  {result.data?.type === 'event' && 'Event'}
                  {result.data?.type === 'reminder' && 'Reminder'}
                  {result.data?.type === 'note' && 'Note'}
                  {result.data?.type === 'task' && 'Task'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* Title */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Title</p>
              {editing ? (
                <input
                  type="text"
                  value={editData?.title || ''}
                  onChange={(e) => fieldChanged('title', e.target.value)}
                  className="w-full text-base font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-base font-medium text-gray-900">{result.data?.title}</p>
              )}
            </div>

            {/* Date & Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Date <span className="text-gray-400">(YYYY-MM-DD)</span></p>
                {editing ? (
                  <input
                    type="date"
                    value={editData?.date || ''}
                    onChange={(e) => fieldChanged('date', e.target.value)}
                    placeholder="2026-02-14"
                    className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender focus:border-transparent outline-none"
                  />
                ) : (
                  result.data?.date && <p className="text-sm text-gray-700">{result.data.date}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Time <span className="text-gray-400">(HH:MM)</span></p>
                {editing ? (
                  <input
                    type="time"
                    value={editData?.time || ''}
                    onChange={(e) => fieldChanged('time', e.target.value)}
                    placeholder="14:30"
                    className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender focus:border-transparent outline-none"
                  />
                ) : (
                  result.data?.time && <p className="text-sm text-gray-700">{result.data.time}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>
              {editing ? (
                <input
                  type="text"
                  value={editData?.location || ''}
                  onChange={(e) => fieldChanged('location', e.target.value)}
                  placeholder="Add location..."
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender focus:border-transparent outline-none"
                />
              ) : (
                result.data?.location && <p className="text-sm text-gray-700">{result.data.location}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              {editing ? (
                <textarea
                  value={editData?.description || ''}
                  onChange={(e) => fieldChanged('description', e.target.value)}
                  rows={3}
                  placeholder="Add description..."
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lavender focus:border-transparent outline-none resize-none"
                />
              ) : (
                result.data?.description && <p className="text-sm text-gray-700">{result.data.description}</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            {editing ? (
              <button
                onClick={handleSaveEdits}
                disabled={saving}
                className="w-full px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Confirm & Save'}
              </button>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3">Saved to your bucket</p>
                <div className="flex gap-3">
                  <a
                    href="/bucket"
                    className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors text-center"
                  >
                    Go to Bucket
                  </a>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { refetch(); setResult(null); setEditData(null); }}
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Upload Another
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

