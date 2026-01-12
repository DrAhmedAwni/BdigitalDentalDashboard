import { useEffect, useState } from "react";
import { supabaseLabApi } from "@/services/supabaseLabApi";
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

type SimpleQuery<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function useSimpleQuery<T>(fetcher: () => Promise<T>): SimpleQuery<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load data"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadIndex]);

  const refetch = () => setReloadIndex((i) => i + 1);

  return { data, isLoading, error, refetch };
}

export function useCases(): SimpleQuery<LabCase[]> {
  return useSimpleQuery(() => supabaseLabApi.listCases());
}

export function useCase(id: string | undefined): SimpleQuery<LabCase | null> {
  const [data, setData] = useState<LabCase | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<Error | null>(null);

  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    supabaseLabApi
      .getCaseById(id)
      .then((result) => {
        if (!cancelled) {
          setData(result ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load case"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadIndex]);

  const refetch = () => setReloadIndex((i) => i + 1);

  return { data: data ?? null, isLoading, error, refetch };
}

export function useDoctors(): SimpleQuery<Doctor[]> {
  return useSimpleQuery(() => supabaseLabApi.listDoctors());
}

export function useDoctor(id: string | undefined): SimpleQuery<Doctor | null> {
  const [data, setData] = useState<Doctor | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<Error | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    supabaseLabApi
      .getDoctorById(id)
      .then((result) => {
        if (!cancelled) {
          setData(result ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load doctor"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadIndex]);

  const refetch = () => setReloadIndex((i) => i + 1);

  return { data: data ?? null, isLoading, error, refetch };
}

export function useDoctorCases(doctorId: string | undefined): SimpleQuery<LabCase[]> {
  const [data, setData] = useState<LabCase[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!doctorId);
  const [error, setError] = useState<Error | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!doctorId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    supabaseLabApi
      .listDoctorCases(doctorId)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load cases"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [doctorId, reloadIndex]);

  const refetch = () => setReloadIndex((i) => i + 1);

  return { data: data ?? [], isLoading, error, refetch };
}

export function useFinance(): {
  expensesQuery: SimpleQuery<Expense[]>;
  invoicesQuery: SimpleQuery<Invoice[]>;
} {
  const expensesQuery = useSimpleQuery<Expense[]>(() => supabaseLabApi.listExpenses());
  const invoicesQuery = useSimpleQuery<Invoice[]>(() => supabaseLabApi.listInvoices());
  return { expensesQuery, invoicesQuery };
}

export function useInventory(): {
  productsQuery: SimpleQuery<InventoryProduct[]>;
  movementsQuery: SimpleQuery<InventoryMovement[]>;
} {
  const productsQuery = useSimpleQuery<InventoryProduct[]>(() => supabaseLabApi.listInventoryProducts());
  const movementsQuery = useSimpleQuery<InventoryMovement[]>(() => supabaseLabApi.listInventoryMovements());
  return { productsQuery, movementsQuery };
}

export function useEmployees(): {
  employeesQuery: SimpleQuery<Employee[]>;
  payrollQuery: SimpleQuery<PayrollRecord[]>;
} {
  const employeesQuery = useSimpleQuery<Employee[]>(() => supabaseLabApi.listEmployees());
  const payrollQuery = useSimpleQuery<PayrollRecord[]>(() => supabaseLabApi.listPayrollRecords());
  return { employeesQuery, payrollQuery };
}
