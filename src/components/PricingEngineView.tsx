/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  DollarSign, 
  Settings, 
  MapPin, 
  Car, 
  Clock, 
  Plus, 
  CheckSquare, 
  Tag, 
  ShieldCheck, 
  Info,
  Layers,
  Sparkles
} from "lucide-react";
import { PricingRule, TripType, VehicleCategory } from "../types";

interface PricingEngineViewProps {
  pricingRules: PricingRule[];
  onUpdateRule: (updatedRule: PricingRule) => void;
  onAddRule: (newRule: PricingRule) => void;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function PricingEngineView({ pricingRules, onUpdateRule, onAddRule, showToast }: PricingEngineViewProps) {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Editing Rule Local fields
  const [editBasePrice, setEditBasePrice] = useState(0);
  const [editExtraKmRate, setEditExtraKmRate] = useState(0);
  const [editExtraHourRate, setEditExtraHourRate] = useState(0);
  const [editNightCharges, setEditNightCharges] = useState(0);
  const [editAllowance, setEditAllowance] = useState(0);

  // New Rule Form State
  const [newCity, setNewCity] = useState("Mumbai");
  const [newCategory, setNewCategory] = useState<VehicleCategory>(VehicleCategory.SEDAN);
  const [newTripType, setNewTripType] = useState<TripType>(TripType.LOCAL_8H_80KM);
  const [newBasePrice, setNewBasePrice] = useState(2500);
  const [newExtraKm, setNewExtraKm] = useState(14);
  const [newExtraHour, setNewExtraHour] = useState(150);

  const startEdit = (rule: PricingRule) => {
    setEditingRuleId(rule.id);
    setEditBasePrice(rule.basePrice);
    setEditExtraKmRate(rule.extraKmRate);
    setEditExtraHourRate(rule.extraHourRate);
    setEditNightCharges(rule.nightCharges);
    setEditAllowance(rule.driverAllowancePerDay);
  };

  const handleSaveEdit = (ruleId: string) => {
    const original = pricingRules.find(r => r.id === ruleId);
    if (original) {
      onUpdateRule({
        ...original,
        basePrice: editBasePrice,
        extraKmRate: editExtraKmRate,
        extraHourRate: editExtraHourRate,
        nightCharges: editNightCharges,
        driverAllowancePerDay: editAllowance
      });
      setEditingRuleId(null);
      if (showToast) {
        showToast("Corporate Tariff Rule updated successfully!", "success");
      } else {
        alert("Corporate Tariff Rule updated successfully!");
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRule({
      id: `PR-${Math.floor(Math.random() * 900) + 100}`,
      vehicleCategory: newCategory,
      city: newCity,
      tripType: newTripType,
      basePrice: Number(newBasePrice),
      includedKms: newTripType === TripType.AIRPORT_TRANSFER ? 40 : 80,
      includedHours: newTripType === TripType.AIRPORT_TRANSFER ? 4 : 8,
      extraKmRate: Number(newExtraKm),
      extraHourRate: Number(newExtraHour),
      nightCharges: 250,
      waitingRatePerHour: 120,
      driverAllowancePerDay: 300
    });
    setShowAddForm(false);
    if (showToast) {
      showToast("New custom Tariff SLA logged under city register!", "success");
    } else {
      alert("New custom Tariff SLA logged under city register!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Commercial SLA Pricing Configurations</h2>
          <p className="text-xs text-gray-500">Configure base pricing matrices, extra KM rates, waiting allowances, and GST structures</p>
        </div>
        <button 
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-all self-start md:self-auto"
        >
          <Plus className="w-4.5 h-4.5" /> Append Tariff Rule
        </button>
      </div>

      {/* Add New Rule Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Append Corporate Pricing Rule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Metro City</label>
              <input 
                type="text" 
                required
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-md p-2"
                placeholder="e.g. Hyderabad"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Vehicle Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full text-xs border border-gray-200 rounded-md p-2 bg-white"
              >
                {Object.values(VehicleCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Corporate Trip Contract</label>
              <select
                value={newTripType}
                onChange={e => setNewTripType(e.target.value as any)}
                className="w-full text-xs border border-gray-200 rounded-md p-2 bg-white"
              >
                {Object.values(TripType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Base Charge Package (₹)</label>
              <input 
                type="number" 
                required
                value={newBasePrice}
                onChange={e => setNewBasePrice(Number(e.target.value))}
                className="w-full text-xs border border-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rate per Extra KM (₹)</label>
              <input 
                type="number" 
                required
                value={newExtraKm}
                onChange={e => setNewExtraKm(Number(e.target.value))}
                className="w-full text-xs border border-gray-200 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rate per Extra Hour (₹)</label>
              <input 
                type="number" 
                required
                value={newExtraHour}
                onChange={e => setNewExtraHour(Number(e.target.value))}
                className="w-full text-xs border border-gray-200 rounded-md p-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              Log Tariff
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

      {/* Grid displaying active tariff rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pricingRules.map(rule => {
          const isEditing = editingRuleId === rule.id;

          return (
            <div key={rule.id} className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 bg-indigo-50 text-indigo-600 rounded text-xs font-mono font-bold">
                      {rule.id}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-rose-500" /> {rule.city}
                    </h3>
                  </div>
                  <span className="text-gray-400 text-xs block">{rule.tripType}</span>
                </div>

                <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-2.5 py-1 rounded">
                  {rule.vehicleCategory.split(" ")[0]}
                </span>
              </div>

              {/* Pricing breakdown parameters */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50/60 p-3.5 rounded-lg border border-slate-100/50">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Base SLA Package</span>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={editBasePrice}
                      onChange={e => setEditBasePrice(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded p-1 font-mono text-center text-xs mt-0.5"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 font-mono text-sm block mt-0.5">₹{rule.basePrice}</span>
                  )}
                  <span className="text-[9px] text-gray-400 block mt-0.5">({rule.includedKms}km / {rule.includedHours}h included)</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Extra KM Rate</span>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={editExtraKmRate}
                      onChange={e => setEditExtraKmRate(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded p-1 font-mono text-center text-xs mt-0.5"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 font-mono text-sm block mt-0.5">₹{rule.extraKmRate}/km</span>
                  )}
                  <span className="text-[9px] text-gray-400 block mt-0.5">After limit</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">Extra Hour Rate</span>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={editExtraHourRate}
                      onChange={e => setEditExtraHourRate(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded p-1 font-mono text-center text-xs mt-0.5"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 font-mono text-sm block mt-0.5">₹{rule.extraHourRate}/hr</span>
                  )}
                  <span className="text-[9px] text-gray-400 block mt-0.5">Waiting charges too</span>
                </div>
              </div>

              {/* Secondary parameters like driver allowance and night shift */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600 border-t border-gray-50 pt-2.5">
                <div>
                  Driver Day Allowance: {" "}
                  {isEditing ? (
                    <input 
                      type="number"
                      value={editAllowance}
                      onChange={e => setEditAllowance(Number(e.target.value))}
                      className="w-20 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-xs inline-block ml-1"
                    />
                  ) : (
                    <strong className="text-gray-800 font-mono">₹{rule.driverAllowancePerDay}/day</strong>
                  )}
                </div>
                <div>
                  Night Shift Surcharge: {" "}
                  {isEditing ? (
                    <input 
                      type="number"
                      value={editNightCharges}
                      onChange={e => setEditNightCharges(Number(e.target.value))}
                      className="w-20 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-xs inline-block ml-1"
                    />
                  ) : (
                    <strong className="text-gray-800 font-mono">₹{rule.nightCharges}</strong>
                  )}
                </div>
              </div>

              {/* Edit Operations Buttons */}
              <div className="flex justify-end pt-2">
                {isEditing ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSaveEdit(rule.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold"
                    >
                      Save SLA Changes
                    </button>
                    <button
                      onClick={() => setEditingRuleId(null)}
                      className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-md text-xs font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(rule)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" /> Adjust Tariffs
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
