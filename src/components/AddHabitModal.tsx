import { X } from 'lucide-react';
import { useState } from 'react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
}

const COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[3]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedColor);
      setName('');
      setSelectedColor(COLORS[3]);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Habit
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5 sm:mb-6">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2.5 sm:mb-3">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Drink water, Exercise, Read..."
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base sm:text-lg"
              autoFocus
            />
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">
              Choose Color
            </label>
            <div className="grid grid-cols-8 gap-2.5 sm:gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl transition-all active:scale-90 touch-manipulation ${
                    selectedColor === color
                      ? 'ring-4 ring-offset-2 ring-indigo-300 scale-110 shadow-lg'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:bg-gray-100 font-semibold transition-all active:scale-95 text-base sm:text-lg touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-200/50 text-base sm:text-lg touch-manipulation"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
