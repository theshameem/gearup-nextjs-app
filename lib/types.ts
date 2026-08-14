export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type GearCondition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR";
export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";
export type PaymentMethod = "STRIPE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  activeGearItemCount?: number;
}

export interface GearItem {
  id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  model?: string | null;
  dailyRentalPrice: string;
  depositAmount: string;
  totalStock: number;
  availableStock: number;
  condition: GearCondition;
  imageUrl?: string | null;
  specifications?: Record<string, unknown> | null;
  isActive: boolean;
  categoryId: string;
  providerId: string;
  category: { id: string; name: string };
  provider: { id: string; name: string };
  averageRating: number;
  reviewCount: number;
}

export interface GearReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { id: string; name: string; profileImage?: string | null };
}

export interface GearDetail extends GearItem {
  reviews?: GearReview[];
}

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDay: string;
  rentalDays: number;
  subtotal: string;
  gearItem: {
    id: string;
    name: string;
    brand?: string | null;
    imageUrl?: string | null;
  };
}

export interface RentalOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  totalAmount: string;
  depositAmount: string;
  pickupAddress?: string | null;
  notes?: string | null;
  status: RentalStatus;
  items: RentalOrderItem[];
  payments?: Payment[];
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  rentalOrderId: string;
  transactionId: string;
  amount: string;
  paymentMethod: PaymentMethod;
  providerReference?: string | null;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  rentalOrder?: {
    id: string;
    orderNumber: string;
    totalAmount: string;
    status: RentalStatus;
  };
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    count?: number;
  };
  count?: number;
}

// Backend actually returns { result: T[], count: number }.
export interface ListResponse<T> {
  result: T[];
  count: number;
}

export interface GearFilters {
  searchTerm?: string;
  categoryId?: string | string[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateRentalPayload {
  gearItemId: string;
  quantity: number;
  rentalStartDate: string;
  rentalEndDate: string;
  pickupAddress?: string;
  notes?: string;
}

export interface CreateGearPayload {
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  dailyRentalPrice: string;
  depositAmount: string;
  totalStock: number;
  availableStock: number;
  condition: GearCondition;
  imageUrl?: string;
  specifications?: Record<string, unknown>;
  categoryId: string;
  isActive: boolean;
}

export interface CreateCheckoutResponse {
  paymentUrl: string;
  sessionId: string;
  payment: Payment;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}
