import {
  Doctor,
  Employee,
  Expense,
  InventoryMovement,
  InventoryProduct,
  Invoice,
  LabCase,
  PayrollRecord,
} from "@/types/lab";

// Simulated network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Static seed data that mirrors the dashboard cards ---

const doctors: Doctor[] = [
  {
    id: "DR-54",
    doctorCode: "DR-54",
    fullName: "Mohamed Eldemellawy",
    email: "m.eldemellawy@example.com",
    phone: "+20 100 123 4567",
    workplace: "Private Clinic - Nasr City",
  },
  {
    id: "DR-52",
    doctorCode: "DR-52",
    fullName: "Ahmed Awni",
    email: "a.awni@example.com",
    phone: "+20 100 987 6543",
    workplace: "SmileCare Hospital",
  },
];

const cases: LabCase[] = [
  {
    id: "G8835",
    code: "G8835",
    patientName: "Hesham",
    doctorId: "DR-54",
    doctorName: "Mohamed Eldemellawy",
    doctorCode: "DR-54",
    material: "Monolithic Zirconia",
    units: 2,
    priceEgp: 2500,
    dueDate: "2026-01-10",
    stage: "Final Delivered",
    status: "Closed",
  },
  {
    id: "E6514",
    code: "E6514",
    patientName: "Sggs",
    doctorId: "DR-52",
    doctorName: "Ahmed Awni",
    doctorCode: "DR-52",
    material: "Monolithic Zirconia",
    units: 1,
    priceEgp: 1250,
    dueDate: "2026-01-07",
    stage: "Final Delivered",
    status: "Closed",
  },
];

const expenses: Expense[] = [
  {
    id: "exp-1",
    category: "Materials",
    amountEgp: 12000,
    vendor: "Zirconia World",
    method: "Bank Transfer",
    notes: "Blocks A2/A3",
    date: "2026-01-02",
  },
  {
    id: "exp-2",
    category: "Labour",
    amountEgp: 8000,
    vendor: "Technicians Payroll",
    method: "Cash",
    date: "2026-01-05",
  },
];

const invoices: Invoice[] = [
  {
    id: "inv-1",
    caseCode: "G8835",
    totalEgp: 2500,
    issuedAt: "2026-01-09",
  },
  {
    id: "inv-2",
    caseCode: "E6514",
    totalEgp: 1250,
    issuedAt: "2026-01-06",
  },
];

const inventoryProducts: InventoryProduct[] = [
  {
    id: "prod-1",
    name: "Zirconia Blocks A2",
    category: "Zirconia",
    unitPriceEgp: 650,
    quantityInStock: 38,
    location: "Cabinet A / Shelf 2",
  },
  {
    id: "prod-2",
    name: "Temporary PMMA",
    category: "PMMA",
    unitPriceEgp: 220,
    quantityInStock: 18,
    location: "Cabinet B / Shelf 1",
  },
];

const inventoryMovements: InventoryMovement[] = [
  {
    id: "mov-1",
    productId: "prod-1",
    productName: "Zirconia Blocks A2",
    quantity: 10,
    moveType: "Purchase",
    date: "2026-01-01",
  },
  {
    id: "mov-2",
    productId: "prod-1",
    productName: "Zirconia Blocks A2",
    quantity: -4,
    moveType: "Consumption",
    date: "2026-01-04",
  },
];

const employees: Employee[] = [
  {
    id: "emp-1",
    fullName: "Omar Hassan",
    role: "Senior Technician",
    salaryType: "Monthly",
    status: "Active",
  },
  {
    id: "emp-2",
    fullName: "Sara Ali",
    role: "Ceramist",
    salaryType: "Per Case",
    status: "Active",
  },
];

const payrollRecords: PayrollRecord[] = [
  {
    id: "pay-1",
    employeeId: "emp-1",
    periodLabel: "Jan 2026",
    amountEgp: 18000,
    method: "Bank Transfer",
    paidAt: "2026-01-30",
  },
  {
    id: "pay-2",
    employeeId: "emp-2",
    periodLabel: "Jan 2026",
    amountEgp: 9200,
    method: "Cash",
    paidAt: "2026-01-29",
  },
];

export const mockLabApi = {
  async listCases() {
    await delay(400);
    return cases;
  },
  async getCaseById(id: string) {
    await delay(300);
    return cases.find((c) => c.id === id) ?? null;
  },
  async listDoctors() {
    await delay(300);
    return doctors;
  },
  async getDoctorById(id: string) {
    await delay(300);
    return doctors.find((d) => d.id === id) ?? null;
  },
  async listDoctorCases(doctorId: string) {
    await delay(350);
    return cases.filter((c) => c.doctorId === doctorId);
  },
  async listExpenses() {
    await delay(350);
    return expenses;
  },
  async listInvoices() {
    await delay(350);
    return invoices;
  },
  async listInventoryProducts() {
    await delay(350);
    return inventoryProducts;
  },
  async listInventoryMovements() {
    await delay(350);
    return inventoryMovements;
  },
  async listEmployees() {
    await delay(350);
    return employees;
  },
  async listPayrollRecords() {
    await delay(350);
    return payrollRecords;
  },
};
