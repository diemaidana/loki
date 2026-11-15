import { Product } from "./product";

export interface ProductDetail extends Product {
  images: string[];
}