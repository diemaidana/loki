export interface Product {
    id?: number | string;
    name: string;
    description: string;
    price: number;
    id_seller?: number | string;
    brand: string;
    stock: number;
    image: string;
    category: string;
}
