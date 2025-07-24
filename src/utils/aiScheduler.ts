import { StudyPlan, AIScheduleRequest } from '../types';
import { formatDate, addDays } from './dateUtils';

export const generateAISchedule = (request: AIScheduleRequest): StudyPlan[] => {
  const { subject, totalMinutes, startDate, endDate, dailyMinutes = 60, sessionLength = 25 } = request;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // 1日あたりの推奨学習時間を計算
  const recommendedDailyMinutes = Math.min(dailyMinutes, Math.ceil(totalMinutes / totalDays));
  
  const schedule: StudyPlan[] = [];
  let remainingMinutes = totalMinutes;
  let currentId = Date.now();
  
  for (let day = 0; day < totalDays && remainingMinutes > 0; day++) {
    const currentDate = addDays(start, day);
    const dateString = formatDate(currentDate);
    
    // 週末は学習時間を調整
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const dailyTarget = isWeekend ? Math.floor(recommendedDailyMinutes * 1.2) : recommendedDailyMinutes;
    
    let dailyMinutesLeft = Math.min(dailyTarget, remainingMinutes);
    
    // セッションに分割
    while (dailyMinutesLeft > 0) {
      const sessionMinutes = Math.min(sessionLength, dailyMinutesLeft);
      
      // 時間帯を決定（朝、昼、夕方、夜のいずれか）
      const timeSlots = ['09:00', '13:00', '15:00', '19:00', '21:00'];
      const usedSlots = schedule
        .filter(plan => plan.date === dateString)
        .map(plan => plan.startTime);
      
      const availableSlots = timeSlots.filter(slot => !usedSlots.includes(slot));
      
      if (availableSlots.length === 0) break;
      
      const startTime = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      const [hours, minutes] = startTime.split(':').map(Number);
      const endTime = new Date(currentDate);
      endTime.setHours(hours, minutes + sessionMinutes);
      
      schedule.push({
        id: currentId++,
        subject,
        date: dateString,
        startTime,
        endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
        minutes: sessionMinutes,
        completed: false,
        type: 'ai-generated'
      });
      
      dailyMinutesLeft -= sessionMinutes;
      remainingMinutes -= sessionMinutes;
    }
  }
  
  return schedule;
};

export const getStudyTips = (subject: string): string[] => {
  const tips: Record<string, string[]> = {
    '数学': [
      '問題を解く前に、まず理論を理解しましょう',
      '間違えた問題は必ず解き直しをしましょう',
      '公式は暗記ではなく、導出過程を理解しましょう'
    ],
    '英語': [
      '毎日少しずつでも英語に触れることが大切です',
      '音読を取り入れて、リスニング力も向上させましょう',
      '単語は文脈の中で覚えると効果的です'
    ],
    'プログラミング': [
      '実際にコードを書いて動かしてみましょう',
      'エラーメッセージを恐れず、デバッグスキルを身につけましょう',
      '他の人のコードを読んで学習しましょう'
    ],
    '物理': [
      '現象を図やグラフで視覚化しましょう',
      '公式の物理的意味を理解しましょう',
      '実験や観察を通じて理解を深めましょう'
    ],
    '化学': [
      '化学反応式をバランスよく書けるようになりましょう',
      '分子の構造を立体的にイメージしましょう',
      '実験結果と理論を関連付けて考えましょう'
    ]
  };
  
  return tips[subject] || [
    '集中できる環境を整えましょう',
    '定期的に休憩を取りましょう',
    '復習を忘れずに行いましょう'
  ];
};