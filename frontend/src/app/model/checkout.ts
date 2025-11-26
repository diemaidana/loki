import { CartItem } from "./cart-item";

export interface Checkout {
    id?: number | string | undefined;
    id_buyer: string | number;
    id_sellers: (string | number)[];
    
    totalAmount: number;
    date: string;
    items: CartItem[];
}
