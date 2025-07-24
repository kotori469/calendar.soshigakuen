import React from 'react';
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';
import { StudyLog } from '../types';
import { getDateRange, formatPeriodLabel } from '../utils/dateUtils';

interface StudyChartProps {
  studyLogs: StudyLog[];
}

export const StudyChart: React.FC<StudyChartProps> = ({ studyLogs }) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<'day' | 'week' | 'month'>('week');
  
  const dateRange = getDateRange(selectedPeriod);
  
  const chartData = dateRange.map(date => {
    let total = 0;
    
    if (selectedPeriod === 'day') {
      // 時間別の集計
      const hour = new Date(date).getHours();
      const dayDate = date.split('T')[0];
      total = studyLogs
        .filter(log => {
          const logDate = new Date(log.date + 'T00:00:00');
          return log.date === dayDate && logDate.getHours() === hour;
        })
        .reduce((sum, log) => sum + log.minutes, 0);
    } else {
      // 日別の集計
      total = studyLogs
        .filter(log => log.date === date)
        .reduce((sum, log) => sum + log.minutes, 0);
    }
    
    return { date, minutes: total };
  });

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60);
  
  const totalMinutes = chartData.reduce((sum, d) => sum + d.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / chartData.length);
  
  const periodLabels = {
    day: '今日（時間別）',
    week: '過去7日間',
    month: '過去30日間'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">学習時間グラフ</h2>
      </div>
      
      {/* 期間選択 */}
      <div className="flex gap-2 mb-6">
        {(['day', 'week', 'month'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              selectedPeriod === period
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {period === 'day' && <Clock className="w-4 h-4" />}
            {period === 'week' && <Calendar className="w-4 h-4" />}
            {period === 'month' && <TrendingUp className="w-4 h-4" />}
            {periodLabels[period]}
          </button>
        ))}
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">合計時間</div>
          <div className="text-2xl font-bold text-blue-800">{totalMinutes}分</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">平均時間</div>
          <div className="text-2xl font-bold text-green-800">{averageMinutes}分</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium">最大時間</div>
          <div className="text-2xl font-bold text-purple-800">{Math.max(...chartData.map(d => d.minutes))}分</div>
        </div>
      </div>

      {/* グラフ */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {chartData.map(({ date, minutes }) => (
          <div key={date} className="flex items-center gap-4">
            <div className="w-20 text-sm text-gray-600 font-medium">
              {formatPeriodLabel(date, selectedPeriod)}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                style={{ width: `${(minutes / maxMinutes) * 100}%` }}
              >
                {minutes > 0 && (
                  <span className="text-white text-xs font-medium">
                    {minutes}分
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};