import { useMemo, useState } from "react";
import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCases, useFinance } from "@/hooks/useLabData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

const FinancePage = () => {
  const { data: cases } = useCases();
  const { expensesQuery, invoicesQuery } = useFinance();

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>("all");
  const [materialFilter, setMaterialFilter] = useState<string>("all");

  const loading = expensesQuery.isLoading || invoicesQuery.isLoading;
  const hasError = expensesQuery.error || invoicesQuery.error;

  const invoicesWithCase = useMemo(
    () =>
      (invoicesQuery.data ?? [])
        .map((inv) => ({
          ...inv,
          relatedCase: (cases ?? []).find((c) => c.caseCode === inv.caseCode),
        }))
        .filter((row) => row.relatedCase),
    [cases, invoicesQuery.data]
  );

  const filteredInvoices = useMemo(
    () =>
      invoicesWithCase.filter(({ relatedCase, issuedAt }) => {
        const issuedDate = new Date(issuedAt);
        if (dateFrom && issuedDate < new Date(dateFrom)) return false;
        if (dateTo && issuedDate > new Date(dateTo)) return false;
        if (doctorFilter !== "all" && relatedCase!.doctorId !== doctorFilter) return false;
        if (caseTypeFilter !== "all" && relatedCase!.caseType !== caseTypeFilter) return false;
        if (materialFilter !== "all" && relatedCase!.material !== materialFilter) return false;
        return true;
      }),
    [invoicesWithCase, dateFrom, dateTo, doctorFilter, caseTypeFilter, materialFilter]
  );

  const filteredExpenses = useMemo(
    () =>
      (expensesQuery.data ?? []).filter((exp) => {
        const d = new Date(exp.date);
        if (dateFrom && d < new Date(dateFrom)) return false;
        if (dateTo && d > new Date(dateTo)) return false;
        return true;
      }),
    [expensesQuery.data, dateFrom, dateTo]
  );

  const financeData = filteredInvoices.reduce<{ month: string; revenue: number; expenses: number }[]>((acc, inv) => {
    const monthLabel = new Date(inv.issuedAt).toLocaleString("default", { month: "short" });
    const existing = acc.find((row) => row.month === monthLabel);
    if (existing) {
      existing.revenue += inv.totalEgp;
    } else {
      acc.push({ month: monthLabel, revenue: inv.totalEgp, expenses: 0 });
    }
    return acc;
  }, []);

  filteredExpenses.forEach((exp) => {
    const monthLabel = new Date(exp.date).toLocaleString("default", { month: "short" });
    const existing = financeData.find((row) => row.month === monthLabel);
    if (existing) {
      existing.expenses += exp.amountEgp;
    } else {
      financeData.push({ month: monthLabel, revenue: 0, expenses: exp.amountEgp });
    }
  });

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--destructive))",
    },
  } as const;

  return (
    <PageShell>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Finance</h1>
        <p className="text-sm text-muted-foreground">Monitor income, expenses, and profitability.</p>
      </div>

      <CardShell>
        <CardHeader>
          <CardTitle className="text-base">Monthly Performance</CardTitle>
          <CardDescription>Revenue vs expenses based on mock transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-2 md:grid-cols-4 text-xs md:text-sm">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9"
              placeholder="From"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9"
              placeholder="To"
            />
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="h-9 text-xs md:text-sm">
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All doctors</SelectItem>
                {Array.from(new Map((cases ?? []).map((c) => [c.doctorId, c])).values()).map((c) => (
                  <SelectItem key={c.doctorId} value={c.doctorId}>
                    {c.doctorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
              <SelectTrigger className="h-9 text-xs md:text-sm">
                <SelectValue placeholder="Case type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="try-in">Try-in</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : (
            <div className="w-full max-w-2xl mx-auto">
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--color-revenue)" radius={4} />
                  <Bar dataKey="expenses" name="Expenses" fill="var(--color-expenses)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </CardShell>

      <div className="grid gap-4 md:grid-cols-2">
        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Expense History</CardTitle>
            <CardDescription>Recent expenses by vendor and method.</CardDescription>
          </CardHeader>
          <CardContent>
            {expensesQuery.isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesQuery.data?.map((exp) => (
                    <TableRow key={exp.id}>
                      <TableCell>{exp.category}</TableCell>
                      <TableCell>{exp.amountEgp.toLocaleString()} EGP</TableCell>
                      <TableCell>{exp.vendor}</TableCell>
                      <TableCell>{exp.method}</TableCell>
                      <TableCell>{exp.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardShell>

        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Invoices</CardTitle>
            <CardDescription>Issued invoices linked to cases.</CardDescription>
          </CardHeader>
          <CardContent>
            {invoicesQuery.isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Case Code</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Issued</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesQuery.data?.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.id}</TableCell>
                      <TableCell>{inv.caseCode}</TableCell>
                      <TableCell>{inv.totalEgp.toLocaleString()} EGP</TableCell>
                      <TableCell>{inv.issuedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardShell>
      </div>
    </PageShell>
  );
};

export default FinancePage;
