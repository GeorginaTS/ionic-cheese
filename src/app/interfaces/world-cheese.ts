export interface WorldCheese {
    _id: string;
    name: string;
    origin_city: string;
    origin_country: string;
    latitude: string;
    longitude: string;
    milk_type: string;
    fermentation_type: string;
    description?: string;
    awards?: string[];
    price?: number;
}