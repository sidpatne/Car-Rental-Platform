/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking, BookingStatus, Driver, Invoice, PricingRule, Supplier, PassengerCompany, TripType, Vehicle, VehicleCategory, AuditLog, UserRole, RolePermissions, Employee, RolePermissionConfig } from "./types";

export const initialSuppliers: Supplier[] = [
  {
    id: "SPL-001",
    name: "Rajesh Mahindra",
    companyName: "Mahindra & Mahindra Logistics Ltd",
    mobile: "+91 98230 45671",
    email: "corporate@mahindralogistics.com",
    gstin: "27AAACM4829K1Z4",
    rating: 4.8,
    vehiclesCount: 15,
    commissionRate: 5.0,
    panCardNo: "AAACM4829K"
  },
  {
    id: "SPL-002",
    name: "Sunil Gupta",
    companyName: "Carzonrent India Pvt Ltd",
    mobile: "+91 99220 12345",
    email: "operations@carzonrent.com",
    gstin: "07AAACC2381B2ZG",
    rating: 4.5,
    vehiclesCount: 22,
    commissionRate: 7.5,
    panCardNo: "AAACC2381B"
  },
  {
    id: "SPL-003",
    name: "Regal Sharma",
    companyName: "Regal Cabs Agency",
    mobile: "+91 88776 55443",
    email: "booking@regalcabs.in",
    gstin: "19AABBR8821C3ZP",
    rating: 4.2,
    vehiclesCount: 8,
    commissionRate: 6.0,
    panCardNo: "AABBR8821C"
  }
];

export const initialCompanies: PassengerCompany[] = [
  {
    id: "COM-001",
    officeName: "Tata Consultancy Services Ltd",
    email: "admin.mumbai@tcs.com",
    gstin: "27AAACT1234A1Z1",
    mobile: "+91 22 6778 9999",
    ownerName: "Natarajan Chandrasekaran",
    panCardNo: "AAACT1234A"
  },
  {
    id: "COM-002",
    officeName: "Reliance Industries Ltd",
    email: "travel.desk@ril.com",
    gstin: "27AAACR4321B2Z2",
    mobile: "+91 22 4477 5000",
    ownerName: "Mukesh Ambani",
    panCardNo: "AAACR4321B"
  },
  {
    id: "COM-003",
    officeName: "Infosys Technologies Ltd",
    email: "corporate.travel@infosys.com",
    gstin: "29AAACI5678C3Z3",
    mobile: "+91 80 2852 0261",
    ownerName: "Salil Parekh",
    panCardNo: "AAACI5678C"
  },
  {
    id: "COM-004",
    officeName: "Google India Pvt Ltd",
    email: "india-travel@google.com",
    gstin: "27AAACG9876D4Z4",
    mobile: "+91 124 451 2900",
    ownerName: "Sanjay Gupta",
    panCardNo: "AAACG9876D"
  },
  {
    id: "COM-005",
    officeName: "ICICI Bank Limited",
    email: "logistics@icicibank.com",
    gstin: "27AAACI1122E5Z5",
    mobile: "+91 22 2653 1122",
    ownerName: "Sandeep Bakhshi",
    panCardNo: "AAACI1122E"
  }
];

export const initialDrivers: Driver[] = [
  {
    id: "DRV-001",
    name: "Ramesh Kumar",
    mobile: "+91 98110 54321",
    licenseNumber: "DL-1420180029381",
    licenseExpiry: "2029-08-12",
    status: "Available",
    rating: 4.9,
    shiftStart: "08:00",
    shiftEnd: "20:00",
    tripsCount: 142,
    baseLocation: "Mumbai - Airport (BOM)"
  },
  {
    id: "DRV-002",
    name: "Satish Shinde",
    mobile: "+91 98220 87654",
    licenseNumber: "MH-1220150008432",
    licenseExpiry: "2027-11-20",
    status: "On Duty",
    rating: 4.7,
    shiftStart: "07:00",
    shiftEnd: "19:00",
    tripsCount: 203,
    baseLocation: "Pune - Hinjewadi"
  },
  {
    id: "DRV-003",
    name: "Amit Patel",
    mobile: "+91 95432 11223",
    licenseNumber: "GJ-0120190038472",
    licenseExpiry: "2026-07-15", // Expiring soon!
    status: "Available",
    rating: 4.8,
    shiftStart: "09:00",
    shiftEnd: "21:00",
    tripsCount: 94,
    baseLocation: "Ahmedabad - SG Highway"
  },
  {
    id: "DRV-004",
    name: "Gurpreet Singh",
    mobile: "+91 99112 33445",
    licenseNumber: "DL-0320140028341",
    licenseExpiry: "2028-03-24",
    status: "On Duty",
    rating: 4.6,
    shiftStart: "20:00",
    shiftEnd: "08:00", // Night shift
    tripsCount: 312,
    baseLocation: "Delhi - Connaught Place"
  },
  {
    id: "DRV-005",
    name: "Venkatesh Prasad",
    mobile: "+91 80556 77889",
    licenseNumber: "KA-5120200049381",
    licenseExpiry: "2030-01-30",
    status: "On Leave",
    rating: 4.5,
    shiftStart: "08:00",
    shiftEnd: "20:00",
    tripsCount: 88,
    baseLocation: "Bengaluru - Whitefield"
  },
  {
    id: "DRV-006",
    name: "Mohammed Rafi",
    mobile: "+91 90887 66554",
    licenseNumber: "TS-0920210048293",
    licenseExpiry: "2026-06-12", // Expired recently
    status: "Suspended",
    rating: 4.3,
    shiftStart: "09:00",
    shiftEnd: "21:00",
    tripsCount: 115,
    baseLocation: "Hyderabad - Gachibowli"
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: "MH-12-QE-4592",
    model: "Toyota Innova Crysta",
    category: VehicleCategory.SUV,
    supplierId: "SPL-001",
    status: "Available",
    fuelType: "Diesel",
    mileageKmpl: 11.5,
    fuelLevel: 85,
    currentLocationName: "Pune - Shivaji Nagar",
    documents: {
      insuranceExpiry: "2027-04-10",
      fitnessExpiry: "2026-07-20", // Soon
      pucExpiry: "2026-08-01",
      permitExpiry: "2028-12-15"
    }
  },
  {
    id: "DL-3C-AS-8812",
    model: "Maruti Suzuki Dzire",
    category: VehicleCategory.SEDAN,
    supplierId: "SPL-002",
    status: "In Trip",
    fuelType: "CNG",
    mileageKmpl: 21.0,
    fuelLevel: 45,
    currentLocationName: "Delhi - Aero City (Near IGI)",
    documents: {
      insuranceExpiry: "2026-09-18",
      fitnessExpiry: "2027-02-14",
      pucExpiry: "2026-07-05", // Soon
      permitExpiry: "2027-10-30"
    }
  },
  {
    id: "KA-03-MM-7241",
    model: "Mercedes E-Class 350d",
    category: VehicleCategory.LUXURY,
    supplierId: "Self-Owned",
    status: "Available",
    fuelType: "Diesel",
    mileageKmpl: 12.0,
    fuelLevel: 95,
    currentLocationName: "Bengaluru - Indiranagar",
    documents: {
      insuranceExpiry: "2026-11-30",
      fitnessExpiry: "2028-05-18",
      pucExpiry: "2026-12-15",
      permitExpiry: "2029-01-20"
    }
  },
  {
    id: "MH-01-DK-9023",
    model: "Toyota Fortuner",
    category: VehicleCategory.PREMIUM_SUV,
    supplierId: "SPL-001",
    status: "In Trip",
    fuelType: "Diesel",
    mileageKmpl: 9.8,
    fuelLevel: 62,
    currentLocationName: "Mumbai - Bandra Kurla Complex",
    documents: {
      insuranceExpiry: "2026-12-25",
      fitnessExpiry: "2027-08-11",
      pucExpiry: "2026-10-14",
      permitExpiry: "2028-04-05"
    }
  },
  {
    id: "DL-1C-TT-0412",
    model: "Force Tempo Traveller",
    category: VehicleCategory.TEMPO_TRAVELLER,
    supplierId: "SPL-003",
    status: "Maintenance",
    fuelType: "Diesel",
    mileageKmpl: 8.5,
    fuelLevel: 20,
    currentLocationName: "Delhi - Okhla Workshop",
    documents: {
      insuranceExpiry: "2026-06-20", // Expired!
      fitnessExpiry: "2026-07-15",
      pucExpiry: "2026-06-15", // Expired!
      permitExpiry: "2027-03-12"
    }
  }
];

export const initialPricingRules: PricingRule[] = [
  {
    id: "PR-001",
    vehicleCategory: VehicleCategory.SEDAN,
    city: "Mumbai",
    tripType: TripType.LOCAL_8H_80KM,
    basePrice: 2400,
    includedKms: 80,
    includedHours: 8,
    extraKmRate: 14,
    extraHourRate: 150,
    nightCharges: 250,
    waitingRatePerHour: 100,
    driverAllowancePerDay: 300
  },
  {
    id: "PR-002",
    vehicleCategory: VehicleCategory.SUV,
    city: "Mumbai",
    tripType: TripType.LOCAL_8H_80KM,
    basePrice: 3800,
    includedKms: 80,
    includedHours: 8,
    extraKmRate: 18,
    extraHourRate: 200,
    nightCharges: 300,
    waitingRatePerHour: 150,
    driverAllowancePerDay: 400
  },
  {
    id: "PR-003",
    vehicleCategory: VehicleCategory.LUXURY,
    city: "Bengaluru",
    tripType: TripType.LOCAL_8H_80KM,
    basePrice: 12000,
    includedKms: 80,
    includedHours: 8,
    extraKmRate: 60,
    extraHourRate: 800,
    nightCharges: 1000,
    waitingRatePerHour: 500,
    driverAllowancePerDay: 600
  },
  {
    id: "PR-004",
    vehicleCategory: VehicleCategory.SUV,
    city: "Delhi",
    tripType: TripType.AIRPORT_TRANSFER,
    basePrice: 1800,
    includedKms: 40,
    includedHours: 4,
    extraKmRate: 18,
    extraHourRate: 200,
    nightCharges: 250,
    waitingRatePerHour: 120,
    driverAllowancePerDay: 300
  },
  {
    id: "PR-005",
    vehicleCategory: VehicleCategory.PREMIUM_SUV,
    city: "Mumbai",
    tripType: TripType.OUTSTATION_ROUND,
    basePrice: 5000, // per day minimum charge
    includedKms: 250, // minimum billing km per day
    includedHours: 24,
    extraKmRate: 22,
    extraHourRate: 0,
    nightCharges: 400,
    waitingRatePerHour: 200,
    driverAllowancePerDay: 500
  }
];

export const initialBookings: Booking[] = [
  {
    id: "BKG-2026-1049",
    customerName: "Siddharth Malhotra",
    mobile: "+91 98450 11223",
    email: "siddharth.m@tata.com",
    company: "Tata Consultancy Services Ltd",
    address: "TCS Banyan Park, Andheri, Mumbai",
    pickupAddress: "Taj Mahal Palace Hotel, Colaba, Mumbai",
    dropAddress: "Chhatrapati Shivaji Maharaj Airport (BOM), Mumbai",
    pickupDate: "2026-06-30",
    pickupTime: "10:30",
    tripType: TripType.AIRPORT_TRANSFER,
    vehicleCategory: VehicleCategory.SUV,
    passengersCount: 3,
    remarks: "VIP Client. Needs water bottle, newspaper, and English-speaking driver.",
    specialInstructions: "Arrive 15 minutes before schedule. Guard of honor protocol.",
    status: BookingStatus.STARTED,
    assignedSupplierId: "SPL-001",
    assignedDriverId: "DRV-001",
    assignedVehicleId: "MH-12-QE-4592",
    currentLat: 19.0760,
    currentLng: 72.8777,
    tripProgress: 65,
    speedKmph: 42,
    createdAt: "2026-06-29T14:32:00Z"
  },
  {
    id: "BKG-2026-1048",
    customerName: "Priyanjali Sharma",
    mobile: "+91 99334 55667",
    email: "priyanjali.sharma@reliance.co.in",
    company: "Reliance Industries Ltd",
    address: "Reliance Corporate Park, Ghansoli",
    pickupAddress: "RCP Gate 2, Ghansoli, Navi Mumbai",
    dropAddress: "Maker Chambers, Nariman Point, Mumbai",
    pickupDate: "2026-06-30",
    pickupTime: "08:15",
    tripType: TripType.LOCAL_8H_80KM,
    vehicleCategory: VehicleCategory.SEDAN,
    passengersCount: 1,
    remarks: "Frequent corporate traveler. Safe driving preferred.",
    specialInstructions: "Do not exceed 80kmph.",
    status: BookingStatus.COMPLETED,
    assignedSupplierId: "SPL-002",
    assignedDriverId: "DRV-002",
    assignedVehicleId: "DL-3C-AS-8812",
    kmsUsed: 84, // extra 4 km
    hoursUsed: 9, // extra 1 hr
    tollCharges: 120,
    parkingCharges: 80,
    otherCharges: 0,
    discountPercentage: 5,
    createdAt: "2026-06-29T09:12:00Z"
  },
  {
    id: "BKG-2026-1047",
    customerName: "Karthik Subramanian",
    mobile: "+91 91122 33445",
    email: "karthik.sub@infosys.com",
    company: "Infosys Technologies Ltd",
    address: "Infosys Campus, Electronic City, Bengaluru",
    pickupAddress: "Infosys Phase 1, Electronic City, Bengaluru",
    dropAddress: "Kempegowda International Airport (BLR), Bengaluru",
    pickupDate: "2026-07-01",
    pickupTime: "14:00",
    tripType: TripType.AIRPORT_TRANSFER,
    vehicleCategory: VehicleCategory.LUXURY,
    passengersCount: 2,
    remarks: "Client delegation from Microsoft. Board member travel.",
    specialInstructions: "Impeccably clean cabin. Sanitizer required.",
    status: BookingStatus.CONFIRMED,
    assignedSupplierId: undefined,
    assignedDriverId: undefined,
    assignedVehicleId: undefined,
    createdAt: "2026-06-29T17:45:00Z"
  },
  {
    id: "BKG-2026-1046",
    customerName: "Rohan Mehra",
    mobile: "+91 98888 77777",
    email: "rohan.mehra@google.com",
    company: "Google India Pvt Ltd",
    address: "Google Signature Towers, Sector 15, Gurugram",
    pickupAddress: "Aero City Hotel Novotel, Delhi",
    dropAddress: "Google Office, Sector 15, Gurugram",
    pickupDate: "2026-06-30",
    pickupTime: "09:00",
    tripType: TripType.LOCAL_8H_80KM,
    vehicleCategory: VehicleCategory.SEDAN,
    passengersCount: 1,
    remarks: "Daily commute booking.",
    specialInstructions: "Confirm receipt of driver details via SMS.",
    status: BookingStatus.INVOICED,
    assignedSupplierId: "SPL-002",
    assignedDriverId: "DRV-004",
    assignedVehicleId: "DL-3C-AS-8812",
    kmsUsed: 75,
    hoursUsed: 7.5,
    tollCharges: 80,
    parkingCharges: 40,
    otherCharges: 0,
    invoiceId: "INV-2026-1046",
    createdAt: "2026-06-28T11:00:00Z"
  },
  {
    id: "BKG-2026-1045",
    customerName: "Nisha Patel",
    mobile: "+91 97776 54321",
    email: "nisha.patel@icicibank.com",
    company: "ICICI Bank Limited",
    address: "ICICI Towers, BKC, Mumbai",
    pickupAddress: "ICICI Towers BKC, Mumbai",
    dropAddress: "Pune Marriott Hotel, Senapati Bapat Road, Pune",
    pickupDate: "2026-07-02",
    pickupTime: "06:00",
    tripType: TripType.OUTSTATION_ROUND,
    vehicleCategory: VehicleCategory.PREMIUM_SUV,
    passengersCount: 4,
    remarks: "Outstation audit trip. Return scheduled for 2026-07-03.",
    specialInstructions: "Ensure fastag has sufficient balance.",
    status: BookingStatus.DRAFT,
    createdAt: "2026-06-29T19:22:00Z"
  }
];

export const initialInvoices: Invoice[] = [
  {
    invoiceNumber: "INV-2026-1046",
    bookingId: "BKG-2026-1046",
    invoiceDate: "2026-06-30",
    dueDate: "2026-07-15",
    baseCharge: 2200,
    extraKmCharges: 0,
    extraHourCharges: 0,
    driverAllowance: 300,
    nightCharges: 0,
    waitingCharges: 0,
    tollCharges: 80,
    parkingCharges: 40,
    miscellaneousCharges: 0,
    subtotal: 2620,
    discountAmount: 120,
    cgstAmount: 225, // ~9% of taxable amount
    sgstAmount: 225, // ~9% of taxable amount
    grandTotal: 2950,
    paymentStatus: "Paid",
    paymentMethod: "Corporate Wallet"
  },
  {
    invoiceNumber: "INV-2026-1048",
    bookingId: "BKG-2026-1048",
    invoiceDate: "2026-06-30",
    dueDate: "2026-07-15",
    baseCharge: 2400, // Sedan Local
    extraKmCharges: 56, // 4 km * Rs.14
    extraHourCharges: 150, // 1 hr * Rs.150
    driverAllowance: 300,
    nightCharges: 0,
    waitingCharges: 0,
    tollCharges: 120,
    parkingCharges: 80,
    miscellaneousCharges: 0,
    subtotal: 3106,
    discountAmount: 155, // 5%
    cgstAmount: 265.5,
    sgstAmount: 265.5,
    grandTotal: 3482,
    paymentStatus: "Unpaid"
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    timestamp: "2026-06-30T09:00:15Z",
    userId: "USR-001",
    userName: "Siddhesh Patne",
    role: UserRole.SUPER_ADMIN,
    action: "ROLE_CHANGE",
    details: "Switched logged-in session role to Super Admin for audit check."
  },
  {
    id: "AUD-002",
    timestamp: "2026-06-30T09:12:00Z",
    userId: "USR-002",
    userName: "Rajesh Dispatcher",
    role: UserRole.DISPATCHER,
    action: "VEHICLE_ASSIGNED",
    details: "Assigned vehicle MH-12-QE-4592 and driver Ramesh Kumar to booking BKG-2026-1049."
  },
  {
    id: "AUD-003",
    timestamp: "2026-06-30T10:30:00Z",
    userId: "DRV-001",
    userName: "Ramesh Kumar (Driver)",
    role: UserRole.DRIVER,
    action: "TRIP_STARTED",
    details: "Started trip for booking BKG-2026-1049. Pickup Colaba Mumbai."
  },
  {
    id: "AUD-004",
    timestamp: "2026-06-30T11:45:10Z",
    userId: "USR-003",
    userName: "Amrita Billing",
    role: UserRole.BILLING_TEAM,
    action: "INVOICE_GENERATED",
    details: "Generated invoice INV-2026-1048 for booking BKG-2026-1048."
  }
];

export const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Siddhesh Patne",
    email: "siddheshpatne6@gmail.com",
    mobile: "+91 98765 43210",
    role: UserRole.SUPER_ADMIN,
    status: "Active"
  },
  {
    id: "EMP-002",
    name: "Rajesh Dispatcher",
    email: "rajesh@fleet.com",
    mobile: "+91 98230 45672",
    role: UserRole.DISPATCHER,
    status: "Active"
  },
  {
    id: "EMP-003",
    name: "Amrita Billing",
    email: "amrita@fleet.com",
    mobile: "+91 91122 33445",
    role: UserRole.BILLING_TEAM,
    status: "Active"
  },
  {
    id: "EMP-004",
    name: "Sunil Kumar",
    email: "sunil@fleet.com",
    mobile: "+91 92233 44556",
    role: UserRole.OPERATIONS_MANAGER,
    status: "Active"
  },
  {
    id: "EMP-005",
    name: "Vikram Singh",
    email: "vikram@fleet.com",
    mobile: "+91 93344 55667",
    role: UserRole.FLEET_MANAGER,
    status: "Active"
  },
  {
    id: "EMP-006",
    name: "Neha Sharma",
    email: "neha@fleet.com",
    mobile: "+91 94455 66778",
    role: UserRole.BOOKING_EXECUTIVE,
    status: "Active"
  }
];

export const initialRolePermissions: RolePermissionConfig[] = Object.values(UserRole).map(role => ({
  role,
  permissions: RolePermissions[role] || []
}));

