export interface StudyLog {
  id: number;
  subject: string;
  minutes: number;
  date: string;
}

export interface Stopwatch {
  subject: string;
  startTime: string;
  isRunning: boolean;
}

export interface Timer {
  subject: string;
  minutes: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface StudyPlan {
  id: number;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  minutes: number;
  completed: boolean;
  type: 'planned' | 'ai-generated';
}

export interface AIScheduleRequest {
  subject: string;
  totalMinutes: number;
  startDate: string;
  endDate: string;
  dailyMinutes?: number;
  sessionLength?: number;
}