import { useState } from 'react';
import { Upload } from 'lucide-react';
import DarkVeil from '../components/DarkVeil';

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
      {/* Hero Section with DarkVeil Background */}
      <div className="relative overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="absolute inset-0">
          <DarkVeil
            hueShift={0.8}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-inter font-semibold text-white mb-4">
            Turn screenshots into{' '}
            <span className="font-instrument-serif text-lavender typewriter">events</span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Upload a screenshot and we'll turn it into something actionable.
          </p>
          <p className="text-sm text-white/60 mb-12">
            Screenshots are deleted immediately after processing.
          </p>

          {/* Upload Zone */}
          {!showOptions && (
            <div className="max-w-md mx-auto">
              <label className="block w-full p-8 border-2 border-dashed border-white/40 rounded-lg cursor-pointer hover:border-white/70 transition-colors bg-white/10 backdrop-blur-sm">
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-lavender mb-4" />
                  <p className="text-lg font-medium text-white mb-2">
                    Drop a screenshot here or click to upload
                  </p>
                  <p className="text-sm text-white/60">
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
              <p className="text-lg font-medium text-white mb-4">What would you like to create?</p>
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
