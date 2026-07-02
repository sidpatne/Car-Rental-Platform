/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocFromServer,
  writeBatch
} from "firebase/firestore";
import { 
  Booking, 
  Driver, 
  Vehicle, 
  PricingRule, 
  Invoice, 
  Supplier, 
  PassengerCompany,
  AuditLog,
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

// Firebase Config derived from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "**********",
  authDomain: "*****************",
  projectId: "********************",
  storageBucket: "*************************",
  messagingSenderId: "****************",
  appId: "**************************"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with the exact database ID from config
export const db = getFirestore(app, "ai-studio-fleettravellogis-8758bf83-4a05-41bd-abef-b37f9a9af77a");

// Firestore standard operations enum and structure for error diagnostic
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection per skill guidelines
async function validateConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client is offline. Running in offline-first cached mode.");
    }
  }
}
validateConnection();

/**
 * Enterprise database seeder. If Firestore collections are empty,
 * automatically seed the database with premium mock datasets to prevent empty states.
 */
export async function seedDatabaseIfEmpty() {
  try {
    const bookingsCol = collection(db, "bookings");
    const snapshot = await getDocs(bookingsCol);
    
    if (snapshot.empty) {
      console.log("Database empty. Starting automatic database seed sequence...");
      const batch = writeBatch(db);

      // Seed Suppliers
      initialSuppliers.forEach((s) => {
        const docRef = doc(db, "suppliers", s.id);
        batch.set(docRef, s);
      });

      // Seed Passenger Companies
      initialCompanies.forEach((c) => {
        const docRef = doc(db, "companies", c.id);
        batch.set(docRef, c);
      });

      // Seed Drivers
      initialDrivers.forEach((d) => {
        const docRef = doc(db, "drivers", d.id);
        batch.set(docRef, d);
      });

      // Seed Vehicles
      initialVehicles.forEach((v) => {
        const docRef = doc(db, "vehicles", v.id);
        batch.set(docRef, v);
      });

      // Seed Pricing Rules
      initialPricingRules.forEach((p) => {
        const docRef = doc(db, "pricingRules", p.id);
        batch.set(docRef, p);
      });

      // Seed Bookings
      initialBookings.forEach((b) => {
        const docRef = doc(db, "bookings", b.id);
        batch.set(docRef, b);
      });

      // Seed Invoices
      initialInvoices.forEach((i) => {
        const docRef = doc(db, "invoices", i.invoiceNumber);
        batch.set(docRef, i);
      });

      // Seed Audit Logs
      initialAuditLogs.forEach((l) => {
        const docRef = doc(db, "auditLogs", l.id);
        batch.set(docRef, l);
      });

      // Seed Employees (RBAC Staff Profiles)
      initialEmployees.forEach((emp) => {
        const docRef = doc(db, "employees", emp.id);
        batch.set(docRef, emp);
      });

      // Seed Role Permissions Configurations
      initialRolePermissions.forEach((rp) => {
        // Since Firebase document IDs cannot have slashes or spaces, let's use the role as ID or normalize it
        // role is like "Super Admin" or "Dispatcher". We can use role as document ID (it's safe)
        const docRef = doc(db, "rolePermissions", rp.role);
        batch.set(docRef, rp);
      });

      await batch.commit();
      console.log("Database seeded successfully with default enterprise records.");
    } else {
      console.log("Database contains existing records. Skipping seed sequence.");
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "seed_sequence");
  }
}

// ==========================================
// Operations Layer for Bookings
// ==========================================
export async function fetchBookingsFromDb(): Promise<Booking[]> {
  try {
    const colRef = collection(db, "bookings");
    const snap = await getDocs(colRef);
    const data: Booking[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as Booking);
    });
    // Sort by createdAt descending
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "bookings");
  }
}

export async function saveBookingToDb(booking: Booking): Promise<void> {
  try {
    const docRef = doc(db, "bookings", booking.id);
    await setDoc(docRef, booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `bookings/${booking.id}`);
  }
}

export async function deleteBookingFromDb(bookingId: string): Promise<void> {
  try {
    const docRef = doc(db, "bookings", bookingId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${bookingId}`);
  }
}

// ==========================================
// Operations Layer for Drivers
// ==========================================
export async function fetchDriversFromDb(): Promise<Driver[]> {
  try {
    const colRef = collection(db, "drivers");
    const snap = await getDocs(colRef);
    const data: Driver[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as Driver);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "drivers");
  }
}

export async function saveDriverToDb(driver: Driver): Promise<void> {
  try {
    const docRef = doc(db, "drivers", driver.id);
    await setDoc(docRef, driver);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `drivers/${driver.id}`);
  }
}

export async function deleteDriverFromDb(driverId: string): Promise<void> {
  try {
    const docRef = doc(db, "drivers", driverId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `drivers/${driverId}`);
  }
}

// ==========================================
// Operations Layer for Vehicles
// ==========================================
export async function fetchVehiclesFromDb(): Promise<Vehicle[]> {
  try {
    const colRef = collection(db, "vehicles");
    const snap = await getDocs(colRef);
    const data: Vehicle[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as Vehicle);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "vehicles");
  }
}

export async function saveVehicleToDb(vehicle: Vehicle): Promise<void> {
  try {
    const docRef = doc(db, "vehicles", vehicle.id);
    await setDoc(docRef, vehicle);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `vehicles/${vehicle.id}`);
  }
}

export async function deleteVehicleFromDb(vehicleId: string): Promise<void> {
  try {
    const docRef = doc(db, "vehicles", vehicleId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `vehicles/${vehicleId}`);
  }
}

// ==========================================
// Operations Layer for Suppliers
// ==========================================
export async function fetchSuppliersFromDb(): Promise<Supplier[]> {
  try {
    const colRef = collection(db, "suppliers");
    const snap = await getDocs(colRef);
    const data: Supplier[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as Supplier);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "suppliers");
  }
}

export async function saveSupplierToDb(supplier: Supplier): Promise<void> {
  try {
    const docRef = doc(db, "suppliers", supplier.id);
    await setDoc(docRef, supplier);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `suppliers/${supplier.id}`);
  }
}

export async function deleteSupplierFromDb(supplierId: string): Promise<void> {
  try {
    const docRef = doc(db, "suppliers", supplierId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `suppliers/${supplierId}`);
  }
}

// ==========================================
// Operations Layer for Pricing Rules
// ==========================================
export async function fetchPricingRulesFromDb(): Promise<PricingRule[]> {
  try {
    const colRef = collection(db, "pricingRules");
    const snap = await getDocs(colRef);
    const data: PricingRule[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as PricingRule);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "pricingRules");
  }
}

export async function savePricingRuleToDb(rule: PricingRule): Promise<void> {
  try {
    const docRef = doc(db, "pricingRules", rule.id);
    await setDoc(docRef, rule);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pricingRules/${rule.id}`);
  }
}

// ==========================================
// Operations Layer for Invoices
// ==========================================
export async function fetchInvoicesFromDb(): Promise<Invoice[]> {
  try {
    const colRef = collection(db, "invoices");
    const snap = await getDocs(colRef);
    const data: Invoice[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as Invoice);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "invoices");
  }
}

export async function saveInvoiceToDb(invoice: Invoice): Promise<void> {
  try {
    const docRef = doc(db, "invoices", invoice.invoiceNumber);
    await setDoc(docRef, invoice);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `invoices/${invoice.invoiceNumber}`);
  }
}

export async function deleteInvoiceFromDb(invoiceNumber: string): Promise<void> {
  try {
    const docRef = doc(db, "invoices", invoiceNumber);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `invoices/${invoiceNumber}`);
  }
}

// ==========================================
// Operations Layer for Passenger Companies
// ==========================================
export async function fetchCompaniesFromDb(): Promise<PassengerCompany[]> {
  try {
    const colRef = collection(db, "companies");
    const snap = await getDocs(colRef);
    const data: PassengerCompany[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as PassengerCompany);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "companies");
  }
}

export async function saveCompanyToDb(company: PassengerCompany): Promise<void> {
  try {
    const docRef = doc(db, "companies", company.id);
    await setDoc(docRef, company);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `companies/${company.id}`);
  }
}

export async function deleteCompanyFromDb(companyId: string): Promise<void> {
  try {
    const docRef = doc(db, "companies", companyId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `companies/${companyId}`);
  }
}

// ==========================================
// Operations Layer for Audit Logs
// ==========================================
export async function fetchAuditLogsFromDb(): Promise<AuditLog[]> {
  try {
    const colRef = collection(db, "auditLogs");
    const snap = await getDocs(colRef);
    const data: AuditLog[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as AuditLog);
    });
    return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "auditLogs");
  }
}

export async function saveAuditLogToDb(log: AuditLog): Promise<void> {
  try {
    const docRef = doc(db, "auditLogs", log.id);
    await setDoc(docRef, log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `auditLogs/${log.id}`);
  }
}

// ==========================================
// Operations Layer for Employees
// ==========================================
export async function fetchEmployeesFromDb(): Promise<Employee[]> {
  try {
    const colRef = collection(db, "employees");
    const snap = await getDocs(colRef);
    const data: Employee[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as Employee);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "employees");
  }
}

export async function saveEmployeeToDb(employee: Employee): Promise<void> {
  try {
    const docRef = doc(db, "employees", employee.id);
    await setDoc(docRef, employee);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `employees/${employee.id}`);
  }
}

export async function deleteEmployeeFromDb(employeeId: string): Promise<void> {
  try {
    const docRef = doc(db, "employees", employeeId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `employees/${employeeId}`);
  }
}

// ==========================================
// Operations Layer for Role Permissions Matrix
// ==========================================
export async function fetchRolePermissionsFromDb(): Promise<RolePermissionConfig[]> {
  try {
    const colRef = collection(db, "rolePermissions");
    const snap = await getDocs(colRef);
    const data: RolePermissionConfig[] = [];
    snap.forEach((doc) => {
      data.push(doc.data() as RolePermissionConfig);
    });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "rolePermissions");
  }
}

export async function saveRolePermissionToDb(rp: RolePermissionConfig): Promise<void> {
  try {
    const docRef = doc(db, "rolePermissions", rp.role);
    await setDoc(docRef, rp);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `rolePermissions/${rp.role}`);
  }
}

