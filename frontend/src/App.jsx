import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';
import HomePage from './pages/HomePage';
import BucketPage from './pages/BucketPage';
import NotesPage from './pages/NotesPage';
import EventsPage from './pages/EventsPage';
import RemindersPage from './pages/RemindersPage';
import TasksPage from './pages/TasksPage';

import { useState } from 'react';

function AuthForm() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream px-4">
      <h1 className="text-3xl font-bold text-gray-800">SnapSync</h1>
      <p className="text-gray-600 text-center">
        {isRegister ? 'Create an account' : 'Sign in to get started'}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary text-gray-800"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary text-gray-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary text-gray-800"
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
}

function AppContent() {
  const { user, loading, backendError, retryAuth } = useAuth();
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
  if (!user) {
    return <AuthForm />;
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
