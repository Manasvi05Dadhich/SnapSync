import { Link, useLocation } from 'react-router-dom';
import { Calendar, Bell, CheckSquare, LogOut, Inbox, FileText } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/20">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-800 font-semibold">
          <span className="text-lavender text-xl">◇</span>
          <span>SnapSync</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {nav.slice(1).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-1.5 rounded-md text-sm ${location.pathname === path
                ? 'text-lavender font-medium bg-lavender-subtle'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {Icon && <Icon className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />}
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {action}
          {isCalendarConnected ? (
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-gray-800 rounded-md"
              title="Open Google Calendar"
            >
              <Calendar className="w-5 h-5" />
            </a>
          ) : (
            <a
              href="/api/auth/google"
              className="p-2 text-gray-500 hover:text-gray-800 rounded-md"
              title="Connect Google Calendar"
            >
              <Calendar className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
