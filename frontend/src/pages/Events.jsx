import { Calendar } from 'lucide-react';

const Events = () => {
  // Mock data
  const events = [
    { id: 1, title: 'Team Standup', date: '2023-10-15 09:00', synced: true },
    { id: 2, title: 'Client Meeting', date: '2023-10-16 14:00', synced: false },
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Calendar size={24} className="text-lavender" />
            <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          </div>
          <button className="bg-lavender text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-lavender/90 transition-colors">
            Add to Google Calendar
          </button>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
              <span className={`text-sm font-medium ${event.synced ? 'text-green-600' : 'text-gray-500'}`}>
                {event.synced ? 'Synced ✔' : 'Not Synced'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
