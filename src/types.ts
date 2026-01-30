export interface LeaveBalance {
  ferie: number;
  rol: number;
  exFestivita: number;
}

export interface LeaveEntry {
  id: string;
  date: string;
  type: 'ferie' | 'rol' | 'exFestivita';
  hours: number;
  description?: string;
}
