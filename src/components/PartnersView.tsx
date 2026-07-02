/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  FileText, 
  Percent, 
  ShieldAlert,
  Sparkles,
  Briefcase,
  Layers,
  ArrowRight,
  Download
} from "lucide-react";
import { Supplier, PassengerCompany } from "../types";

interface PartnersViewProps {
  suppliers: Supplier[];
  companies: PassengerCompany[];
  onAddSupplier: (supplier: Supplier) => Promise<void>;
  onAddCompany: (company: PassengerCompany) => Promise<void>;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

export default function PartnersView({
  suppliers,
  companies,
  onAddSupplier,
  onAddCompany,
  showToast
}: PartnersViewProps) {
  // Section tab selector: "suppliers" or "companies"
  const [activeSubTab, setActiveSubTab] = useState<"suppliers" | "companies">("suppliers");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"all" | "name" | "gst" | "email">("all");
  const [complianceFilter, setComplianceFilter] = useState<"all" | "has_pan" | "no_pan">("all");

  // Registration Form States for Supplier
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [supOwnerName, setSupOwnerName] = useState("");
  const [supCompanyName, setSupCompanyName] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supMobile, setSupMobile] = useState("");
  const [supGstin, setSupGstin] = useState("");
  const [supPan, setSupPan] = useState("");
  const [supCommission, setSupCommission] = useState(5.0);

  // Registration Form States for Company
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [comOfficeName, setComOfficeName] = useState("");
  const [comEmail, setComEmail] = useState("");
  const [comGstin, setComGstin] = useState("");
  const [comMobile, setComMobile] = useState("");
  const [comOwnerName, setComOwnerName] = useState("");
  const [comPan, setComPan] = useState("");

  // Filtered Lists
  const filteredSuppliers = suppliers.filter(s => {
    // Search filter
    const query = searchQuery.toLowerCase().trim();
    let matchesSearch = true;
    if (query) {
      if (searchField === "all") {
        matchesSearch = s.companyName.toLowerCase().includes(query) ||
                        s.name.toLowerCase().includes(query) ||
                        s.email.toLowerCase().includes(query) ||
                        s.gstin.toLowerCase().includes(query);
      } else if (searchField === "name") {
        matchesSearch = s.companyName.toLowerCase().includes(query) || s.name.toLowerCase().includes(query);
      } else if (searchField === "gst") {
        matchesSearch = s.gstin.toLowerCase().includes(query);
      } else if (searchField === "email") {
        matchesSearch = s.email.toLowerCase().includes(query);
      }
    }

    // Compliance filter
    let matchesCompliance = true;
    if (complianceFilter === "has_pan") {
      matchesCompliance = !!s.panCardNo && s.panCardNo !== "PENDING-PAN" && s.panCardNo !== "PENDING";
    } else if (complianceFilter === "no_pan") {
      matchesCompliance = !s.panCardNo || s.panCardNo === "PENDING-PAN" || s.panCardNo === "PENDING";
    }

    return matchesSearch && matchesCompliance;
  });

  const filteredCompanies = companies.filter(c => {
    const query = searchQuery.toLowerCase().trim();
    let matchesSearch = true;
    if (query) {
      if (searchField === "all") {
        matchesSearch = c.officeName.toLowerCase().includes(query) ||
                        c.ownerName.toLowerCase().includes(query) ||
                        c.email.toLowerCase().includes(query) ||
                        c.gstin.toLowerCase().includes(query);
      } else if (searchField === "name") {
        matchesSearch = c.officeName.toLowerCase().includes(query) || c.ownerName.toLowerCase().includes(query);
      } else if (searchField === "gst") {
        matchesSearch = c.gstin.toLowerCase().includes(query);
      } else if (searchField === "email") {
        matchesSearch = c.email.toLowerCase().includes(query);
      }
    }

    // Compliance filter
    let matchesCompliance = true;
    if (complianceFilter === "has_pan") {
      matchesCompliance = !!c.panCardNo && c.panCardNo !== "PENDING";
    } else if (complianceFilter === "no_pan") {
      matchesCompliance = !c.panCardNo || c.panCardNo === "PENDING";
    }

    return matchesSearch && matchesCompliance;
  });

  const resetSupplierForm = () => {
    setSupOwnerName("");
    setSupCompanyName("");
    setSupEmail("");
    setSupMobile("");
    setSupGstin("");
    setSupPan("");
    setSupCommission(5.0);
    setShowSupplierForm(false);
  };

  const resetCompanyForm = () => {
    setComOfficeName("");
    setComEmail("");
    setComGstin("");
    setComMobile("");
    setComOwnerName("");
    setComPan("");
    setShowCompanyForm(false);
  };

  // Submit Handlers
  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supOwnerName.trim() || !supCompanyName.trim() || !supEmail.trim() || !supMobile.trim() || !supGstin.trim()) {
      showToast?.("Please fill out all required fields marked with *", "error");
      return;
    }

    // Basic PAN verification format (10 chars alphanumeric)
    const normalizedPan = supPan.trim().toUpperCase();
    if (normalizedPan && normalizedPan.length !== 10) {
      showToast?.("Please enter a valid 10-character PAN Card Number.", "error");
      return;
    }

    const newSupplier: Supplier = {
      id: `SPL-${Math.floor(Math.random() * 900) + 100}`,
      name: supOwnerName.trim(),
      companyName: supCompanyName.trim(),
      mobile: supMobile.trim(),
      email: supEmail.trim(),
      gstin: supGstin.trim().toUpperCase(),
      rating: 5.0,
      vehiclesCount: 0,
      commissionRate: Number(supCommission) || 5.0,
      panCardNo: normalizedPan || "PENDING-PAN"
    };

    try {
      await onAddSupplier(newSupplier);
      showToast?.(`Supplier "${newSupplier.companyName}" registered successfully!`, "success");
      resetSupplierForm();
    } catch (err) {
      showToast?.("Failed to register supplier.", "error");
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comOfficeName.trim() || !comEmail.trim() || !comMobile.trim() || !comGstin.trim() || !comOwnerName.trim() || !comPan.trim()) {
      showToast?.("Please fill out all required fields marked with *", "error");
      return;
    }

    const normalizedPan = comPan.trim().toUpperCase();
    if (normalizedPan.length !== 10) {
      showToast?.("Please enter a valid 10-character PAN Card Number.", "error");
      return;
    }

    const newCompany: PassengerCompany = {
      id: `COM-${Math.floor(Math.random() * 900) + 100}`,
      officeName: comOfficeName.trim(),
      email: comEmail.trim(),
      gstin: comGstin.trim().toUpperCase(),
      mobile: comMobile.trim(),
      ownerName: comOwnerName.trim(),
      panCardNo: normalizedPan
    };

    try {
      await onAddCompany(newCompany);
      showToast?.(`Corporate Passenger Client "${newCompany.officeName}" registered successfully!`, "success");
      resetCompanyForm();
    } catch (err) {
      showToast?.("Failed to register corporate client.", "error");
    }
  };

  // Export to CSV Handler
  const handleExportToCsv = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    if (activeSubTab === "suppliers") {
      headers = ["ID", "Owner Name", "Company Name", "Email", "Mobile", "GSTIN", "PAN Card", "Rating", "Vehicles Count", "Commission Rate (%)"];
      rows = filteredSuppliers.map(s => [
        s.id,
        s.name,
        s.companyName,
        s.email,
        s.mobile,
        s.gstin,
        s.panCardNo || "PENDING",
        s.rating.toString(),
        s.vehiclesCount.toString(),
        s.commissionRate.toString()
      ]);
      filename = `logistics_suppliers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      headers = ["ID", "Office Name", "Authorized Owner/Director", "Email", "Mobile", "GSTIN", "PAN Card"];
      rows = filteredCompanies.map(c => [
        c.id,
        c.officeName,
        c.ownerName,
        c.email,
        c.mobile,
        c.gstin,
        c.panCardNo
      ]);
      filename = `passenger_companies_export_${new Date().toISOString().slice(0, 10)}.csv`;
    }

    // Format as CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.(`Successfully exported ${rows.length} records to CSV!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Upper Title Block */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 id="partners-view-title" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Partners & Corporate Clients
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage logistics suppliers, fleet providers, and corporate passenger client office registries.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="export-csv-btn"
            onClick={handleExportToCsv}
            className="bg-slate-50 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-100 hover:border-gray-300 transition-all"
            title="Download formatted Excel/CSV file"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            Export CSV
          </button>
          
          {activeSubTab === "suppliers" ? (
            <button
              id="add-supplier-btn"
              onClick={() => setShowSupplierForm(!showSupplierForm)}
              className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Supplier
            </button>
          ) : (
            <button
              id="add-company-btn"
              onClick={() => setShowCompanyForm(!showCompanyForm)}
              className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Company / Office
            </button>
          )}
        </div>
      </div>

      {/* Directory Tab Selector and Search / Filters */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Sub Tabs & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl border border-gray-200 flex shrink-0 self-start">
            <button
              id="tab-suppliers"
              onClick={() => { setActiveSubTab("suppliers"); setSearchQuery(""); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "suppliers"
                  ? "bg-white text-slate-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Logistics Suppliers ({suppliers.length})
            </button>
            <button
              id="tab-companies"
              onClick={() => { setActiveSubTab("companies"); setSearchQuery(""); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "companies"
                  ? "bg-white text-slate-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              Passenger Companies ({companies.length})
            </button>
          </div>
        </div>

        {/* Row 2: Search, Field Selector, and Compliance Filter */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center shadow-xs">
          {/* Dynamic Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="partners-search"
              type="text"
              placeholder={
                activeSubTab === "suppliers"
                  ? "Search supplier name, company, email, GSTIN..."
                  : "Search corporate office, authorized contact, GSTIN..."
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500"
            />
          </div>

          {/* Search Field Filter Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Field:</span>
              <select
                id="search-field-select"
                value={searchField}
                onChange={e => setSearchField(e.target.value as any)}
                className="bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Fields</option>
                <option value="name">Name / Owner</option>
                <option value="gst">GST Number</option>
                <option value="email">Email Address</option>
              </select>
            </div>

            {/* Compliance Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Compliance:</span>
              <select
                id="compliance-filter-select"
                value={complianceFilter}
                onChange={e => setComplianceFilter(e.target.value as any)}
                className="bg-slate-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Compliance Statuses</option>
                <option value="has_pan">With Verified PAN</option>
                <option value="no_pan">Missing/Pending PAN</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(searchQuery || searchField !== "all" || complianceFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchField("all");
                  setComplianceFilter("all");
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold px-2 py-2 hover:bg-indigo-50 rounded-lg transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Forms */}
      {showSupplierForm && (
        <div id="supplier-form-container" className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Register New Logistics Supplier / Vendor
            </h3>
            <button 
              onClick={resetSupplierForm}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSupplierSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Owner / Primary Contact Name *</label>
              <input
                id="sup-owner-name"
                type="text"
                placeholder="e.g. Rajesh Mahindra"
                required
                value={supOwnerName}
                onChange={e => setSupOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Company / Entity Registered Name *</label>
              <input
                id="sup-company-name"
                type="text"
                placeholder="e.g. Mahindra Logistics Ltd"
                required
                value={supCompanyName}
                onChange={e => setSupCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">GSTIN Number *</label>
              <input
                id="sup-gstin"
                type="text"
                placeholder="e.g. 27AAACM4829K1Z4"
                required
                value={supGstin}
                onChange={e => setSupGstin(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Email Address *</label>
              <input
                id="sup-email"
                type="email"
                placeholder="e.g. corporate@mahindra.com"
                required
                value={supEmail}
                onChange={e => setSupEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Mobile / Telephone Number *</label>
              <input
                id="sup-mobile"
                type="tel"
                placeholder="e.g. +91 98230 45671"
                required
                value={supMobile}
                onChange={e => setSupMobile(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">PAN Card Number</label>
              <input
                id="sup-pan"
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={supPan}
                onChange={e => setSupPan(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="block text-xs font-bold text-gray-700">Contractual Commission Percentage</span>
                  <span className="text-[10px] text-gray-400">Standard cut kept on bookings allocated to this vendor.</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="sup-commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={supCommission}
                  onChange={e => setSupCommission(Number(e.target.value))}
                  className="w-20 bg-white border border-gray-200 rounded-lg p-1.5 text-center text-xs font-bold"
                />
                <span className="text-xs font-bold text-gray-500">%</span>
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetSupplierForm}
                className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer hover:bg-indigo-700"
              >
                Save Supplier Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {showCompanyForm && (
        <div id="company-form-container" className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Register New Corporate Client / Passenger Office
            </h3>
            <button 
              onClick={resetCompanyForm}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCompanySubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Company / Office Registered Name *</label>
              <input
                id="com-office-name"
                type="text"
                placeholder="e.g. Tata Consultancy Services Ltd"
                required
                value={comOfficeName}
                onChange={e => setComOfficeName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Owner / Authorized Director Name *</label>
              <input
                id="com-owner-name"
                type="text"
                placeholder="e.g. N. Chandrasekaran"
                required
                value={comOwnerName}
                onChange={e => setComOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">GSTIN Number *</label>
              <input
                id="com-gstin"
                type="text"
                placeholder="e.g. 27AAACT1234A1Z1"
                required
                value={comGstin}
                onChange={e => setComGstin(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Office Email Address *</label>
              <input
                id="com-email"
                type="email"
                placeholder="e.g. admin.desk@tcs.com"
                required
                value={comEmail}
                onChange={e => setComEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Office Contact / Mobile *</label>
              <input
                id="com-mobile"
                type="tel"
                placeholder="e.g. +91 22 6778 9999"
                required
                value={comMobile}
                onChange={e => setComMobile(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">PAN Card Number *</label>
              <input
                id="com-pan"
                type="text"
                placeholder="e.g. AAACT1234A"
                required
                value={comPan}
                onChange={e => setComPan(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetCompanyForm}
                className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer hover:bg-indigo-700"
              >
                Save Office Registry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Directory Content Rendering */}
      {activeSubTab === "suppliers" ? (
        filteredSuppliers.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-900 text-sm">No Suppliers Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find any registered logistics partners matching your search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-block px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold font-mono tracking-wider mb-1">
                        {s.id}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm tracking-tight">{s.companyName}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Owner: <strong className="text-gray-700 font-medium">{s.name}</strong></p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                      ★ {s.rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Financial & Fleet Info */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-[10px]">
                    <div>
                      <span className="block text-gray-400 uppercase font-semibold scale-90 origin-left">Commission Rate</span>
                      <strong className="text-indigo-600 font-bold text-xs">{s.commissionRate}%</strong>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase font-semibold scale-90 origin-left">Assigned Fleet</span>
                      <strong className="text-slate-800 text-xs">{s.vehiclesCount} Cars</strong>
                    </div>
                  </div>

                  {/* Documents & Compliance */}
                  <div className="space-y-1.5 text-xs border-t border-gray-100 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="block text-gray-400 uppercase font-semibold">GSTIN No</span>
                        <span className="font-bold text-gray-700 font-mono truncate block" title={s.gstin}>{s.gstin}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 uppercase font-semibold">PAN Card</span>
                        <span className="font-bold text-gray-700 font-mono truncate block" title={s.panCardNo || "PENDING"}>{s.panCardNo || "PENDING"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Dial & Email Buttons */}
                <div className="border-t border-gray-100 pt-3 flex gap-2">
                  <a
                    href={`tel:${s.mobile}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 text-slate-700 hover:text-indigo-700 text-xs py-2 px-3 rounded-lg font-bold transition-all"
                    title={`Dial phone number: ${s.mobile}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dial Phone</span>
                  </a>
                  <a
                    href={`mailto:${s.email}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 text-slate-700 hover:text-indigo-700 text-xs py-2 px-3 rounded-lg font-bold transition-all"
                    title={`Send email: ${s.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-900 text-sm">No Companies Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find any registered passenger corporate offices matching your search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-block px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded text-[9px] font-bold font-mono tracking-wider mb-1">
                        {c.id}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm tracking-tight">{c.officeName}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Primary Director: <strong className="text-gray-700 font-medium">{c.ownerName}</strong></p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-teal-50/50 text-teal-700 rounded text-[10px] font-bold border border-teal-100 uppercase font-mono tracking-wider">
                      SLA Client
                    </span>
                  </div>

                  {/* Documents & Identification Info */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-[10px]">
                    <div>
                      <span className="block text-gray-400 uppercase font-semibold">GSTIN No</span>
                      <span className="font-bold text-teal-800 font-mono truncate block text-xs" title={c.gstin}>{c.gstin}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 uppercase font-semibold">PAN Card</span>
                      <span className="font-bold text-teal-800 font-mono truncate block text-xs" title={c.panCardNo}>{c.panCardNo}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Dial & Email Buttons */}
                <div className="border-t border-gray-100 pt-3 flex gap-2">
                  <a
                    href={`tel:${c.mobile}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-100 text-slate-700 hover:text-teal-700 text-xs py-2 px-3 rounded-lg font-bold transition-all"
                    title={`Dial office phone number: ${c.mobile}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>Dial Phone</span>
                  </a>
                  <a
                    href={`mailto:${c.email}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-100 text-slate-700 hover:text-teal-700 text-xs py-2 px-3 rounded-lg font-bold transition-all"
                    title={`Send office email: ${c.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* SLA Quick Guidelines Info Box */}
      <div className="bg-slate-900 text-slate-300 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Corporate Account Compliance Enforcements
          </h4>
          <p className="text-[11px] text-slate-400 max-w-2xl">
            Under transport department guidelines, all logistics suppliers and passenger companies must present a verified PAN and GST registration to compile Tax Invoices.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-xs text-indigo-400 font-bold hover:underline cursor-pointer">
          Review Compliance Schema <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
