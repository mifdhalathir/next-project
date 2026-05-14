"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { addKarsaNotification } from './NotificationHub';

export type CartItem = { name: string; price: number; qty: number };
export type OrderStatus = "received" | "preparing" | "cooked" | "ready" | "completed";

export type Order = {
  id: string;
  tableNumber: string;
  customerName: string;
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
  applyVoucher: (code: string) => { success: boolean; message: string };
  activeOrder: Order | null;
  total: number;
  totalItems: number;
  voucherDiscount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [voucher, setVoucher] = useState<{ type: string; discount: number; code: string } | null>(null);

  // Synchronize active order status from localStorage (for real-time tracking)
  useEffect(() => {
    const syncStatus = () => {
      if (!activeOrder) return;
      const savedOrders = localStorage.getItem("karsa_orders");
      if (savedOrders) {
        const orders: Order[] = JSON.parse(savedOrders);
        const current = orders.find(o => o.id === activeOrder.id);
        
        if (current && current.status !== activeOrder.status) {
          // Play sound if status becomes "ready"
          if (current.status === "ready") {
            const beep = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            beep.play().catch(e => console.log("Sound error:", e));
            addKarsaNotification(`Pesananmu SIAP diantar/ambil! 🛎️`, "success");
          }
          setActiveOrder(current);
        } else if (!current && activeOrder.status !== "completed") {
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
    // Auth Guard
    const userName = typeof window !== "undefined" ? localStorage.getItem("karsa_user_name") : null;
    const tableNum = typeof window !== "undefined" ? localStorage.getItem("karsa_table_number") : null;
    const area = typeof window !== "undefined" ? localStorage.getItem("karsa_area") || "Indoor" : "Indoor";
    
    if (!userName || !tableNum) {
      alert("Eits! Isi namamu dan pilih nomor meja dulu ya! ☕");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    const orderID = `KRSA-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsArray = Object.values(cart);
    const baseTotal = itemsArray.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalQty = itemsArray.reduce((sum, item) => sum + item.qty, 0);

    let totalAmount = baseTotal;
    if (voucher) {
      if (voucher.type === 'persen') totalAmount -= Math.round(baseTotal * voucher.discount / 100);
      else if (voucher.type === 'flat') totalAmount -= Math.min(voucher.discount, baseTotal);
    }

    const newOrder: Order = {
      id: orderID,
      tableNumber,
      customerName: userName,
      items: itemsArray,
      total: totalAmount,
      status: "received",
      timestamp: Date.now(),
    };

    // [CORE SYSTEM BRIDGE] Save to PESANAN_HARI_INI for Kasir consistency
    const pesananBaru = {
        orderID: orderID,
        id: Date.now(),
        nama: userName,
        meja: 'Meja ' + tableNumber,
        area: area,
        items: itemsArray.map(item => ({
            nama: item.name,
            harga: item.price,
            qty: item.qty,
            subtotal: item.price * item.qty
        })),
        totalHarga: totalAmount,
        totalItem: totalQty,
        waktuPesan: new Date().toLocaleString('id-ID'),
        tanggal: new Date().toLocaleDateString('id-ID'),
        jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending'
    };

    // Save to PESANAN_HARI_INI
    let pesananHariIni = [];
    try { pesananHariIni = JSON.parse(localStorage.getItem('PESANAN_HARI_INI') || '[]'); } catch(e) {}
    pesananHariIni.push(pesananBaru);
    localStorage.setItem('PESANAN_HARI_INI', JSON.stringify(pesananHariIni));

    // Save to karsa_pesanan_masuk (backward compat)
    let pesananMasuk = [];
    try { pesananMasuk = JSON.parse(localStorage.getItem('karsa_pesanan_masuk') || '[]'); } catch(e) {}
    pesananMasuk.push({
        id: pesananBaru.id,
        nama: userName,
        jumlah: totalQty,
        tanggal: pesananBaru.tanggal,
        jam: pesananBaru.jam,
        catatan: 'Order dari Next.js (Meja ' + tableNumber + ')',
        area: area,
        status: 'menunggu',
        waktuMasuk: pesananBaru.waktuPesan,
        totalHarga: totalAmount
    });
    localStorage.setItem('karsa_pesanan_masuk', JSON.stringify(pesananMasuk));

    // Save to legacy karsa_orders (for internal Next.js tracking if needed)
    const existingOrdersJson = localStorage.getItem("karsa_orders");
    const existingOrders: Order[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
    localStorage.setItem("karsa_orders", JSON.stringify([...existingOrders, newOrder]));

    addKarsaNotification(`Pesanan Baru Terkirim! Mohon Tunggu Ya! ☕`, "warning");
    window.dispatchEvent(new Event("storage"));

    if (voucher) {
      sessionStorage.setItem('karsa_voucher_used', voucher.code);
    }

    setActiveOrder(newOrder);
    setCart({});
    setVoucher(null);
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
    const userName = typeof window !== "undefined" ? localStorage.getItem("karsa_user_name") : null;
    const tableNum = typeof window !== "undefined" ? localStorage.getItem("karsa_table_number") : null;

    if (!userName || !tableNum) {
      alert("Eits! Isi namamu dan pilih nomor meja dulu ya! ☕");
      window.location.href = "/login";
      return;
    }
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
    const userName = typeof window !== "undefined" ? localStorage.getItem("karsa_user_name") : null;
    const tableNum = typeof window !== "undefined" ? localStorage.getItem("karsa_table_number") : null;

    if (!userName || !tableNum) {
      alert("Eits! Isi namamu dan pilih nomor meja dulu ya! ☕");
      window.location.href = "/login";
      return;
    }
    setCart(prev => {
      if (qty <= 0) {
        const newCart = { ...prev };
        delete newCart[name];
        return newCart;
      }
      return { ...prev, [name]: { name, price, qty } };
    });
  };

  const applyVoucher = (code: string) => {
    const c = code.trim().toUpperCase();
    if (typeof window !== "undefined" && sessionStorage.getItem("karsa_voucher_used")) {
      return { success: false, message: "Voucher sudah dipakai di sesi ini!" };
    }
    if (c === "KARSAVIP") {
      setVoucher({ type: "persen", discount: 20, code: c });
      return { success: true, message: `Voucher KARSAVIP aktif! Diskon 20%.` };
    } else if (c === "KOPIGRATIS") {
      setVoucher({ type: "flat", discount: 15000, code: c });
      return { success: true, message: `Voucher KOPIGRATIS aktif! Potongan Rp 15.000.` };
    }
    return { success: false, message: "Kode voucher tidak valid!" };
  };

  const baseTotal = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
  let total = baseTotal;
  let voucherDiscount = 0;
  if (voucher) {
    if (voucher.type === 'persen') voucherDiscount = Math.round(baseTotal * voucher.discount / 100);
    else if (voucher.type === 'flat') voucherDiscount = Math.min(voucher.discount, baseTotal);
    total -= voucherDiscount;
  }
  
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQty, clearCart, 
      placeOrder, placeReservation, applyVoucher, activeOrder, total, totalItems, voucherDiscount
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
