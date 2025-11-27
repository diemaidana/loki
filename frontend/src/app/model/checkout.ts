import { CartItem } from "./cart-item";
import { CheckoutItemDetail } from "./check-out-item-detail";

export interface Checkout {
    id?: number | string | undefined;
    id_buyer: string | number;
    id_sellers: (string | number)[];
    
    totalAmount: number;
    date: string;
    items: CheckoutItemDetail[];
}
