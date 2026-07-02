/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User Roles & RBAC System
export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  OPERATIONS_MANAGER = "Operations Manager",
  DISPATCHER = "Dispatcher",
  BOOKING_EXECUTIVE = "Booking Executive",
  BILLING_TEAM = "Billing Team",
  FLEET_MANAGER = "Fleet Manager",
  DRIVER = "Driver",
  SUPPLIER = "Supplier/Vendor",
  READ_ONLY_MGT = "Read-only Management"
}

export interface Permission {
  module: string;
  actions: ("CREATE" | "READ" | "UPDATE" | "DELETE" | "ASSIGN" | "INVOICE" | "APPROVE")[];
}

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { module: "All", actions: ["CREATE", "READ", "UPDATE", "DELETE", "ASSIGN", "INVOICE", "APPROVE"] }
  ],
  [UserRole.OPERATIONS_MANAGER]: [
    { module: "Dashboard", actions: ["READ"] },
    { module: "Bookings", actions: ["CREATE", "READ", "UPDATE", "ASSIGN"] },
    { module: "Fleet", actions: ["CREATE", "READ", "UPDATE"] },
    { module: "Drivers", actions: ["CREATE", "READ", "UPDATE", "ASSIGN"] },
    { module: "Pricing", actions: ["CREATE", "READ", "UPDATE"] },
    { module: "Invoices", actions: ["READ", "APPROVE"] },
    { module: "Reports", actions: ["READ"] }
  ],
  [UserRole.DISPATCHER]: [
    { module: "Dashboard", actions: ["READ"] },
    { module: "Bookings", actions: ["READ", "UPDATE", "ASSIGN"] },
    { module: "Drivers", actions: ["READ", "ASSIGN"] },
    { module: "Fleet", actions: ["READ"] }
  ],
  [UserRole.BOOKING_EXECUTIVE]: [
    { module: "Dashboard", actions: ["READ"] },
    { module: "Bookings", actions: ["CREATE", "READ", "UPDATE"] },
    { module: "Fleet", actions: ["READ"] }
  ],
  [UserRole.BILLING_TEAM]: [
    { module: "Dashboard", actions: ["READ"] },
    { module: "Bookings", actions: ["READ"] },
    { module: "Pricing", actions: ["READ", "UPDATE"] },
    { module: "Invoices", actions: ["CREATE", "READ", "UPDATE", "INVOICE"] },
    { module: "Reports", actions: ["READ"] }
  ],
  [UserRole.FLEET_MANAGER]: [
    { module: "Dashboard", actions: ["READ"] },
    { module: "Fleet", actions: ["CREATE", "READ", "UPDATE", "DELETE"] },
    { module: "Drivers", actions: ["CREATE", "READ", "UPDATE"] }
  ],
  [UserRole.DRIVER]: [
    { module: "Bookings", actions: ["READ", "UPDATE"] } // Only assigned trips
  ],
  [UserRole.SUPPLIER]: [
    { module: "Bookings", actions: ["READ"] },
    { module: "Fleet", actions: ["CREATE", "READ", "UPDATE"] } // Supplier vehicles
  ],
  [UserRole.READ_ONLY_MGT]: [
    { module: "Dashboard", actions: ["READ"] },
    { module: "Reports", actions: ["READ"] }
  ]
};

// Booking Lifecycle
export enum BookingStatus {
  DRAFT = "Draft",
  CONFIRMED = "Confirmed",
  ASSIGNED = "Assigned",
  STARTED = "Started",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  INVOICED = "Invoiced"
}

export enum TripType {
  AIRPORT_TRANSFER = "Airport Transfer",
  LOCAL_8H_80KM = "Local (8 Hrs / 80 Kms)",
  LOCAL_4H_40KM = "Local (4 Hrs / 40 Kms)",
  OUTSTATION_ROUND = "Outstation Round Trip",
  OUTSTATION_ONEWAY = "Outstation One Way",
  POINT_TO_POINT = "Point to Point"
}

export enum VehicleCategory {
  SEDAN = "Sedan (Dezire/Etios)",
  SUV = "SUV (Innova Crysta)",
  PREMIUM_SUV = "Premium SUV (Fortuner)",
  LUXURY = "Luxury (Mercedes E-Class)",
  TEMPO_TRAVELLER = "Tempo Traveller (17-Seater)"
}

export interface Booking {
  id: string; // Booking ID e.g., BKG-2026-001
  customerName: string;
  mobile: string;
  email: string;
  company: string;
  address: string;
  pickupAddress: string;
  dropAddress: string;
  pickupDate: string;
  pickupTime: string;
  tripType: TripType;
  vehicleCategory: VehicleCategory;
  passengersCount: number;
  remarks: string;
  specialInstructions: string;
  status: BookingStatus;
  
  // Dispatch / Assignment details
  assignedSupplierId?: string;
  assignedDriverId?: string;
  assignedVehicleId?: string;
  
  // Real-time tracking mock states
  currentLat?: number;
  currentLng?: number;
  tripProgress?: number; // percentage 0 - 100
  speedKmph?: number;
  
  // Pricing/Billing calculations
  kmsUsed?: number;
  hoursUsed?: number;
  tollCharges?: number;
  parkingCharges?: number;
  otherCharges?: number;
  discountPercentage?: number;
  invoiceId?: string;
  createdAt: string;
}

// Fleet (Vehicle Asset Management)
export interface Vehicle {
  id: string; // Vehicle Register Number e.g. MH-12-QE-4592
  model: string; // e.g. Toyota Innova Crysta
  category: VehicleCategory;
  supplierId: string; // "Self-Owned" or Supplier Name
  status: "Available" | "In Trip" | "Maintenance" | "Inactive";
  fuelType: "Diesel" | "CNG" | "Petrol" | "Electric";
  mileageKmpl: number;
  fuelLevel: number; // Percentage
  currentLocationName?: string;
  
  // Compliance / Documents
  documents: {
    insuranceExpiry: string;
    fitnessExpiry: string;
    pucExpiry: string;
    permitExpiry: string;
    insuranceUrl?: string;
    fitnessUrl?: string;
    pucUrl?: string;
    permitUrl?: string;
  };
}

// Driver Asset Management
export interface Driver {
  id: string; // DRV-001
  name: string;
  mobile: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: "Available" | "On Duty" | "On Leave" | "Suspended";
  rating: number; // 1-5
  shiftStart: string; // HH:MM
  shiftEnd: string; // HH:MM
  tripsCount: number;
  baseLocation: string;
}

// Supplier/Vendor Management
export interface Supplier {
  id: string; // SPL-001
  name: string; // Owner Name
  companyName: string;
  mobile: string;
  email: string;
  gstin: string; // GST No
  rating: number;
  vehiclesCount: number;
  commissionRate: number; // Percentage
  panCardNo?: string; // PAN Card No
}

// Passenger Company / Corporate Office Details
export interface PassengerCompany {
  id: string; // COM-001
  officeName: string;
  email: string;
  gstin: string; // GST No
  mobile: string;
  ownerName: string;
  panCardNo: string;
}

// Configurable Pricing Engines
export interface PricingRule {
  id: string;
  vehicleCategory: VehicleCategory;
  city: string;
  tripType: TripType;
  basePrice: number; // base rate
  includedKms: number;
  includedHours: number;
  extraKmRate: number;
  extraHourRate: number;
  nightCharges: number; // 23:00 to 05:00
  waitingRatePerHour: number;
  driverAllowancePerDay: number;
}

// Invoice Generation Schema
export interface Invoice {
  invoiceNumber: string; // INV-2026-0001
  bookingId: string;
  invoiceDate: string;
  dueDate: string;
  
  // Computed lines
  baseCharge: number;
  extraKmCharges: number;
  extraHourCharges: number;
  driverAllowance: number;
  nightCharges: number;
  waitingCharges: number;
  tollCharges: number;
  parkingCharges: number;
  miscellaneousCharges: number;
  
  subtotal: number;
  discountAmount: number;
  cgstAmount: number; // 9%
  sgstAmount: number; // 9%
  grandTotal: number;
  
  paymentStatus: "Paid" | "Unpaid" | "Overdue";
  paymentMethod?: "Bank Transfer" | "Credit Card" | "Corporate Wallet" | "Cash";
}

// Audit Log Record
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
}

// Employee Staff Profile Management
export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: "Active" | "Inactive";
}

// Role Permission Configuration for RBAC
export interface RolePermissionConfig {
  role: UserRole;
  permissions: Permission[];
}

