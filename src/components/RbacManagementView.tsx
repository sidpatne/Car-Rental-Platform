/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Shield, 
  Users, 
  UserCheck, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  Info,
  ShieldAlert,
  Search,
  UserPlus
} from "lucide-react";
import { UserRole, Employee, RolePermissionConfig, Permission } from "../types";

interface RbacManagementViewProps {
  employees: Employee[];
  rolePermissions: RolePermissionConfig[];
  onUpdateEmployee: (emp: Employee) => Promise<void>;
  onAddEmployee: (emp: Employee) => Promise<void>;
  onDeleteEmployee: (empId: string) => Promise<void>;
  onUpdateRolePermissions: (rolePerm: RolePermissionConfig) => Promise<void>;
  onResetToDefaults: () => Promise<void>;
  showToast?: (message: string, type?: "success" | "warning" | "info" | "error") => void;
}

const CONFIGURABLE_MODULES = [
  "Dashboard",
  "Bookings",
  "Fleet",
  "Pricing",
  "Invoices",
  "Reports"
];

export default function RbacManagementView({
  employees,
  rolePermissions,
  onUpdateEmployee,
  onAddEmployee,
  onDeleteEmployee,
  onUpdateRolePermissions,
  onResetToDefaults,
  showToast
}: RbacManagementViewProps) {
  // Tabs: "matrix" (Role permissions) or "employees" (Employee role assignment)
  const [activeSubTab, setActiveSubTab] = useState<"matrix" | "employees">("employees");
  const [employeeSearch, setEmployeeSearch] = useState("");
  
  // State for adding a new employee
  const [showAddEmpForm, setShowAddEmpForm] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpEmail, setNewEmpEmail] = useState("");
  const [newEmpMobile, setNewEmpMobile] = useState("");
  const [newEmpRole, setNewEmpRole] = useState<UserRole>(UserRole.BOOKING_EXECUTIVE);

  // State for editing an employee's details inline
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editEmpName, setEditEmpName] = useState("");
  const [editEmpEmail, setEditEmpEmail] = useState("");
  const [editEmpMobile, setEditEmpMobile] = useState("");
  const [editEmpRole, setEditEmpRole] = useState<UserRole>(UserRole.BOOKING_EXECUTIVE);
  const [editEmpStatus, setEditEmpStatus] = useState<"Active" | "Inactive">("Active");

  // Helper to determine the access level for a role and module
  const getAccessLevel = (rolePerms: Permission[], module: string): "NONE" | "READ" | "WRITE" | "FULL" => {
    const perm = rolePerms.find(p => p.module === "All" || p.module === module);
    if (!perm) return "NONE";
    if (perm.module === "All") return "FULL";
    
    const actions = perm.actions;
    if (actions.includes("DELETE") || actions.includes("APPROVE")) return "FULL";
    if (actions.includes("CREATE") || actions.includes("UPDATE")) return "WRITE";
    if (actions.includes("READ")) return "READ";
    return "NONE";
  };

  // Helper to get actions list for a chosen access level
  const getActionsForAccessLevel = (level: "NONE" | "READ" | "WRITE" | "FULL"): ("CREATE" | "READ" | "UPDATE" | "DELETE" | "ASSIGN" | "INVOICE" | "APPROVE")[] => {
    switch (level) {
      case "READ":
        return ["READ"];
      case "WRITE":
        return ["CREATE", "READ", "UPDATE"];
      case "FULL":
        return ["CREATE", "READ", "UPDATE", "DELETE", "ASSIGN", "INVOICE", "APPROVE"];
      default:
        return [];
    }
  };

  // Handler to update the matrix cell
  const handleMatrixCellChange = async (role: UserRole, module: string, newLevel: "NONE" | "READ" | "WRITE" | "FULL") => {
    // Locate the current permissions for this role
    const currentConfig = rolePermissions.find(rp => rp.role === role) || { role, permissions: [] };
    
    // Filter out the current module
    let updatedPermissions = currentConfig.permissions.filter(p => p.module !== "All" && p.module !== module);
    
    // Special handling for SUPER_ADMIN which has "All" permission
    if (role === UserRole.SUPER_ADMIN && newLevel !== "FULL") {
      // If Super Admin is being downgraded on a module, expand "All" to specific modules first
      if (currentConfig.permissions.some(p => p.module === "All")) {
        updatedPermissions = CONFIGURABLE_MODULES.filter(m => m !== module).map(m => ({
          module: m,
          actions: ["CREATE", "READ", "UPDATE", "DELETE", "ASSIGN", "INVOICE", "APPROVE"]
        }));
      }
    }

    if (newLevel !== "NONE") {
      updatedPermissions.push({
        module,
        actions: getActionsForAccessLevel(newLevel)
      });
    }

    const updatedConfig: RolePermissionConfig = {
      role,
      permissions: updatedPermissions
    };

    try {
      await onUpdateRolePermissions(updatedConfig);
      showToast?.(`Updated permissions for "${role}" on "${module}" module!`, "success");
    } catch (err) {
      showToast?.("Failed to update role permissions.", "error");
    }
  };

  // Handler to add employee
  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim() || !newEmpMobile.trim()) {
      showToast?.("Please fill out all required fields.", "error");
      return;
    }

    const newEmp: Employee = {
      id: `EMP-${Math.floor(Math.random() * 900) + 100}`,
      name: newEmpName.trim(),
      email: newEmpEmail.trim().toLowerCase(),
      mobile: newEmpMobile.trim(),
      role: newEmpRole,
      status: "Active"
    };

    try {
      await onAddEmployee(newEmp);
      showToast?.(`Employee "${newEmp.name}" enrolled successfully!`, "success");
      setNewEmpName("");
      setNewEmpEmail("");
      setNewEmpMobile("");
      setShowAddEmpForm(false);
    } catch (err) {
      showToast?.("Failed to enroll employee.", "error");
    }
  };

  // Start inline edit employee
  const startEditEmployee = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setEditEmpName(emp.name);
    setEditEmpEmail(emp.email);
    setEditEmpMobile(emp.mobile);
    setEditEmpRole(emp.role);
    setEditEmpStatus(emp.status);
  };

  // Save edited employee
  const handleSaveEmployeeEdit = async (id: string) => {
    if (!editEmpName.trim() || !editEmpEmail.trim() || !editEmpMobile.trim()) {
      showToast?.("Please fill out all required fields.", "error");
      return;
    }

    const updatedEmp: Employee = {
      id,
      name: editEmpName.trim(),
      email: editEmpEmail.trim().toLowerCase(),
      mobile: editEmpMobile.trim(),
      role: editEmpRole,
      status: editEmpStatus
    };

    try {
      await onUpdateEmployee(updatedEmp);
      showToast?.(`Profile for "${updatedEmp.name}" updated successfully!`, "success");
      setEditingEmpId(null);
    } catch (err) {
      showToast?.("Failed to update employee.", "error");
    }
  };

  // Delete employee
  const handleDeleteEmployeeClick = async (emp: Employee) => {
    if (confirm(`Are you sure you want to remove ${emp.name} from the staff registry?`)) {
      try {
        await onDeleteEmployee(emp.id);
        showToast?.(`Removed "${emp.name}" from employee registry.`, "warning");
      } catch (err) {
        showToast?.("Failed to remove employee.", "error");
      }
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const query = employeeSearch.toLowerCase().trim();
    if (!query) return true;
    return emp.name.toLowerCase().includes(query) ||
           emp.email.toLowerCase().includes(query) ||
           emp.id.toLowerCase().includes(query) ||
           emp.role.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 id="rbac-view-title" className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Security Permissions & RBAC Matrix
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure system module permissions for each role and assign operational roles to enterprise staff members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm("Reset all roles to standard compliance factory defaults? This will overwrite custom permission configurations.")) {
                onResetToDefaults()
                  .then(() => showToast?.("Role permission policies reset to defaults successfully!", "success"))
                  .catch(() => showToast?.("Failed to reset policies.", "error"));
              }
            }}
            className="bg-slate-50 border border-gray-200 text-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-100 transition-all"
            title="Reset role permissions to initial factory rules"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            Reset to Defaults
          </button>
          
          <button
            onClick={() => {
              setActiveSubTab("employees");
              setShowAddEmpForm(true);
            }}
            className="bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-indigo-700 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Enroll New Staff
          </button>
        </div>
      </div>

      {/* Main Tab Controller & Stats */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl border border-gray-200 flex shrink-0 self-start">
            <button
              id="tab-rbac-employees"
              onClick={() => setActiveSubTab("employees")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "employees"
                  ? "bg-white text-slate-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Staff Role Assignments ({employees.length})
            </button>
            <button
              id="tab-rbac-matrix"
              onClick={() => setActiveSubTab("matrix")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === "matrix"
                  ? "bg-white text-slate-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
              Feature Clearances Matrix
            </button>
          </div>
        </div>

        {/* Dynamic add form */}
        {showAddEmpForm && activeSubTab === "employees" && (
          <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Enroll New Enterprise Employee / Operator
              </h3>
              <button 
                onClick={() => setShowAddEmpForm(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Employee Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Saxena"
                  required
                  value={newEmpName}
                  onChange={e => setNewEmpName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@fleet.com"
                  required
                  value={newEmpEmail}
                  onChange={e => setNewEmpEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 90001 22233"
                  required
                  value={newEmpMobile}
                  onChange={e => setNewEmpMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Assigned System Role *</label>
                <select
                  value={newEmpRole}
                  onChange={e => setNewEmpRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2.5 text-xs font-bold text-gray-700 outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmpForm(false)}
                  className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer hover:bg-indigo-700"
                >
                  Add Employee to Registry
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View render */}
        {activeSubTab === "employees" ? (
          <div className="space-y-4">
            {/* Search filter for employees */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees by ID, Name, Email, or current Role..."
                  value={employeeSearch}
                  onChange={e => setEmployeeSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500"
                />
              </div>
              {employeeSearch && (
                <button
                  onClick={() => setEmployeeSearch("")}
                  className="text-xs text-indigo-600 font-bold hover:underline shrink-0"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Employee Registry Grid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                      <th className="py-3 px-4">Employee ID</th>
                      <th className="py-3 px-4">Staff Name</th>
                      <th className="py-3 px-4">Primary Contact</th>
                      <th className="py-3 px-4">Active Role Assignment</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map(emp => {
                      const isEditing = editingEmpId === emp.id;
                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/30 transition-all">
                          {/* ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                            {emp.id}
                          </td>
                          
                          {/* Name */}
                          <td className="py-3.5 px-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editEmpName}
                                onChange={e => setEditEmpName(e.target.value)}
                                className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold w-full max-w-[180px] focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                              />
                            ) : (
                              <span className="font-bold text-gray-950 font-sans text-sm">{emp.name}</span>
                            )}
                          </td>

                          {/* Email & Mobile */}
                          <td className="py-3.5 px-4">
                            {isEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="email"
                                  value={editEmpEmail}
                                  onChange={e => setEditEmpEmail(e.target.value)}
                                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs w-full max-w-[200px] block"
                                  placeholder="Email"
                                />
                                <input
                                  type="tel"
                                  value={editEmpMobile}
                                  onChange={e => setEditEmpMobile(e.target.value)}
                                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs w-full max-w-[200px] block"
                                  placeholder="Mobile"
                                />
                              </div>
                            ) : (
                              <div className="font-sans space-y-0.5">
                                <span className="block text-gray-700 font-medium">{emp.email}</span>
                                <span className="block text-gray-400 text-[10px] font-mono">{emp.mobile}</span>
                              </div>
                            )}
                          </td>

                          {/* Role selector dropdown */}
                          <td className="py-3.5 px-4">
                            {isEditing ? (
                              <select
                                value={editEmpRole}
                                onChange={e => setEditEmpRole(e.target.value as UserRole)}
                                className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-bold text-indigo-600 focus:outline-hidden"
                              >
                                {Object.values(UserRole).map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span className="font-semibold text-slate-800 font-sans">
                                  {emp.role}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            {isEditing ? (
                              <select
                                value={editEmpStatus}
                                onChange={e => setEditEmpStatus(e.target.value as any)}
                                className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-700 focus:outline-hidden"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            ) : (
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                emp.status === "Active" 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}>
                                {emp.status}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveEmployeeEdit(emp.id)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                                  title="Save Changes"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingEmpId(null)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => startEditEmployee(emp)}
                                  className="p-1.5 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg transition-all"
                                  title="Edit Employee Role & Profile"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployeeClick(emp)}
                                  className="p-1.5 bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 rounded-lg transition-all"
                                  title="Remove Employee"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Role Permissions Matrix View */
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-800 space-y-1">
                <p className="font-bold">How the Clearances Matrix Works:</p>
                <p>
                  As Super Admin, you can grant, restrict, or modify clearances for each of the major system features. Dropping or updating a permission cell instantly modifies active RBAC access policies, restricting operations for dispatcher sessions, booking desk accounts, and billing operators immediately.
                </p>
              </div>
            </div>

            {/* Matrix Card Grid layout / Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-mono text-[10px] tracking-wider uppercase">
                      <th className="py-4 px-4 font-bold text-gray-800">Operational Role</th>
                      {CONFIGURABLE_MODULES.map(module => (
                        <th key={module} className="py-4 px-3 text-center min-w-[130px]">
                          {module} Module
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.values(UserRole).map(role => {
                      // Get config for this role
                      const roleConfig = rolePermissions.find(rp => rp.role === role) || { role, permissions: [] };
                      
                      return (
                        <tr key={role} className="hover:bg-slate-50/20 transition-all">
                          {/* Role Name */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900 font-sans">{role}</div>
                            <span className="text-[10px] text-gray-400 font-medium block mt-0.5 uppercase tracking-wider font-mono">
                              {role === UserRole.SUPER_ADMIN ? "Unrestricted Bypass" : "RBAC Policy Managed"}
                            </span>
                          </td>

                          {/* Each module dropdown */}
                          {CONFIGURABLE_MODULES.map(module => {
                            const level = getAccessLevel(roleConfig.permissions, module);
                            
                            return (
                              <td key={module} className="py-3 px-3 text-center">
                                <select
                                  value={level}
                                  onChange={e => handleMatrixCellChange(role, module, e.target.value as any)}
                                  disabled={role === UserRole.SUPER_ADMIN && module === "Dashboard"} // Dashboard always read-only or bypass for super admin
                                  className={`text-[11px] font-bold py-1.5 px-2 rounded-lg border outline-hidden transition-all text-center mx-auto block cursor-pointer ${
                                    level === "FULL" 
                                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" 
                                      : level === "WRITE"
                                      ? "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100"
                                      : level === "READ"
                                      ? "bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100"
                                      : "bg-rose-50/50 border-rose-100 text-rose-500 hover:bg-rose-50"
                                  }`}
                                >
                                  <option value="NONE">❌ No Access</option>
                                  <option value="READ">👁️ Read Only</option>
                                  <option value="WRITE">✍️ Read/Write</option>
                                  <option value="FULL">⚡ Full Control</option>
                                </select>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit logs integration disclaimer */}
      <div className="bg-slate-900 text-slate-300 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-400" />
            Super-Admin Immutable Security Policies
          </h4>
          <p className="text-[11px] text-slate-400 max-w-2xl">
            Any modification of user roles or authorization matrix cell status will immediately append a cryptographic hash log into the immutable activity audit trails, recording user profile Siddhesh Patne as the initiating officer.
          </p>
        </div>
      </div>
    </div>
  );
}
