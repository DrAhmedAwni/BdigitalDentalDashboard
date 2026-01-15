import { supabase } from "@/lib/supabase";
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

// Helper to map database snake_case to camelCase
function mapCaseFromDb(dbCase: any, doctor?: any): LabCase {
    return {
        id: dbCase.id,
        code: dbCase.case_code,
        caseCode: dbCase.case_code,
        patientName: dbCase.patient_name,
        patientId: dbCase.patient_id,
        doctorId: dbCase.doctor_id,
        doctorName: doctor?.full_name || dbCase.doctors?.full_name || "",
        doctorCode: doctor?.doctor_code || dbCase.doctors?.doctor_code || "",
        caseType: dbCase.case_type,
        material: dbCase.material,
        shade: dbCase.shade,
        units: dbCase.units,
        priceEgp: dbCase.price_egp,
        dueDate: dbCase.due_date,
        stage: dbCase.stage,
        notes: dbCase.notes,
        statusHistory: dbCase.status_history,
        createdAt: dbCase.created_at,
        updatedAt: dbCase.updated_at,
    };
}

function mapDoctorFromDb(dbDoctor: any): Doctor {
    const workplace = dbDoctor.workplace_name
        ? `${dbDoctor.workplace_type || "Clinic"} - ${dbDoctor.workplace_name}`
        : dbDoctor.workplace_type || "Private Clinic";

    return {
        id: dbDoctor.id,
        fullName: dbDoctor.full_name,
        doctorCode: dbDoctor.doctor_code,
        email: dbDoctor.email,
        phone: dbDoctor.primary_phone || dbDoctor.phone || "",
        workplace,
    };
}

function mapExpenseFromDb(dbExpense: any): Expense {
    return {
        id: dbExpense.id,
        category: dbExpense.fin_expense_categories?.name || dbExpense.category || "Uncategorized",
        amountEgp: dbExpense.amount_egp,
        vendor: dbExpense.vendor,
        method: dbExpense.method,
        notes: dbExpense.notes,
        date: dbExpense.expense_date,
    };
}

function mapInvoiceFromDb(dbInvoice: any): Invoice {
    return {
        id: dbInvoice.id,
        caseCode: dbInvoice.cases?.case_code || dbInvoice.case_code || "",
        totalEgp: dbInvoice.total_egp,
        issuedAt: dbInvoice.issued_at,
    };
}

function mapInventoryProductFromDb(dbProduct: any): InventoryProduct {
    return {
        id: dbProduct.id,
        name: dbProduct.name || dbProduct.variant_name,
        category: dbProduct.category || "general",
        unitPriceEgp: dbProduct.unit_price_egp || 0,
        quantityInStock: dbProduct.quantity_in_stock || 0,
        location: dbProduct.location || "Main Storage",
    };
}

function mapInventoryMovementFromDb(dbMovement: any): InventoryMovement {
    return {
        id: dbMovement.id,
        productId: dbMovement.variant_id,
        productName: dbMovement.inv_variants?.variant_name || dbMovement.product_name || "",
        quantity: dbMovement.qty,
        moveType: dbMovement.move_type,
        date: dbMovement.moved_at,
    };
}

function mapEmployeeFromDb(dbEmployee: any): Employee {
    return {
        id: dbEmployee.id,
        fullName: dbEmployee.full_name,
        role: dbEmployee.role,
        salaryType: dbEmployee.salary_type,
        status: dbEmployee.active ? "Active" : "Inactive",
    };
}

function mapPayrollFromDb(dbPayroll: any): PayrollRecord {
    const periodLabel = dbPayroll.period_start && dbPayroll.period_end
        ? `${new Date(dbPayroll.period_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
        : "N/A";

    return {
        id: dbPayroll.id,
        employeeId: dbPayroll.employee_id,
        periodLabel,
        amountEgp: dbPayroll.amount_egp,
        method: dbPayroll.method,
        paidAt: dbPayroll.paid_at,
    };
}

export const supabaseLabApi = {
    async listCases(): Promise<LabCase[]> {
        const { data, error } = await supabase
            .from("cases")
            .select(`
        *,
        doctors (
          full_name,
          doctor_code
        )
      `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching cases:", error);
            throw new Error(`Failed to fetch cases: ${error.message}`);
        }

        return (data || []).map((c) => mapCaseFromDb(c));
    },

    async getCaseById(id: string): Promise<LabCase | null> {
        const { data, error } = await supabase
            .from("cases")
            .select(`
        *,
        doctors (
          full_name,
          doctor_code
        )
      `)
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching case:", error);
            return null;
        }

        return data ? mapCaseFromDb(data) : null;
    },

    async updateCase(id: string, updates: Partial<LabCase>): Promise<LabCase | null> {
        // Convert camelCase to snake_case for database
        const dbUpdates: any = {};

        if (updates.material !== undefined) dbUpdates.material = updates.material;
        if (updates.units !== undefined) dbUpdates.units = updates.units;
        if (updates.priceEgp !== undefined) dbUpdates.price_egp = updates.priceEgp;
        if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
        if (updates.stage !== undefined) dbUpdates.stage = updates.stage;
        if (updates.shade !== undefined) dbUpdates.shade = updates.shade;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

        // Always update the updated_at timestamp
        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from("cases")
            .update(dbUpdates)
            .eq("id", id)
            .select(`
        *,
        doctors (
          full_name,
          doctor_code
        )
      `)
            .single();

        if (error) {
            console.error("Error updating case:", error);
            throw new Error(`Failed to update case: ${error.message}`);
        }

        return data ? mapCaseFromDb(data) : null;
    },

    async listDoctors(): Promise<Doctor[]> {
        const { data, error } = await supabase
            .from("doctors")
            .select("*")
            .order("full_name", { ascending: true });

        if (error) {
            console.error("Error fetching doctors:", error);
            throw new Error(`Failed to fetch doctors: ${error.message}`);
        }

        return (data || []).map(mapDoctorFromDb);
    },

    async getDoctorById(id: string): Promise<Doctor | null> {
        const { data, error } = await supabase
            .from("doctors")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching doctor:", error);
            return null;
        }

        return data ? mapDoctorFromDb(data) : null;
    },

    async listDoctorCases(doctorId: string): Promise<LabCase[]> {
        const { data, error } = await supabase
            .from("cases")
            .select(`
        *,
        doctors (
          full_name,
          doctor_code
        )
      `)
            .eq("doctor_id", doctorId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching doctor cases:", error);
            throw new Error(`Failed to fetch doctor cases: ${error.message}`);
        }

        return (data || []).map((c) => mapCaseFromDb(c));
    },

    async listExpenses(): Promise<Expense[]> {
        const { data, error } = await supabase
            .from("fin_expenses")
            .select(`
        *,
        fin_expense_categories (
          name
        )
      `)
            .order("expense_date", { ascending: false });

        if (error) {
            console.error("Error fetching expenses:", error);
            throw new Error(`Failed to fetch expenses: ${error.message}`);
        }

        return (data || []).map(mapExpenseFromDb);
    },

    async listInvoices(): Promise<Invoice[]> {
        const { data, error } = await supabase
            .from("invoices")
            .select(`
        *,
        cases (
          case_code
        )
      `)
            .order("issued_at", { ascending: false });

        if (error) {
            console.error("Error fetching invoices:", error);
            throw new Error(`Failed to fetch invoices: ${error.message}`);
        }

        return (data || []).map(mapInvoiceFromDb);
    },

    async listInventoryProducts(): Promise<InventoryProduct[]> {
        // Try to get aggregated stock data
        const { data, error } = await supabase
            .from("inv_variants")
            .select(`
        id,
        variant_name,
        inv_products (
          name,
          category
        )
      `);

        if (error) {
            console.error("Error fetching inventory products:", error);
            throw new Error(`Failed to fetch inventory products: ${error.message}`);
        }

        // For each variant, calculate the stock quantity from stock moves
        const productsWithStock = await Promise.all(
            (data || []).map(async (variant) => {
                const { data: moves, error: movesError } = await supabase
                    .from("inv_stock_moves")
                    .select("qty")
                    .eq("variant_id", variant.id);

                const totalQty = movesError ? 0 : (moves || []).reduce((sum, m) => sum + m.qty, 0);

                // inv_products is an array, get first element
                const product = Array.isArray(variant.inv_products) ? variant.inv_products[0] : variant.inv_products;

                return {
                    id: variant.id,
                    name: variant.variant_name || product?.name || "Unknown",
                    category: product?.category || "general",
                    unitPriceEgp: 0, // Would need price data from another table
                    quantityInStock: totalQty,
                    location: "Main Storage",
                };
            })
        );

        return productsWithStock;
    },

    async listInventoryMovements(): Promise<InventoryMovement[]> {
        const { data, error } = await supabase
            .from("inv_stock_moves")
            .select(`
        *,
        inv_variants (
          variant_name
        )
      `)
            .order("moved_at", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Error fetching inventory movements:", error);
            throw new Error(`Failed to fetch inventory movements: ${error.message}`);
        }

        return (data || []).map(mapInventoryMovementFromDb);
    },

    async listEmployees(): Promise<Employee[]> {
        const { data, error } = await supabase
            .from("hr_employees")
            .select("*")
            .order("full_name", { ascending: true });

        if (error) {
            console.error("Error fetching employees:", error);
            throw new Error(`Failed to fetch employees: ${error.message}`);
        }

        return (data || []).map(mapEmployeeFromDb);
    },

    async listPayrollRecords(): Promise<PayrollRecord[]> {
        const { data, error } = await supabase
            .from("hr_payroll_payments")
            .select("*")
            .order("paid_at", { ascending: false });

        if (error) {
            console.error("Error fetching payroll records:", error);
            throw new Error(`Failed to fetch payroll records: ${error.message}`);
        }

        return (data || []).map(mapPayrollFromDb);
    },
};
