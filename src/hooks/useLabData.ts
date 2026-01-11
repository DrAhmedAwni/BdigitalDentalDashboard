import { useEffect, useState } from "react";
import { mockLabApi } from "@/services/mockLabApi";
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
};

function useSimpleQuery<T>(fetcher: () => Promise<T>): SimpleQuery<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
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
  }, [fetcher]);

  return { data, isLoading };
}

export function useCases(): SimpleQuery<LabCase[]> {
  return useSimpleQuery(() => mockLabApi.listCases());
}

export function useCase(id: string | undefined): SimpleQuery<LabCase | null> {
  const [data, setData] = useState<LabCase | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    mockLabApi
      .getCaseById(id)
      .then((result) => {
        if (!cancelled) {
          setData(result);
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
  }, [id]);

  return { data: data ?? null, isLoading };
}

export function useDoctors(): SimpleQuery<Doctor[]> {
  return useSimpleQuery(() => mockLabApi.listDoctors());
}

export function useDoctor(id: string | undefined): SimpleQuery<Doctor | null> {
  const [data, setData] = useState<Doctor | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!id);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    mockLabApi
      .getDoctorById(id)
      .then((result) => {
        if (!cancelled) {
          setData(result);
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
  }, [id]);

  return { data: data ?? null, isLoading };
}

export function useDoctorCases(doctorId: string | undefined): SimpleQuery<LabCase[]> {
  const [data, setData] = useState<LabCase[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(!!doctorId);

  useEffect(() => {
    let cancelled = false;

    if (!doctorId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    mockLabApi
      .listDoctorCases(doctorId)
      .then((result) => {
        if (!cancelled) {
          setData(result);
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
  }, [doctorId]);

  return { data: data ?? [], isLoading };
}

export function useFinance(): {
  expensesQuery: SimpleQuery<Expense[]>;
  invoicesQuery: SimpleQuery<Invoice[]>;
} {
  const expensesQuery = useSimpleQuery<Expense[]>(() => mockLabApi.listExpenses());
  const invoicesQuery = useSimpleQuery<Invoice[]>(() => mockLabApi.listInvoices());
  return { expensesQuery, invoicesQuery };
}

export function useInventory(): {
  productsQuery: SimpleQuery<InventoryProduct[]>;
  movementsQuery: SimpleQuery<InventoryMovement[]>;
} {
  const productsQuery = useSimpleQuery<InventoryProduct[]>(() => mockLabApi.listInventoryProducts());
  const movementsQuery = useSimpleQuery<InventoryMovement[]>(() => mockLabApi.listInventoryMovements());
  return { productsQuery, movementsQuery };
}

export function useEmployees(): {
  employeesQuery: SimpleQuery<Employee[]>;
  payrollQuery: SimpleQuery<PayrollRecord[]>;
} {
  const employeesQuery = useSimpleQuery<Employee[]>(() => mockLabApi.listEmployees());
  const payrollQuery = useSimpleQuery<PayrollRecord[]>(() => mockLabApi.listPayrollRecords());
  return { employeesQuery, payrollQuery };
}
