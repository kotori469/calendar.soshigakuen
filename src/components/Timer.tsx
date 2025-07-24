import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer as TimerIcon } from 'lucide-react';
import { Timer as TimerType } from '../types';
import { formatTime } from '../utils/dateUtils';

interface TimerProps {
  onTimerComplete: (subject: string, minutes: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ onTimerComplete }) => {
  const [timer, setTimer] = useState<TimerType | null>(null);
  const [subject, setSubject] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer?.isRunning && timer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (!prev || prev.remainingSeconds <= 1) {
            // Timer completed
            if (prev) {
              onTimerComplete(prev.subject, prev.minutes);
              // Show notification if supported
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`${prev.subject} のタイマーが終了しました！`, {
                  body: 'お疲れ様でした！',
                  icon: '/vite.svg'
                });
              }
            }
            return null;
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer?.isRunning, timer?.remainingSeconds, onTimerComplete]);

  const startTimer = () => {
    if (!subject.trim() || !minutes.trim()) return;
    
    const minutesNum = parseInt(minutes);
    if (isNaN(minutesNum) || minutesNum <= 0) return;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setTimer({
      subject: subject.trim(),
      minutes: minutesNum,
      remainingSeconds: minutesNum * 60,
      isRunning: true
    });
  };

  const pauseTimer = () => {
    setTimer(prev => prev ? { ...prev, isRunning: false } : null);
  };

  const resumeTimer = () => {
    setTimer(prev => prev ? { ...prev, isRunning: true } : null);
  };

  const stopTimer = () => {
    setTimer(null);
  };

  const resetForm = () => {
    setSubject('');
    setMinutes('');
    setTimer(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <TimerIcon className="w-5 h-5 text-orange-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">ポモドーロタイマー</h2>
      </div>

      {!timer ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="timer-subject" className="block text-sm font-medium text-gray-700 mb-2">
              教科名
            </label>
            <input
              type="text"
              id="timer-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="例: 数学、英語"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="timer-minutes" className="block text-sm font-medium text-gray-700 mb-2">
              時間（分）
            </label>
            <input
              type="number"
              id="timer-minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="25"
              min="1"
              max="120"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={startTimer}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            タイマー開始
          </button>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{timer.subject}</h3>
            <div className="text-4xl font-bold text-orange-600 mb-4">
              {formatTime(timer.remainingSeconds)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${((timer.minutes * 60 - timer.remainingSeconds) / (timer.minutes * 60)) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            {timer.isRunning ? (
              <button
                onClick={pauseTimer}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                一時停止
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                再開
              </button>
            )}
            <button
              onClick={stopTimer}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              停止
            </button>
          </div>
        </div>
      )}
    </div>
  );
};