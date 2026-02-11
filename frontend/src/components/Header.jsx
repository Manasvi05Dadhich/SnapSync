import { Link, useLocation } from 'react-router-dom';
import { Calendar, Bell, CheckSquare, Inbox, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { path: '/bucket', label: 'Bucket', icon: Inbox },
  { path: '/notes', label: 'Notes', icon: FileText },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/reminders', label: 'Reminders', icon: Bell },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export default function Header({ pageTitle, action }) {
  const { logout, isCalendarConnected } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-2 px-6">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-full px-5 py-1.5 flex items-center justify-between border border-white/20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-base font-display font-semibold text-slate-900">SnapSync</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/bucket"
            className={`text-sm font-medium transition-colors ${location.pathname === '/bucket'
                ? 'text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Bucket
          </Link>

          {isCalendarConnected ? (
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              title="Open Google Calendar"
            >
              Calendar
            </a>
          ) : (
            <a
              href="/api/auth/google"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              title="Connect Google Calendar"
            >
              Calendar
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
