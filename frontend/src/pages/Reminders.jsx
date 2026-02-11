import { Bell } from 'lucide-react';

const Reminders = () => {

  const reminders = [
    { id: 1, title: 'Call dentist', date: '2023-10-15 09:00' },
    { id: 2, title: 'Buy groceries', date: '2023-10-16 18:00' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 mb-8">
          <Bell size={24} className="text-warm-orange" />
          <h1 className="text-2xl font-semibold text-gray-900">Reminders</h1>
        </div>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{reminder.title}</h3>
                <p className="text-sm text-gray-500">{reminder.date}</p>
              </div>
              <button className="text-warm-orange hover:text-warm-orange/80 text-sm font-medium">
                Add to Google Calendar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
