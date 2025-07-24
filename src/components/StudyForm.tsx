import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { StudyLog } from '../types';

interface StudyFormProps {
  onAddStudy: (study: Omit<StudyLog, 'id'>) => void;
}

export const StudyForm: React.FC<StudyFormProps> = ({ onAddStudy }) => {
  const [subject, setSubject] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !minutes.trim()) return;

    const minutesNum = parseInt(minutes);
    if (isNaN(minutesNum) || minutesNum <= 0) return;

    onAddStudy({
      subject: subject.trim(),
      minutes: minutesNum,
      date: new Date().toISOString().split('T')[0]
    });

    setSubject('');
    setMinutes('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">学習記録を追加</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            教科名
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例: 数学、英語、プログラミング"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-2">
            学習時間（分）
          </label>
          <input
            type="number"
            id="minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="60"
            min="1"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          記録を追加
        </button>
      </form>
    </div>
  );
};