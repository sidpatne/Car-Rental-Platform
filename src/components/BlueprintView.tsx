/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  Database, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  CalendarDays, 
  CheckCircle2, 
  FileCode, 
  Network, 
  Server, 
  HardDrive, 
  ListOrdered,
  Workflow
} from "lucide-react";

export default function BlueprintView() {
  const [activeTab, setActiveTab] = useState<"requirements" | "database" | "apis" | "architecture" | "scalability" | "roadmap">("requirements");

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-6 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
            <Layers className="w-4 h-4" /> System Architect Workspace
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Enterprise Fleet Logistics Blueprint
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Production-ready specifications, database DDLs, API catalogs, and scaling models matching Indecab enterprise specifications.
          </p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
          <span className="px-2.5 py-1 text-slate-300 font-medium">Doc Version: 2.4.0</span>
          <span className="px-2.5 py-1 text-indigo-400 border-l border-slate-800 font-bold">STATUS: SIGNED-OFF</span>
        </div>
      </div>

      {/* Docs Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/50 px-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab("requirements")}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold transition-all duration-150 ${
            activeTab === "requirements" 
              ? "border-indigo-500 text-indigo-400 bg-slate-900/40" 
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Requirements & RBAC
        </button>
        <button
          onClick={() => setActiveTab("database")}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold transition-all duration-150 ${
            activeTab === "database" 
              ? "border-indigo-500 text-indigo-400 bg-slate-900/40" 
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          Normalized DB ERD
        </button>
        <button
          onClick={() => setActiveTab("apis")}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold transition-all duration-150 ${
            activeTab === "apis" 
              ? "border-indigo-500 text-indigo-400 bg-slate-900/40" 
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
          }`}
        >
          <FileCode className="w-4 h-4" />
          REST API Catalog
        </button>
        <button
          onClick={() => setActiveTab("architecture")}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold transition-all duration-150 ${
            activeTab === "architecture" 
              ? "border-indigo-500 text-indigo-400 bg-slate-900/40" 
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Infrastructure Stack
        </button>
        <button
          onClick={() => setActiveTab("scalability")}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold transition-all duration-150 ${
            activeTab === "scalability" 
              ? "border-indigo-500 text-indigo-400 bg-slate-900/40" 
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Scale & DR Strategy
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold transition-all duration-150 ${
            activeTab === "roadmap" 
              ? "border-indigo-500 text-indigo-400 bg-slate-900/40" 
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Engineering Roadmap
        </button>
      </div>

      {/* Docs Body Content */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[800px]">
        {/* TAB 1: Requirements & RBAC */}
        {activeTab === "requirements" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded">FR</span>
                  Functional Requirements
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong>Unified Booking Engine:</strong> Support multi-tenant, corporate passenger registrations, outstation routing, airport-transfers with wait-time tracking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong>Dynamic Pricing Engine:</strong> City-wise, vehicle-wise custom corporate SLA pricing, extra KM/Hours logic, night-shift allowances, toll/parking integration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong>Intelligent Roster Scheduling:</strong> Automated vehicle-driver-supplier assignment using nearest-available coordinates and historical duty logs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong>Compliance & Document Vault:</strong> Expiry alerts for PUC, Fitness Certificates, Commercial Permits, State Taxes and Driver Licenses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span><strong>Corporate Ledger & Invoicing:</strong> Auto-compilation of complete trip sheets into professional GST-compliant invoices downloadable in PDF format.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-lg border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded">NFR</span>
                  Non-Functional Requirements
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Sub-Second Dispatch Latency:</strong> Matching and scheduling conflicts verified under 500ms using atomic database triggers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>99.99% Operational Uptime:</strong> High availability multi-region deployment backed by automated container health-checks and failover mechanisms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Data Privacy Compliance (GDPR/DPD):</strong> Masking passenger mobile numbers and personal identifiers on public screens. Encryption for all files in S3.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span><strong>Mobile-First Driver Layout:</strong> Responsive grid design tailored for high-glare and touch environments for dispatch operations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RBAC Table */}
            <div className="bg-slate-950/40 p-5 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                Enterprise RBAC Permission Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-xs">
                      <th className="py-2 px-3">Role Name</th>
                      <th className="py-2 px-3">Dashboard</th>
                      <th className="py-2 px-3">Bookings</th>
                      <th className="py-2 px-3">Fleet Asset</th>
                      <th className="py-2 px-3">Driver Allocation</th>
                      <th className="py-2 px-3">Pricing Settings</th>
                      <th className="py-2 px-3">Invoicing</th>
                      <th className="py-2 px-3">System Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Super Admin</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Operations Mgr</td>
                      <td className="py-2.5 px-3 text-emerald-400">Read</td>
                      <td className="py-2.5 px-3 text-emerald-400">Manage</td>
                      <td className="py-2.5 px-3 text-emerald-400">Manage</td>
                      <td className="py-2.5 px-3 text-emerald-400">Manage</td>
                      <td className="py-2.5 px-3 text-indigo-400">Read/Edit</td>
                      <td className="py-2.5 px-3 text-indigo-400">Approve</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Dispatcher</td>
                      <td className="py-2.5 px-3 text-emerald-400">Read</td>
                      <td className="py-2.5 px-3 text-indigo-400">Assign Only</td>
                      <td className="py-2.5 px-3 text-slate-300">Read</td>
                      <td className="py-2.5 px-3 text-emerald-400">Manage</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Booking Exec</td>
                      <td className="py-2.5 px-3 text-emerald-400">Read</td>
                      <td className="py-2.5 px-3 text-emerald-400">Create/Edit</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Billing Team</td>
                      <td className="py-2.5 px-3 text-emerald-400">Read</td>
                      <td className="py-2.5 px-3 text-slate-300">Read</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-indigo-400">Read/Edit</td>
                      <td className="py-2.5 px-3 text-emerald-400">Full</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-white">Fleet Manager</td>
                      <td className="py-2.5 px-3 text-emerald-400">Read</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-emerald-400">Manage</td>
                      <td className="py-2.5 px-3 text-indigo-400">Drivers Read</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                      <td className="py-2.5 px-3 text-slate-500">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Normalized DB ERD Schema */}
        {activeTab === "database" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                PostgreSQL Normalized Database Architecture (ERD Model)
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Designed under 3rd Normal Form (3NF). Built to support full acid transaction safety, atomic constraints, custom indices, state histories, soft deletes, and user audit triggers.
              </p>

              {/* ERD Relationship description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-indigo-400 font-bold text-sm mb-1">1-to-Many Relationships</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• <code className="text-slate-200">suppliers</code> (1) ➜ (M) <code className="text-slate-200">vehicles</code></li>
                    <li>• <code className="text-slate-200">companies</code> (1) ➜ (M) <code className="text-slate-200">corporate_pricing</code></li>
                    <li>• <code className="text-slate-200">bookings</code> (1) ➜ (M) <code className="text-slate-200">trip_status_timeline</code></li>
                  </ul>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-emerald-400 font-bold text-sm mb-1">Many-to-Many Mappings</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• <code className="text-slate-200">drivers</code> and <code className="text-slate-200">vehicles</code> via <code className="text-slate-200">driver_vehicle_assignments</code></li>
                    <li>• <code className="text-slate-200">suppliers</code> and <code className="text-slate-200">driver_roster</code></li>
                  </ul>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <div className="text-pink-400 font-bold text-sm mb-1">1-to-1 Strong Constraints</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• <code className="text-slate-200">bookings</code> (1) ➜ (0..1) <code className="text-slate-200">invoices</code></li>
                    <li>• <code className="text-slate-200">invoices</code> (1) ➜ (0..1) <code className="text-slate-200">payment_records</code></li>
                  </ul>
                </div>
              </div>

              {/* SQL Schema Definition */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-400 uppercase font-mono tracking-wider">Production SQL Definition DDL</span>
                  <span className="text-xs text-slate-500 font-mono">Dialect: PostgreSQL 15+</span>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-[350px] leading-relaxed">
{`-- Enterprise Corporate Fleet Schema
-- 1. Suppliers/Vendors Table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    gstin VARCHAR(15) UNIQUE NOT NULL,
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- 2. Vehicles Asset Table
CREATE TABLE vehicles (
    id VARCHAR(50) PRIMARY KEY, -- Register plate (e.g. MH-12-QE-4592)
    model VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Sedan, SUV, Luxury, etc.
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL, -- Null implies Self-Owned
    fuel_type VARCHAR(50) NOT NULL,
    mileage_kmpl DECIMAL(4, 2) NOT NULL,
    fuel_level_percent INT DEFAULT 100,
    status VARCHAR(50) DEFAULT 'Available',
    insurance_expiry DATE NOT NULL,
    fitness_expiry DATE NOT NULL,
    puc_expiry DATE NOT NULL,
    permit_expiry DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_supplier ON vehicles(supplier_id);

-- 3. Drivers Table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Available', -- Available, On Duty, Leave, Suspended
    rating DECIMAL(2,1) DEFAULT 5.0,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    base_location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_drivers_status ON drivers(status);

-- 4. Bookings Core Table
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY, -- BKG-YYYY-XXXX
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    trip_type VARCHAR(100) NOT NULL,
    vehicle_category VARCHAR(100) NOT NULL,
    passengers_count INT DEFAULT 1,
    remarks TEXT,
    special_instructions TEXT,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Confirmed, Assigned, Started, Completed, Cancelled, Invoiced
    assigned_supplier_id UUID REFERENCES suppliers(id),
    assigned_driver_id UUID REFERENCES drivers(id),
    assigned_vehicle_id VARCHAR(50) REFERENCES vehicles(id),
    kms_used DECIMAL(6, 2),
    hours_used DECIMAL(4, 2),
    toll_charges DECIMAL(10, 2) DEFAULT 0.0,
    parking_charges DECIMAL(10, 2) DEFAULT 0.0,
    other_charges DECIMAL(10, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_date);

-- 5. Invoices Table
CREATE TABLE invoices (
    invoice_number VARCHAR(50) PRIMARY KEY, -- INV-YYYY-XXXX
    booking_id VARCHAR(50) UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    base_charge DECIMAL(10, 2) NOT NULL,
    extra_km_charges DECIMAL(10, 2) DEFAULT 0.0,
    extra_hour_charges DECIMAL(10, 2) DEFAULT 0.0,
    driver_allowance DECIMAL(10, 2) DEFAULT 0.0,
    night_charges DECIMAL(10, 2) DEFAULT 0.0,
    waiting_charges DECIMAL(10, 2) DEFAULT 0.0,
    toll_charges DECIMAL(10, 2) DEFAULT 0.0,
    parking_charges DECIMAL(10, 2) DEFAULT 0.0,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.0,
    cgst_amount DECIMAL(10, 2) NOT NULL, -- Central tax (9%)
    sgst_amount DECIMAL(10, 2) NOT NULL, -- State tax (9%)
    grand_total DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Unpaid', -- Paid, Unpaid, Overdue
    payment_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REST API Catalog */}
        {activeTab === "apis" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                Enterprise RESTful API Catalog
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Documented REST architecture designed for integration with client applications, driver apps, or customer CRM dashboards. Supports complete filtering, query sorting, search parameters, and JWT authorization headers.
              </p>

              {/* Endpoint list */}
              <div className="space-y-4">
                {/* Endpoint 1 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-600 text-white font-mono font-bold text-xs rounded">POST</span>
                      <code className="text-indigo-300 font-mono text-sm">/api/v1/bookings</code>
                    </div>
                    <span className="text-xs text-slate-400">Auth: JWT Required (Operations, Booking Exec, Admin)</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">
                    Create a corporate transportation booking, running validation routines via pricing SLA engine prior to checkout.
                  </p>
                  <div className="text-[11px] text-indigo-400 font-mono font-semibold">Request Body Structure:</div>
                  <pre className="p-2.5 bg-slate-950 rounded text-[10px] font-mono text-slate-400 overflow-x-auto mt-1">
{`{
  "customerName": "Siddharth Malhotra",
  "mobile": "+91 98450 11223",
  "email": "siddharth.m@tata.com",
  "company": "Tata Consultancy Services Ltd",
  "pickupAddress": "Taj Mahal Palace, Colaba, Mumbai",
  "dropAddress": "CSM Airport (BOM), Mumbai",
  "pickupDate": "2026-06-30",
  "pickupTime": "10:30",
  "tripType": "Airport Transfer",
  "vehicleCategory": "SUV (Innova Crysta)",
  "passengersCount": 3
}`}
                  </pre>
                </div>

                {/* Endpoint 2 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-600 text-white font-mono font-bold text-xs rounded">PUT</span>
                      <code className="text-amber-300 font-mono text-sm">/api/v1/bookings/:id/assign</code>
                    </div>
                    <span className="text-xs text-slate-400">Auth: JWT Required (Operations, Dispatcher)</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">
                    Manually or automatically allocate a vehicle license plate, driver UUID, and vendor entity to a pending booking.
                  </p>
                  <div className="text-[11px] text-amber-400 font-mono font-semibold">Payload parameters:</div>
                  <pre className="p-2.5 bg-slate-950 rounded text-[10px] font-mono text-slate-400 overflow-x-auto mt-1">
{`{
  "assignedSupplierId": "SPL-001",
  "assignedDriverId": "DRV-001",
  "assignedVehicleId": "MH-12-QE-4592"
}`}
                  </pre>
                </div>

                {/* Endpoint 3 */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold text-xs rounded">GET</span>
                      <code className="text-emerald-300 font-mono text-sm">/api/v1/reports/export</code>
                    </div>
                    <span className="text-xs text-slate-400">Auth: JWT Required (Admin, Billing, Management)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Retrieve compiled financial revenue logs and driver utilization. Query Parameters supported: <code className="text-indigo-400">?format=csv|xlsx</code>, <code className="text-indigo-400">&startDate=2026-06-01</code>, <code className="text-indigo-400">&endDate=2026-06-30</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Platform Architecture */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                Infrastructure & System Deployment Architecture
              </h3>

              {/* Block diagram of system flow */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-4 text-xs font-mono text-center">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <div className="p-3 bg-indigo-950/80 border border-indigo-800 rounded text-indigo-300">
                    <strong>Client Layer</strong><br />
                    React / Vite / Tailwind
                  </div>
                  <div className="text-slate-500 font-bold">➜</div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-300">
                    <strong>Ingress / Proxy</strong><br />
                    Nginx Reverse Proxy & SSL Terminating
                  </div>
                  <div className="text-slate-500 font-bold">➜</div>
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded text-emerald-300">
                    <strong>Core Application</strong><br />
                    NestJS (Express REST API Server)
                  </div>
                </div>

                <div className="flex justify-center py-1">
                  <div className="h-6 w-0.5 bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <div className="p-3 bg-rose-950/80 border border-rose-800 rounded text-rose-300">
                    <strong>Job Queue</strong><br />
                    BullMQ / Redis Cluster
                  </div>
                  <div className="text-slate-500 font-bold">⬌</div>
                  <div className="p-3 bg-amber-950/80 border border-amber-800 rounded text-amber-300">
                    <strong>SQL Database</strong><br />
                    PostgreSQL 15 RDS (Read Replicas)
                  </div>
                  <div className="text-slate-500 font-bold">⬌</div>
                  <div className="p-3 bg-teal-950/80 border border-teal-800 rounded text-teal-300">
                    <strong>Asset Storage</strong><br />
                    AWS S3 Bucket (Private/Secured)
                  </div>
                </div>
              </div>

              {/* Deployment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-1.5 text-sm">
                    <Server className="w-4 h-4 text-emerald-400" /> Containerization & Kubernetes
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li>• <strong>Docker Multi-stage Builds:</strong> Shrink build sizing to under 120MB using Node Alpine distributions.</li>
                    <li>• <strong>AWS EKS (Elastic Kubernetes Service):</strong> Auto-scaling groups deployed across three availability zones (AZs) for maximum failure tolerance.</li>
                    <li>• <strong>Horizontal Pod Autoscaling (HPA):</strong> Scaled on CPU & Memory metrics (trigger target: 70% average resource utilization).</li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-1.5 text-sm">
                    <Workflow className="w-4 h-4 text-indigo-400" /> CI/CD Automation Pipeline
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li>• <strong>GitHub Actions:</strong> Automatic lint checks, unit tests run, security vulnerability scans (Snyk).</li>
                    <li>• <strong>AWS ECR:</strong> Building, tagging, and uploading production Docker containers securely.</li>
                    <li>• <strong>GitOps Deployment (ArgoCD):</strong> Progressive delivery and canary deployments for production API branches.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Scalability & Disaster Recovery */}
        {activeTab === "scalability" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Enterprise Scalability & DR Plan
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Proactive operations setup ensures that during system bottlenecks, driver tracking spikes, or hardware failures, customer dispatch runs uninterrupted.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <HardDrive className="w-4 h-4" /> Redis Cache Strategy
                  </div>
                  <p className="text-xs text-slate-300">
                    Store static pricing templates, city grids, and supplier base locations in high-speed Redis nodes. Cache-aside pattern cuts API endpoint database load by up to 75%.
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Network className="w-4 h-4" /> Read Replica Clustering
                  </div>
                  <p className="text-xs text-slate-300">
                    Route intensive reports, invoicing calculations, and corporate Excel exports to dedicated read-replicas. Preserve the master database primary write bandwidth for real-time dispatch state changes.
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" /> Multi-Region DR (Disaster Recovery)
                  </div>
                  <p className="text-xs text-slate-300">
                    Nightly block backups of PostgreSQL databases compiled to secure S3 storage. RPO (Recovery Point Objective) set under 1 hour, RTO (Recovery Time Objective) under 15 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Engineering Roadmap */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-indigo-400" />
                5-Phase Implementation Roadmap & Milestones
              </h3>

              <div className="space-y-4 font-sans text-sm">
                {/* Phase 1 */}
                <div className="relative pl-6 border-l-2 border-indigo-500/30 pb-4">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500"></div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">Phase 1: Foundation & Asset Onboarding</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">Weeks 1-4</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Set up core schemas, initialize Cognito/Firebase authentication, and implement suppliers, vehicles, and driver master registration dashboards. Build basic document expiration notification triggers.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="relative pl-6 border-l-2 border-indigo-500/30 pb-4">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500"></div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">Phase 2: Booking Engine & Pricing SLA Customization</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">Weeks 5-8</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Develop the primary corporate booking portal, including local, outstation, and airport transfer rules. Embed the core pricing engine backend calculation algorithm.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="relative pl-6 border-l-2 border-indigo-500/30 pb-4">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500"></div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">Phase 3: Dispatch & Smart Roster Scheduling</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">Weeks 9-12</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Introduce spatial driver distance computations, conflict detection algorithm, and automated supplier matching workflows. Embed websocket handlers for driver GPS status updates.
                  </p>
                </div>

                {/* Phase 4 */}
                <div className="relative pl-6 border-l-2 border-indigo-500/30 pb-4">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500"></div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">Phase 4: Corporate Billing & PDF Invoicing Engine</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">Weeks 13-16</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Integrate the automatic invoice generation engine based on completed trip coordinates. Implement professional company branding templates, export formats, and email triggers.
                  </p>
                </div>

                {/* Phase 5 */}
                <div className="relative pl-6 pb-2">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-base">Phase 5: Performance Optimization & Canary Deployment</span>
                    <span className="text-xs font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">Weeks 17-20</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Deploy multi-region DB replicas, activate redis server caching layer, establish Sentry logging alerts, run comprehensive load-testing simulations (10,000 parallel trips), and cut-over with canary releases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
