/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Printer, 
  Send, 
  Download, 
  FileCheck2, 
  Clock, 
  Car, 
  UserCheck, 
  Briefcase, 
  MapPin, 
  FileText,
  Mail,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  CheckSquare
} from "lucide-react";
import { Invoice, Booking, Driver, Vehicle } from "../types";

interface InvoiceViewProps {
  invoices: Invoice[];
  bookings: Booking[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onBatchMarkPaid?: (invoiceNumbers: string[]) => Promise<void> | void;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function InvoiceView({ invoices, bookings, drivers, vehicles, onBatchMarkPaid, showToast }: InvoiceViewProps) {
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<string>(
    invoices.length > 0 ? invoices[0].invoiceNumber : ""
  );
  const [emailStatus, setEmailStatus] = useState<string>("");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const activeInvoice = invoices.find(i => i.invoiceNumber === selectedInvoiceNumber);
  const associatedBooking = activeInvoice ? bookings.find(b => b.id === activeInvoice.bookingId) : null;
  const associatedDriver = associatedBooking ? drivers.find(d => d.id === associatedBooking.assignedDriverId) : null;
  const associatedVehicle = associatedBooking ? vehicles.find(v => v.id === associatedBooking.assignedVehicleId) : null;

  const eligibleInvoices = invoices.filter(inv => inv.paymentStatus !== "Paid");
  const isAllSelected = eligibleInvoices.length > 0 && eligibleInvoices.every(inv => selectedInvoices.includes(inv.invoiceNumber));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(eligibleInvoices.map(inv => inv.invoiceNumber));
    }
  };

  const handleToggleSelect = (invoiceNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoices(prev => 
      prev.includes(invoiceNumber) 
        ? prev.filter(num => num !== invoiceNumber) 
        : [...prev, invoiceNumber]
    );
  };

  const handleBatchMarkPaid = async () => {
    if (selectedInvoices.length === 0) return;
    
    if (onBatchMarkPaid) {
      try {
        await onBatchMarkPaid(selectedInvoices);
        if (showToast) {
          showToast(`Successfully marked ${selectedInvoices.length} invoice(s) as PAID.`, "success");
        }
        setSelectedInvoices([]);
      } catch (error) {
        if (showToast) {
          showToast("Failed to process batch invoice payment.", "error");
        }
      }
    } else {
      if (showToast) {
        showToast("Batch action handler not configured on server.", "error");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = (email: string) => {
    setEmailStatus("Preparing billing PDF dispatch...");
    setTimeout(() => {
      setEmailStatus(`Success: Billing receipt emailed to ${email}!`);
      setTimeout(() => setEmailStatus(""), 3000);
    }, 1200);
  };

  const handleDownload = () => {
    if (showToast) {
      showToast("System compiling PDF invoice assets... Download initiated.", "info");
    } else {
      alert("System compiling PDF invoice assets... Download initiated.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar Invoice Registry */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 space-y-4 h-fit">
        <div className="border-b border-gray-50 pb-2 space-y-1">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
            <Receipt className="w-5 h-5 text-indigo-600" /> Invoices Repository
          </h3>
          <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
            <span>{invoices.length} invoice{invoices.length !== 1 && 's'} total</span>
            {eligibleInvoices.length > 0 && (
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 font-semibold transition-colors select-none">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded-sm focus:ring-indigo-500 cursor-pointer"
                />
                Select All Unpaid ({eligibleInvoices.length})
              </label>
            )}
          </div>
        </div>

        {/* Batch action banner */}
        <AnimatePresence>
          {selectedInvoices.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg space-y-2 overflow-hidden"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  {selectedInvoices.length} Selected
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedInvoices([])}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
              <button
                type="button"
                onClick={handleBatchMarkPaid}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" /> Mark Checked as Paid
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {invoices.map(inv => {
            const bkg = bookings.find(b => b.id === inv.bookingId);
            const isEligible = inv.paymentStatus !== "Paid";
            const isSelected = selectedInvoices.includes(inv.invoiceNumber);

            return (
              <div
                key={inv.invoiceNumber}
                onClick={() => setSelectedInvoiceNumber(inv.invoiceNumber)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                  selectedInvoiceNumber === inv.invoiceNumber
                    ? "border-indigo-500 bg-indigo-50/40"
                    : "border-gray-100 hover:bg-gray-50/50"
                }`}
              >
                {/* Custom Checkbox/Check Badge */}
                {isEligible ? (
                  <div 
                    onClick={(e) => handleToggleSelect(inv.invoiceNumber, e)}
                    className="pt-0.5 shrink-0"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded-xs focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="pt-0.5 shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                  </div>
                )}

                {/* Card Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center font-mono font-bold text-gray-900">
                    <span>{inv.invoiceNumber}</span>
                    <span className={inv.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}>
                      ₹{inv.grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 text-[10px]">
                    <span className="truncate pr-1.5">{bkg?.customerName || "Corporate Client"}</span>
                    <span className={`px-1.5 py-0.2 rounded uppercase font-bold text-[8px] shrink-0 ${
                      inv.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {invoices.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-400">
              No generated invoices compiled yet.
            </div>
          )}
        </div>
      </div>

      {/* Main Billing Viewer Document Frame */}
      <div className="lg:col-span-2 space-y-4">
        {activeInvoice && associatedBooking ? (
          <>
            {/* Control Strip */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-wrap gap-2.5 items-center justify-between no-print">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Document Control Desk</span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEmail(associatedBooking.email || "billing@corporate.com")}
                  className="px-3.5 py-2 border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-50/30 transition-all"
                >
                  <Send className="w-4 h-4" /> Email Client
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3.5 py-2 border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-50/30 transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
              </div>
            </div>

            {/* Email Toast Confirmation */}
            {emailStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5 animate-pulse no-print">
                <CheckCircle2 className="w-4 h-4" /> {emailStatus}
              </div>
            )}

            {/* Print Friendly Professional Tax Invoice Sheet */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-xs text-gray-800 space-y-6 invoice-print-container">
              {/* Invoice Top Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-lg">
                    <FileText className="w-5.5 h-5.5" /> Fleet & Logistics Corp Ltd.
                  </div>
                  <span className="text-gray-400 text-xs block mt-0.5">Corporate Travel Management Division</span>
                  <p className="text-[10px] text-gray-500 max-w-xs mt-2 leading-relaxed">
                    Corporate Hub, 10th Floor, Maker Chambers VI, Nariman Point, Mumbai - 400021. GSTIN: 27AAACF8412B1ZC
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900">Tax Invoice</h2>
                  <div className="font-mono text-xs text-indigo-600 font-bold">{activeInvoice.invoiceNumber}</div>
                  <div className="text-[11px] text-gray-500">Date: {activeInvoice.invoiceDate}</div>
                  <div className="text-[11px] text-gray-500">Due: {activeInvoice.dueDate}</div>
                </div>
              </div>

              {/* Billed To / Passenger Parameters */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Billed To (Corporate SLA)</span>
                  <strong className="text-gray-900 font-bold block">{associatedBooking.company}</strong>
                  <span className="text-gray-500 block mt-1">{associatedBooking.address}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Trip & Passenger Dossier</span>
                  <table className="text-left text-[11px] text-gray-600 w-full">
                    <tbody>
                      <tr>
                        <td className="py-0.5 font-medium">Passenger:</td>
                        <td className="py-0.5 font-bold text-gray-900">{associatedBooking.customerName}</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-medium">Trip Category:</td>
                        <td className="py-0.5 font-semibold">{associatedBooking.tripType}</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-medium">Vehicle Class:</td>
                        <td className="py-0.5 font-mono text-[10px] uppercase font-bold text-gray-800">{associatedVehicle?.id} • {associatedVehicle?.model}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Itemized Service Ledger */}
              <div className="border-t border-b border-gray-100 py-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase font-mono text-[10px] tracking-wider">
                      <th className="py-2">Operational Item Description</th>
                      <th className="py-2 text-center">Unit Metric</th>
                      <th className="py-2 text-right">Base SLA Rate (₹)</th>
                      <th className="py-2 text-right">Computed Charge (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/60 font-sans text-gray-700">
                    {/* Line 1: Base SLA */}
                    <tr>
                      <td className="py-3">
                        <strong>Logistics SLA Base Package</strong>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Includes {associatedBooking.tripType === "Airport Transfer" ? "40" : "80"} KMs & {associatedBooking.tripType === "Airport Transfer" ? "4" : "8"} Hours
                        </span>
                      </td>
                      <td className="py-3 text-center">1 Unit</td>
                      <td className="py-3 text-right">₹{activeInvoice.baseCharge.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono font-semibold">₹{activeInvoice.baseCharge.toLocaleString()}</td>
                    </tr>

                    {/* Line 2: Extra KMs */}
                    {activeInvoice.extraKmCharges > 0 && (
                      <tr>
                        <td className="py-3">
                          <strong>Extra Kilometer Allocation</strong>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            Additional KMs computed from actual trip coordinates
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono text-[11px]">
                          {associatedBooking.kmsUsed ? associatedBooking.kmsUsed - 80 : 0} KMs
                        </td>
                        <td className="py-3 text-right">₹14/km</td>
                        <td className="py-3 text-right font-mono font-semibold">₹{activeInvoice.extraKmCharges.toLocaleString()}</td>
                      </tr>
                    )}

                    {/* Line 3: Extra Hours */}
                    {activeInvoice.extraHourCharges > 0 && (
                      <tr>
                        <td className="py-3">
                          <strong>Extra Operational Hour Overtime</strong>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            Transit wait-time and overlap buffers
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono text-[11px]">
                          {associatedBooking.hoursUsed ? Math.round((associatedBooking.hoursUsed - 8) * 10) / 10 : 0} Hrs
                        </td>
                        <td className="py-3 text-right">₹150/hr</td>
                        <td className="py-3 text-right font-mono font-semibold">₹{activeInvoice.extraHourCharges.toLocaleString()}</td>
                      </tr>
                    )}

                    {/* Line 4: Driver Allowance */}
                    {activeInvoice.driverAllowance > 0 && (
                      <tr>
                        <td className="py-3">
                          <strong>Chauffeur Day Duty Allowance</strong>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Standard flat allowance per daily trip roster</span>
                        </td>
                        <td className="py-3 text-center">1 Day</td>
                        <td className="py-3 text-right">₹300</td>
                        <td className="py-3 text-right font-mono font-semibold">₹{activeInvoice.driverAllowance}</td>
                      </tr>
                    )}

                    {/* Line 5: Toll and Parking */}
                    {(activeInvoice.tollCharges > 0 || activeInvoice.parkingCharges > 0) && (
                      <tr>
                        <td className="py-3">
                          <strong>Toll Fastag & Airport Parking Tolls</strong>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Actual receipts logged during the transit route</span>
                        </td>
                        <td className="py-3 text-center">Receipts</td>
                        <td className="py-3 text-right">Actuals</td>
                        <td className="py-3 text-right font-mono font-semibold">
                          ₹{(activeInvoice.tollCharges + activeInvoice.parkingCharges).toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Taxation Calculations Block */}
              <div className="flex justify-end text-xs">
                <div className="w-80 space-y-2 font-sans">
                  <div className="flex justify-between text-gray-500">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-semibold text-gray-800">₹{activeInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  {activeInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>SLA Discount (-5%):</span>
                      <span className="font-mono">- ₹{activeInvoice.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Central GST (CGST 9%):</span>
                    <span className="font-mono font-semibold text-gray-800">₹{activeInvoice.cgstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 pb-2 border-b border-gray-100">
                    <span>State GST (SGST 9%):</span>
                    <span className="font-mono font-semibold text-gray-800">₹{activeInvoice.sgstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                    <span>Grand Total:</span>
                    <span className="font-mono text-indigo-600">₹{activeInvoice.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Sign-Off */}
              <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] text-gray-400">
                <div className="max-w-xs leading-relaxed">
                  <strong>Corporate Billing Rules:</strong> All bills compiled under Corporate SLA frameworks. Disputes must be logged within 7 days of dispatch ticket receipt.
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-gray-300 w-32 h-6"></div>
                  <span className="block mt-1 font-semibold uppercase tracking-wider text-gray-500">Authorized Billing Lead</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-100 text-gray-400 text-sm">
            Please choose an invoice template from the sidebar to visualize.
          </div>
        )}
      </div>
    </div>
  );
}
