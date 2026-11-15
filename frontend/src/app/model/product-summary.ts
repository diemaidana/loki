import { Product } from "./product";

export interface ProductSummary extends Product {
  coverImageUrl: string | null;
}