interface MGoal {
  id: number;
  title: string;
  description: string;
  start_date: string;
  target_date: string;
  reminder_per: string;
  reminder_day: string;
  reminder_time: string;
  nominal_target: number;
  goal_details_sum_nominal?: number;
  presentage?: number;
  less_days?: number;
  status: boolean;
  over_target_date: boolean;
  created_at: string;
  updated_at: string;
  goal_details: MGoalDetail[];
}

interface MGoalDetail {
  id: number;
  goal_id: number;
  date: string;
  nominal: number;
}

interface RGoal {
  title?: string;
  description?: string;
  start_date?: string;
  target_date?: string;
  reminder_per?: string;
  reminder_day?: string;
  reminder_time?: string;
  nominal_target?: string | number;
}

interface RGoalDetail {
  goal_id?: number;
  date?: string;
  nominal?: number | string;
}

export type { MGoal, RGoal, MGoalDetail, RGoalDetail };
