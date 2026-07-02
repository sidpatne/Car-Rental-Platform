/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Car, 
  Clock, 
  Compass, 
  DollarSign, 
  FileText, 
  Gauge, 
  HelpCircle, 
  History, 
  Layers, 
  LayoutDashboard, 
  Lock, 
  LogOut, 
  MapPin, 
  Receipt, 
  ShieldAlert, 
  Shield, 
  SlidersHorizontal, 
  TrendingUp, 
  UserCheck, 
  Users,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info
} from "lucide-react";

// Types and Seed Mock Data
import { 
  UserRole, 
  RolePermissions, 
  Booking, 
  BookingStatus, 
  Driver, 
  Vehicle, 
  PricingRule, 
  Invoice, 
  AuditLog, 
  VehicleCategory, 
  TripType,
  Supplier,
  PassengerCompany,
  Employee,
  RolePermissionConfig
} from "./types";
import { 
  initialBookings, 
  initialDrivers, 
  initialVehicles, 
  initialPricingRules, 
  initialInvoices, 
  initialSuppliers, 
  initialCompanies,
  initialAuditLogs,
  initialEmployees,
  initialRolePermissions
} from "./mockData";

// Firebase Integration Services
import {
  seedDatabaseIfEmpty,
  fetchBookingsFromDb,
  saveBookingToDb,
  fetchDriversFromDb,
  saveDriverToDb,
  fetchVehiclesFromDb,
  saveVehicleToDb,
  fetchPricingRulesFromDb,
  savePricingRuleToDb,
  fetchInvoicesFromDb,
  saveInvoiceToDb,
  fetchSuppliersFromDb,
  saveSupplierToDb,
  fetchCompaniesFromDb,
  saveCompanyToDb,
  fetchAuditLogsFromDb,
  saveAuditLogToDb,
  fetchEmployeesFromDb,
  saveEmployeeToDb,
  deleteEmployeeFromDb,
  fetchRolePermissionsFromDb,
  saveRolePermissionToDb
} from "./firebaseService";

// Modular Views
import DashboardView from "./components/DashboardView";
import BookingView from "./components/BookingView";
import PassengerDetailsView from "./components/PassengerDetailsView";
import DriverSchedulingView from "./components/DriverSchedulingView";
import FleetView from "./components/FleetView";
import PricingEngineView from "./components/PricingEngineView";
import InvoiceView from "./components/InvoiceView";
import ReportsView from "./components/ReportsView";
import BlueprintView from "./components/BlueprintView";
import PartnersView from "./components/PartnersView";
import RbacManagementView from "./components/RbacManagementView";

export default function App() {
  // Global Operational States
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.SUPER_ADMIN);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(initialPricingRules);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [companies, setCompanies] = useState<PassengerCompany[]>(initialCompanies);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [dbRolePermissions, setDbRolePermissions] = useState<RolePermissionConfig[]>(initialRolePermissions);
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "drivers" | "fleet" | "pricing" | "billing" | "reports" | "blueprints" | "audit" | "partners" | "rbac">("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  // Floating Toast alerts state
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "warning" | "info" | "error" }[]>([]);
  const showToast = (message: string, type: "success" | "warning" | "info" | "error" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };
  
  // Real database connection load-state
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  // Initialize operational db from Firestore
  useEffect(() => {
    async function loadOperationalDb() {
      try {
        setIsLoadingDb(true);
        // Ensure standard enterprise seed sequence
        await seedDatabaseIfEmpty();
        
        // Fetch collections in parallel
        const [bkgs, drvs, vehs, prcs, invs, spls, comps, logs, emps, rps] = await Promise.all([
          fetchBookingsFromDb(),
          fetchDriversFromDb(),
          fetchVehiclesFromDb(),
          fetchPricingRulesFromDb(),
          fetchInvoicesFromDb(),
          fetchSuppliersFromDb(),
          fetchCompaniesFromDb(),
          fetchAuditLogsFromDb(),
          fetchEmployeesFromDb(),
          fetchRolePermissionsFromDb()
        ]);
        
        setBookings(bkgs);
        setDrivers(drvs);
        setVehicles(vehs);
        setPricingRules(prcs);
        setInvoices(invs);
        setSuppliers(spls);
        setCompanies(comps);
        setAuditLogs(logs);
        setEmployees(emps || initialEmployees);
        setDbRolePermissions(rps || initialRolePermissions);
      } catch (error) {
        console.error("Critical: Failed to sync operational database with Firestore:", error);
      } finally {
        setIsLoadingDb(false);
      }
    }
    loadOperationalDb();
  }, []);

  // Append a message to our system audit log
  const logAudit = async (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(Math.random() * 900) + 100}`,
      timestamp: new Date().toISOString(),
      userId: "USR-001",
      userName: "Siddhesh Patne",
      role: currentUserRole,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await saveAuditLogToDb(newLog);
  };

  // 1. Create Booking Draft
  const handleCreateBooking = async (newBkgData: Partial<Booking>) => {
    const nextId = `BKG-2026-${bookings.length + 1050}`;
    const newBooking: Booking = {
      id: nextId,
      customerName: newBkgData.customerName || "Walk-In Client",
      mobile: newBkgData.mobile || "+91 00000 00000",
      email: newBkgData.email || "",
      company: newBkgData.company || "Self-Sponsored",
      address: newBkgData.address || "Corporate Hub",
      pickupAddress: newBkgData.pickupAddress || "",
      dropAddress: newBkgData.dropAddress || "",
      pickupDate: newBkgData.pickupDate || "2026-06-30",
      pickupTime: newBkgData.pickupTime || "12:00",
      tripType: newBkgData.tripType || TripType.LOCAL_8H_80KM,
      vehicleCategory: newBkgData.vehicleCategory || VehicleCategory.SUV,
      passengersCount: newBkgData.passengersCount || 1,
      remarks: newBkgData.remarks || "",
      specialInstructions: newBkgData.specialInstructions || "",
      status: BookingStatus.CONFIRMED,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    await saveBookingToDb(newBooking);
    await logAudit("BOOKING_CREATED", `Drafted and confirmed corporate ticket sheet ${nextId} for ${newBooking.customerName}`);
  };

  // 2. Dispatch/Update Booking assignments
  const handleUpdateBooking = async (updatedData: Partial<Booking>) => {
    let targetBooking: Booking | null = null;
    
    setBookings(prev => prev.map(b => {
      if (b.id === updatedData.id) {
        const merged = { ...b, ...updatedData };
        targetBooking = merged;
        
        // Audit assignment triggers
        if (updatedData.assignedDriverId && updatedData.assignedDriverId !== b.assignedDriverId) {
          const drv = drivers.find(d => d.id === updatedData.assignedDriverId);
          logAudit("DRIVER_ASSIGNED", `Allocated Chauffeur [${drv?.name}] to corporate ticket ${b.id}`);
        }
        if (updatedData.assignedVehicleId && updatedData.assignedVehicleId !== b.assignedVehicleId) {
          logAudit("VEHICLE_ASSIGNED", `Allocated Vehicle Plate [${updatedData.assignedVehicleId}] to corporate ticket ${b.id}`);
        }
        if (updatedData.status && updatedData.status !== b.status) {
          logAudit("STATUS_CHANGED", `Transitioned ticket ${b.id} status from ${b.status} to ${updatedData.status}`);
          
          // Trigger automatic billing compilation when marked as completed
          if (updatedData.status === BookingStatus.COMPLETED && b.status !== BookingStatus.COMPLETED) {
            triggerAutomatedBilling(merged);
          }
        }
        
        return merged;
      }
      return b;
    }));

    if (targetBooking) {
      await saveBookingToDb(targetBooking);
    }
  };

  // 3. Automated Pricing Engine compiler for invoices
  const triggerAutomatedBilling = async (bkg: Booking) => {
    // Locate corresponding pricing rule (fallback to rule 1 if not exact match)
    const rule = pricingRules.find(r => r.vehicleCategory === bkg.vehicleCategory) || pricingRules[0];
    
    const kmsUsed = bkg.kmsUsed || 80;
    const hoursUsed = bkg.hoursUsed || 8;
    const extraKms = Math.max(0, kmsUsed - rule.includedKms);
    const extraHours = Math.max(0, hoursUsed - rule.includedHours);

    // Compute lines
    const baseCharge = rule.basePrice;
    const extraKmCharges = extraKms * rule.extraKmRate;
    const extraHourCharges = extraHours * rule.extraHourRate;
    const driverAllowance = rule.driverAllowancePerDay;
    const nightCharges = (bkg.pickupTime >= "22:00" || bkg.pickupTime <= "05:00") ? rule.nightCharges : 0;
    
    const tollCharges = bkg.tollCharges || 0;
    const parkingCharges = bkg.parkingCharges || 0;

    const subtotal = baseCharge + extraKmCharges + extraHourCharges + driverAllowance + nightCharges + tollCharges + parkingCharges;
    const discountAmount = Math.round(subtotal * 0.05); // Standard 5% SLA discount
    const taxableTotal = subtotal - discountAmount;
    
    const cgstAmount = Math.round(taxableTotal * 0.09); // Central GST (9%)
    const sgstAmount = Math.round(taxableTotal * 0.09); // State GST (9%)
    const grandTotal = taxableTotal + cgstAmount + sgstAmount;

    const newInvoice: Invoice = {
      invoiceNumber: `INV-2026-${invoices.length + 1050}`,
      bookingId: bkg.id,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 15 days net
      baseCharge,
      extraKmCharges,
      extraHourCharges,
      driverAllowance,
      nightCharges,
      waitingCharges: 0,
      tollCharges,
      parkingCharges,
      miscellaneousCharges: 0,
      subtotal,
      discountAmount,
      cgstAmount,
      sgstAmount,
      grandTotal,
      paymentStatus: "Unpaid"
    };

    setInvoices(prev => [newInvoice, ...prev]);
    await saveInvoiceToDb(newInvoice);
    
    // Automatically transition booking status to Invoiced
    const updatedBkg = { ...bkg, status: BookingStatus.INVOICED, invoiceId: newInvoice.invoiceNumber };
    setBookings(prev => prev.map(b => b.id === bkg.id ? updatedBkg : b));
    await saveBookingToDb(updatedBkg);
    
    await logAudit("INVOICE_COMPILED", `Pricing SLA auto-compiled invoice ${newInvoice.invoiceNumber} for ticket ${bkg.id}. Total: ₹${grandTotal.toLocaleString()}`);
  };

  // Toggle Driver Duty status
  const handleToggleDriverStatus = async (id: string, newStatus: Driver["status"]) => {
    let targetDriver: Driver | null = null;
    setDrivers(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, status: newStatus };
        targetDriver = updated;
        return updated;
      }
      return d;
    }));
    if (targetDriver) {
      await saveDriverToDb(targetDriver);
    }
    const drvName = drivers.find(d => d.id === id)?.name;
    await logAudit("DRIVER_STATUS_CHANGE", `Switched chauffeur [${drvName}] duty schedule state to ${newStatus}`);
  };

  // Batch mark invoices as Paid
  const handleBatchMarkInvoicesPaid = async (invoiceNumbers: string[]) => {
    setInvoices(prev => prev.map(inv => {
      if (invoiceNumbers.includes(inv.invoiceNumber)) {
        const updated = { ...inv, paymentStatus: "Paid" as const };
        saveInvoiceToDb(updated);
        return updated;
      }
      return inv;
    }));
    await logAudit("INVOICES_BATCH_PAID", `Marked ${invoiceNumbers.length} invoices as PAID: ${invoiceNumbers.join(", ")}`);
  };

  // Create new Driver Account
  const handleAddDriver = async (newDrv: Omit<Driver, "id" | "tripsCount">): Promise<Driver> => {
    const nextId = `DRV-00${drivers.length + 1}`;
    const created: Driver = {
      ...newDrv,
      id: nextId,
      tripsCount: 0
    };
    setDrivers(prev => [...prev, created]);
    await saveDriverToDb(created);
    await logAudit("DRIVER_REGISTERED", `Enrolled new commercial driver ${created.name} under profile ID ${nextId}`);
    return created;
  };

  // Toggle Vehicle operational state
  const handleToggleVehicleStatus = async (id: string, newStatus: Vehicle["status"]) => {
    let targetVehicle: Vehicle | null = null;
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        const updated = { ...v, status: newStatus };
        targetVehicle = updated;
        return updated;
      }
      return v;
    }));
    if (targetVehicle) {
      await saveVehicleToDb(targetVehicle);
    }
    await logAudit("VEHICLE_STATUS_CHANGE", `Switched vehicle plate [${id}] service state to ${newStatus}`);
  };

  // Create new Vehicle asset
  const handleAddVehicle = async (newVeh: Vehicle) => {
    setVehicles(prev => [...prev, newVeh]);
    await saveVehicleToDb(newVeh);
    await logAudit("VEHICLE_REGISTERED", `Registered new fleet asset ${newVeh.model} [${newVeh.id}] under Category [${newVeh.category}]`);
  };

  // Pricing Matrix Customizations
  const handleUpdatePricingRule = async (updatedRule: PricingRule) => {
    setPricingRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
    await savePricingRuleToDb(updatedRule);
    await logAudit("PRICING_UPDATED", `Adjusted commercial SLA tariff values for rule ID ${updatedRule.id} (${updatedRule.city} - ${updatedRule.vehicleCategory.split(" ")[0]})`);
  };

  const handleAddPricingRule = async (newRule: PricingRule) => {
    setPricingRules(prev => [...prev, newRule]);
    await savePricingRuleToDb(newRule);
    await logAudit("PRICING_RULE_ADDED", `Appended new municipal tariff rule ${newRule.id} for Category [${newRule.vehicleCategory}] in ${newRule.city}`);
  };

  const handleAddSupplier = async (newSup: Supplier) => {
    setSuppliers(prev => [...prev, newSup]);
    await saveSupplierToDb(newSup);
    await logAudit("SUPPLIER_REGISTERED", `Registered new logistics supplier ${newSup.companyName} with Contact Name ${newSup.name} and PAN ${newSup.panCardNo}`);
  };

  const handleAddCompany = async (newComp: PassengerCompany) => {
    setCompanies(prev => [...prev, newComp]);
    await saveCompanyToDb(newComp);
    await logAudit("COMPANY_REGISTERED", `Registered new corporate passenger company ${newComp.officeName} under director ${newComp.ownerName}`);
  };

  // Employee Profile Management Functions
  const handleUpdateEmployee = async (updatedEmp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updatedEmp.id ? updatedEmp : e));
    await saveEmployeeToDb(updatedEmp);
    await logAudit("STAFF_PROFILE_UPDATED", `Adjusted profile registry file of ${updatedEmp.name} (ID: ${updatedEmp.id}) to Role: [${updatedEmp.role}], Status: ${updatedEmp.status}`);
  };

  const handleAddEmployee = async (newEmp: Employee) => {
    setEmployees(prev => [...prev, newEmp]);
    await saveEmployeeToDb(newEmp);
    await logAudit("STAFF_ENROLLED", `Enrolled new enterprise operator ${newEmp.name} (ID: ${newEmp.id}) as Role: [${newEmp.role}]`);
  };

  const handleDeleteEmployee = async (empId: string) => {
    const empName = employees.find(e => e.id === empId)?.name || empId;
    setEmployees(prev => prev.filter(e => e.id !== empId));
    await deleteEmployeeFromDb(empId);
    await logAudit("STAFF_REMOVED", `Removed profile record of staff officer ${empName} (ID: ${empId}) from active registries`);
  };

  // Role Permissions Matrix Configuration Functions
  const handleUpdateRolePermissions = async (updatedRolePerm: RolePermissionConfig) => {
    setDbRolePermissions(prev => {
      const exists = prev.some(rp => rp.role === updatedRolePerm.role);
      if (exists) {
        return prev.map(rp => rp.role === updatedRolePerm.role ? updatedRolePerm : rp);
      } else {
        return [...prev, updatedRolePerm];
      }
    });
    await saveRolePermissionToDb(updatedRolePerm);
    await logAudit("RBAC_MATRIX_UPDATED", `Modified operational module access policies for Role: [${updatedRolePerm.role}]`);
  };

  const handleResetToDefaults = async () => {
    setDbRolePermissions(initialRolePermissions);
    for (const rp of initialRolePermissions) {
      await saveRolePermissionToDb(rp);
    }
    await logAudit("RBAC_POLICIES_RESET", "Reverted all corporate role permission policies back to compliance factory defaults");
  };

  // RBAC Permission check helper using dynamic database role permissions
  const hasModulePermission = (moduleName: string) => {
    const config = dbRolePermissions.find(rp => rp.role === currentUserRole);
    if (!config) {
      const rules = RolePermissions[currentUserRole];
      if (!rules) return false;
      return rules.some(r => r.module === "All" || r.module === moduleName);
    }
    return config.permissions.some(r => r.module === "All" || r.module === moduleName);
  };

  // Navigation controller mapping
  const renderActiveView = () => {
    const selectedBkgObj = bookings.find(b => b.id === selectedBookingId);

    if (selectedBookingId && selectedBkgObj) {
      return (
        <PassengerDetailsView 
          booking={selectedBkgObj}
          drivers={drivers}
          vehicles={vehicles}
          suppliers={suppliers}
          onBack={() => setSelectedBookingId(null)}
          onUpdateBooking={handleUpdateBooking}
          onAddDriver={handleAddDriver}
          onAddVehicle={handleAddVehicle}
          onGenerateInvoice={(id) => {
            const bkg = bookings.find(b => b.id === id);
            if (bkg) triggerAutomatedBilling(bkg);
          }}
          showToast={showToast}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        if (!hasModulePermission("Dashboard")) return <PermissionDeniedGate module="Dashboard" role={currentUserRole} />;
        return (
          <DashboardView 
            bookings={bookings} 
            drivers={drivers} 
            vehicles={vehicles} 
            onSelectBooking={(id) => setSelectedBookingId(id)}
          />
        );
      case "bookings":
        if (!hasModulePermission("Bookings")) return <PermissionDeniedGate module="Bookings" role={currentUserRole} />;
        return (
          <BookingView 
            bookings={bookings}
            drivers={drivers}
            vehicles={vehicles}
            companies={companies}
            onCreateBooking={handleCreateBooking}
            onSelectBooking={(id) => setSelectedBookingId(id)}
            onUpdateBooking={handleUpdateBooking}
            showToast={showToast}
          />
        );
      case "fleet":
        if (!hasModulePermission("Fleet")) return <PermissionDeniedGate module="Fleet" role={currentUserRole} />;
        return (
          <FleetView 
            vehicles={vehicles}
            onToggleVehicleStatus={handleToggleVehicleStatus}
            onAddVehicle={handleAddVehicle}
            showToast={showToast}
          />
        );
      case "pricing":
        if (!hasModulePermission("Pricing")) return <PermissionDeniedGate module="Pricing" role={currentUserRole} />;
        return (
          <PricingEngineView 
            pricingRules={pricingRules}
            onUpdateRule={handleUpdatePricingRule}
            onAddRule={handleAddPricingRule}
            showToast={showToast}
          />
        );
      case "billing":
        if (!hasModulePermission("Invoices")) return <PermissionDeniedGate module="Invoices" role={currentUserRole} />;
        return (
          <InvoiceView 
            invoices={invoices}
            bookings={bookings}
            drivers={drivers}
            vehicles={vehicles}
            onBatchMarkPaid={handleBatchMarkInvoicesPaid}
            showToast={showToast}
          />
        );
      case "reports":
        if (!hasModulePermission("Reports")) return <PermissionDeniedGate module="Reports" role={currentUserRole} />;
        return (
          <ReportsView 
            bookings={bookings}
            invoices={invoices}
            drivers={drivers}
            vehicles={vehicles}
          />
        );
      case "partners":
        if (!hasModulePermission("Fleet") && !hasModulePermission("Bookings")) {
          return <PermissionDeniedGate module="Partners & Corporate Clients" role={currentUserRole} />;
        }
        return (
          <PartnersView 
            suppliers={suppliers}
            companies={companies}
            onAddSupplier={handleAddSupplier}
            onAddCompany={handleAddCompany}
            showToast={showToast}
          />
        );
      case "audit":
        return <AuditLogTableView logs={auditLogs} />;
      case "rbac":
        if (currentUserRole !== UserRole.SUPER_ADMIN) {
          return <PermissionDeniedGate module="Security Permissions & RBAC Matrix" role={currentUserRole} />;
        }
        return (
          <RbacManagementView 
            employees={employees}
            rolePermissions={dbRolePermissions}
            onUpdateEmployee={handleUpdateEmployee}
            onAddEmployee={handleAddEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onUpdateRolePermissions={handleUpdateRolePermissions}
            onResetToDefaults={handleResetToDefaults}
            showToast={showToast}
          />
        );
      default:
        return <DashboardView bookings={bookings} drivers={drivers} vehicles={vehicles} onSelectBooking={setSelectedBookingId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800 antialiased">
      {/* Top Main Workspace Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-40 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
              Enterprise Fleet Logistics Portal
            </h1>
            <p className="text-xs text-gray-500">Fleet Operations & Billing System</p>
          </div>
        </div>

        {/* User Session and RBAC role switcher switcher */}
        <div className="flex items-center gap-3 self-end md:self-auto bg-slate-50 border border-gray-200 rounded-xl p-1.5 px-3">
          <div className="text-right">
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Workspace Identity</span>
            <span className="text-xs font-bold text-gray-800">Siddhesh Patne</span>
          </div>
          
          <div className="h-6 w-px bg-gray-200"></div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Testing RBAC:</span>
            <select
              value={currentUserRole}
              onChange={(e) => {
                const r = e.target.value as UserRole;
                setCurrentUserRole(r);
                logAudit("USER_SWITCHED_ROLE", `Switched operational session view context to [${r}] to review clearances`);
              }}
              className="text-xs border border-gray-200 rounded-lg py-1 px-2.5 bg-white font-bold text-indigo-600 outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Left Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-400 border-r border-slate-800 p-5 flex flex-col justify-between no-print shrink-0">
          <div className="space-y-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1.5">Operational Modules</span>

            <nav className="space-y-1">
              <SidebarLink 
                icon={<LayoutDashboard className="w-4 h-4" />} 
                label="Dashboard" 
                active={activeTab === "dashboard" && !selectedBookingId} 
                onClick={() => { setActiveTab("dashboard"); setSelectedBookingId(null); }} 
              />
              <SidebarLink 
                icon={<Briefcase className="w-4 h-4" />} 
                label="Bookings & Tickets" 
                active={activeTab === "bookings" && !selectedBookingId} 
                onClick={() => { setActiveTab("bookings"); setSelectedBookingId(null); }} 
              />
              <SidebarLink 
                icon={<Car className="w-4 h-4" />} 
                label="Fleet Assets" 
                active={activeTab === "fleet" && !selectedBookingId} 
                onClick={() => { setActiveTab("fleet"); setSelectedBookingId(null); }} 
              />
              <SidebarLink 
                icon={<SlidersHorizontal className="w-4 h-4" />} 
                label="Pricing Tariffs" 
                active={activeTab === "pricing" && !selectedBookingId} 
                onClick={() => { setActiveTab("pricing"); setSelectedBookingId(null); }} 
              />
              <SidebarLink 
                icon={<Receipt className="w-4 h-4" />} 
                label="Tax Invoicing" 
                active={activeTab === "billing" && !selectedBookingId} 
                onClick={() => { setActiveTab("billing"); setSelectedBookingId(null); }} 
              />
              <SidebarLink 
                icon={<TrendingUp className="w-4 h-4" />} 
                label="Reports Ledger" 
                active={activeTab === "reports" && !selectedBookingId} 
                onClick={() => { setActiveTab("reports"); setSelectedBookingId(null); }} 
              />
              <SidebarLink 
                icon={<Users className="w-4 h-4" />} 
                label="Partners & Corporate Clients" 
                active={activeTab === "partners" && !selectedBookingId} 
                onClick={() => { setActiveTab("partners"); setSelectedBookingId(null); }} 
              />
              
              <div className="border-t border-slate-800/80 my-4"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1.5 pb-2">Technical Logs</span>

              <SidebarLink 
                icon={<History className="w-4 h-4" />} 
                label="Activity Audit Trail" 
                active={activeTab === "audit" && !selectedBookingId} 
                onClick={() => { setActiveTab("audit"); setSelectedBookingId(null); }} 
              />

              <SidebarLink 
                icon={<Shield className="w-4 h-4" />} 
                label="Staff & Clearances (RBAC)" 
                active={activeTab === "rbac" && !selectedBookingId} 
                onClick={() => { setActiveTab("rbac"); setSelectedBookingId(null); }} 
              />
            </nav>
          </div>

          <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 space-y-2">
            <div>
              Platform Security: <strong className="text-slate-300">Active</strong>
            </div>
            <div>
              Dialect: <strong className="text-indigo-400 font-mono">Postgres15</strong>
            </div>
            <div>
              Node Container: <strong className="text-emerald-400 font-mono">Port 3000</strong>
            </div>
          </div>
        </aside>

        {/* Dynamic Workspace Content Viewer */}
        <main className="flex-1 p-5 md:p-6 w-full min-w-0 overflow-y-auto">
          {isLoadingDb ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-100 shadow-xs p-12 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900">Synchronizing Operational Ledger...</h3>
                <p className="text-xs text-gray-500 mt-1">Connecting to secure Cloud Firestore and verifying compliance schemas...</p>
              </div>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      {/* Global Floating Toast Alerts Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-3 pointer-events-auto transition-all ${
              t.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : t.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : t.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-indigo-50 border-indigo-200 text-indigo-800"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {t.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {t.type === "info" && <Info className="w-4 h-4 text-indigo-600 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-gray-400 hover:text-gray-600 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sidebar Link Component helper
interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarLink({ icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-all ${
        active 
          ? "bg-indigo-600 text-white font-bold shadow-xs" 
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// RBAC Warning Gate component
interface PermissionDeniedGateProps {
  module: string;
  role: UserRole;
}

function PermissionDeniedGate({ module, role }: PermissionDeniedGateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto my-12 space-y-4">
      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-sm border border-rose-100">
        <Lock className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Access Restricted</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Your current testing role <strong className="text-indigo-600 font-bold uppercase">{role}</strong> has insufficient security clearances to view the <strong className="text-gray-800 font-bold">{module}</strong> database cluster.
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-[11px] text-gray-600 leading-normal text-left space-y-1">
        <span className="font-bold block text-gray-700">Required Clearances:</span>
        <div>• Role-Permissions Matrix must declare module action authorization.</div>
        <div>• Select <strong>Super Admin</strong> or <strong>Operations Manager</strong> in the top header switcher to override permission blocks instantly.</div>
      </div>
    </div>
  );
}

// Audit Logs Table View Component
function AuditLogTableView({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Activity Audit Trail</h2>
          <p className="text-xs text-gray-500">Immutable operations log recording dispatch, pricing, and RBAC transitions</p>
        </div>
        <div className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-2 font-mono text-gray-600">
          LOG RETENTION PERIOD: <strong>365 DAYS</strong>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Parameters & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-mono text-gray-700">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-gray-400 text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-indigo-600 font-bold">{log.id}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-gray-800">{log.userName}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-sans font-semibold text-indigo-700 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{log.action}</td>
                  <td className="py-3 px-4 font-sans text-gray-600 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
