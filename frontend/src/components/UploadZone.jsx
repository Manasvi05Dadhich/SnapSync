import { useState, useCallback } from 'react';
import { useItems } from '../context/ItemsContext';
import { uploadImage } from '../lib/api';
import { Loader2 } from 'lucide-react';

export default function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { refetch } = useItems();

  const handleFile = useCallback(
    async (file) => {
      if (!file?.type?.startsWith('image/')) return;
      setUploading(true);
      setResult(null);
      try {
        const data = await uploadImage(file);
        setResult(data);
        // Automatically refetch items so they show up in Notes/Events/Tasks/Reminders
        refetch();
      } catch (err) {
        setResult({ error: err.message });
      } finally {
        setUploading(false);
      }
    },
    [refetch]
  );

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
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-gray-700">Extracted & Saved:</p>
            <span className="px-3 py-1 rounded-lg text-sm bg-lavender-subtle text-lavender font-medium">
              {result.data?.type === 'event' && 'Event'}
              {result.data?.type === 'note' && 'Reminder'}
              {result.data?.type === 'task' && 'Task'}
            </span>
          </div>

          <div className="space-y-3">
            {result.data?.title && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Title</p>
                <p className="text-base font-medium text-gray-900">{result.data.title}</p>
              </div>
            )}

            {result.data?.description && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{result.data.description}</p>
              </div>
            )}

            {result.data?.date && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm text-gray-700">{new Date(result.data.date).toLocaleString()}</p>
              </div>
            )}

            {result.data?.priority && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Priority</p>
                <p className="text-sm text-gray-700 capitalize">{result.data.priority}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">Saved to your bucket</p>
            <button
              onClick={() => { refetch(); setResult(null); }}
              className="text-sm text-lavender font-medium hover:underline"
            >
              Upload another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
