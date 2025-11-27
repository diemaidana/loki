export interface Notification {
    id?: string | number;
    recipientId?: string | number;
    senderId?: string | number;
    type: 'PURCHASE' | 'OFFER' | 'OFFER_UPDATE'; 
    title: string;
    message: string;
    date: string;
    relatedEntityId?: string | number; 
}