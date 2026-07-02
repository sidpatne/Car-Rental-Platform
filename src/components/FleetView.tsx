/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Car, 
  Settings, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Fuel, 
  FileText, 
  Plus, 
  Trash2,
  SlidersHorizontal,
  Info
} from "lucide-react";
import { Vehicle, VehicleCategory } from "../types";

interface FleetViewProps {
  vehicles: Vehicle[];
  onToggleVehicleStatus: (id: string, newStatus: Vehicle["status"]) => void;
  onAddVehicle: (newVeh: Vehicle) => void;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function FleetView({ vehicles, onToggleVehicleStatus, onAddVehicle, showToast }: FleetViewProps) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Vehicle Form State
  const [regNo, setRegNo] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState<VehicleCategory>(VehicleCategory.SUV);
  const [fuelType, setFuelType] = useState<Vehicle["fuelType"]>("Diesel");
  const [mileage, setMileage] = useState(12.5);
  const [insExpiry, setInsExpiry] = useState("2027-01-01");
  const [fitExpiry, setFitExpiry] = useState("2027-01-01");
  const [pucExpiry, setPucExpiry] = useState("2026-12-31");
  const [permExpiry, setPermExpiry] = useState("2028-01-01");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo || !model) {
      if (showToast) {
        showToast("Please specify Plate Number and Car Model", "warning");
      } else {
        alert("Please specify Plate Number and Car Model");
      }
      return;
    }
    onAddVehicle({
      id: regNo,
      model,
      category,
      supplierId: "Self-Owned",
      status: "Available",
      fuelType,
      mileageKmpl: Number(mileage),
      fuelLevel: 100,
      currentLocationName: "Company HQ Base",
      documents: {
        insuranceExpiry: insExpiry,
        fitnessExpiry: fitExpiry,
        pucExpiry: pucExpiry,
        permitExpiry: permExpiry
      }
    });

    setRegNo("");
    setModel("");
    setShowAddForm(false);
    if (showToast) {
      showToast("New vehicle asset logged into secure registry!", "success");
    } else {
      alert("New vehicle asset logged into secure registry!");
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = filterCategory === "All" || v.category === filterCategory;
    const matchesStatus = filterStatus === "All" || v.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Fleet Assets & Compliance Vault</h2>
          <p className="text-xs text-gray-500">Manage vehicle registration sheets, fuel metrics, and mandatory regulatory filings</p>
        </div>
        <button 
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-all self-start md:self-auto"
        >
          <Plus className="w-4.5 h-4.5" /> Register Vehicle Asset
        </button>
      </div>

      {/* Roster Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fleet Filter Console</span>
        
        <div className="flex gap-2.5">
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 bg-white font-medium text-gray-700 outline-hidden"
          >
            <option value="All">All Vehicle Classes</option>
            {Object.values(VehicleCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg py-1.5 px-3 bg-white font-medium text-gray-700 outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Trip">In Trip</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Add Vehicle Quick Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-xl border border-indigo-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Register New Fleet Asset</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Plate Number (Registration) *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. MH-12-RS-9020"
                value={regNo}
                onChange={e => setRegNo(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Car Model *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Toyota Innova Crysta"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Vehicle Category Class</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value as VehicleCategory)}
                className="w-full text-xs border border-gray-200 rounded-md p-2 bg-white"
              >
                {Object.values(VehicleCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fuel Type</label>
              <select 
                value={fuelType}
                onChange={e => setFuelType(e.target.value as any)}
                className="w-full text-xs border border-gray-200 rounded-md p-2 bg-white"
              >
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Insurance Expiry Date</label>
              <input type="date" value={insExpiry} onChange={e => setInsExpiry(e.target.value)} className="w-full border border-gray-200 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fitness Cert Expiry</label>
              <input type="date" value={fitExpiry} onChange={e => setFitExpiry(e.target.value)} className="w-full border border-gray-200 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">PUC Certificate Expiry</label>
              <input type="date" value={pucExpiry} onChange={e => setPucExpiry(e.target.value)} className="w-full border border-gray-200 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Commercial Permit Expiry</label>
              <input type="date" value={permExpiry} onChange={e => setPermExpiry(e.target.value)} className="w-full border border-gray-200 rounded-md p-2" />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
            >
              Verify & Add Asset
            </button>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map(v => {
          // Identify compliance anomalies
          const isInsExpired = v.documents.insuranceExpiry < "2026-06-30";
          const isFitExpired = v.documents.fitnessExpiry < "2026-06-30";
          const isPucExpired = v.documents.pucExpiry < "2026-06-30";
          const hasViolation = isInsExpired || isFitExpired || isPucExpired;

          return (
            <div 
              key={v.id} 
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                hasViolation ? "border-rose-200 bg-rose-50/10" : "border-gray-100"
              }`}
            >
              {/* Card Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                      <Car className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{v.id}</h4>
                      <span className="text-[10px] text-gray-400 font-mono block">{v.model}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded">
                    {v.category.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 font-semibold flex items-center gap-0.5">
                    <Fuel className="w-3.5 h-3.5 text-gray-400" />
                    {v.fuelType} ({v.mileageKmpl} km/l)
                  </span>
                </div>
              </div>

              {/* Fuel and Location telemetry */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100/70">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Fuel Gauge</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${v.fuelLevel}%` }} 
                        className={`h-full ${v.fuelLevel < 30 ? "bg-rose-500" : "bg-emerald-500"}`}
                      ></div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-gray-700">{v.fuelLevel}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Last Location Ping</span>
                  <span className="font-bold text-gray-700 block truncate mt-0.5" title={v.currentLocationName}>
                    {v.currentLocationName || "Unknown Base"}
                  </span>
                </div>
              </div>

              {/* Regulatory Compliances */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-0.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" /> Documents Compliance
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600">
                  <div className="flex justify-between border-b border-gray-50 pb-0.5">
                    <span>Insurance:</span>
                    <span className={isInsExpired ? "text-rose-600 font-bold" : "text-gray-500"}>{v.documents.insuranceExpiry}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-0.5">
                    <span>Fitness:</span>
                    <span className={isFitExpired ? "text-rose-600 font-bold" : "text-gray-500"}>{v.documents.fitnessExpiry}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-0.5">
                    <span>PUC Cert:</span>
                    <span className={isPucExpired ? "text-rose-600 font-bold" : "text-gray-500"}>{v.documents.pucExpiry}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-0.5">
                    <span>Permit:</span>
                    <span className="text-gray-500">{v.documents.permitExpiry}</span>
                  </div>
                </div>
              </div>

              {/* Actions & Status Dropdown */}
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-50 text-xs">
                {hasViolation ? (
                  <div className="flex items-center gap-1 text-rose-600 font-bold">
                    <AlertTriangle className="w-4 h-4" /> Compliance Violation
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Compliances Clear
                  </div>
                )}

                <select
                  value={v.status}
                  onChange={e => onToggleVehicleStatus(v.id, e.target.value as Vehicle["status"])}
                  className={`font-semibold border rounded-lg py-1 px-2 text-[11px] outline-hidden focus:ring-1 ${
                    v.status === "Available" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                    v.status === "In Trip" ? "border-indigo-200 text-indigo-700 bg-indigo-50" :
                    v.status === "Maintenance" ? "border-amber-200 text-amber-700 bg-amber-50" :
                    "border-rose-200 text-rose-700 bg-rose-50"
                  }`}
                >
                  <option value="Available">Available</option>
                  <option value="In Trip">In Trip</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
