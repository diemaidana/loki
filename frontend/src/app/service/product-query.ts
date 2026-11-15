export interface ProductQuery {
    title?: string;
    categoryCodes?: string[];
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
}
