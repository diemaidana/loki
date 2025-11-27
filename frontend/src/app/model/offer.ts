export interface Offer {
    id?: string | number;
    productId: string | number;  
    userId: string | number;
    sellerId: string | number;
    amount: number;
    date: string;
    status: 'pending' | 'accepted' | 'rejected';
}