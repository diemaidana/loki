export interface Offer {
    id?: string | number;
    productId: string | number;
    productName: string;  
    userId: string | number;
    sellerId: string | number;
    amount: number;
    date: string;
    lastOffer: boolean; // True = Comprador | Vendedor = False
    status: 'pendiente' | 'aceptada' | 'rechazada' | 'expirada' | 'pendiente-pago' | 'finalizada';
}