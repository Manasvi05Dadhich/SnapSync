import { useState } from 'react';
import { Upload } from 'lucide-react';

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setShowOptions(true);
    }
  };

  const handleCreate = (type) => {
    // Handle creation logic here
    console.log(`Creating ${type} from ${uploadedFile.name}`);
    setUploadedFile(null);
    setShowOptions(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Aura Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 via-soft-pink/10 to-warm-orange/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-inter font-semibold text-gray-900 mb-4">
            Turn screenshots into{' '}
            <span className="font-instrument-serif text-lavender typewriter">events</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload a screenshot and we'll turn it into something actionable.
          </p>
          <p className="text-sm text-gray-500 mb-12">
            Screenshots are deleted immediately after processing.
          </p>

          {/* Upload Zone */}
          {!showOptions && (
            <div className="max-w-md mx-auto">
              <label className="block w-full p-8 border-2 border-dashed border-lavender rounded-lg cursor-pointer hover:border-lavender/80 transition-colors">
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-lavender mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop a screenshot here or click to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Processed once. Deleted immediately.
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Creation Options */}
          {showOptions && (
            <div className="max-w-md mx-auto">
              <p className="text-lg font-medium text-gray-900 mb-4">What would you like to create?</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleCreate('Event')}
                  className="w-full py-3 px-4 bg-lavender text-gray-900 font-medium rounded-lg hover:bg-lavender/90 transition-colors"
                >
                  Create Event
                </button>
                <button
                  onClick={() => handleCreate('Reminder')}
                  className="w-full py-3 px-4 bg-warm-orange text-gray-900 font-medium rounded-lg hover:bg-warm-orange/90 transition-colors"
                >
                  Create Reminder
                </button>
                <button
                  onClick={() => handleCreate('Task')}
                  className="w-full py-3 px-4 bg-soft-pink text-gray-900 font-medium rounded-lg hover:bg-soft-pink/90 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
