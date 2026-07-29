export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  featured: boolean;
  published: boolean;
  available: boolean;
  tags: string[];
};

export type ProductWithCategory = Product & {
  category: Category;
};

export type CartItemInput = {
  slug: string;
  quantity: number;
};

export type OrderStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderRecord = {
  id: string;
  orderCode: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  items: CartItemInput[];
};
