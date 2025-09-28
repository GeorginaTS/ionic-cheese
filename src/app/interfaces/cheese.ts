export interface Cheese {
  _id: string;
  name: string;
  description?: string;
  date: string | Date; // Use string for date to handle different formats
  status: string;
  public: boolean;
  userId: string;
  milkType: string;
  milkOrigin: string;
  milkQuantity: number; // in liters
  imageUrl?: string; // Firebase Storage image URL
  notes?: CheeseNotes[];
  making?: CheeseMaking;
  ripening?: CheeseRipening;
  taste?: CheeseTaste;
}
export interface CheeseMaking {
  milkTemperature?: string;
  starterCultures?: string;
  coagulant?: string;
  coagulationTime?: string;
  milkPH?: string;
  curdCutting?: string;
  molding?: string;
  appliedPressure?: string;
  salting?: string;
}
export interface CheeseRipening {
  ripeningStartDate?: string;
  estimatedDuration?: string;
  temperature?: string;
  humidity?: string;
  turningFlips?: string;
  washing?: string;
  brushing?: string;
}
export interface CheeseTaste {
  visual?: Opinion;
  flavor?: Opinion;
  aroma?: Opinion;
  texture?: Opinion;
  taste?: Opinion;
}
export interface Opinion {
  rate?: number;
  text?: string;
}
export interface CheeseNotes {
  date: Date;
  about: string;
  notes: string;
}
export const CHEESE_NOTES_ABOUT_OPTIONS: CheeseNotes['about'][] = [
  'Before',
  'Elaboration',
  'Maturation',
  'Taste',
  'Other',
];
