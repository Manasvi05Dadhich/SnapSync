import Header from '../components/Header';
import RotatingWord from '../components/RotatingWord';
import UploadZone from '../components/UploadZone';
import DarkVeil from '../components/DarkVeil';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header pageTitle="Home" />

      <section className="relative pt-24 pb-20 px-4" style={{ minHeight: '600px' }}>
        {/* DarkVeil Animated Background */}
        <div className="absolute inset-0" style={{ opacity: 0.675 }}>
          <DarkVeil
            hueShift={50}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.4}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Turn screenshots into <RotatingWord />
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Upload a screenshot and we'll turn it into something actionable.
          </p>
          <p className="text-sm text-gray-500 mb-12">
            Screenshots are deleted immediately after processing.
          </p>

          <div className="flex justify-center">
            <UploadZone />
          </div>
        </div>
      </section>
    </div>
  );
}
