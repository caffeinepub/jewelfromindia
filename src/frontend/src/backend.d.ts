import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CustomJewelleryRequest {
    metal: string;
    user: Principal;
    style: string;
    gemstone: string;
    notes: string;
    timestamp: bigint;
    budget: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    user: Principal;
    totalAmount: bigint;
    timestamp: bigint;
    items: Array<bigint>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Review {
    user: Principal;
    productId: bigint;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: bigint;
    weight: number;
    popularityScore: bigint;
    stockQuantity: bigint;
    name: string;
    craftsmanshipNotes: string;
    description: string;
    metalType: string;
    hallmarkCertified: boolean;
    gemstone: string;
    category: ProductCategory;
    price: bigint;
    images: Array<string>;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered"
}
export enum ProductCategory {
    bangles = "bangles",
    bridalSets = "bridalSets",
    traditional = "traditional",
    necklaces = "necklaces",
    earrings = "earrings",
    rings = "rings"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    addReview(review: Review): Promise<void>;
    addToCart(productId: bigint): Promise<void>;
    addToWishlist(productId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    filterByCategory(category: ProductCategory): Promise<Array<Product>>;
    filterByGemstone(gemstone: string): Promise<Array<Product>>;
    filterByMetalType(metalType: string): Promise<Array<Product>>;
    filterByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Product>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<bigint>>;
    getOrderHistory(): Promise<Array<Order>>;
    getProducts(): Promise<Array<Product>>;
    getReviews(productId: bigint): Promise<Array<Review>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeFromCart(productId: bigint): Promise<void>;
    removeFromWishlist(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    sortByPopularity(): Promise<Array<Product>>;
    submitCustomRequest(request: CustomJewelleryRequest): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
