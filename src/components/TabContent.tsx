import React from 'react';
import { StudyLog, StudyPlan } from '../types';
import { StudyForm } from './StudyForm';
import { StudyChart } from './StudyChart';
import { StudyLogs } from './StudyLogs';
import { Timer } from './Timer';
import { Stopwatch } from './Stopwatch';
import { Calendar } from './Calendar';
import { AIScheduler } from './AIScheduler';

interface TabContentProps {
  activeTab: string;
  studyLogs: StudyLog[];
  studyPlans: StudyPlan[];
  onAddStudy: (study: Omit<StudyLog, 'id'>) => void;
  onDeleteLog: (id: number) => void;
  onTimerComplete: (subject: string, minutes: number) => void;
  onStopwatchComplete: (subject: string, minutes: number) => void;
  onAddPlan: (plan: Omit<StudyPlan, 'id'>) => void;
  onToggleComplete: (id: number) => void;
  onDeletePlan: (id: number) => void;
  onScheduleGenerated: (plans: StudyPlan[]) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  studyLogs,
  studyPlans,
  onAddStudy,
  onDeleteLog,
  onTimerComplete,
  onStopwatchComplete,
  onAddPlan,
  onToggleComplete,
  onDeletePlan,
  onScheduleGenerated,
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return (
          <div className="max-w-2xl mx-auto">
            <StudyForm onAddStudy={onAddStudy} />
          </div>
        );
      case 'chart':
        return (
          <div className="max-w-4xl mx-auto">
            <StudyChart studyLogs={studyLogs} />
          </div>
        );
      case 'calendar':
        return (
          <div className="max-w-6xl mx-auto">
            <Calendar 
              studyPlans={studyPlans}
              studyLogs={studyLogs}
              onAddPlan={onAddPlan}
              onToggleComplete={onToggleComplete}
              onDeletePlan={onDeletePlan}
            />
          </div>
        );
      case 'ai-scheduler':
        return (
          <div className="max-w-4xl mx-auto">
            <AIScheduler onScheduleGenerated={onScheduleGenerated} />
          </div>
        );
      case 'timer':
        return (
          <div className="max-w-2xl mx-auto">
            <Timer onTimerComplete={onTimerComplete} />
          </div>
        );
      case 'stopwatch':
        return (
          <div className="max-w-2xl mx-auto">
            <Stopwatch onStopwatchComplete={onStopwatchComplete} />
          </div>
        );
      case 'logs':
        return (
          <div className="max-w-4xl mx-auto">
            <StudyLogs studyLogs={studyLogs} onDeleteLog={onDeleteLog} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fadeIn">
      {renderContent()}
    </div>
  );
};