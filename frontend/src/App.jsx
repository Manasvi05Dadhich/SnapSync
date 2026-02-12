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
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-gray-500">Loading...</p>
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

