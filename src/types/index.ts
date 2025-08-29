export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface CarAd {
  id: string;
  userId: string;
  userName: string;
  carModelId: number;
  carBrand: string;
  carModel: string;
  registrationNumber: string;
  technicalData: string;
  isImported: boolean;
  equipment: string;
  description: string;
  fixedPrice?: number;
  isBiddable: boolean;
  currentHighestBid?: number;
  createdAt: string;
  auctionEndDate?: string;
  isSold: boolean;
  hasDownPayment: boolean;
  imageUrls: string[];
}

export interface CarBrand {
  id: number;
  name: string;
  models: CarModel[];
}

export interface CarModel {
  id: number;
  name: string;
  carBrandId: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Bid {
  id: string;
  carAdId: string;
  userId: string;
  userName: string;
  amount: number;
  createdAt: string;
}

export interface BidForm {
  carAdId: string;
  amount: number;
}