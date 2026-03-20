import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { BottomNav } from "./components/layout/BottomNav";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { BrowsePage } from "./pages/BrowsePage";
import { CartPage } from "./pages/CartPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CustomJewelleryPage } from "./pages/CustomJewelleryPage";
import { HeritagePage } from "./pages/HeritagePage";
import { HomePage } from "./pages/HomePage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { WishlistPage } from "./pages/WishlistPage";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <BottomNav />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.11 0 0)",
            border: "1px solid oklch(0.72 0.118 74 / 0.3)",
            color: "oklch(0.962 0.012 82)",
          },
        }}
      />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browse",
  component: BrowsePage,
});
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductDetailPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});
const checkoutSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout-success",
  component: CheckoutSuccessPage,
});
const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: WishlistPage,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});
const customRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/custom",
  component: CustomJewelleryPage,
});
const heritageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/heritage",
  component: HeritagePage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: AuthPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  productRoute,
  cartRoute,
  checkoutSuccessRoute,
  wishlistRoute,
  ordersRoute,
  customRoute,
  heritageRoute,
  profileRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
