"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  query,
  orderBy
} from "firebase/firestore";
import { addKarsaNotification } from "./NotificationHub";
import { addActivityLog } from "./ActivityLog";

// Type definitions
export type TableStatus = "available" | "occupied" | "reserved";

export interface KarsaTable {
  id: number;
  area: "Indoor" | "Outdoor";
  status: TableStatus;
  customerName: string | null;
  checkedInAt: number | null;
}

export interface KarsaOrderItem {
  nama: string;
  harga: number;
  qty: number;
  subtotal: number;
}

export interface KarsaOrder {
  orderID: string;
  id: number; // timestamp
  nama: string;
  meja: string;
  area: string;
  items: KarsaOrderItem[];
  totalHarga: number;
  totalItem: number;
  waktuPesan: string;
  tanggal: string;
  jam: string;
  status: "Pending" | "Diracik" | "Dikonfirmasi" | "Selesai";
  paymentMethod?: string;
  notes?: string;
}

export interface KarsaReservation {
  id: string;
  name: string;
  time: string;
  guests: number;
  notes: string;
  status: "pending" | "arrived" | "cancelled";
  timestamp: number;
}

interface KarsaContextType {
  tables: KarsaTable[];
  orders: KarsaOrder[];
  reservations: KarsaReservation[];
  inventory: Record<string, number>;
  userPoints: number;
  userId: string | null;
  userName: string | null;
  userAvatar: string | null;
  activeTableNumber: string | null;
  activeArea: string | null;

  // Seating actions
  checkInTable: (tableNum: number, area: "Indoor" | "Outdoor", name: string) => Promise<void>;
  checkOutTable: (tableNum: number) => Promise<void>;
  
  // Order actions
  placeOrder: (
    items: { name: string; price: number; qty: number }[],
    total: number,
    paymentMethod: string,
    notes: string
  ) => Promise<string>;
  updateOrderStatus: (orderID: string, newStatus: KarsaOrder["status"]) => Promise<void>;
  
  // Reservation actions
  placeReservation: (res: Omit<KarsaReservation, "id" | "status" | "timestamp">) => Promise<void>;
  updateReservationStatus: (id: string, status: KarsaReservation["status"]) => Promise<void>;
  
  // Inventory actions
  updateStock: (itemName: string, delta: number) => Promise<void>;
  setStock: (itemName: string, stock: number) => Promise<void>;
  resetAllStock: () => Promise<void>;
  
  // Loyalty Point actions
  addUserPoints: (pointsToAdd: number) => Promise<void>;
  syncLoyaltyPoints: (name: string) => Promise<void>;
}

const KarsaContext = createContext<KarsaContextType | undefined>(undefined);

// Default Menu Items Inventory
const DEFAULT_INVENTORY: Record<string, number> = {
  "Kentang Goreng": 20,
  "Nugget/Sosis": 15,
  "Roti Bakar": 12,
  "Cireng/Dimsum": 10,
  "Espresso": 30,
  "Americano": 25,
  "Cappuccino": 20,
  "Latte": 20,
  "Mochaccino": 15,
  "Teh Tarik": 15,
  "Lemon Tea": 25,
  "Chocolate": 15,
  "Milo": 20,
  "Matcha": 12,
  "Es Kopi Susu": 30,
  "Milkshake": 15,
  "Smoothies": 10,
  "Cake Slice": 10,
  "Brownies": 12,
  "Donat": 20,
  "Croissant": 15,
  "Waffle": 10,
  "Kopi Susu Karsa": 30,
  "Iced Americano": 25,
  "Matcha Latte": 20,
  "Red Velvet Latte": 15,
  "Nasi Goreng Katsu": 10,
  "Indomie Spesial": 20,
  "Mix Platter": 12
};

const DEFAULT_TABLES: KarsaTable[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  area: i + 1 <= 10 ? "Indoor" : "Outdoor",
  status: "available",
  customerName: null,
  checkedInAt: null
}));

export function KarsaProvider({ children }: { children: React.ReactNode }) {
  const [tables, setTables] = useState<KarsaTable[]>(DEFAULT_TABLES);
  const [orders, setOrders] = useState<KarsaOrder[]>([]);
  const [reservations, setReservations] = useState<KarsaReservation[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>(DEFAULT_INVENTORY);
  const [userPoints, setUserPoints] = useState<number>(0);
  
  // User Session Stats
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [activeTableNumber, setActiveTableNumber] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<string | null>(null);

  // Sync session state from localStorage
  const checkSession = useCallback(() => {
    if (typeof window !== "undefined") {
      setUserName(localStorage.getItem("karsa_user_name"));
      setUserId(localStorage.getItem("karsa_uid") || localStorage.getItem("karsa_user_name")); // Fallback to username if uid doesn't exist
      setUserAvatar(localStorage.getItem("karsa_user_avatar"));
      setActiveTableNumber(localStorage.getItem("karsa_table_number"));
      setActiveArea(localStorage.getItem("karsa_area"));
    }
  }, []);

  useEffect(() => {
    checkSession();
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, [checkSession]);

  // Seeding initial collections in Firestore if they are empty
  const seedDatabaseIfNeeded = useCallback(async () => {
    if (!db) return;
    try {
      // 1. Seed Tables
      const tablesRef = collection(db, "tables");
      const tablesSnap = await getDocs(tablesRef);
      if (tablesSnap.empty) {
        console.log("🌱 Seeding 15 tables in Firestore...");
        for (let i = 1; i <= 15; i++) {
          const area: "Indoor" | "Outdoor" = i <= 10 ? "Indoor" : "Outdoor";
          await setDoc(doc(db, "tables", `table_${i}`), {
            id: i,
            area,
            status: "available",
            customerName: null,
            checkedInAt: null
          });
        }
      }

      // 2. Seed Inventory
      const inventoryRef = collection(db, "inventory");
      const inventorySnap = await getDocs(inventoryRef);
      if (inventorySnap.empty) {
        console.log("🌱 Seeding default menu inventory in Firestore...");
        for (const [name, stock] of Object.entries(DEFAULT_INVENTORY)) {
          await setDoc(doc(db, "inventory", name), { name, stock, isAvailable: stock > 0 });
        }
      }
    } catch (error) {
      console.error("❌ Seeding database failed:", error);
    }
  }, []);

  // Set up real-time onSnapshot listeners from Firestore
  useEffect(() => {
    seedDatabaseIfNeeded();

    if (!db) {
      // Offline fallback: load everything from localStorage initially
      if (typeof window !== "undefined") {
        try {
          const localOrders = JSON.parse(localStorage.getItem("PESANAN_HARI_INI") || "[]");
          setOrders(localOrders);
          const localInv = JSON.parse(localStorage.getItem("karsa_inventory") || "{}");
          setInventory(Object.keys(localInv).length ? localInv : DEFAULT_INVENTORY);
        } catch (e) {}
      }
      return;
    }

    // 1. Real-time Tables Sync
    const unsubscribeTables = onSnapshot(collection(db, "tables"), (snapshot) => {
      const updatedTables: KarsaTable[] = [];
      snapshot.forEach((docSnap) => {
        updatedTables.push(docSnap.data() as KarsaTable);
      });
      // Sort tables by ID
      updatedTables.sort((a, b) => a.id - b.id);
      setTables(updatedTables);

      // Backport to localStorage for statusMeja and Capacity computations
      const occupiedIds = updatedTables.filter(t => t.status !== "available").map(t => t.id);
      const indoorUsed = updatedTables.filter(t => t.area === "Indoor" && t.status !== "available").length;
      const outdoorUsed = updatedTables.filter(t => t.area === "Outdoor" && t.status !== "available").length;
      localStorage.setItem("karsa_area_capacity", JSON.stringify({
        indoor: { total: 10, used: indoorUsed },
        outdoor: { total: 5, used: outdoorUsed }
      }));
      window.dispatchEvent(new Event("storage"));
    }, (err) => console.error("Firestore Tables listener error:", err));

    // 2. Real-time Orders Sync (Orders for today/active)
    const ordersQuery = query(collection(db, "orders"), orderBy("id", "desc"));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const updatedOrders: KarsaOrder[] = [];
      const pesananMasuk: any[] = [];
      
      snapshot.forEach((docSnap) => {
        const order = docSnap.data() as KarsaOrder;
        updatedOrders.push(order);
        
        // Map to karsa_pesanan_masuk for Kasir view
        if (order.status !== "Selesai") {
          pesananMasuk.push({
            id: order.id,
            nama: order.nama,
            jumlah: order.totalItem,
            tanggal: order.tanggal,
            jam: order.jam,
            catatan: order.notes || `Order (Meja ${order.meja})`,
            area: order.area,
            status: order.status === "Pending" ? "menunggu" : "diproses",
            waktuMasuk: order.waktuPesan,
            totalHarga: order.totalHarga
          });
        }
      });

      // Sound notification on new order (Chef alert)
      setOrders((prev) => {
        const isNewArrival = updatedOrders.length > prev.length && prev.length > 0;
        if (isNewArrival) {
          try {
            const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            audio.volume = 0.4;
            audio.play().catch(() => {});
          } catch (e) {}
          addKarsaNotification("Pesanan Baru Masuk! 🛎️", "warning");
        }
        return updatedOrders;
      });

      // Sync to legacy local storage to support Kasir dashboard seamlessly
      localStorage.setItem("PESANAN_HARI_INI", JSON.stringify(updatedOrders));
      localStorage.setItem("karsa_pesanan_masuk", JSON.stringify(pesananMasuk));
      window.dispatchEvent(new Event("storage"));
    }, (err) => console.error("Firestore Orders listener error:", err));

    // 3. Real-time Inventory Sync
    const unsubscribeInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const updatedInv: Record<string, number> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.name) {
          updatedInv[data.name] = data.stock;
        }
      });
      setInventory(updatedInv);
      
      // Mirror to localstorage
      localStorage.setItem("karsa_inventory", JSON.stringify(updatedInv));
      window.dispatchEvent(new Event("storage"));
    }, (err) => console.error("Firestore Inventory listener error:", err));

    // 4. Real-time Reservations Sync
    const reservationsQuery = query(collection(db, "reservations"), orderBy("timestamp", "desc"));
    const unsubscribeReservations = onSnapshot(reservationsQuery, (snapshot) => {
      const updatedRes: KarsaReservation[] = [];
      snapshot.forEach((docSnap) => {
        updatedRes.push(docSnap.data() as KarsaReservation);
      });
      setReservations(updatedRes);
      localStorage.setItem("karsa_reservations", JSON.stringify(updatedRes));
      window.dispatchEvent(new Event("storage"));
    }, (err) => console.error("Firestore Reservations listener error:", err));

    return () => {
      unsubscribeTables();
      unsubscribeOrders();
      unsubscribeInventory();
      unsubscribeReservations();
    };
  }, [seedDatabaseIfNeeded]);

  // Sync specific user points based on Firestore
  const syncLoyaltyPoints = useCallback(async (name: string) => {
    if (!db || !name) return;
    try {
      const pointsRef = doc(db, "loyalty_points", name);
      const pointsSnap = await getDoc(pointsRef);
      if (pointsSnap.exists()) {
        const points = pointsSnap.data().points || 0;
        setUserPoints(points);
        localStorage.setItem(`karsa_points_${name}`, String(points));
      } else {
        await setDoc(pointsRef, { name, points: 0 });
        setUserPoints(0);
        localStorage.setItem(`karsa_points_${name}`, "0");
      }
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Points Sync error", e);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      syncLoyaltyPoints(userName);
    }
  }, [userName, syncLoyaltyPoints]);

  // Seating Action: Check-in customer to Table
  const checkInTable = async (tableNum: number, area: "Indoor" | "Outdoor", name: string) => {
    const tableStr = String(tableNum).padStart(2, "0");
    
    // 1. Update local storage for immediate Client response
    localStorage.setItem("karsa_table_number", tableStr);
    localStorage.setItem("karsa_area", area);
    localStorage.setItem("karsa_jam_masuk", new Date().toISOString());
    checkSession();
    
    // 2. Write to Firestore if connected
    if (db) {
      try {
        const tableRef = doc(db, "tables", `table_${tableNum}`);
        await updateDoc(tableRef, {
          status: "occupied",
          customerName: name,
          checkedInAt: Date.now()
        });

        // Add a check-in record to orders as notification
        await addDoc(collection(db, "checkins"), {
          id: Date.now(),
          nama: name,
          meja: `Meja ${tableStr}`,
          area,
          tanggal: new Date().toLocaleDateString("id-ID"),
          jam: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          status: "menunggu"
        });
      } catch (e) {
        console.error("Firestore table check-in failed, using Local Mode", e);
      }
    }

    addActivityLog(`${name} memilih Meja ${tableStr} (${area})`, "login");
    addKarsaNotification(`Meja ${tableStr} (${area}) dipilih. Selamat menikmati! ☕`, "success");
    window.dispatchEvent(new Event("storage"));
  };

  // Seating Action: Check-out table
  const checkOutTable = async (tableNum: number) => {
    if (db) {
      try {
        const tableRef = doc(db, "tables", `table_${tableNum}`);
        await updateDoc(tableRef, {
          status: "available",
          customerName: null,
          checkedInAt: null
        });
      } catch (e) {
        console.error("Firestore table checkout failed", e);
      }
    }
    
    if (typeof window !== "undefined") {
      const activeNum = localStorage.getItem("karsa_table_number");
      if (Number(activeNum) === tableNum) {
        localStorage.removeItem("karsa_table_number");
        localStorage.removeItem("karsa_area");
        localStorage.removeItem("karsa_jam_masuk");
        checkSession();
      }
    }
    window.dispatchEvent(new Event("storage"));
  };

  // Place checkout order
  const placeOrder = async (
    items: { name: string; price: number; qty: number }[],
    total: number,
    paymentMethod: string,
    notes: string
  ): Promise<string> => {
    const tableNum = activeTableNumber || "00";
    const area = activeArea || "Indoor";
    const custName = userName || "Sultan";
    const orderID = `KRSA-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = Date.now();
    const waktuPesan = new Date().toLocaleString("id-ID");
    const tanggal = new Date().toLocaleDateString("id-ID");
    const jam = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const totalQty = items.reduce((sum, it) => sum + it.qty, 0);

    const orderData: KarsaOrder = {
      orderID,
      id: timestamp,
      nama: custName,
      meja: tableNum,
      area,
      items: items.map(it => ({
        nama: it.name,
        harga: it.price,
        qty: it.qty,
        subtotal: it.price * it.qty
      })),
      totalHarga: total,
      totalItem: totalQty,
      waktuPesan,
      tanggal,
      jam,
      status: "Pending",
      paymentMethod,
      notes
    };

    // 1. Deduct stock and update Firestore
    if (db) {
      try {
        // Write order document
        await setDoc(doc(db, "orders", orderID), orderData);
        
        // Deduct inventory items in Firestore
        for (const item of items) {
          const invRef = doc(db, "inventory", item.name);
          const invSnap = await getDoc(invRef);
          if (invSnap.exists()) {
            const currentStock = invSnap.data().stock || 0;
            const nextStock = Math.max(0, currentStock - item.qty);
            await updateDoc(invRef, {
              stock: nextStock,
              isAvailable: nextStock > 0
            });
          }
        }

        // Add Loyalty Points (1 point for every Rp 10.000 spent)
        const earnedPoints = Math.floor(total / 10000);
        if (earnedPoints > 0) {
          const loyaltyRef = doc(db, "loyalty_points", custName);
          const loyaltySnap = await getDoc(loyaltyRef);
          let currentPoints = 0;
          if (loyaltySnap.exists()) {
            currentPoints = loyaltySnap.data().points || 0;
          }
          await setDoc(loyaltyRef, { name: custName, points: currentPoints + earnedPoints });
          syncLoyaltyPoints(custName);
        }
      } catch (e) {
        console.error("Firestore order placement failed, falling back to Local Mode", e);
        // Deduct offline stock locally
        const localInv = JSON.parse(localStorage.getItem("karsa_inventory") || "{}");
        items.forEach(it => {
          if (localInv[it.name] !== undefined) {
            localInv[it.name] = Math.max(0, localInv[it.name] - it.qty);
          }
        });
        localStorage.setItem("karsa_inventory", JSON.stringify(localInv));
      }
    }

    addActivityLog(`Order ${orderID} dari ${custName} (Meja ${tableNum}) — Rp ${total.toLocaleString("id-ID")}`, "order");
    addKarsaNotification(`Pesanan Baru Terkirim! Mohon Tunggu Ya! ☕`, "warning");
    window.dispatchEvent(new Event("storage"));

    return orderID;
  };

  // Update order status (Called from Kasir or Dapur page)
  const updateOrderStatus = async (orderID: string, newStatus: KarsaOrder["status"]) => {
    if (db) {
      try {
        const orderRef = doc(db, "orders", orderID);
        await updateDoc(orderRef, { status: newStatus });
      } catch (e) {
        console.error("Firestore order status update failed", e);
      }
    }

    // Fallback sync to local state
    setOrders(prev => {
      const nextOrders = prev.map(o => o.orderID === orderID ? { ...o, status: newStatus } : o);
      localStorage.setItem("PESANAN_HARI_INI", JSON.stringify(nextOrders));
      return nextOrders;
    });

    addActivityLog(`Order ${orderID} status ➔ ${newStatus}`, "status");
    window.dispatchEvent(new Event("storage"));
  };

  // Place Reservation
  const placeReservation = async (res: Omit<KarsaReservation, "id" | "status" | "timestamp">) => {
    const timestamp = Date.now();
    const id = String(timestamp);
    const reservationData: KarsaReservation = {
      ...res,
      id,
      status: "pending",
      timestamp
    };

    if (db) {
      try {
        await setDoc(doc(db, "reservations", id), reservationData);
      } catch (e) {
        console.error("Firestore reservation placement failed", e);
      }
    }

    // Notification & activity log handled by CartProvider.placeReservation to avoid duplicates
    window.dispatchEvent(new Event("storage"));
  };

  // Update Reservation Status
  const updateReservationStatus = async (id: string, status: KarsaReservation["status"]) => {
    if (db) {
      try {
        const resRef = doc(db, "reservations", id);
        await updateDoc(resRef, { status });
      } catch (e) {
        console.error("Firestore reservation status update failed", e);
      }
    }
    
    // Fallback sync
    setReservations(prev => {
      const next = prev.map(r => r.id === id ? { ...r, status } : r);
      localStorage.setItem("karsa_reservations", JSON.stringify(next));
      return next;
    });
    window.dispatchEvent(new Event("storage"));
  };

  // Update Inventory Stock (relative adjust)
  const updateStock = async (itemName: string, delta: number) => {
    if (db) {
      try {
        const invRef = doc(db, "inventory", itemName);
        const invSnap = await getDoc(invRef);
        if (invSnap.exists()) {
          const currentStock = invSnap.data().stock || 0;
          const nextStock = Math.max(0, currentStock + delta);
          await updateDoc(invRef, {
            stock: nextStock,
            isAvailable: nextStock > 0
          });
        }
      } catch (e) {
        console.error("Firestore stock adjustment failed", e);
      }
    }
  };

  // Set Inventory Stock (absolute set)
  const setStock = async (itemName: string, stock: number) => {
    const validStock = Math.max(0, stock);
    if (db) {
      try {
        const invRef = doc(db, "inventory", itemName);
        await updateDoc(invRef, {
          stock: validStock,
          isAvailable: validStock > 0
        });
      } catch (e) {
        console.error("Firestore set stock failed", e);
      }
    }
  };

  // Reset all stock to defaults
  const resetAllStock = async () => {
    if (db) {
      try {
        for (const [name, stock] of Object.entries(DEFAULT_INVENTORY)) {
          await setDoc(doc(db, "inventory", name), {
            name,
            stock,
            isAvailable: stock > 0
          });
        }
        addActivityLog("Seluruh stok diset ulang ke default", "status");
      } catch (e) {
        console.error("Firestore reset stock failed", e);
      }
    }
  };

  // Manual Loyalty Point adjust
  const addUserPoints = async (pointsToAdd: number) => {
    if (!userName) return;
    const nextPoints = userPoints + pointsToAdd;
    setUserPoints(nextPoints);
    localStorage.setItem(`karsa_points_${userName}`, String(nextPoints));

    if (db) {
      try {
        const loyaltyRef = doc(db, "loyalty_points", userName);
        await setDoc(loyaltyRef, { name: userName, points: nextPoints });
      } catch (e) {
        console.error("Firestore points update failed", e);
      }
    }
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <KarsaContext.Provider
      value={{
        tables,
        orders,
        reservations,
        inventory,
        userPoints,
        userId,
        userName,
        userAvatar,
        activeTableNumber,
        activeArea,
        checkInTable,
        checkOutTable,
        placeOrder,
        updateOrderStatus,
        placeReservation,
        updateReservationStatus,
        updateStock,
        setStock,
        resetAllStock,
        addUserPoints,
        syncLoyaltyPoints
      }}
    >
      {children}
    </KarsaContext.Provider>
  );
}

export function useKarsa() {
  const context = useContext(KarsaContext);
  if (context === undefined) {
    throw new Error("useKarsa must be used within a KarsaProvider");
  }
  return context;
}
