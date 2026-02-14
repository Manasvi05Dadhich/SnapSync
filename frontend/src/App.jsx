import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';
import HomePage from './pages/HomePage';
import BucketPage from './pages/BucketPage';
import NotesPage from './pages/NotesPage';
import EventsPage from './pages/EventsPage';
import RemindersPage from './pages/RemindersPage';
import TasksPage from './pages/TasksPage';

function AppContent() {
  const { loading, backendError, retryAuth } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  if (backendError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-cream px-4">
        <p className="text-gray-700 text-center">
          Can't reach the server. Make sure the backend is running on port 5000.
        </p>
        <button
          onClick={retryAuth}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bucket" element={<BucketPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/reminders" element={<RemindersPage />} />
      <Route path="/tasks" element={<TasksPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ItemsProvider>
          <AppContent />
        </ItemsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

