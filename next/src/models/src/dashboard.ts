interface SummaryFinancialRecord {
  label: string;
  total: number;
  isUp: boolean;
  percentage: string;
}

interface Shortcuts {
  id: number;
  name: string;
  url: string;
  icon: string;
  iconJsx?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

export type { SummaryFinancialRecord, Shortcuts };
