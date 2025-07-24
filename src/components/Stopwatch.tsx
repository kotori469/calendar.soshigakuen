import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Watch as StopwatchIcon } from 'lucide-react';
import { Stopwatch as StopwatchType } from '../types';
import { formatTime } from '../utils/dateUtils';

interface StopwatchProps {
  onStopwatchComplete: (subject: string, minutes: number) => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onStopwatchComplete }) => {
  const [stopwatch, setStopwatch] = useState<StopwatchType | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (stopwatch?.isRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(stopwatch.startTime);
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [stopwatch?.isRunning, stopwatch?.startTime]);

  const startStopwatch = () => {
    if (!subject.trim()) return;

    setStopwatch({
      subject: subject.trim(),
      startTime: new Date().toISOString(),
      isRunning: true
    });
    setElapsedSeconds(0);
  };

  const pauseStopwatch = () => {
    setStopwatch(prev => prev ? { ...prev, isRunning: false } : null);
  };

  const resumeStopwatch = () => {
    if (!stopwatch) return;
    
    // Adjust start time to account for paused duration
    const pausedDuration = elapsedSeconds * 1000;
    const newStartTime = new Date(Date.now() - pausedDuration).toISOString();
    
    setStopwatch({
      ...stopwatch,
      startTime: newStartTime,
      isRunning: true
    });
  };

  const stopStopwatch = () => {
    if (!stopwatch) return;
    
    const minutes = Math.floor(elapsedSeconds / 60);
    if (minutes > 0) {
      onStopwatchComplete(stopwatch.subject, minutes);
    }
    
    setStopwatch(null);
    setElapsedSeconds(0);
    setSubject('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-100 rounded-lg">
          <StopwatchIcon className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">ストップウォッチ</h2>
      </div>

      {!stopwatch ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="stopwatch-subject" className="block text-sm font-medium text-gray-700 mb-2">
              教科名
            </label>
            <input
              type="text"
              id="stopwatch-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="例: 数学、英語"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={startStopwatch}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            ストップウォッチ開始
          </button>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{stopwatch.subject}</h3>
            <div className="text-4xl font-bold text-teal-600 mb-4">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.floor(elapsedSeconds / 60)}分経過
            </div>
          </div>

          <div className="flex gap-3">
            {stopwatch.isRunning ? (
              <button
                onClick={pauseStopwatch}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
                一時停止
              </button>
            ) : (
              <button
                onClick={resumeStopwatch}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                再開
              </button>
            )}
            <button
              onClick={stopStopwatch}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              停止・記録
            </button>
          </div>
        </div>
      )}
    </div>
  );
};