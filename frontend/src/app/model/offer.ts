export interface Offer {
    id?: string | number;
    productId: string | number;
    productName: string;  
    userId: string | number;
    sellerId: string | number;
    amount: number;
    date: string;
    status: 'pendiente' | 'aceptada' | 'rechazada' | 'expirada' | 'pendiente-pago' | 'finalizada';
}