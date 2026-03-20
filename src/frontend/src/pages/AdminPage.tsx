import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Edit2, Loader2, Package, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus, type Product, ProductCategory } from "../backend";
import { formatPrice } from "../data/sampleProducts";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useAllOrders,
  useDeleteProduct,
  useIsAdmin,
  useProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

const EMPTY_PRODUCT: Product = {
  id: 0n,
  name: "",
  description: "",
  category: ProductCategory.rings,
  metalType: "",
  gemstone: "",
  price: 0n,
  weight: 0,
  images: [""],
  hallmarkCertified: true,
  craftsmanshipNotes: "",
  popularityScore: 0n,
  stockQuantity: 1n,
};

export function AdminPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!identity || isAdmin === false) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="admin.page"
      >
        <p className="text-muted-foreground">Admin access required.</p>
        <Button
          variant="outline"
          className="mt-4 border-gold/40 text-gold"
          onClick={() => navigate({ to: "/" })}
        >
          Go Home
        </Button>
      </main>
    );
  }

  const handleProductSave = (product: Product) => {
    if (!product.name || !product.metalType) {
      toast.error("Name and metal type required");
      return;
    }
    if (product.id === 0n) {
      addProduct.mutate(product, {
        onSuccess: () => {
          toast.success("Product added!");
          setDialogOpen(false);
        },
        onError: () => toast.error("Failed to add product"),
      });
    } else {
      updateProduct.mutate(product, {
        onSuccess: () => {
          toast.success("Product updated!");
          setDialogOpen(false);
        },
        onError: () => toast.error("Failed to update product"),
      });
    }
  };

  const handleDeleteProduct = (id: bigint) => {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Product deleted"),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  return (
    <main
      className="container mx-auto px-4 py-8 pb-24 lg:pb-8"
      data-ocid="admin.page"
    >
      <p className="text-xs tracking-[0.3em] text-gold uppercase mb-1">
        Administration
      </p>
      <h1 className="font-serif text-3xl font-bold text-ivory mb-8">
        Admin Panel
      </h1>

      <Tabs defaultValue="products" data-ocid="admin.tab">
        <TabsList className="bg-card border border-border/40 mb-6">
          <TabsTrigger
            value="products"
            data-ocid="admin.tab"
            className="data-[state=active]:text-gold"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            data-ocid="admin.tab"
            className="data-[state=active]:text-gold"
          >
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" data-ocid="admin.panel">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {products.length} products
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.open_modal_button"
                  onClick={() => setEditProduct({ ...EMPTY_PRODUCT })}
                  className="gold-gradient text-background border-0 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-card border-border/60 max-w-lg max-h-[80vh] overflow-y-auto"
                data-ocid="admin.dialog"
              >
                <DialogHeader>
                  <DialogTitle className="font-serif text-gold">
                    {editProduct?.id === 0n
                      ? "Add New Product"
                      : "Edit Product"}
                  </DialogTitle>
                </DialogHeader>
                {editProduct && (
                  <ProductForm
                    product={editProduct}
                    onChange={setEditProduct}
                    onSave={handleProductSave}
                    saving={addProduct.isPending || updateProduct.isPending}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          {productsLoading ? (
            <div className="text-center py-10" data-ocid="admin.loading_state">
              <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="text-muted-foreground">
                      Product
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Stock
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, i) => (
                    <TableRow
                      key={String(product.id)}
                      className="border-border/40"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="text-sm font-medium text-foreground line-clamp-1 max-w-32">
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-sm text-gold">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {String(product.stockQuantity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`admin.edit_button.${i + 1}`}
                            onClick={() => {
                              setEditProduct({ ...product });
                              setDialogOpen(true);
                            }}
                            className="border-border/60 h-7 px-2"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`admin.delete_button.${i + 1}`}
                            onClick={() => handleDeleteProduct(product.id)}
                            className="border-destructive/40 text-destructive h-7 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" data-ocid="admin.panel">
          {ordersLoading ? (
            <div className="text-center py-10" data-ocid="admin.loading_state">
              <Loader2 className="w-6 h-6 text-gold animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10" data-ocid="admin.empty_state">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="text-muted-foreground">
                      Order ID
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Items
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Total
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, i) => (
                    <TableRow
                      key={String(order.id)}
                      className="border-border/40"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        #{String(order.id)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(
                          Number(order.timestamp) / 1_000_000,
                        ).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.items.length}
                      </TableCell>
                      <TableCell className="text-sm text-gold">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(v) =>
                            updateOrderStatus.mutate(
                              { orderId: order.id, status: v as OrderStatus },
                              {
                                onSuccess: () =>
                                  toast.success("Status updated"),
                              },
                            )
                          }
                        >
                          <SelectTrigger
                            data-ocid={`admin.select.${i + 1}`}
                            className="w-32 h-7 text-xs"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(OrderStatus).map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function ProductForm({
  product,
  onChange,
  onSave,
  saving,
}: {
  product: Product;
  onChange: (p: Product) => void;
  onSave: (p: Product) => void;
  saving: boolean;
}) {
  const set = (key: keyof Product, value: unknown) =>
    onChange({ ...product, [key]: value });

  return (
    <div className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Name *</Label>
        <Input
          value={product.name}
          onChange={(e) => set("name", e.target.value)}
          data-ocid="admin.input"
          className="bg-secondary border-border/60"
          placeholder="Product name"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={product.category}
            onValueChange={(v) => set("category", v as ProductCategory)}
          >
            <SelectTrigger
              data-ocid="admin.select"
              className="bg-secondary border-border/60"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProductCategory).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Metal Type *</Label>
          <Input
            value={product.metalType}
            onChange={(e) => set("metalType", e.target.value)}
            data-ocid="admin.input"
            className="bg-secondary border-border/60"
            placeholder="e.g. 22K Gold"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Price (INR)</Label>
          <Input
            type="number"
            value={String(product.price)}
            onChange={(e) => set("price", BigInt(e.target.value || "0"))}
            data-ocid="admin.input"
            className="bg-secondary border-border/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Weight (g)</Label>
          <Input
            type="number"
            value={product.weight}
            onChange={(e) =>
              set("weight", Number.parseFloat(e.target.value || "0"))
            }
            data-ocid="admin.input"
            className="bg-secondary border-border/60"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Gemstone</Label>
          <Input
            value={product.gemstone}
            onChange={(e) => set("gemstone", e.target.value)}
            data-ocid="admin.input"
            className="bg-secondary border-border/60"
            placeholder="e.g. Diamond"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Stock Qty</Label>
          <Input
            type="number"
            value={String(product.stockQuantity)}
            onChange={(e) =>
              set("stockQuantity", BigInt(e.target.value || "1"))
            }
            data-ocid="admin.input"
            className="bg-secondary border-border/60"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Image URL</Label>
        <Input
          value={product.images[0] ?? ""}
          onChange={(e) => set("images", [e.target.value])}
          data-ocid="admin.input"
          className="bg-secondary border-border/60"
          placeholder="https://..."
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea
          value={product.description}
          onChange={(e) => set("description", e.target.value)}
          data-ocid="admin.textarea"
          className="bg-secondary border-border/60 resize-none"
          rows={3}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">
          Craftsmanship Notes
        </Label>
        <Textarea
          value={product.craftsmanshipNotes}
          onChange={(e) => set("craftsmanshipNotes", e.target.value)}
          data-ocid="admin.textarea"
          className="bg-secondary border-border/60 resize-none"
          rows={2}
        />
      </div>
      <Button
        data-ocid="admin.save_button"
        onClick={() => onSave(product)}
        disabled={saving}
        className="w-full gold-gradient text-background font-semibold border-0"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product"}
      </Button>
    </div>
  );
}
