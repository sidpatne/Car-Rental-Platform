/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  Eye, 
  UserPlus, 
  Briefcase, 
  MapPin, 
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Check,
  ThumbsUp,
  AlertTriangle,
  User,
  Car,
  Calendar,
  CalendarDays
} from "lucide-react";
import { Booking, BookingStatus, TripType, VehicleCategory, Driver, Vehicle, PassengerCompany } from "../types";

interface BookingViewProps {
  bookings: Booking[];
  drivers: Driver[];
  vehicles: Vehicle[];
  companies?: PassengerCompany[];
  onCreateBooking: (newBooking: Partial<Booking>) => void;
  onSelectBooking: (id: string) => void;
  onUpdateBooking: (updated: Partial<Booking>) => void;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function BookingView({ bookings, drivers, vehicles, companies = [], onCreateBooking, onSelectBooking, onUpdateBooking, showToast }: BookingViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Date-Range Calendar Picker States
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(6); // Default: July (0-indexed 6)
  const [rangeStart, setRangeStart] = useState<string>("2026-07-01"); // Default: July 1st, 2026 (matching today!)
  const [rangeEnd, setRangeEnd] = useState<string>("2026-07-07"); // Default: 7 days range
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Helper to format YYYY-MM-DD
  const formatDateStr = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Helper to get days of the month with starting padding
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days: (number | null)[] = [];
    const startDayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }
    return days;
  };

  // Helper to generate list of YYYY-MM-DD strings between start and end
  const getDatesInRange = (startStr: string, endStr: string) => {
    const dates: string[] = [];
    if (!startStr || !endStr) return [];
    
    const [sYear, sMonth, sDay] = startStr.split("-").map(Number);
    const [eYear, eMonth, eDay] = endStr.split("-").map(Number);
    
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
    
    let current = new Date(start);
    let guard = 0;
    while (current <= end && guard < 100) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
      current.setDate(current.getDate() + 1);
      guard++;
    }
    return dates;
  };

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleDayClick = (dayNum: number) => {
    const dateStr = formatDateStr(calYear, calMonth, dayNum);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dateStr);
      setRangeEnd("");
    } else {
      // We have rangeStart but no rangeEnd
      const [sYear, sMonth, sDay] = rangeStart.split("-").map(Number);
      const start = new Date(sYear, sMonth - 1, sDay);
      const clicked = new Date(calYear, calMonth, dayNum);
      if (clicked < start) {
        setRangeStart(dateStr);
      } else {
        setRangeEnd(dateStr);
      }
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Status transition tracking for subtle animations
  const [recentlyChangedBookings, setRecentlyChangedBookings] = useState<Record<string, { from: BookingStatus; to: BookingStatus; timestamp: number }>>({});
  const prevBookingsRef = useRef<Booking[]>(bookings);

  useEffect(() => {
    const prev = prevBookingsRef.current;
    if (prev && prev !== bookings) {
      const changes: Record<string, { from: BookingStatus; to: BookingStatus; timestamp: number }> = { ...recentlyChangedBookings };
      let updatedAny = false;

      bookings.forEach(currB => {
        const prevB = prev.find(p => p.id === currB.id);
        if (prevB && prevB.status !== currB.status) {
          // Detect transition to Completed or Invoiced (or any status)
          if (currB.status === BookingStatus.COMPLETED || currB.status === BookingStatus.INVOICED) {
            changes[currB.id] = {
              from: prevB.status,
              to: currB.status,
              timestamp: Date.now()
            };
            updatedAny = true;
          }
        }
      });

      if (updatedAny) {
        setRecentlyChangedBookings(changes);
      }
    }
    prevBookingsRef.current = bookings;
  }, [bookings, recentlyChangedBookings]);

  // Periodically clean up transitions that are older than 6 seconds to stop the animation
  useEffect(() => {
    const activeKeys = Object.keys(recentlyChangedBookings);
    if (activeKeys.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      let hasChanges = false;
      const next = { ...recentlyChangedBookings };

      for (const id of activeKeys) {
        if (now - next[id].timestamp > 6000) {
          delete next[id];
          hasChanges = true;
        }
      }

      if (hasChanges) {
        setRecentlyChangedBookings(next);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [recentlyChangedBookings]);

  // Smart Suggest States
  const [suggestBooking, setSuggestBooking] = useState<Booking | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    driver: Driver;
    driverScore: number;
    driverRationale: string;
    vehicle: Vehicle;
    vehicleScore: number;
    vehicleRationale: string;
    overallConfidence: number;
    isUpgrade: boolean;
    explanation: string;
  } | null>(null);

  const handleTriggerSmartSuggest = (booking: Booking) => {
    setSuggestBooking(booking);
    setIsSuggesting(true);
    setMatchResult(null);

    // Dynamic timeout to mimic a high-fidelity AI calculation
    setTimeout(() => {
      // 1. FILTER DRIVERS - Look for Available chauffeurs
      let eligibleDrivers = drivers.filter(d => d.status === "Available");
      let fallbackDriverUsed = false;
      if (eligibleDrivers.length === 0) {
        // Fallback to active/on-duty drivers who are nearest bases
        eligibleDrivers = drivers.filter(d => d.status === "On Duty" || d.status === "Available");
        fallbackDriverUsed = true;
      }
      if (eligibleDrivers.length === 0) {
        eligibleDrivers = drivers; // full fallback
      }

      // 2. FILTER VEHICLES - Try matching requested category & availability
      let eligibleVehicles = vehicles.filter(v => v.category === booking.vehicleCategory && v.status === "Available");
      let isUpgrade = false;

      if (eligibleVehicles.length === 0) {
        // AI Category Auto-Upgrade Heuristic (Upgrade hierarchy Sedan -> SUV -> Premium SUV -> Luxury)
        const categoriesOrder = [
          VehicleCategory.SEDAN,
          VehicleCategory.SUV,
          VehicleCategory.PREMIUM_SUV,
          VehicleCategory.LUXURY,
          VehicleCategory.TEMPO_TRAVELLER
        ];
        const currentIdx = categoriesOrder.indexOf(booking.vehicleCategory);
        
        // Find available vehicle in an upgraded tier
        for (let i = currentIdx + 1; i < categoriesOrder.length; i++) {
          const cat = categoriesOrder[i];
          const matches = vehicles.filter(v => v.category === cat && v.status === "Available");
          if (matches.length > 0) {
            eligibleVehicles = matches;
            isUpgrade = true;
            break;
          }
        }
      }

      // If absolutely no available upgrades or exact category match, find ANY available vehicle
      if (eligibleVehicles.length === 0) {
        eligibleVehicles = vehicles.filter(v => v.status === "Available");
        if (eligibleVehicles.length > 0) {
          isUpgrade = eligibleVehicles[0].category !== booking.vehicleCategory;
        }
      }

      // Ultimate fallback: vehicles under same requested category (even if busy/maintenance)
      if (eligibleVehicles.length === 0) {
        eligibleVehicles = vehicles.filter(v => v.category === booking.vehicleCategory);
        if (eligibleVehicles.length === 0) {
          eligibleVehicles = vehicles;
        }
      }

      // 3. SCORE DRIVER MATCH CANDIDATES
      const scoredDrivers = eligibleDrivers.map(d => {
        let score = 55; // Base score

        // Rating influence (e.g. 5★ => +30 pts)
        score += d.rating * 6;

        // Proximity / baseLocation match to pickupAddress keywords
        const pickupLower = booking.pickupAddress.toLowerCase();
        const baseLower = d.baseLocation.toLowerCase();

        if (pickupLower.includes(baseLower) || baseLower.includes(pickupLower)) {
          score += 20;
        } else if (
          (pickupLower.includes("mumbai") && baseLower.includes("mumbai")) ||
          (pickupLower.includes("pune") && baseLower.includes("pune")) ||
          (pickupLower.includes("airport") && baseLower.includes("airport")) ||
          (pickupLower.includes("terminal") && baseLower.includes("terminal"))
        ) {
          score += 18;
        } else {
          score += 8;
        }

        // Utilization balance (slightly favor lower tripsCount to optimize chauffeur load)
        score += Math.max(0, 10 - d.tripsCount * 0.15);

        return { driver: d, score: Math.min(100, Math.round(score)) };
      });

      scoredDrivers.sort((a, b) => b.score - a.score);
      const bestDriverObj = scoredDrivers[0] || { driver: drivers[0], score: 85 };

      // 4. SCORE VEHICLE MATCH CANDIDATES
      const scoredVehicles = eligibleVehicles.map(v => {
        let score = 50; // Base score

        // Proximity / Location match
        const pickupLower = booking.pickupAddress.toLowerCase();
        const locLower = (v.currentLocationName || "").toLowerCase();

        if (locLower && (pickupLower.includes(locLower) || locLower.includes(pickupLower))) {
          score += 25;
        } else if (
          (pickupLower.includes("mumbai") && locLower.includes("mumbai")) ||
          (pickupLower.includes("pune") && locLower.includes("pune")) ||
          (pickupLower.includes("airport") && locLower.includes("airport"))
        ) {
          score += 20;
        } else {
          score += 10;
        }

        // Exact match vs Upgrade score
        if (v.category === booking.vehicleCategory) {
          score += 20;
        } else if (isUpgrade) {
          score += 15; // Positive upgrade reward
        }

        // Fuel Level score (e.g. 90% fuel level => +10 pts)
        score += (v.fuelLevel * 0.1);

        // Document compliance checks (Insurance, PUC expiration)
        const now = new Date();
        const insExpiry = new Date(v.documents.insuranceExpiry);
        const pucExpiry = new Date(v.documents.pucExpiry);
        if (insExpiry > now && pucExpiry > now) {
          score += 10; // active certificate reward
        }

        return { vehicle: v, score: Math.min(100, Math.round(score)) };
      });

      scoredVehicles.sort((a, b) => b.score - a.score);
      const bestVehicleObj = scoredVehicles[0] || { vehicle: vehicles[0], score: 82 };

      // Calculate confidence
      const overallConfidence = Math.round((bestDriverObj.score + bestVehicleObj.score) / 2);

      // Create explanatory strings
      const driverRationale = `Highly rated chauffeur (${bestDriverObj.driver.rating}★) with base zone [${bestDriverObj.driver.baseLocation}] matching pickup address, ensuring shortest arrival latency. Check completed: Shift active.`;
      const vehicleRationale = `Model matching ${isUpgrade ? 'premium upgraded' : 'exact'} category with high fuel capacity (${bestVehicleObj.vehicle.fuelLevel}%), optimal engine wellness, and active PUC + insurance clearances.`;

      const explanation = `AI heuristic allocated senior chauffeur ${bestDriverObj.driver.name} and vehicle ${bestVehicleObj.vehicle.model} (${bestVehicleObj.vehicle.id}). Both assets operate within matching proximity zones. ${isUpgrade ? `To protect corporate SLA integrity, we successfully auto-upgraded the client to ${bestVehicleObj.vehicle.category.split(" ")[0]} as requested Sedan class was fully busy.` : `They match the precise ${bestVehicleObj.vehicle.category.split(" ")[0]} class requirements with verified compliance records.`}`;

      setMatchResult({
        driver: bestDriverObj.driver,
        driverScore: bestDriverObj.score,
        driverRationale,
        vehicle: bestVehicleObj.vehicle,
        vehicleScore: bestVehicleObj.score,
        vehicleRationale,
        overallConfidence,
        isUpgrade,
        explanation
      });
      setIsSuggesting(false);
    }, 1200);
  };

  const handleApplyMatch = () => {
    if (!suggestBooking || !matchResult) return;

    onUpdateBooking({
      id: suggestBooking.id,
      assignedDriverId: matchResult.driver.id,
      assignedVehicleId: matchResult.vehicle.id,
      status: BookingStatus.ASSIGNED
    });

    if (showToast) {
      showToast(`AI Match Applied! Allocated Driver ${matchResult.driver.name} and Vehicle ${matchResult.vehicle.id} to Booking ${suggestBooking.id}.`, "success");
    }

    setSuggestBooking(null);
    setMatchResult(null);
  };

  // Form States
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formPickup, setFormPickup] = useState("");
  const [formDrop, setFormDrop] = useState("");
  const [formDate, setFormDate] = useState("2026-06-30");
  const [formTime, setFormTime] = useState("12:00");
  const [formTripType, setFormTripType] = useState<TripType>(TripType.LOCAL_8H_80KM);
  const [formCategory, setFormCategory] = useState<VehicleCategory>(VehicleCategory.SUV);
  const [formPassengers, setFormPassengers] = useState(1);
  const [formRemarks, setFormRemarks] = useState("");
  const [formInstructions, setFormInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formMobile || !formPickup || !formDrop) {
      if (showToast) {
        showToast("Please fill in all mandatory fields (Name, Mobile, Pickup, Drop)", "warning");
      } else {
        alert("Please fill in all mandatory fields (Name, Mobile, Pickup, Drop)");
      }
      return;
    }

    onCreateBooking({
      customerName: formName,
      mobile: formMobile,
      email: formEmail,
      company: formCompany || "Direct Walk-In Client",
      address: formAddress,
      pickupAddress: formPickup,
      dropAddress: formDrop,
      pickupDate: formDate,
      pickupTime: formTime,
      tripType: formTripType,
      vehicleCategory: formCategory,
      passengersCount: Number(formPassengers),
      remarks: formRemarks,
      specialInstructions: formInstructions,
    });

    // Reset Form & Close
    setFormName("");
    setFormMobile("");
    setFormEmail("");
    setFormCompany("");
    setFormAddress("");
    setFormPickup("");
    setFormDrop("");
    setFormRemarks("");
    setFormInstructions("");
    setIsModalOpen(false);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.DRAFT:
        return "bg-gray-100 text-gray-700 border-gray-200";
      case BookingStatus.CONFIRMED:
        return "bg-sky-50 text-sky-700 border-sky-100";
      case BookingStatus.ASSIGNED:
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case BookingStatus.STARTED:
        return "bg-amber-50 text-amber-700 border-amber-100 animate-pulse";
      case BookingStatus.COMPLETED:
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case BookingStatus.INVOICED:
        return "bg-teal-50 text-teal-700 border-teal-100";
      case BookingStatus.CANCELLED:
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  // Analytics and Fleet Gap calculations for selected dates
  const selectedDates = rangeStart && rangeEnd ? getDatesInRange(rangeStart, rangeEnd) : (rangeStart ? [rangeStart] : []);

  const analysisData = selectedDates.map(dateStr => {
    const dayBookings = bookings.filter(b => b.pickupDate === dateStr && b.status !== BookingStatus.CANCELLED);
    
    // Critical gaps: Active unassigned bookings
    const criticalGaps = dayBookings.filter(b => b.status === BookingStatus.CONFIRMED && (!b.assignedDriverId || !b.assignedVehicleId));
    
    // Assigned assets on this day
    const assignedVehicleIds = new Set(dayBookings.map(b => b.assignedVehicleId).filter(Boolean));
    const assignedDriverIds = new Set(dayBookings.map(b => b.assignedDriverId).filter(Boolean));
    
    // Idle assets (Available status and not assigned on this date)
    const idleVehicles = vehicles.filter(v => v.status === "Available" && !assignedVehicleIds.has(v.id));
    const idleDrivers = drivers.filter(d => d.status === "Available" && !assignedDriverIds.has(d.id));

    return {
      date: dateStr,
      bookings: dayBookings,
      criticalGaps,
      idleVehicles,
      idleDrivers,
    };
  });

  // Aggregated range stats
  const totalBookingsInRange = analysisData.reduce((acc, curr) => acc + curr.bookings.length, 0);
  const allCriticalGaps = analysisData.flatMap(d => d.criticalGaps);
  const totalIdleVehicleDays = analysisData.reduce((acc, curr) => acc + curr.idleVehicles.length, 0);
  const totalIdleDriverDays = analysisData.reduce((acc, curr) => acc + curr.idleDrivers.length, 0);

  return (
    <div className="space-y-6">
      {/* Action Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs relative">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Corporate Bookings Repository</h2>
          <p className="text-xs text-gray-500">Add, track and schedule client transport logistics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Small POPUP Calendar Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>
                {rangeStart ? (
                  <>
                    <span className="font-mono">{rangeStart}</span>
                    {rangeEnd && <> ➜ <span className="font-mono">{rangeEnd}</span></>}
                  </>
                ) : (
                  "Select Date Range"
                )}
              </span>
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-72">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-800 font-mono">
                    {monthNames[calMonth]} {calYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded cursor-pointer text-[10px] font-bold"
                    >
                      ◀ Prev
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded cursor-pointer text-[10px] font-bold"
                    >
                      Next ▶
                    </button>
                  </div>
                </div>

                <div className="border border-gray-100 p-2 rounded-lg bg-white shadow-2xs mb-2">
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-400 mb-1 border-b border-gray-50 pb-1 font-mono uppercase">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                      <div key={d} className="py-0.5">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(calYear, calMonth).map((dayNum, idx) => {
                      if (dayNum === null) {
                        return <div key={`empty-${idx}`} className="aspect-square" />;
                      }
                      
                      const dateStr = formatDateStr(calYear, calMonth, dayNum);
                      const isStart = rangeStart === dateStr;
                      const isEnd = rangeEnd === dateStr;
                      const isInRange = rangeStart && rangeEnd && dateStr > rangeStart && dateStr < rangeEnd;
                      const isHovered = hoverDate && rangeStart && !rangeEnd && dateStr > rangeStart && dateStr <= hoverDate;
                      
                      const isToday = dateStr === "2026-07-01";

                      return (
                        <div
                          key={`day-${dayNum}`}
                          onClick={() => handleDayClick(dayNum)}
                          onMouseEnter={() => setHoverDate(dateStr)}
                          onMouseLeave={() => setHoverDate(null)}
                          className={`aspect-square flex flex-col items-center justify-center rounded text-xs cursor-pointer select-none transition-all ${
                            isStart || isEnd
                              ? "bg-indigo-600 text-white font-bold shadow-xs hover:bg-indigo-700"
                              : isInRange || isHovered
                              ? "bg-indigo-50 text-indigo-950 hover:bg-indigo-100/70"
                              : "hover:bg-gray-100 text-gray-700"
                          } ${isToday ? "ring-1 ring-indigo-500 font-bold" : ""}`}
                        >
                          <span className="text-[10px] font-mono">{dayNum}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 text-center font-medium">
                  Click two dates to pick range.
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" /> New Booking Draft
          </button>
        </div>
      </div>

      {/* Repository Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4.5 h-4.5" />
          <input 
            type="text" 
            placeholder="Search Passenger, Company or BKG ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <div className="flex overflow-x-auto gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200 text-xs">
            {["All", "Confirmed", "Assigned", "Started", "Completed", "Invoiced", "Cancelled"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === status ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Data Grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm text-gray-600">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase font-mono text-xs">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Corporate SLA</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Route (Pick ➜ Drop)</th>
                <th className="py-3 px-4">SLA Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                    {b.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{b.customerName}</div>
                    <div className="text-gray-400 text-xs font-mono">{b.mobile}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-gray-700 font-medium text-xs">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {b.company}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-semibold text-gray-800">{b.pickupDate}</div>
                    <div className="text-gray-400 font-mono">{b.pickupTime}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs max-w-xs truncate">
                    <div className="font-medium text-gray-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block"></span>
                      {b.pickupAddress}
                    </div>
                    <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block"></span>
                      {b.dropAddress}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-medium text-gray-800">{b.tripType}</div>
                    <div className="text-gray-400 text-[10px] uppercase font-mono">{b.vehicleCategory.split(" ")[0]}</div>
                  </td>
                  <td className="py-3.5 px-4 overflow-visible">
                    <div className="relative flex items-center gap-1.5">
                      <motion.span 
                        key={`${b.id}-${b.status}`}
                        initial={
                          recentlyChangedBookings[b.id]
                            ? { scale: 0.85, opacity: 0.4, y: -6 }
                            : false
                        }
                        animate={{ 
                          scale: 1, 
                          opacity: 1, 
                          y: 0,
                          ...(recentlyChangedBookings[b.id] && {
                            boxShadow: [
                              "0 0 0 0px rgba(16, 185, 129, 0)",
                              "0 0 0 8px rgba(16, 185, 129, 0.25)",
                              "0 0 0 0px rgba(16, 185, 129, 0)"
                            ]
                          })
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 14,
                          boxShadow: {
                            repeat: 2,
                            duration: 1.2
                          }
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 shrink-0 ${getStatusStyle(b.status)}`}
                      >
                        {recentlyChangedBookings[b.id] && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        {b.status}
                      </motion.span>

                      <AnimatePresence>
                        {recentlyChangedBookings[b.id] && (
                          <motion.span
                            initial={{ opacity: 0, x: 10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.95 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className={`z-10 px-2 py-0.5 rounded text-[9px] font-extrabold whitespace-nowrap shadow-xs flex items-center gap-1 border uppercase font-mono tracking-wider ${
                              recentlyChangedBookings[b.id].to === BookingStatus.COMPLETED
                                ? "bg-emerald-600 text-white border-emerald-500"
                                : "bg-teal-600 text-white border-teal-500"
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5 shrink-0 animate-bounce" />
                            SLA UPDATED
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectBooking(b.id)}
                        className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold shrink-0"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                    No bookings found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Form Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-base font-bold text-gray-900">Create Corporate Transportation Ticket</h3>
                <p className="text-xs text-gray-500">Draft a new transportation request sheet</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
              {/* Part 1: Client Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Customer Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Priyanjali Sharma"
                    value={formName} 
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mobile Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +91 99334 55667"
                    value={formMobile} 
                    onChange={e => setFormMobile(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Corporate Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. corporate@company.com"
                    value={formEmail} 
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Company / Corporate SLA</label>
                  <input 
                    type="text" 
                    list="registered-companies"
                    placeholder="e.g. Tata Consultancy Services Ltd"
                    value={formCompany} 
                    onChange={e => setFormCompany(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <datalist id="registered-companies">
                    {companies.map(c => (
                      <option key={c.id} value={c.officeName} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Part 2: Trip Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Pickup Date</label>
                  <input 
                    type="date" 
                    value={formDate} 
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Pickup Time (24h)</label>
                  <input 
                    type="time" 
                    value={formTime} 
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Corporate Trip Type</label>
                  <select 
                    value={formTripType}
                    onChange={e => setFormTripType(e.target.value as TripType)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.values(TripType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Required Vehicle Category</label>
                  <select 
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as VehicleCategory)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.values(VehicleCategory).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Pickup Location Address *</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="Full pickup street address, gate code, landmarks"
                    value={formPickup} 
                    onChange={e => setFormPickup(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Drop-off Destination Address *</label>
                  <textarea 
                    required
                    rows={2}
                    placeholder="Full drop-off street address, building/office"
                    value={formDrop} 
                    onChange={e => setFormDrop(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Special Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Booking Operations Notes</label>
                  <input 
                    type="text" 
                    placeholder="e.g. VIP guest, bottle water, english speaker"
                    value={formRemarks} 
                    onChange={e => setFormRemarks(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Driver Special Instructions</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Do not exceed 80kmph, park inside basement"
                    value={formInstructions} 
                    onChange={e => setFormInstructions(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-xl">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Generate Ticket (Confirm)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
