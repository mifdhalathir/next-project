"use client";
import React, { createContext, useContext, useState } from 'react';

type CartItem = { name: string; price: number; qty: number };
type CartContextType = {
  cart: { [key: string]: CartItem };
  addToCart: (name: string, price: number) => void;
  removeFromCart: (name: string) => void;
  updateQty: (name: string, qty: number, price: number) => void;
  total: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});

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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
