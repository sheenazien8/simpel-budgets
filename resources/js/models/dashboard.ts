interface SummaryFinancialRecord {
  income: {
    total: number;
    percentage: string;
    isUp: boolean;
  };
  expense: {
    total: number;
    percentage: string;
    isUp: boolean;
  };
  remaining: {
    total: number;
    percentage: string;
    isUp: boolean;
  };
}

export { SummaryFinancialRecord };
