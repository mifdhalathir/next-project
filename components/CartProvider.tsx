"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { addKarsaNotification } from './NotificationHub';
import { addActivityLog } from './ActivityLog';
import { useKarsa } from './KarsaContext';
import confetti from 'canvas-confetti';

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
  tableNumber?: string;
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
  const { orders, placeOrder: karsaPlaceOrder, placeReservation: karsaPlaceReservation } = useKarsa();
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [voucher, setVoucher] = useState<{ type: string; discount: number; code: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("karsa_cart");
    const savedActiveOrder = localStorage.getItem("karsa_active_order");
    const savedVoucher = localStorage.getItem("karsa_active_voucher");

    if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    if (savedActiveOrder) {
        try { setActiveOrder(JSON.parse(savedActiveOrder)); } catch (e) {}
    }
    if (savedVoucher) {
        try { setVoucher(JSON.parse(savedVoucher)); } catch (e) {}
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("karsa_cart", JSON.stringify(cart));
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (activeOrder) {
      localStorage.setItem("karsa_active_order", JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem("karsa_active_order");
    }
  }, [activeOrder, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (voucher) {
      localStorage.setItem("karsa_active_voucher", JSON.stringify(voucher));
    } else {
      localStorage.removeItem("karsa_active_voucher");
    }
  }, [voucher, mounted]);

  // Synchronize active order status from KarsaContext real-time order list
  useEffect(() => {
    if (!activeOrder) return;
    const current = orders.find((o) => o.orderID === activeOrder.id);
    if (current) {
      const statusMap: Record<string, OrderStatus> = {
        'Pending': 'received',
        'Diracik': 'preparing',
        'Preparing': 'preparing',
        'Dikonfirmasi': 'ready',
        'Ready': 'ready',
        'Selesai': 'completed',
      };
      const mappedStatus = statusMap[current.status] || 'received';
      
      if (mappedStatus !== activeOrder.status) {
        if (mappedStatus === "ready") {
          const beep = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          beep.play().catch(e => console.log("Sound error:", e));
          addKarsaNotification(`Pesananmu SIAP diantar/ambil! 🛎️`, "success");
        }
        setActiveOrder({ ...activeOrder, status: mappedStatus });
      }
    }
  }, [orders, activeOrder]);

  const placeOrder = (tableNumber: string): Order => {
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
    const totalQty = itemsArray.reduce((sum, item) => sum + item.qty, 0);

    // Call KarsaContext async placeOrder in the background to sync to Firestore
    karsaPlaceOrder(
      itemsArray,
      total,
      localStorage.getItem("karsa_payment_method") || "tunai",
      ""
    ).catch((e) => console.error("Firestore order sync failed", e));

    const newOrder: Order = {
      id: orderID,
      tableNumber,
      customerName: userName,
      items: itemsArray,
      total: total,
      status: "received",
      timestamp: Date.now(),
    };

    // Keep legacy local storage writes for Kasir offline/compat compatibility
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
        totalHarga: total,
        totalItem: totalQty,
        waktuPesan: new Date().toLocaleString('id-ID'),
        tanggal: new Date().toLocaleDateString('id-ID'),
        jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending'
    };

    let pesananHariIni = [];
    try { pesananHariIni = JSON.parse(localStorage.getItem('PESANAN_HARI_INI') || '[]'); } catch(e) {}
    pesananHariIni.push(pesananBaru);
    localStorage.setItem('PESANAN_HARI_INI', JSON.stringify(pesananHariIni));

    let pesananMasuk = [];
    try { pesananMasuk = JSON.parse(localStorage.getItem('karsa_pesanan_masuk') || '[]'); } catch(e) {}
    pesananMasuk.push({
        id: pesananBaru.id,
        nama: userName,
        shadow: true,
        jumlah: totalQty,
        tanggal: pesananBaru.tanggal,
        jam: pesananBaru.jam,
        catatan: 'Order dari App (Meja ' + tableNumber + ')',
        area: area,
        status: 'menunggu',
        waktuMasuk: pesananBaru.waktuPesan,
        totalHarga: total
    });
    localStorage.setItem('karsa_pesanan_masuk', JSON.stringify(pesananMasuk));

    // Trigger canvas-confetti upon order checkout
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#b45309", "#d97706", "#fcd34d", "#ffffff"],
      });
    } catch (e) {}

    addKarsaNotification(`Pesanan Baru Terkirim! Mohon Tunggu Ya! ☕`, "warning");
    addActivityLog(`Order ${orderID} dari ${userName} (Meja ${tableNumber}) — Rp ${total.toLocaleString('id-ID')}`, "order");
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
    // Call KarsaContext async placeReservation
    karsaPlaceReservation({
      name: res.name,
      time: res.time,
      guests: res.guests,
      notes: res.notes
    }).catch(e => console.error("Firestore reservation sync failed", e));

    const resId = Date.now();
    const newRes: Reservation = {
      ...res,
      id: String(resId),
      status: "pending",
      timestamp: resId,
    };

    let existingRes: Reservation[] = [];
    try {
      const existingResJson = localStorage.getItem("karsa_reservations");
      if (existingResJson) {
        existingRes = JSON.parse(existingResJson);
        if (!Array.isArray(existingRes)) {
          existingRes = [];
        }
      }
    } catch (e) {
      existingRes = [];
    }
    localStorage.setItem("karsa_reservations", JSON.stringify([...existingRes, newRes]));

    let pesananMasuk = [];
    try { pesananMasuk = JSON.parse(localStorage.getItem('karsa_pesanan_masuk') || '[]'); } catch(e) {}
    
    const [tanggal, jam] = res.time.split(' ');
    
    pesananMasuk.push({
        id: resId,
        nama: res.name,
        jumlah: res.guests,
        tanggal: tanggal || new Date().toLocaleDateString('id-ID'),
        jam: jam || new Date().toLocaleTimeString('id-ID'),
        catatan: res.notes || 'Reservasi Meja',
        status: 'menunggu',
        waktuMasuk: new Date().toLocaleString('id-ID'),
        isReservation: true
    });
    localStorage.setItem('karsa_pesanan_masuk', JSON.stringify(pesananMasuk));

    addKarsaNotification(`Reservasi untuk ${res.name} berhasil terkirim ke Kasir! 📅`, "success");
    addActivityLog(`Reservasi baru: ${res.name} (${res.time}) untuk ${res.guests} orang`, "login");
    
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => setCart({});

  const addToCart = (name: string, price: number) => {
    const userName = typeof window !== "undefined" ? localStorage.getItem("karsa_user_name") : null;
    const tableNum = typeof window !== "undefined" ? localStorage.getItem("karsa_table_number") : null;

    if (!userName) {
      alert("Eits! Isi namamu dulu ya! ☕");
      window.location.href = "/login";
      return;
    }
    if (!tableNum) {
      addKarsaNotification("Silakan pilih nomor meja dulu ya! 📍", "warning");
      window.dispatchEvent(new Event("openTableModal"));
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

    if (!userName) {
      alert("Eits! Isi namamu dulu ya! ☕");
      window.location.href = "/login";
      return;
    }
    if (!tableNum) {
      addKarsaNotification("Silakan pilih nomor meja dulu ya! 📍", "warning");
      window.dispatchEvent(new Event("openTableModal"));
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
      addActivityLog("Voucher KARSAVIP diaktifkan (Diskon 20%)", "voucher");
      return { success: true, message: `Voucher KARSAVIP aktif! Diskon 20%.` };
    } else if (c === "KOPIGRATIS") {
      setVoucher({ type: "flat", discount: 15000, code: c });
      addActivityLog("Voucher KOPIGRATIS diaktifkan (Potongan Rp 15.000)", "voucher");
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
