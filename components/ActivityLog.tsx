"use client";

import { useState, useEffect } from "react";

export type ActivityEntry = {
  id: string;
  type: "order" | "status" | "inventory" | "login" | "voucher" | "payment" | "system";
  message: string;
  timestamp: number;
};

// Helper to add activity log from anywhere
export const addActivityLog = (message: string, type: ActivityEntry["type"] = "system") => {
  try {
    const saved = localStorage.getItem("karsa_activity_log");
    let parsed: ActivityEntry[] = [];
    try { parsed = saved ? JSON.parse(saved) : []; if (!Array.isArray(parsed)) parsed = []; } catch (e) { parsed = []; }

    const entry: ActivityEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      timestamp: Date.now(),
    };

    parsed.push(entry);
    // Keep only last 500 entries
    if (parsed.length > 500) parsed = parsed.slice(-500);
    localStorage.setItem("karsa_activity_log", JSON.stringify(parsed));
  } catch (e) {
    console.error("Activity log error:", e);
  }
};

// Full data backup function
export const downloadBackupJSON = () => {
  const backup: Record<string, any> = {};
  const keys = [
    "PESANAN_HARI_INI", "karsa_pesanan_masuk", "karsa_inventory",
    "karsa_orders", "karsa_reservations", "karsa_users",
    "karsa_activity_log", "karsa_notifications",
    "karsa_loyalty_points", "karsa_revenue"
  ];

  for (const key of keys) {
    const val = localStorage.getItem(key);
    if (val) {
      try { backup[key] = JSON.parse(val); } catch { backup[key] = val; }
    }
  }

  backup._meta = {
    exportedAt: new Date().toISOString(),
    source: "Karsa Kafe POS System",
    version: "2.0",
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `karsa-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addActivityLog("Data di-backup ke file JSON", "system");
};

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityEntry[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem("karsa_activity_log");
        if (saved) {
          const parsed: ActivityEntry[] = JSON.parse(saved);
          setLogs(parsed.sort((a, b) => b.timestamp - a.timestamp));
        }
      } catch (e) {}
    };
    load();
    const interval = setInterval(load, 3000);
    window.addEventListener("storage", load);
    return () => { clearInterval(interval); window.removeEventListener("storage", load); };
  }, []);

  const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
    order:     { bg: "bg-green-500/10", text: "text-green-400", icon: "🛒" },
    status:    { bg: "bg-blue-500/10",  text: "text-blue-400",  icon: "🔄" },
    inventory: { bg: "bg-red-500/10",   text: "text-red-400",   icon: "📦" },
    login:     { bg: "bg-purple-500/10", text: "text-purple-400", icon: "🔐" },
    voucher:   { bg: "bg-amber-500/10", text: "text-amber-400", icon: "🎫" },
    payment:   { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "💳" },
    system:    { bg: "bg-stone-500/10", text: "text-stone-400", icon: "⚙️" },
  };

  const filtered = filterType === "all" ? logs : logs.filter(l => l.type === filterType);
  const displayed = isExpanded ? filtered : filtered.slice(0, 10);

  const clearLogs = () => {
    if (confirm("Hapus semua log aktivitas?")) {
      localStorage.setItem("karsa_activity_log", "[]");
      setLogs([]);
    }
  };

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">Activity Log</h2>
          <span className="text-[9px] font-bold text-stone-600 bg-white/5 px-2 py-0.5 rounded">{logs.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadBackupJSON}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition"
            title="Download Backup JSON"
          >
            📥 Backup
          </button>
          <button
            onClick={clearLogs}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["all", "order", "status", "inventory", "login", "payment", "system"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all ${
              filterType === t
                ? "bg-amber-500/20 border-amber-500/40 text-amber-500"
                : "bg-white/[0.02] border-white/5 text-stone-600 hover:text-stone-400"
            }`}
          >
            {t === "all" ? "Semua" : t}
          </button>
        ))}
      </div>

      {/* Log Entries */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {displayed.length === 0 ? (
          <p className="text-center text-stone-600 text-xs italic py-8">Belum ada log aktivitas.</p>
        ) : (
          displayed.map((log) => {
            const colors = typeColors[log.type] || typeColors.system;
            return (
              <div
                key={log.id}
                className={`flex items-start gap-3 p-3 rounded-xl ${colors.bg} border border-white/[0.03] hover:border-white/10 transition`}
              >
                <span className="text-sm mt-0.5">{colors.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-bold ${colors.text} truncate`}>{log.message}</p>
                  <p className="text-[9px] text-stone-600 font-mono mt-0.5">
                    {new Date(log.timestamp).toLocaleString("id-ID", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit"
                    })}
                  </p>
                </div>
                <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} shrink-0`}>
                  {log.type}
                </span>
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 10 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 text-[10px] font-bold text-stone-500 hover:text-amber-500 transition uppercase tracking-widest"
        >
          {isExpanded ? "Sembunyikan" : `Lihat Semua (${filtered.length})`}
        </button>
      )}
    </div>
  );
}
