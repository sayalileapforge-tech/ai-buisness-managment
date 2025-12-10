// =========================================
// LOCAL STORAGE PRODUCT STORE (NO BACKEND)
// =========================================

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  image: string | null;
  barcode?: string;
  qrCode?: string;
  createdAt: number;
}

/* ===========================================================
    INTERNAL: GET ALL PRODUCTS
=========================================================== */
export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem("products");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading products:", err);
    return [];
  }
}

/* ===========================================================
    INTERNAL: SAVE ALL PRODUCTS
=========================================================== */
function saveProducts(products: Product[]) {
  try {
    localStorage.setItem("products", JSON.stringify(products));
  } catch (err) {
    console.error("Error saving products:", err);
  }
}

/* ===========================================================
    ADD A NEW PRODUCT
=========================================================== */
export function addProduct(product: Omit<Product, "id" | "createdAt">) {
  const products = getProducts();

  const newProduct: Product = {
    id: "prod_" + Date.now(),
    createdAt: Date.now(),
    ...product,
  };

  products.push(newProduct);
  saveProducts(products);

  return newProduct;
}

/* ===========================================================
    UPDATE PRODUCT
=========================================================== */
export function updateProduct(id: string, updates: Partial<Product>) {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) return false;

  products[index] = { ...products[index], ...updates };
  saveProducts(products);

  return true;
}

/* ===========================================================
    DELETE PRODUCT
=========================================================== */
export function deleteProduct(id: string) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

/* ===========================================================
    REDUCE STOCK (USED IN SALE SYSTEM)
=========================================================== */
export function reduceStock(id: string, qty: number) {
  const products = getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) return false;

  product.stock = Math.max(product.stock - qty, 0);
  saveProducts(products);

  return true;
}

/* ===========================================================
    INCREASE STOCK (RESTOCKING)
=========================================================== */
export function increaseStock(id: string, qty: number) {
  const products = getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) return false;

  product.stock = product.stock + qty;
  saveProducts(products);

  return true;
}

/* ===========================================================
    CLEAR ALL PRODUCTS (DEVELOPMENT ONLY)
=========================================================== */
export function clearAllProducts() {
  localStorage.removeItem("products");
}
