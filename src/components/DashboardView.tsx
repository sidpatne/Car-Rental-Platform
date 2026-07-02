/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Car, 
  UserCheck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  Clock, 
  CheckCircle2, 
  XCircle,
  Gauge,
  Navigation,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Booking, Driver, Vehicle } from "../types";

interface DashboardProps {
  bookings: Booking[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onSelectBooking: (id: string) => void;
}

// Pre-packaged static analytical historical data
const monthlyTrends = [
  { month: "Jan", revenue: 420000, bookings: 120, profit: 84000 },
  { month: "Feb", revenue: 480000, bookings: 145, profit: 102000 },
  { month: "Mar", revenue: 590000, bookings: 180, profit: 135000 },
  { month: "Apr", revenue: 640000, bookings: 195, profit: 148000 },
  { month: "May", revenue: 720000, bookings: 220, profit: 180000 },
  { month: "Jun", revenue: 850000, bookings: 255, profit: 212500 }
];

const categoryData = [
  { name: "SUV (Innova)", value: 45, color: "#6366f1" },
  { name: "Sedan (Dzire)", value: 30, color: "#14b8a6" },
  { name: "Luxury (Mercedes)", value: 15, color: "#f59e0b" },
  { name: "Premium SUV", value: 10, color: "#ec4899" }
];

export default function DashboardView({ bookings, drivers, vehicles, onSelectBooking }: DashboardProps) {
  const [filterRange, setFilterRange] = useState<"7days" | "30days" | "custom">("30days");
  const [selectedCity, setSelectedCity] = useState<"All" | "Mumbai" | "Delhi" | "Bengaluru">("All");

  // Compute stats dynamically
  const activeTrips = bookings.filter(b => b.status === "Started").length;
  const completedTrips = bookings.filter(b => b.status === "Completed" || b.status === "Invoiced").length;
  const pendingAssignments = bookings.filter(b => b.status === "Confirmed" && !b.assignedDriverId).length;

  const driverUtilization = Math.round(
    (drivers.filter(d => d.status === "On Duty").length / drivers.length) * 100
  );
  
  const fleetUtilization = Math.round(
    (vehicles.filter(v => v.status === "In Trip").length / vehicles.length) * 100
  );

  const availableVehiclesCount = vehicles.filter(v => v.status === "Available").length;

  // Compliance Alerts
  const complianceAlerts = vehicles.filter(v => {
    const fitnessDiff = new Date(v.documents.fitnessExpiry).getTime() - new Date().getTime();
    const insuranceDiff = new Date(v.documents.insuranceExpiry).getTime() - new Date().getTime();
    const pucDiff = new Date(v.documents.pucExpiry).getTime() - new Date().getTime();
    const day = 1000 * 60 * 60 * 24;
    return (fitnessDiff / day < 45) || (insuranceDiff / day < 45) || (pucDiff / day < 45);
  });

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Operational Overview
          </h2>
          <p className="text-xs text-gray-500">Real-time telemetry and commercial analytics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs">
            <button 
              onClick={() => setFilterRange("7days")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filterRange === "7days" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setFilterRange("30days")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filterRange === "30days" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => setFilterRange("custom")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filterRange === "custom" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"}`}
            >
              Custom Range
            </button>
          </div>

          <select 
            value={selectedCity} 
            onChange={(e: any) => setSelectedCity(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 bg-white font-medium text-gray-700 outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Active Trips */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Active Trips</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{activeTrips}</span>
              <span className="text-xs text-emerald-500 font-semibold text-center">Active</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Fleet Utilization */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Fleet Utilized</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-900">{fleetUtilization}%</span>
              <span className="text-xs text-gray-500 font-medium">({availableVehiclesCount} avail)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Driver Utilization */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Driver Duty</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-900">{driverUtilization}%</span>
              <span className="text-xs text-rose-500 font-semibold">{pendingAssignments} unassigned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Row: Compliance Alerts & Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Compliance & Active Notifications alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Compliance Vault Alerts
            </h3>
            <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">
              {complianceAlerts.length} Issues
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {complianceAlerts.map(veh => (
              <div key={veh.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-xs space-y-1">
                <div className="flex justify-between items-center font-bold text-gray-900">
                  <span>{veh.id}</span>
                  <span className="font-medium text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded text-[10px]">
                    {veh.category.split(" ")[0]}
                  </span>
                </div>
                <p className="text-gray-600">{veh.model} • {veh.supplierId === "Self-Owned" ? "Company Asset" : "Vendor Supplied"}</p>
                
                <div className="pt-1.5 grid grid-cols-2 gap-2 border-t border-amber-100 text-[10px] text-gray-500">
                  <div>
                    Fitness: <span className="font-semibold text-rose-600">{veh.documents.fitnessExpiry}</span>
                  </div>
                  <div>
                    Insurance: <span className="font-semibold text-gray-700">{veh.documents.insuranceExpiry}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {complianceAlerts.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                All vehicle certificates are verified and active.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Quick Roster Allocation Widget */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-indigo-600" /> Pending Unassigned Trips
          </h3>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {bookings.filter(b => b.status === "Confirmed" && !b.assignedDriverId).map(b => (
              <div 
                key={b.id} 
                onClick={() => onSelectBooking(b.id)}
                className="p-3 bg-gray-50 hover:bg-indigo-50/30 border border-gray-100 hover:border-indigo-100 rounded-lg text-xs cursor-pointer flex justify-between items-center transition-all group"
              >
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-indigo-600">{b.id}</span>
                  <div className="font-medium text-gray-800">{b.customerName}</div>
                  <div className="text-gray-400 text-[10px]">{b.pickupDate} • {b.pickupTime}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}

            {bookings.filter(b => b.status === "Confirmed" && !b.assignedDriverId).length === 0 && (
              <div className="text-center py-6 text-xs text-gray-400">
                No pending bookings require dispatch scheduling.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts section (Area and Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue and Booking Volume trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-xs p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Commercial Booking & Revenue Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet category breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1.5">
              <Gauge className="w-5 h-5 text-indigo-600" /> Category Distribution
            </h3>
            <div className="h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-800">100%</span>
                <span className="text-[10px] text-gray-400">Total Shares</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-gray-50 pt-3">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex justify-between text-xs items-center">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </span>
                <span className="font-bold text-gray-800">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
