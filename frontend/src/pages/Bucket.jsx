const Bucket = () => {
  // Mock data - replace with actual data from backend
  const items = [
    { id: 1, type: 'Event', title: 'Team Meeting', date: '2023-10-15' },
    { id: 2, type: 'Reminder', title: 'Call Mom', date: '2023-10-16' },
    { id: 3, type: 'Task', title: 'Finish report', date: '2023-10-17' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  item.type === 'Event' ? 'bg-lavender text-gray-900' :
                  item.type === 'Reminder' ? 'bg-warm-orange text-gray-900' :
                  'bg-soft-pink text-gray-900'
                }`}>
                  {item.type}
                </span>
                <h3 className="text-lg font-medium text-gray-900 mt-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bucket;
