import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Order,
  OrderStatus,
  type Product,
  ProductCategory,
  type Review,
} from "../backend";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { useActor } from "./useActor";

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS;
      try {
        const products = await actor.getProducts();
        return products.length > 0 ? products : SAMPLE_PRODUCTS;
      } catch {
        return SAMPLE_PRODUCTS;
      }
    },
    enabled: !isFetching,
    placeholderData: SAMPLE_PRODUCTS,
    staleTime: 30_000,
  });
}

export function useProductsByCategory(category: ProductCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor || !category) return SAMPLE_PRODUCTS;
      try {
        const products = await actor.filterByCategory(category);
        return products.length > 0
          ? products
          : SAMPLE_PRODUCTS.filter((p) => p.category === category);
      } catch {
        return SAMPLE_PRODUCTS.filter((p) => p.category === category);
      }
    },
    enabled: !isFetching,
    placeholderData: () =>
      category
        ? SAMPLE_PRODUCTS.filter((p) => p.category === category)
        : SAMPLE_PRODUCTS,
    staleTime: 30_000,
  });
}

export function usePopularProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "popular"],
    queryFn: async () => {
      if (!actor)
        return [...SAMPLE_PRODUCTS].sort((a, b) =>
          Number(b.popularityScore - a.popularityScore),
        );
      try {
        const products = await actor.sortByPopularity();
        return products.length > 0
          ? products
          : [...SAMPLE_PRODUCTS].sort((a, b) =>
              Number(b.popularityScore - a.popularityScore),
            );
      } catch {
        return [...SAMPLE_PRODUCTS].sort((a, b) =>
          Number(b.popularityScore - a.popularityScore),
        );
      }
    },
    enabled: !isFetching,
    placeholderData: () =>
      [...SAMPLE_PRODUCTS].sort((a, b) =>
        Number(b.popularityScore - a.popularityScore),
      ),
    staleTime: 30_000,
  });
}

export function useCart() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !isFetching,
    staleTime: 0,
  });
}

export function useWishlist() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWishlist();
    },
    enabled: !isFetching,
    staleTime: 0,
  });
}

export function useOrderHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !isFetching,
    staleTime: 0,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !isFetching,
    staleTime: 0,
  });
}

export function useReviews(productId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviews(productId);
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest";
      return actor.getCallerUserRole();
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

// Mutations
export function useAddToCart() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addToCart(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeFromCart(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useAddToWishlist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addToWishlist(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeFromWishlist(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createOrder();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addReview(review);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["reviews", vars.productId.toString()],
      }),
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addProduct(product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateProduct(product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOrders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: Array<{
        productName: string;
        currency: string;
        quantity: bigint;
        priceInCents: bigint;
        productDescription: string;
      }>;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useSubmitCustomRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (request: {
      metal: string;
      style: string;
      gemstone: string;
      notes: string;
      budget: bigint;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.submitCustomRequest({
        ...request,
        user: Principal.anonymous(),
        timestamp: BigInt(Date.now()),
      });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile({ name });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export { ProductCategory, OrderStatus };
