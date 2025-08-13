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
    notes?:CheeseNotes[];
    elaboration?: CheeseElaboration;
    maturation?: CheeseMaturation;
    eaten?: CheeseEaten;
}
export interface CheeseElaboration {
    temperature: number;
    ferments?: string[];
    ingredients?: string[];
}
export interface CheeseMaturation  {
    duration: number; // in days
    humidity: number; // in percentage
    temperature: number; // in Celsius
    place?: string; // e.g., 'Cave', 'Fridge'
    notes?: string; 
}
export interface CheeseEaten{
    dateEaten: Date;
    notes?: string;
}
export interface CheeseNotes {
    date: Date;
    notes?: string;
}
