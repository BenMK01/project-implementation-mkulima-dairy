// frontend/src/lib/cart.ts
export const CART_KEY = "cart";

export interface CartItem {
  id: number;
  name: string;
  price_per_kg: number | string;
  quantity: number;
}

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch (err) {
    console.error("loadCart error:", err);
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    // notify other parts of the app immediately
    try {
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { items } }));
    } catch (e) {
      // ignore if CustomEvent dispatching fails in some environments
    }
  } catch (err) {
    console.error("saveCart error:", err);
  }
}

export function addToCart(item: { id: number; name: string; price_per_kg: number | string; quantity?: number; }): boolean {
  try {
    const current = loadCart();
    const id = Number(item.id);
    const existing = current.find(i => Number(i.id) === id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (item.quantity ?? 1);
    } else {
      current.push({
        id,
        name: item.name,
        price_per_kg: item.price_per_kg,
        quantity: item.quantity ?? 1,
      });
    }
    saveCart(current);
    console.info("addToCart:", item, "new cart length:", current.length);
    return true;
  } catch (err) {
    console.error("addToCart error:", err);
    return false;
  }
}

export function removeFromCart(id: number) {
  try {
    const current = loadCart();
    const next = current.filter(i => Number(i.id) !== Number(id));
    saveCart(next);
  } catch (err) {
    console.error("removeFromCart error:", err);
  }
}

export function clearCart() {
  try {
    saveCart([]);
  } catch (err) {
    console.error("clearCart error:", err);
  }
}