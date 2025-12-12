// frontend/src/components/Cart.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadCart, clearCart as clearCartLib, removeFromCart, addToCart } from '@/lib/cart';

interface CartItem {
  id: number;
  name: string;
  price_per_kg: number | string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // initial load
    setItems(loadCart());

    const onCartUpdated = () => {
      setItems(loadCart());
    };

    // listen for custom event dispatched when cart changes
    window.addEventListener("cartUpdated", onCartUpdated as EventListener);
    // listen for storage events from other tabs/windows
    window.addEventListener("storage", onCartUpdated as EventListener);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated as EventListener);
      window.removeEventListener("storage", onCartUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    // persist mirror — already saved by the lib, keep local state in sync
    // This effect is optional; we only need it if items is modified locally here.
  }, [items]);

  const updateQuantity = (id: number, newQty: number) => {
    const current = loadCart();
    const next = current.map(it => (it.id === id ? { ...it, quantity: Math.max(1, newQty) } : it));
    // save using lib
    try {
      // reuse addToCart/remove to persist: simpler to save directly
      // but we call saveCart via clear/add sequence
      // Build next state and save
      const { saveCart } = require('@/lib/cart') as typeof import('@/lib/cart');
      saveCart(next);
      setItems(next);
    } catch (err) {
      console.error("updateQuantity error:", err);
    }
  };

  const handleRemove = (id: number) => {
    try {
      removeFromCart(id);
      setItems(loadCart());
    } catch (err) {
      console.error("removeFromCart:", err);
    }
  };

  const clearCart = () => {
    clearCartLib();
    setItems([]);
  };

  const subtotal = items.reduce((s, it) => s + (Number(it.price_per_kg) || 0) * it.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // Placeholder: Replace with real checkout flow later
    alert(`Checkout not implemented. Subtotal: KSh ${subtotal.toFixed(2)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Cart</h1>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Add items from the marketplace to see them here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">KSh {Number(item.price_per_kg).toFixed(2)} / kg</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <div className="px-4">{item.quantity}</div>
                  <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                </div>

                <div className="w-36 text-right">
                  <div className="font-semibold">KSh {(Number(item.price_per_kg) * item.quantity).toFixed(2)}</div>
                  <Button variant="ghost" onClick={() => handleRemove(item.id)} className="mt-2">Remove</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-lg">Subtotal</div>
                <div className="text-2xl font-bold">KSh {subtotal.toFixed(2)}</div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
                <Button onClick={handleCheckout}>Checkout</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cart;