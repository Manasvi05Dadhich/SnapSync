import { CheckSquare } from 'lucide-react';

const Tasks = () => {
  // Mock data
  const tasks = [
    { id: 1, title: 'Review code changes', completed: false },
    { id: 2, title: 'Update documentation', completed: true },
  ];

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 mb-8">
          <CheckSquare size={24} className="text-soft-pink" />
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        </div>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="w-5 h-5 text-soft-pink border-gray-300 rounded focus:ring-soft-pink"
                />
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
              </div>
              {!task.completed && (
                <button className="text-soft-pink hover:text-soft-pink/80 text-sm font-medium">
                  Add to Google Calendar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
