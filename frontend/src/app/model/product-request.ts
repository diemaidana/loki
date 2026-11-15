import { Product } from "./product";

export interface ProductRequest extends Product {
    user: string;
    title: string;
    description: string;
    price: number;
    priceMin: number;
    categories: string[];
    stock: number;
}