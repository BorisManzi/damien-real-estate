export type TransactionType = "rent" | "buy" | "land";

export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial"
  | "villa";

export type PropertyStatus =
  | "for-rent"
  | "for-sale"
  | "available"
  | "reserved"
  | "new"
  | "featured";

export type PricePeriod = "month" | "night" | "total" | null;

export interface PropertyLocation {
  city: string;
  district: string;
  neighborhood?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  status: PropertyStatus[];
  transactionType: TransactionType;
  propertyType: PropertyType;
  price: number;
  pricePeriod: PricePeriod;
  currency: "RWF" | "USD";
  city: string;
  district: string;
  neighborhood?: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number | null;
  sizeUnit: "m²" | "acres" | null;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  furnished?: boolean;
  parking?: boolean;
  garden?: boolean;
  createdAt: string;
}

export interface PropertyFilters {
  query?: string;
  transactionType?: TransactionType | "all";
  location?: string;
  propertyType?: PropertyType | "all";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | "any";
  bathrooms?: number | "any";
  furnished?: boolean | "any";
  sort?: "recommended" | "newest" | "price-asc" | "price-desc";
}

export interface LeadInquiry {
  name: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  transactionType: TransactionType | "unsure";
  preferredLocation: string;
  propertyType?: PropertyType | "any";
  budget?: string;
  bedrooms?: string;
  message?: string;
}

export interface LocationTile {
  name: string;
  slug: string;
  image: string;
  propertyCount: number;
}
