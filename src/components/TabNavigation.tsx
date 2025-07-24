import React from 'react';
import { BookOpen, BarChart3, Timer, Watch, Calendar, Brain } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'add', label: '記録追加', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'chart', label: 'グラフ', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'calendar', label: 'カレンダー', icon: <Calendar className="w-4 h-4" /> },
  { id: 'ai-scheduler', label: 'AI予定', icon: <Brain className="w-4 h-4" /> },
  { id: 'timer', label: 'タイマー', icon: <Timer className="w-4 h-4" /> },
  { id: 'stopwatch', label: 'ストップウォッチ', icon: <Watch className="w-4 h-4" /> },
  { id: 'logs', label: '学習記録', icon: <BookOpen className="w-4 h-4" /> },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8">
      <nav className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};