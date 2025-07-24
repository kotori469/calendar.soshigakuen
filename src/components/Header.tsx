import React from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';

interface HeaderProps {
  totalMinutes: number;
  todayMinutes: number;
}

export const Header: React.FC<HeaderProps> = ({ totalMinutes, todayMinutes }) => {
  const totalHours = Math.floor(totalMinutes / 60);
  const todayHours = Math.floor(todayMinutes / 60);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">学習記録アプリ</h1>
              <p className="text-blue-100 mt-1">あなたの学習を記録・管理しましょう</p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm text-blue-100">今日</span>
              </div>
              <div className="text-2xl font-bold">{todayHours}h {todayMinutes % 60}m</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm text-blue-100">合計</span>
              </div>
              <div className="text-2xl font-bold">{totalHours}h {totalMinutes % 60}m</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};