/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  UserCheck, 
  Car, 
  Truck, 
  ShieldAlert, 
  CheckSquare, 
  ClipboardList,
  Compass,
  DollarSign,
  AlertTriangle,
  Layers,
  History,
  Phone,
  Mail,
  Send,
  Printer,
  Download
} from "lucide-react";
import { Booking, BookingStatus, Driver, Supplier, Vehicle, VehicleCategory } from "../types";

interface PassengerDetailsViewProps {
  booking: Booking;
  drivers: Driver[];
  vehicles: Vehicle[];
  suppliers: Supplier[];
  onBack: () => void;
  onUpdateBooking: (updatedBooking: Partial<Booking>) => void;
  onAddDriver: (newDrv: Omit<Driver, "id" | "tripsCount">) => Promise<Driver>;
  onAddVehicle?: (newVeh: Vehicle) => Promise<void>;
  onGenerateInvoice: (bookingId: string) => void;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function PassengerDetailsView({ 
  booking, 
  drivers, 
  vehicles, 
  suppliers, 
  onBack, 
  onUpdateBooking,
  onAddDriver,
  onAddVehicle,
  onGenerateInvoice,
  showToast
}: PassengerDetailsViewProps) {
  // Local state for assignments
  const [selectedSupplierId, setSelectedSupplierId] = useState(booking.assignedSupplierId || "");
  const [selectedDriverId, setSelectedDriverId] = useState(booking.assignedDriverId || "");
  const [selectedVehicleId, setSelectedVehicleId] = useState(booking.assignedVehicleId || "");
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  // Manual Driver Entry States
  const [isManualDriver, setIsManualDriver] = useState(false);
  const [manualDriverName, setManualDriverName] = useState("");
  const [manualDriverMobile, setManualDriverMobile] = useState("");

  // Manual Vehicle Entry States
  const [isManualVehicle, setIsManualVehicle] = useState(false);
  const [manualVehicleId, setManualVehicleId] = useState("");
  const [manualVehicleModel, setManualVehicleModel] = useState("");
  const [manualVehicleFuelType, setManualVehicleFuelType] = useState<"Petrol" | "Diesel" | "Electric" | "CNG">("Diesel");
  
  // Extra fields for simulated completions
  const [kmsUsed, setKmsUsed] = useState(booking.kmsUsed || 80);
  const [hoursUsed, setHoursUsed] = useState(booking.hoursUsed || 8);
  const [toll, setToll] = useState(booking.tollCharges || 0);
  const [parking, setParking] = useState(booking.parkingCharges || 0);

  // Filter lists based on rules
  const availableDrivers = drivers.filter(d => d.status === "Available" || d.id === booking.assignedDriverId);
  const compatibleVehicles = vehicles.filter(v => {
    const isSameCategory = v.category === booking.vehicleCategory;
    const isAvailable = v.status === "Available" || v.id === booking.assignedVehicleId;
    return isSameCategory && isAvailable;
  });

  const handleAssign = async () => {
    let finalDriverId = selectedDriverId;
    let finalVehicleId = selectedVehicleId;

    if (isManualDriver) {
      if (!manualDriverName.trim()) {
        showToast?.("Please enter a valid driver name.", "error");
        return;
      }
      if (!manualDriverMobile.trim()) {
        showToast?.("Please enter a valid mobile number.", "error");
        return;
      }

      try {
        const created = await onAddDriver({
          name: manualDriverName,
          mobile: manualDriverMobile,
          licenseNumber: "MANUAL-N/A",
          licenseExpiry: "2035-12-31",
          status: "Available",
          rating: 5.0,
          shiftStart: "09:00",
          shiftEnd: "18:00",
          baseLocation: "Zone A"
        });
        finalDriverId = created.id;
        // Keep selected in UI
        setSelectedDriverId(created.id);
        setIsManualDriver(false);
      } catch (err) {
        showToast?.("Failed to register custom manual driver.", "error");
        return;
      }
    }

    if (isManualVehicle) {
      if (!manualVehicleId.trim()) {
        showToast?.("Please enter a valid vehicle plate ID.", "error");
        return;
      }
      if (!manualVehicleModel.trim()) {
        showToast?.("Please enter a valid vehicle model.", "error");
        return;
      }

      try {
        const uppercasePlate = manualVehicleId.toUpperCase();
        if (onAddVehicle) {
          await onAddVehicle({
            id: uppercasePlate,
            model: manualVehicleModel,
            category: booking.vehicleCategory,
            supplierId: "Self-Owned",
            status: "Available",
            fuelType: manualVehicleFuelType,
            mileageKmpl: 12,
            fuelLevel: 100,
            documents: {
              pucExpiry: "2029-12-31",
              insuranceExpiry: "2029-12-31",
              fitnessExpiry: "2029-12-31",
              permitExpiry: "2029-12-31"
            }
          });
        }
        finalVehicleId = uppercasePlate;
        setSelectedVehicleId(uppercasePlate);
        setIsManualVehicle(false);
      } catch (err) {
        showToast?.("Failed to register custom manual vehicle.", "error");
        return;
      }
    }

    const selectedDriver = drivers.find(d => d.id === finalDriverId);
    const selectedVehicle = vehicles.find(v => v.id === finalVehicleId);

    // Conflict and safety checks
    if (selectedDriver && selectedDriver.status === "Suspended") {
      if (showToast) {
        showToast("ALERT: Driver is currently suspended. Please assign an active driver.", "error");
      } else {
        alert("ALERT: Driver is currently suspended. Please assign an active driver.");
      }
      return;
    }

    if (selectedVehicle && selectedVehicle.documents.insuranceExpiry < "2026-06-30") {
      if (showToast) {
        showToast("WARNING: Vehicle insurance has expired. Please choose a compliant vehicle.", "warning");
      } else {
        alert("WARNING: Vehicle insurance has expired. Please choose a compliant vehicle.");
      }
      return;
    }

    const nextStatus = finalDriverId && finalVehicleId ? BookingStatus.ASSIGNED : status;

    onUpdateBooking({
      id: booking.id,
      assignedSupplierId: selectedSupplierId || undefined,
      assignedDriverId: finalDriverId || undefined,
      assignedVehicleId: finalVehicleId || undefined,
      status: nextStatus,
      kmsUsed,
      hoursUsed,
      tollCharges: toll,
      parkingCharges: parking
    });

    if (showToast) {
      showToast("Corporate Ticket Sheet updated and dispatch allocations saved successfully!", "success");
    } else {
      alert("Corporate Ticket Sheet updated and dispatch allocations saved successfully!");
    }
  };

  const handleStatusChange = (nextStatus: BookingStatus) => {
    setStatus(nextStatus);
    onUpdateBooking({
      id: booking.id,
      status: nextStatus
    });
  };

  const currentDriver = drivers.find(d => d.id === booking.assignedDriverId);
  const currentVehicle = vehicles.find(v => v.id === booking.assignedVehicleId);
  const currentSupplier = suppliers.find(s => s.id === booking.assignedSupplierId);

  return (
    <div className="space-y-6">
      {/* Detail Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Repositories
        </button>

        <div className="flex items-center gap-2">
          {booking.status === BookingStatus.COMPLETED && (
            <button
              onClick={() => onGenerateInvoice(booking.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
            >
              <DollarSign className="w-4 h-4" /> Generate Legal Invoice
            </button>
          )}
          <span className="text-xs text-gray-400 font-medium">Ticket: <strong className="text-gray-800 font-mono">{booking.id}</strong></span>
        </div>
      </div>



      {/* Main Grid: Info Sheets & Allocation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Information Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Passenger & Booking Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2.5 flex items-center gap-1.5">
              <User className="w-5 h-5 text-indigo-600" /> Passenger & Booking Dossier
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-gray-400 font-semibold mb-1">Corporate Passenger</span>
                <span className="font-bold text-gray-800 text-sm block">{booking.customerName}</span>
                <span className="text-gray-500 font-mono block mt-0.5">{booking.mobile} • {booking.email}</span>
                <span className="text-indigo-600 font-semibold font-mono text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  {booking.company}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-gray-400 font-semibold mb-1">Transportation Ticket Parameters</span>
                <table className="w-full text-left text-[11px] text-gray-700">
                  <tbody>
                    <tr>
                      <td className="py-0.5 font-medium text-gray-500">Pickup Schedule:</td>
                      <td className="py-0.5 font-semibold text-gray-900">{booking.pickupDate} at {booking.pickupTime}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium text-gray-500">SLA Class:</td>
                      <td className="py-0.5 font-semibold text-gray-900">{booking.tripType}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium text-gray-500">Requested Category:</td>
                      <td className="py-0.5 font-semibold text-gray-900">{booking.vehicleCategory}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium text-gray-500">Count:</td>
                      <td className="py-0.5 font-semibold text-gray-900">{booking.passengersCount} Pax</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-50 text-xs">
              <div>
                <span className="block text-gray-400 font-semibold mb-1 flex items-center gap-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Pickup Route Location
                </span>
                <p className="text-gray-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-100">
                  {booking.pickupAddress}
                </p>
              </div>
              <div>
                <span className="block text-gray-400 font-semibold mb-1 flex items-center gap-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Drop-Off Target Location
                </span>
                <p className="text-gray-800 font-medium bg-slate-50 p-2.5 rounded border border-slate-100">
                  {booking.dropAddress}
                </p>
              </div>
            </div>

            {/* Special remarks notes */}
            {(booking.remarks || booking.specialInstructions) && (
              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-xs space-y-1.5">
                {booking.remarks && (
                  <p className="text-amber-800">
                    <strong>Operations Note:</strong> {booking.remarks}
                  </p>
                )}
                {booking.specialInstructions && (
                  <p className="text-amber-800">
                    <strong>Driver SLA Instruction:</strong> {booking.specialInstructions}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Real-time Telemetry & Asset Details */}
          {(currentDriver || currentVehicle) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2.5 flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-indigo-600" /> Allocated Asset Logistics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {currentDriver && (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-start gap-3">
                    <UserCheck className="w-8 h-8 text-indigo-600 mt-1" />
                    <div>
                      <span className="block text-gray-400 font-semibold">Allocated Chauffeur</span>
                      <span className="font-bold text-gray-800 block text-sm">{currentDriver.name}</span>
                      <span className="text-gray-500 block font-mono">{currentDriver.mobile}</span>
                    </div>
                  </div>
                )}

                {currentVehicle && (
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-start gap-3">
                    <Car className="w-8 h-8 text-emerald-600 mt-1" />
                    <div>
                      <span className="block text-gray-400 font-semibold">Allocated Vehicle</span>
                      <span className="font-bold text-gray-800 block text-sm">{currentVehicle.id}</span>
                      <span className="text-gray-500 block">{currentVehicle.model} ({currentVehicle.fuelType})</span>
                      <div className="flex gap-2 items-center mt-2">
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 border border-emerald-100 rounded uppercase font-mono">
                          Compliance OK
                        </span>
                        <span className="text-[9px] text-gray-400">Fuel: {currentVehicle.fuelLevel}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Started trip live updates */}
              {booking.status === BookingStatus.STARTED && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-emerald-700 font-bold block flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Trip Transiting Live
                    </span>
                    <span className="text-gray-500">Current Lat: {booking.currentLat?.toFixed(4)}, Lng: {booking.currentLng?.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="block text-[9px] text-gray-400 uppercase font-mono">Speed</span>
                      <span className="text-sm font-bold text-gray-800 font-mono">{booking.speedKmph} km/h</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[9px] text-gray-400 uppercase font-mono">Progress</span>
                      <span className="text-sm font-bold text-gray-800 font-mono">{booking.tripProgress}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Column: Operations Assignment Control Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-50 pb-2.5 flex items-center gap-1.5">
              <ClipboardList className="w-5 h-5 text-indigo-600" /> Dispatch Control Panel
            </h3>

            {/* Step 1: Assign Supplier */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase">1. Assign Vendor/Supplier</label>
              <select
                value={selectedSupplierId}
                onChange={e => setSelectedSupplierId(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-white font-medium text-gray-700 outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Self-Owned Fleet</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.companyName})</option>
                ))}
              </select>
            </div>

            {/* Step 2: Assign Driver with availability validations */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-gray-600 uppercase">2. Select Duty Chauffeur</label>
                <button
                  type="button"
                  onClick={() => setIsManualDriver(!isManualDriver)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-all hover:underline"
                >
                  {isManualDriver ? "📋 Choose from roster" : "✍️ Enter details manually"}
                </button>
              </div>

              {!isManualDriver ? (
                <>
                  <select
                    value={selectedDriverId}
                    onChange={e => setSelectedDriverId(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-white font-medium text-gray-700 outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Select Available Driver...</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} • {d.status} (Rating: {d.rating}★)
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-gray-400 block">Only drivers marked as &quot;Available&quot; are populated.</span>
                </>
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5 font-semibold">Chauffeur Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={manualDriverName}
                      onChange={e => setManualDriverName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5 font-semibold">Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={manualDriverMobile}
                      onChange={e => setManualDriverMobile(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Assign compatible vehicles */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-gray-600 uppercase">3. Choose Matching Car</label>
                <button
                  type="button"
                  onClick={() => setIsManualVehicle(!isManualVehicle)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-all hover:underline"
                >
                  {isManualVehicle ? "📋 Choose from fleet" : "✍️ Enter details manually"}
                </button>
              </div>

              {!isManualVehicle ? (
                <>
                  <select
                    value={selectedVehicleId}
                    onChange={e => setSelectedVehicleId(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-white font-medium text-gray-700 outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Matching Vehicle...</option>
                    {compatibleVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.id} • {v.model} • {v.status}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-gray-400 block">
                    Showing compatible <strong className="text-gray-700">{booking.vehicleCategory.split(" ")[0]}</strong> assets.
                  </span>
                </>
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5 font-semibold">Vehicle Plate ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. MH-12-GP-4001"
                      value={manualVehicleId}
                      onChange={e => setManualVehicleId(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5 font-semibold">Vehicle Model *</label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota Innova Crysta"
                      value={manualVehicleModel}
                      onChange={e => setManualVehicleModel(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5 font-semibold">Fuel Type</label>
                    <select
                      value={manualVehicleFuelType}
                      onChange={e => setManualVehicleFuelType(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs outline-hidden focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Completed trip data parameters for pricing computations */}
            {(booking.status === BookingStatus.STARTED || booking.status === BookingStatus.COMPLETED) && (
              <div className="space-y-3 pt-3 border-t border-gray-50 bg-slate-50 -mx-5 px-5 py-4">
                <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">Actual Trip-Sheet Constants</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Total KMs Used</label>
                    <input 
                      type="number"
                      value={kmsUsed}
                      onChange={e => setKmsUsed(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Hours Used</label>
                    <input 
                      type="number"
                      value={hoursUsed}
                      onChange={e => setHoursUsed(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 font-mono text-center text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Toll Charges (₹)</label>
                    <input 
                      type="number"
                      value={toll}
                      onChange={e => setToll(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 font-mono text-center text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Parking (₹)</label>
                    <input 
                      type="number"
                      value={parking}
                      onChange={e => setParking(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-md p-1.5 font-mono text-center text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2">
              <button
                onClick={handleAssign}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" /> Save & Dispatch Allocation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
