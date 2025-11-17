export interface WebhookData {
  totalJour: number;
  totalProf: number;
  totalBar: number;
  nbEleves: number;
}

export interface MonthData {
  total: number;
  totalProf: number;
  totalBar: number;
  dateRange: string;
}

export interface MonthlySummaryData {
  currentMonth: MonthData;
  previousMonth: MonthData;
}

export interface DailyBreakdownEntry {
  date: string;
  total: number;
  totalProf: number;
  totalBar: number;
  nbEleves: number;
}
