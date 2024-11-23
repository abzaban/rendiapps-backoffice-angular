export interface DataFilter {
  attribute: string;
  title: string;
  required: boolean;
  items: string[];
  values: any[];
  initialValue: string | null;
}

export interface CustomEmit {
  attribute: string;
  item: string;
  value: any;
}
