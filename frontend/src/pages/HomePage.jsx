import Header from '../components/Header';
import RotatingWord from '../components/RotatingWord';
import UploadZone from '../components/UploadZone';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header pageTitle="Home" />

      <section className="relative pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
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
