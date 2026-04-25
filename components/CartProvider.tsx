"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = { name: string; price: number; qty: number };
export type OrderStatus = "received" | "preparing" | "ready" | "completed";

export type Order = {
  id: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
};

export type Reservation = {
  id: string;
  name: string;
  time: string;
  guests: number;
  notes: string;
  status: "pending" | "arrived" | "cancelled";
  timestamp: number;
};

type CartContextType = {
  cart: { [key: string]: CartItem };
  addToCart: (name: string, price: number) => void;
  removeFromCart: (name: string) => void;
  updateQty: (name: string, qty: number, price: number) => void;
  clearCart: () => void;
  placeOrder: (tableNumber: string) => Order;
  placeReservation: (res: Omit<Reservation, "id" | "status" | "timestamp">) => void;
  activeOrder: Order | null;
  total: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Synchronize active order status from localStorage (for real-time tracking)
  useEffect(() => {
    const syncStatus = () => {
      if (!activeOrder) return;
      const savedOrders = localStorage.getItem("karsa_orders");
      if (savedOrders) {
        const orders: Order[] = JSON.parse(savedOrders);
        const current = orders.find(o => o.id === activeOrder.id);
        if (current && current.status !== activeOrder.status) {
          setActiveOrder(current);
        } else if (!current && activeOrder.status !== "completed") {
          // If order is gone from karsa_orders, it's likely completed
          setActiveOrder({ ...activeOrder, status: "completed" });
        }
      }
    };

    window.addEventListener("storage", syncStatus);
    const interval = setInterval(syncStatus, 2000);
    
    return () => {
      window.removeEventListener("storage", syncStatus);
      clearInterval(interval);
    };
  }, [activeOrder]);

  const placeOrder = (tableNumber: string): Order => {
    const newOrder: Order = {
      id: `KRSA-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber,
      items: Object.values(cart),
      total: Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0),
      status: "received",
      timestamp: Date.now(),
    };

    const existingOrdersJson = localStorage.getItem("karsa_orders");
    const existingOrders: Order[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("karsa_orders", JSON.stringify(updatedOrders));

    window.dispatchEvent(new Event("storage"));

    setActiveOrder(newOrder);
    setCart({});
    return newOrder;
  };

  const placeReservation = (res: Omit<Reservation, "id" | "status" | "timestamp">) => {
    const newRes: Reservation = {
      ...res,
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "pending",
      timestamp: Date.now(),
    };

    const existingResJson = localStorage.getItem("karsa_reservations");
    const existingRes: Reservation[] = existingResJson ? JSON.parse(existingResJson) : [];
    localStorage.setItem("karsa_reservations", JSON.stringify([...existingRes, newRes]));
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => setCart({});

  const addToCart = (name: string, price: number) => {
    setCart(prev => ({
      ...prev,
      [name]: { name, price, qty: (prev[name]?.qty || 0) + 1 }
    }));
  };

  const removeFromCart = (name: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[name];
      return newCart;
    });
  };

  const updateQty = (name: string, qty: number, price: number) => {
    setCart(prev => {
      if (qty <= 0) {
        const newCart = { ...prev };
        delete newCart[name];
        return newCart;
      }
      return { ...prev, [name]: { name, price, qty } };
    });
  };

  const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQty, clearCart, 
      placeOrder, placeReservation, activeOrder, total, totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
