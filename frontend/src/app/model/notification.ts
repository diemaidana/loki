export interface Notification {
    id?: string | number;
    recipientId: string | number; // Quien recibe
    senderId: string | number;    // Quien envía (Comprador o Vendedor)
    
    type: 'compra' | 'oferta' | 'updateDeOferta'; 
    
    productName: string;
    productId: string | number;
    
    date: string;
}