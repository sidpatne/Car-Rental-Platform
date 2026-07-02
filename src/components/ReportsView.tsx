/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  TrendingUp, 
  Gauge, 
  ShieldCheck, 
  Briefcase, 
  MapPin, 
  CalendarDays,
  FileText,
  AlertCircle,
  TrendingDown
} from "lucide-react";
import { Booking, Invoice, Driver, Vehicle } from "../types";

interface ReportsViewProps {
  bookings: Booking[];
  invoices: Invoice[];
  drivers: Driver[];
  vehicles: Vehicle[];
}

export default function ReportsView({ bookings, invoices, drivers, vehicles }: ReportsViewProps) {
  const [activeReportCategory, setActiveReportCategory] = useState<"revenue" | "utilization" | "gst" | "compliance">("revenue");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [exportFeedback, setExportFeedback] = useState<string>("");

  const triggerExport = (format: "csv" | "xlsx" | "pdf") => {
    setExportFeedback(`Assembling report datasets for active Category [${activeReportCategory.toUpperCase()}]...`);
    setTimeout(() => {
      setExportFeedback(`Success: Exported FLEET_REPORTS_${activeReportCategory.toUpperCase()}_Q2_2026.${format}`);
      setTimeout(() => setExportFeedback(""), 3000);
    }, 1500);
  };

  // Static pre-packaged GST logs matching mock invoices
  const gstLedger = [
    { id: "TX-1046", date: "2026-06-30", invoice: "INV-2026-1046", base: 2200, cgst: 225, sgst: 225, totalTax: 450, customer: "Google India" },
    { id: "TX-1048", date: "2026-06-30", invoice: "INV-2026-1048", base: 2400, cgst: 265.5, sgst: 265.5, totalTax: 531, customer: "Reliance Industries" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Enterprise Reports & Regulatory Filings</h2>
          <p className="text-xs text-gray-500">Compile logistics logs, municipal taxes, GST filings, and vehicle metrics</p>
        </div>
        
        {/* Export triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerExport("csv")}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 hover:border-indigo-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
          >
            <Download className="w-4 h-4 text-gray-400" /> Export CSV
          </button>
          <button
            onClick={() => triggerExport("xlsx")}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 hover:border-indigo-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export Excel
          </button>
        </div>
      </div>

      {/* Export feedback notifications */}
      {exportFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-pulse">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{exportFeedback}</span>
        </div>
      )}

      {/* Sidebar navigation and reports viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation pane */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Report Category</span>
          
          <button
            onClick={() => setActiveReportCategory("revenue")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
              activeReportCategory === "revenue"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>Revenue Ledger</span>
            <TrendingUp className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => setActiveReportCategory("utilization")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
              activeReportCategory === "utilization"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>Fleet & Driver Utilization</span>
            <Gauge className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => setActiveReportCategory("gst")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
              activeReportCategory === "gst"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>GST Tax Ledger (9%+9%)</span>
            <FileText className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => setActiveReportCategory("compliance")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
              activeReportCategory === "compliance"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>Safety Compliances</span>
            <AlertCircle className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Right Tabular Data viewport */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-xs p-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 border-b border-gray-50 pb-4 mb-4">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
              {activeReportCategory === "revenue" ? "Financial Revenue Registry" :
               activeReportCategory === "utilization" ? "Asset Performance Log" :
               activeReportCategory === "gst" ? "GST Commercial Tax Audit Ledger" :
               "Compliance Expiry Vault"}
            </h3>
            
            <div className="flex gap-2">
              <select
                value={filterPeriod}
                onChange={e => setFilterPeriod(e.target.value as any)}
                className="text-xs border border-gray-200 rounded-lg py-1.5 px-2.5 bg-white font-medium text-gray-700 outline-hidden"
              >
                <option value="daily">Daily View</option>
                <option value="weekly">Weekly Summary</option>
                <option value="monthly">Monthly Audit</option>
                <option value="yearly">Yearly SLA</option>
              </select>
            </div>
          </div>

          {/* TABLE VIEWER */}
          {activeReportCategory === "revenue" && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                    <th className="py-2 px-3">Invoice #</th>
                    <th className="py-2 px-3">Booking ID</th>
                    <th className="py-2 px-3">Billed Client</th>
                    <th className="py-2 px-3 text-right">Base Charge (₹)</th>
                    <th className="py-2 px-3 text-right">Taxes (₹)</th>
                    <th className="py-2 px-3 text-right">Grand Total (₹)</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map(inv => {
                    const bkg = bookings.find(b => b.id === inv.bookingId);
                    return (
                      <tr key={inv.invoiceNumber} className="hover:bg-gray-50/50">
                        <td className="py-3 px-3 font-mono font-bold text-gray-800">{inv.invoiceNumber}</td>
                        <td className="py-3 px-3 font-mono text-indigo-600 font-medium">{inv.bookingId}</td>
                        <td className="py-3 px-3 font-semibold text-gray-700">{bkg?.company || "Direct Corporate Client"}</td>
                        <td className="py-3 px-3 text-right font-mono">₹{inv.baseCharge.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-mono">₹{(inv.cgstAmount + inv.sgstAmount).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">₹{inv.grandTotal.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            inv.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {inv.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeReportCategory === "utilization" && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                    <th className="py-2 px-3">Driver Name</th>
                    <th className="py-2 px-3">Base Location</th>
                    <th className="py-2 px-3 text-center">Rating</th>
                    <th className="py-2 px-3 text-right">Trips Logged</th>
                    <th className="py-2 px-3 text-right">Shift Hours</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {drivers.map(drv => (
                    <tr key={drv.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-bold text-gray-800">{drv.name}</td>
                      <td className="py-3 px-3 text-gray-500">{drv.baseLocation}</td>
                      <td className="py-3 px-3 text-center text-indigo-600 font-bold">★ {drv.rating.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold">{drv.tripsCount}</td>
                      <td className="py-3 px-3 text-right font-mono text-gray-500">{drv.shiftStart} - {drv.shiftEnd}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          drv.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                          drv.status === "On Duty" ? "bg-indigo-50 text-indigo-700" :
                          "bg-rose-50 text-rose-700"
                        }`}>
                          {drv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReportCategory === "gst" && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                    <th className="py-2 px-3">Filing Date</th>
                    <th className="py-2 px-3">Tax Invoice Ref</th>
                    <th className="py-2 px-3">Corporate Party</th>
                    <th className="py-2 px-3 text-right">CGST 9% (₹)</th>
                    <th className="py-2 px-3 text-right">SGST 9% (₹)</th>
                    <th className="py-2 px-3 text-right">Total GST Tax (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-sans">
                  {gstLedger.map(gst => (
                    <tr key={gst.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-semibold text-gray-700">{gst.date}</td>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-600">{gst.invoice}</td>
                      <td className="py-3 px-3 font-bold text-gray-800">{gst.customer}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{gst.cgst.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{gst.sgst.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600">₹{gst.totalTax.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReportCategory === "compliance" && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                    <th className="py-2 px-3">Asset Plate Number</th>
                    <th className="py-2 px-3">Vehicle Model</th>
                    <th className="py-2 px-3">Fitness Cert Expiry</th>
                    <th className="py-2 px-3">PUC Expiry</th>
                    <th className="py-2 px-3">Insurance Expiry</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-mono">
                  {vehicles.map(v => {
                    const isFExpired = v.documents.fitnessExpiry < "2026-06-30";
                    const isPExpired = v.documents.pucExpiry < "2026-06-30";
                    const isIExpired = v.documents.insuranceExpiry < "2026-06-30";
                    const hasAnom = isFExpired || isPExpired || isIExpired;

                    return (
                      <tr key={v.id} className="hover:bg-gray-50/50 text-xs">
                        <td className="py-3 px-3 font-bold text-gray-900">{v.id}</td>
                        <td className="py-3 px-3 text-gray-500 font-sans">{v.model}</td>
                        <td className={`py-3 px-3 ${isFExpired ? "text-rose-600 font-bold" : "text-gray-600"}`}>
                          {v.documents.fitnessExpiry}
                        </td>
                        <td className={`py-3 px-3 ${isPExpired ? "text-rose-600 font-bold" : "text-gray-600"}`}>
                          {v.documents.pucExpiry}
                        </td>
                        <td className={`py-3 px-3 ${isIExpired ? "text-rose-600 font-bold" : "text-gray-600"}`}>
                          {v.documents.insuranceExpiry}
                        </td>
                        <td className="py-3 px-3 text-center font-sans">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            hasAnom ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {hasAnom ? "Violation" : "Compliant"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
