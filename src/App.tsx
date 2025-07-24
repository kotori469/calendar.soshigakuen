import React from 'react';
import { useState, useEffect } from 'react';
import { StudyLog, StudyPlan } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';
import { formatDate } from './utils/dateUtils';

function App() {
  const [studyLogs, setStudyLogs] = useLocalStorage<StudyLog[]>('studyLogs', []);
  const [studyPlans, setStudyPlans] = useLocalStorage<StudyPlan[]>('studyPlans', []);
  const [nextId, setNextId] = useLocalStorage<number>('nextId', 1);
  const [nextPlanId, setNextPlanId] = useLocalStorage<number>('nextPlanId', 1);
  const [activeTab, setActiveTab] = useLocalStorage<string>('activeTab', 'add');

  // キーボードショートカット
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case '1':
            setActiveTab('add');
            break;
          case '2':
            setActiveTab('chart');
            break;
          case '3':
            setActiveTab('calendar');
            break;
          case '4':
            setActiveTab('ai-scheduler');
            break;
          case '5':
            setActiveTab('timer');
            break;
          case '6':
            setActiveTab('stopwatch');
            break;
          case '7':
            setActiveTab('logs');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setActiveTab]);

  const addStudyLog = (study: Omit<StudyLog, 'id'>) => {
    const newLog: StudyLog = {
      ...study,
      id: nextId
    };
    setStudyLogs(prev => [...prev, newLog]);
    setNextId(prev => prev + 1);
  };

  const deleteStudyLog = (id: number) => {
    setStudyLogs(prev => prev.filter(log => log.id !== id));
  };

  const addStudyPlan = (plan: Omit<StudyPlan, 'id'>) => {
    const newPlan: StudyPlan = {
      ...plan,
      id: nextPlanId
    };
    setStudyPlans(prev => [...prev, newPlan]);
    setNextPlanId(prev => prev + 1);
  };

  const togglePlanComplete = (id: number) => {
    setStudyPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, completed: !plan.completed } : plan
    ));
  };

  const deletePlan = (id: number) => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const handleScheduleGenerated = (plans: StudyPlan[]) => {
    const plansWithIds = plans.map(plan => ({
      ...plan,
      id: nextPlanId + plans.indexOf(plan)
    }));
    setStudyPlans(prev => [...prev, ...plansWithIds]);
    setNextPlanId(prev => prev + plans.length);
  };

  const handleTimerComplete = (subject: string, minutes: number) => {
    addStudyLog({
      subject,
      minutes,
      date: formatDate(new Date())
    });
  };

  const handleStopwatchComplete = (subject: string, minutes: number) => {
    addStudyLog({
      subject,
      minutes,
      date: formatDate(new Date())
    });
  };

  const today = formatDate(new Date());
  const todayMinutes = studyLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.minutes, 0);
  
  const totalMinutes = studyLogs.reduce((sum, log) => sum + log.minutes, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header totalMinutes={totalMinutes} todayMinutes={todayMinutes} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <TabContent
          activeTab={activeTab}
          studyLogs={studyLogs}
          studyPlans={studyPlans}
          onAddStudy={addStudyLog}
          onDeleteLog={deleteStudyLog}
          onTimerComplete={handleTimerComplete}
          onStopwatchComplete={handleStopwatchComplete}
          onAddPlan={addStudyPlan}
          onToggleComplete={togglePlanComplete}
          onDeletePlan={deletePlan}
          onScheduleGenerated={handleScheduleGenerated}
        />
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>キーボードショートカット: Alt + 1-7 でタブ切り替え</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
