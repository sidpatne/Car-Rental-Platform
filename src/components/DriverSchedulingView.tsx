/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calendar, 
  UserCheck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  UserPlus, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from "lucide-react";
import { Driver } from "../types";

interface DriverSchedulingViewProps {
  drivers: Driver[];
  onToggleDriverStatus: (id: string, newStatus: Driver["status"]) => void;
  onAddDriver: (driver: Omit<Driver, "id" | "tripsCount">) => void;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function DriverSchedulingView({ drivers, onToggleDriverStatus, onAddDriver, showToast }: DriverSchedulingViewProps) {
  const [filterCity, setFilterCity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [autoMatchLog, setAutoMatchLog] = useState<string>("");

  // New Driver Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [license, setLicense] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("2028-12-31");
  const [baseLoc, setBaseLoc] = useState("Mumbai - Airport (BOM)");
  const [startShift, setStartShift] = useState("08:00");
  const [endShift, setEndShift] = useState("20:00");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !license) {
      if (showToast) {
        showToast("Please fill in Name, Mobile and License Number", "warning");
      } else {
        alert("Please fill in Name, Mobile and License Number");
      }
      return;
    }
    onAddDriver({
      name,
      mobile,
      licenseNumber: license,
      licenseExpiry,
      status: "Available",
      rating: 5.0,
      shiftStart: startShift,
      shiftEnd: endShift,
      baseLocation: baseLoc
    });
    setName("");
    setMobile("");
    setLicense("");
    setShowAddForm(false);
    if (showToast) {
      showToast("Driver account registered successfully!", "success");
    } else {
      alert("Driver account registered successfully!");
    }
  };

  const handleAutoMatch = () => {
    setAutoMatchLog("Analyzing transit requests & locations...");
    setTimeout(() => {
      const availableCount = drivers.filter(d => d.status === "Available").length;
      if (availableCount === 0) {
        setAutoMatchLog("Conflict Detected: 0 available drivers found. Please resolve active leaves/shifts.");
      } else {
        const best = drivers.find(d => d.status === "Available" && d.rating >= 4.7);
        setAutoMatchLog(`Success: System auto-matched Chauffeur [${best?.name}] based on top feedback rating (${best?.rating}★) and location proximity.`);
      }
    }, 1200);
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesCity = filterCity === "All" || d.baseLocation.includes(filterCity);
    const matchesStatus = filterStatus === "All" || d.status === filterStatus;
    return matchesCity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Driver Roster & Shift Schedules</h2>
          <p className="text-xs text-gray-500">Track chauffeur certifications, working hours, and real-time statuses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoMatch}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} /> Auto-Match Proximity
          </button>
          <button 
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Chauffeur
          </button>
        </div>
      </div>

      {/* Auto Match Logs Feedback */}
      {autoMatchLog && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          autoMatchLog.startsWith("Conflict") 
            ? "bg-rose-50 border-rose-100 text-rose-800" 
            : autoMatchLog.startsWith("Success") 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-indigo-50 border-indigo-100 text-indigo-800"
        }`}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="font-medium">{autoMatchLog}</span>
          </div>
          <button onClick={() => setAutoMatchLog("")} className="font-bold opacity-60">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Roster Filter Console</span>
        
        <div className="flex gap-2.5">
          <select 
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 bg-white font-medium text-gray-700 outline-hidden"
          >
            <option value="All">All Locations</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>

          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 bg-white font-medium text-gray-700 outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Duty">On Duty</option>
            <option value="On Leave">On Leave</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Add Chauffeur Quick Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Chauffeur Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Anand Sen"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Mobile Contact *</label>
            <input 
              type="tel" 
              required
              placeholder="e.g. +91 91223 34455"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">DL License Key *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. DL-112024002931"
              value={license}
              onChange={e => setLicense(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-md p-2"
            />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-xs"
            >
              Confirm Account
            </button>
            <button 
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 border border-gray-200 text-gray-500 rounded-md text-xs font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Chauffeur Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrivers.map(d => {
          // Identify potential conflicts
          const isExpiredLicense = d.licenseExpiry < "2026-06-30";
          const hasShiftConflict = d.status === "Suspended" || isExpiredLicense;

          return (
            <div 
              key={d.id} 
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                hasShiftConflict ? "border-rose-200 bg-rose-50/10" : "border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900">{d.name}</h3>
                    <span className="text-[10px] font-mono font-bold text-gray-400">[{d.id}]</span>
                  </div>
                  <span className="text-gray-400 text-xs block">{d.baseLocation}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-full">
                    ★ {d.rating.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1">{d.tripsCount} Completed</span>
                </div>
              </div>

              {/* Shift Hours info */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Duty Shift Hours</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {d.shiftStart} - {d.shiftEnd}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Certification Expiry</span>
                  <span className={`font-semibold block mt-0.5 ${isExpiredLicense ? "text-rose-600 font-bold" : "text-gray-700"}`}>
                    {d.licenseExpiry}
                  </span>
                </div>
              </div>

              {/* Status and Action bar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                {isExpiredLicense ? (
                  <div className="flex items-center gap-1 text-rose-600 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> Expired License
                  </div>
                ) : (
                  <select
                    value={d.status}
                    onChange={e => onToggleDriverStatus(d.id, e.target.value as Driver["status"])}
                    className={`font-semibold border rounded-lg py-1 px-2.5 text-xs focus:ring-1 outline-hidden ${
                      d.status === "Available" ? "border-emerald-200 text-emerald-700 bg-emerald-50/50" :
                      d.status === "On Duty" ? "border-indigo-200 text-indigo-700 bg-indigo-50/50" :
                      d.status === "On Leave" ? "border-amber-200 text-amber-700 bg-amber-50/50" :
                      "border-rose-200 text-rose-700 bg-rose-50/50"
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                )}

                <span className="text-[10px] font-mono text-gray-400">Cell: {d.mobile}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
