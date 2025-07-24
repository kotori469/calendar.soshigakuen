import React from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { StudyLog } from '../types';

interface StudyLogsProps {
  studyLogs: StudyLog[];
  onDeleteLog: (id: number) => void;
}

export const StudyLogs: React.FC<StudyLogsProps> = ({ studyLogs, onDeleteLog }) => {
  const groupedLogs = studyLogs.reduce((groups, log) => {
    const date = log.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, StudyLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

  if (studyLogs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">学習記録がありません</h3>
        <p className="text-gray-400">最初の学習記録を追加してみましょう！</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">学習記録</h2>
      </div>

      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date} className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              {new Date(date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
              })}
            </h3>
            <div className="space-y-2">
              {groupedLogs[date].map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 rounded">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{log.subject}</span>
                      <span className="text-gray-600 ml-2">{log.minutes}分</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              合計: {groupedLogs[date].reduce((sum, log) => sum + log.minutes, 0)}分
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};