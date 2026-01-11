export type CaseStage =
  | "submitted"
  | "design"
  | "production"
  | "finishing"
  | "quality_check"
  | "final_delivered";

export interface LabCase {
  id: string; // public.cases.id
  code: string; // legacy alias for caseCode
  caseCode: string; // public.cases.case_code
  patientName: string; // public.cases.patient_name
  patientId: string; // public.cases.patient_id
  doctorId: string; // public.cases.doctor_id
  doctorName: string; // joined from public.doctors.full_name
  doctorCode: string; // joined from public.doctors.doctor_code
  caseType: "try-in" | "final"; // public.cases.case_type
  material: string; // public.cases.material
  shade?: string; // public.cases.shade
  units: number; // public.cases.units
  priceEgp: number; // public.cases.price_egp
  dueDate: string; // public.cases.due_date (ISO date)
  stage: CaseStage; // public.cases.stage
  notes?: string; // public.cases.notes
  statusHistory?: unknown; // public.cases.status_history (jsonb)
  createdAt: string; // public.cases.created_at
  updatedAt: string; // public.cases.updated_at
}

export interface Doctor {
  id: string; // public.doctors.id
  fullName: string; // public.doctors.full_name
  doctorCode: string; // public.doctors.doctor_code
  email: string | null; // public.doctors.email
  phone: string; // derived from primary_phone
  workplace: string; // derived from workplace_type + workplace_name
}

export interface Expense {
  id: string; // public.fin_expenses.id
  category: string; // denormalized from fin_expense_categories.name
  amountEgp: number; // public.fin_expenses.amount_egp
  vendor: string | null; // public.fin_expenses.vendor
  method: string; // public.fin_expenses.method
  notes?: string; // public.fin_expenses.notes
  date: string; // ISO, from public.fin_expenses.expense_date
}

export interface Invoice {
  id: string; // public.invoices.id
  caseCode: string; // denormalized from related case.case_code
  totalEgp: number; // public.invoices.total_egp
  issuedAt: string; // public.invoices.issued_at
}

export interface InventoryProduct {
  id: string; // derived inventory id (variant + location)
  name: string; // from inv_products.name / inv_variants.variant_name
  category: string; // from inv_products.category
  unitPriceEgp: number; // derived average unit cost
  quantityInStock: number; // aggregated from inv_stock_moves
  location: string; // from inv_locations.name
}

export interface InventoryMovement {
  id: string; // public.inv_stock_moves.id
  productId: string; // public.inv_stock_moves.variant_id
  productName: string; // joined variant name
  quantity: number; // public.inv_stock_moves.qty
  moveType: "purchase_in" | "consume_out" | "adjust_in" | "adjust_out"; // public.inv_stock_moves.move_type
  date: string; // ISO, from public.inv_stock_moves.moved_at
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
}

export interface Employee {
  id: string; // public.hr_employees.id
  fullName: string; // public.hr_employees.full_name
  role: string | null; // public.hr_employees.role
  salaryType: "monthly" | "daily" | "per_case" | "other"; // public.hr_employees.salary_type
  status: "Active" | "Inactive"; // derived from hr_employees.active
}

export interface PayrollRecord {
  id: string; // public.hr_payroll_payments.id
  employeeId: string; // public.hr_payroll_payments.employee_id
  periodLabel: string; // derived from period_start + period_end
  amountEgp: number; // public.hr_payroll_payments.amount_egp
  method: string; // public.hr_payroll_payments.method
  paidAt: string; // public.hr_payroll_payments.paid_at
}
