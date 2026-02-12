
export type LeadType = 'buyer' | 'seller';

export interface Lead {
  id: string;
  type: LeadType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timestamp: string;
  // Buyer specific
  budget?: string;
  area?: string;
  timeline?: string;
  propertyType?: string;
  bedrooms?: string;
  features?: string[];
  purpose?: string;
  // Seller specific (enhanced)
  location?: string;
  estimatedValue?: string;
  condition?: string;
  reason?: string;
  propertyDescription?: string;
  expectedPrice?: string;
  images?: string[]; // Base64 strings for simulation
  cadernetaPredial?: string; // Base64 or filename
}

export enum Page {
  HOME = 'home',
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  LOGIN = 'login'
}
