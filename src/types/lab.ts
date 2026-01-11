export type CaseStage =
  | "Received"
  | "Design"
  | "Production"
  | "Finishing"
  | "Quality Check"
  | "Final Delivered";

export interface LabCase {
  id: string; // same as code for now
  code: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorCode: string;
  material: string;
  units: number;
  priceEgp: number;
  dueDate: string; // ISO string
  stage: CaseStage;
  status: "Open" | "Closed" | "On Hold";
}

export interface Doctor {
  id: string; // doctor_code
  fullName: string;
  doctorCode: string;
  email: string;
  phone: string;
  workplace: string;
}

export interface Expense {
  id: string;
  category: string;
  amountEgp: number;
  vendor: string;
  method: string;
  notes?: string;
  date: string; // ISO
}

export interface Invoice {
  id: string;
  caseCode: string;
  totalEgp: number;
  issuedAt: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  unitPriceEgp: number;
  quantityInStock: number;
  location: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  moveType: "Purchase" | "Consumption" | "Adjustment";
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
}

export interface Employee {
  id: string;
  fullName: string;
  role: string;
  salaryType: "Monthly" | "Per Case" | "Hourly";
  status: "Active" | "Inactive";
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  periodLabel: string;
  amountEgp: number;
  method: string;
  paidAt: string;
}
