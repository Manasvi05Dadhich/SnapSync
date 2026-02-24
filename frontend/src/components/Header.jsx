import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BellRing, CheckSquare, Inbox, FileText, Loader2, LogOut, Calendar, LayoutGrid, User as UserIcon, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useNotifications from '../hooks/useNotifications';
import { API } from '../lib/api';

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
  const { supported, permission, subscribed, loading, subscribe, unsubscribe } = useNotifications();

  const handleNotificationToggle = async () => {
    if (subscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-2 px-6">
      <div className="max-w-4xl mx-auto bg-white/75 backdrop-blur-xl rounded-full px-5 py-2 flex items-center justify-between border border-gray-200/50 shadow-sm">
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

          {/* Notification toggle */}
          {supported && permission !== 'denied' && (
            <button
              onClick={handleNotificationToggle}
              disabled={loading}
              className={`p-1.5 rounded-full transition-all ${subscribed
                ? 'text-lavender bg-lavender-subtle hover:bg-lavender/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={subscribed ? 'Notifications enabled — click to disable' : 'Enable push notifications'}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : subscribed ? (
                <BellRing className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Google Calendar Link - Hybrid Flow */}
          {isCalendarConnected ? (
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all text-xs font-medium"
              title="Open Google Calendar"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Calendar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <a
              href={`${API}/auth/google`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-xs font-medium border border-slate-200/50"
              title="Connect Google Calendar"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Connect Calendar</span>
            </a>
          )}

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-gray-100 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
