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
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <span className="text-white text-lg font-bold">S</span>
          </div>
          <span className="text-xl font-display font-semibold text-slate-900">SnapSync</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.slice(1).map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === path
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {action}
          {isCalendarConnected ? (
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Open Google Calendar"
            >
              <Calendar className="w-5 h-5" />
            </a>
          ) : (
            <a
              href="/api/auth/google"
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-sm font-medium hover:bg-accent-primary/90 transition-colors shadow-sm"
              title="Connect Google Calendar"
            >
              <Calendar size={16} />
              <span>Connect</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
