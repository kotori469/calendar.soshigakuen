import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle, Circle } from 'lucide-react';
import { StudyPlan, StudyLog } from '../types';
import { formatDate, getMonthDays, isSameDay, addDays } from '../utils/dateUtils';

interface CalendarProps {
  studyPlans: StudyPlan[];
  studyLogs: StudyLog[];
  onAddPlan: (plan: Omit<StudyPlan, 'id'>) => void;
  onToggleComplete: (id: number) => void;
  onDeletePlan: (id: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  studyPlans,
  studyLogs,
  onAddPlan,
  onToggleComplete,
  onDeletePlan
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    subject: '',
    startTime: '09:00',
    endTime: '10:00',
    minutes: 60
  });

  const monthDays = getMonthDays(currentDate);
  const today = new Date();

  const getDayPlans = (date: Date) => {
    const dateString = formatDate(date);
    return studyPlans.filter(plan => plan.date === dateString);
  };

  const getDayLogs = (date: Date) => {
    const dateString = formatDate(date);
    return studyLogs.filter(log => log.date === dateString);
  };

  const getTotalMinutes = (date: Date) => {
    const plans = getDayPlans(date);
    const logs = getDayLogs(date);
    const planMinutes = plans.reduce((sum, plan) => sum + plan.minutes, 0);
    const logMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
    return planMinutes + logMinutes;
  };

  const handleAddPlan = () => {
    if (!selectedDate || !newPlan.subject.trim()) return;

    const startTime = new Date(`2000-01-01T${newPlan.startTime}:00`);
    const endTime = new Date(`2000-01-01T${newPlan.endTime}:00`);
    const minutes = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)));

    onAddPlan({
      subject: newPlan.subject.trim(),
      date: formatDate(selectedDate),
      startTime: newPlan.startTime,
      endTime: newPlan.endTime,
      minutes,
      completed: false,
      type: 'planned'
    });

    setNewPlan({ subject: '', startTime: '09:00', endTime: '10:00', minutes: 60 });
    setShowAddForm(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">学習カレンダー</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h3 className="text-lg font-medium text-gray-800">
            {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {monthDays.map(date => {
          const dayPlans = getDayPlans(date);
          const totalMinutes = getTotalMinutes(date);
          const isToday = isSameDay(date, today);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          
          return (
            <div
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`
                p-2 min-h-[80px] border rounded-lg cursor-pointer transition-all duration-200 
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'}
                ${isSelected ? 'ring-2 ring-indigo-500' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-blue-600' : 
                  !isCurrentMonth ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  {date.getDate()}
                </span>
                {totalMinutes > 0 && (
                  <span className="text-xs bg-green-100 text-green-600 px-1 rounded">
                    {totalMinutes}分
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayPlans.slice(0, 2).map(plan => (
                  <div
                    key={plan.id}
                    className={`text-xs p-1 rounded truncate ${
                      plan.completed 
                        ? 'bg-green-100 text-green-700 line-through' 
                        : plan.type === 'ai-generated'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {plan.startTime} {plan.subject}
                  </div>
                ))}
                {dayPlans.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayPlans.length - 2}件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 選択日の詳細 */}
      {selectedDate && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedDate.toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              予定追加
            </button>
          </div>

          {/* 予定追加フォーム */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="教科名"
                  value={newPlan.subject}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, subject: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={newPlan.startTime}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, startTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={newPlan.endTime}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, endTime: e.target.value }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddPlan}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  追加
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* 予定一覧 */}
          <div className="space-y-2">
            {getDayPlans(selectedDate).map(plan => (
              <div
                key={plan.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  plan.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleComplete(plan.id)}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {plan.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <div className={`font-medium ${plan.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {plan.subject}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {plan.startTime} - {plan.endTime} ({plan.minutes}分)
                      {plan.type === 'ai-generated' && (
                        <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                          AI生成
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                >
                  ×
                </button>
              </div>
            ))}
            
            {getDayLogs(selectedDate).map(log => (
              <div key={`log-${log.id}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">{log.subject}</div>
                  <div className="text-sm text-gray-500">完了済み - {log.minutes}分</div>
                </div>
              </div>
            ))}
            
            {getDayPlans(selectedDate).length === 0 && getDayLogs(selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                この日の予定はありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};