import { useQuery } from "@tanstack/react-query";
import { mockLabApi } from "@/services/mockLabApi";

export const queryKeys = {
  cases: ["cases"] as const,
  case: (id: string) => ["case", id] as const,
  doctors: ["doctors"] as const,
  doctor: (id: string) => ["doctor", id] as const,
  doctorCases: (id: string) => ["doctor-cases", id] as const,
  expenses: ["expenses"] as const,
  invoices: ["invoices"] as const,
  inventoryProducts: ["inventory-products"] as const,
  inventoryMovements: ["inventory-movements"] as const,
  employees: ["employees"] as const,
  payroll: ["payroll"] as const,
};

export function useCases() {
  return useQuery({ queryKey: queryKeys.cases, queryFn: () => mockLabApi.listCases() });
}

export function useCase(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.case(id) : ["case", "unknown"],
    queryFn: () => (id ? mockLabApi.getCaseById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useDoctors() {
  return useQuery({ queryKey: queryKeys.doctors, queryFn: () => mockLabApi.listDoctors() });
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.doctor(id) : ["doctor", "unknown"],
    queryFn: () => (id ? mockLabApi.getDoctorById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useDoctorCases(doctorId: string | undefined) {
  return useQuery({
    queryKey: doctorId ? queryKeys.doctorCases(doctorId) : ["doctor-cases", "unknown"],
    queryFn: () => (doctorId ? mockLabApi.listDoctorCases(doctorId) : Promise.resolve([])),
    enabled: !!doctorId,
  });
}

export function useFinance() {
  const expensesQuery = useQuery({ queryKey: queryKeys.expenses, queryFn: () => mockLabApi.listExpenses() });
  const invoicesQuery = useQuery({ queryKey: queryKeys.invoices, queryFn: () => mockLabApi.listInvoices() });
  return { expensesQuery, invoicesQuery };
}

export function useInventory() {
  const productsQuery = useQuery({
    queryKey: queryKeys.inventoryProducts,
    queryFn: () => mockLabApi.listInventoryProducts(),
  });
  const movementsQuery = useQuery({
    queryKey: queryKeys.inventoryMovements,
    queryFn: () => mockLabApi.listInventoryMovements(),
  });
  return { productsQuery, movementsQuery };
}

export function useEmployees() {
  const employeesQuery = useQuery({ queryKey: queryKeys.employees, queryFn: () => mockLabApi.listEmployees() });
  const payrollQuery = useQuery({ queryKey: queryKeys.payroll, queryFn: () => mockLabApi.listPayrollRecords() });
  return { employeesQuery, payrollQuery };
}
