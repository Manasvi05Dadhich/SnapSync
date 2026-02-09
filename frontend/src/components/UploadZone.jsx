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
      setChoice(null);
      try {
        const data = await uploadImage(file);
        setResult(data);
      } catch (err) {
        setResult({ error: err.message });
      } finally {
        setUploading(false);
      }
    },
    []
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
    <div className="w-full max-w-xl">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-colors
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
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Saved as:</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-lg text-sm bg-lavender-subtle text-lavender">
              {result.data?.type === 'event' && 'Event'}
              {result.data?.type === 'note' && 'Reminder'}
              {result.data?.type === 'task' && 'Task'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-3">Item saved to your bucket.</p>
          <button
            onClick={() => { refetch(); setResult(null); }}
            className="mt-3 text-sm text-lavender font-medium hover:underline"
          >
            Upload another
          </button>
        </div>
      )}
    </div>
  );
}
