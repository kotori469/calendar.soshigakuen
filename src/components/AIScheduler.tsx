import React, { useState } from 'react';
import { Brain, Calendar, Clock, Target, Lightbulb } from 'lucide-react';
import { AIScheduleRequest, StudyPlan } from '../types';
import { generateAISchedule, getStudyTips } from '../utils/aiScheduler';
import { formatDate, addDays } from '../utils/dateUtils';

interface AISchedulerProps {
  onScheduleGenerated: (plans: StudyPlan[]) => void;
}

export const AIScheduler: React.FC<AISchedulerProps> = ({ onScheduleGenerated }) => {
  const [request, setRequest] = useState<AIScheduleRequest>({
    subject: '',
    totalMinutes: 300,
    startDate: formatDate(new Date()),
    endDate: formatDate(addDays(new Date(), 7)),
    dailyMinutes: 60,
    sessionLength: 25
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<StudyPlan[]>([]);
  const [showTips, setShowTips] = useState(false);

  const handleGenerate = async () => {
    if (!request.subject.trim() || request.totalMinutes <= 0) return;
    
    setIsGenerating(true);
    
    // AIスケジュール生成のシミュレーション
    setTimeout(() => {
      const schedule = generateAISchedule(request);
      setGeneratedSchedule(schedule);
      setIsGenerating(false);
      setShowTips(true);
    }, 1500);
  };

  const handleApplySchedule = () => {
    onScheduleGenerated(generatedSchedule);
    setGeneratedSchedule([]);
    setShowTips(false);
    
    // フォームをリセット
    setRequest({
      subject: '',
      totalMinutes: 300,
      startDate: formatDate(new Date()),
      endDate: formatDate(addDays(new Date(), 7)),
      dailyMinutes: 60,
      sessionLength: 25
    });
  };

  const tips = request.subject ? getStudyTips(request.subject) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">AI学習スケジューラー</h2>
      </div>

      {!generatedSchedule.length ? (
        <div className="space-y-6">
          {/* 基本設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                教科名
              </label>
              <input
                type="text"
                value={request.subject}
                onChange={(e) => setRequest(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="例: 数学、英語、プログラミング"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                合計学習時間（分）
              </label>
              <input
                type="number"
                value={request.totalMinutes}
                onChange={(e) => setRequest(prev => ({ ...prev, totalMinutes: parseInt(e.target.value) || 0 }))}
                min="30"
                max="10000"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* 期間設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日
              </label>
              <input
                type="date"
                value={request.startDate}
                onChange={(e) => setRequest(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日
              </label>
              <input
                type="date"
                value={request.endDate}
                onChange={(e) => setRequest(prev => ({ ...prev, endDate: e.target.value }))}
                min={request.startDate}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* 詳細設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1日の目標時間（分）
              </label>
              <input
                type="number"
                value={request.dailyMinutes}
                onChange={(e) => setRequest(prev => ({ ...prev, dailyMinutes: parseInt(e.target.value) || 60 }))}
                min="15"
                max="480"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1セッションの長さ（分）
              </label>
              <input
                type="number"
                value={request.sessionLength}
                onChange={(e) => setRequest(prev => ({ ...prev, sessionLength: parseInt(e.target.value) || 25 }))}
                min="15"
                max="120"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* 生成ボタン */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !request.subject.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                AIが最適なスケジュールを生成中...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                AIスケジュールを生成
              </>
            )}
          </button>

          {/* 説明 */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              AIスケジューラーの特徴
            </h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• 効率的な学習時間の配分を自動計算</li>
              <li>• ポモドーロテクニックに基づいたセッション分割</li>
              <li>• 週末の学習時間を平日より多めに調整</li>
              <li>• 最適な時間帯に学習セッションを配置</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 生成されたスケジュール */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              生成されたスケジュール
            </h3>
            <div className="text-sm text-green-700">
              <p>合計 {generatedSchedule.length} セッション、{generatedSchedule.reduce((sum, plan) => sum + plan.minutes, 0)} 分の学習プランを生成しました。</p>
            </div>
          </div>

          {/* スケジュール詳細 */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {generatedSchedule.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {new Date(plan.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {plan.startTime} - {plan.endTime} ({plan.minutes}分)
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  {plan.subject}
                </div>
              </div>
            ))}
          </div>

          {/* 学習のコツ */}
          {showTips && tips.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {request.subject}の学習のコツ
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3">
            <button
              onClick={handleApplySchedule}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              スケジュールを適用
            </button>
            <button
              onClick={() => {
                setGeneratedSchedule([]);
                setShowTips(false);
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              やり直し
            </button>
          </div>
        </div>
      )}
    </div>
  );
};