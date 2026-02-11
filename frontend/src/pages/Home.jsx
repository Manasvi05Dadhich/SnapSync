import { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import DarkVeil from '../components/DarkVeil';
import RotatingWord from '../components/RotatingWord';

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
    console.log(`Creating ${type} from ${uploadedFile.name}`);
    setUploadedFile(null);
    setShowOptions(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <DarkVeil
            hueShift={0.8}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={1}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center w-full">
          {/* Hero Headline */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold text-white mb-6 leading-[1.1] tracking-tight">
              <span className="block text-white/90 text-3xl md:text-4xl lg:text-5xl font-sans font-light mb-4">
                Turn screenshots into
              </span>
              <RotatingWord />
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
              Upload a screenshot and we'll instantly turn it into something actionable.
            </p>
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-16">
            <Sparkles size={14} />
            <span>Processed instantly • Deleted immediately • Privacy first</span>
          </div>

          {/* Upload Zone */}
          {!showOptions && (
            <div className="max-w-xl mx-auto">
              <label className="group block w-full p-12 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-white/60 transition-all bg-white/5 backdrop-blur-sm hover:bg-white/10">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-white" />
                  </div>
                  <p className="text-xl font-medium text-white mb-2">
                    Drop a screenshot here
                  </p>
                  <p className="text-sm text-white/60">
                    or <span className="text-white/90 underline">click to browse</span>
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

          {/* Action Options */}
          {showOptions && (
            <div className="max-w-xl mx-auto">
              <p className="text-lg font-medium text-white mb-6">
                What would you like to create?
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleCreate('Event')}
                  className="w-full py-4 px-6 bg-white text-slate-900 font-medium rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  📅 Create Event
                </button>
                <button
                  onClick={() => handleCreate('Reminder')}
                  className="w-full py-4 px-6 bg-white text-slate-900 font-medium rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  ⏰ Create Reminder
                </button>
                <button
                  onClick={() => handleCreate('Task')}
                  className="w-full py-4 px-6 bg-white text-slate-900 font-medium rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  ✓ Create Task
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
