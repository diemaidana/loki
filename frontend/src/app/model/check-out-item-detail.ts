export interface CheckoutItemDetail {
    productId: string | number;
    quantity: number;
    price: number; // Guarda el precio al momento de la compra por si cambia.
}