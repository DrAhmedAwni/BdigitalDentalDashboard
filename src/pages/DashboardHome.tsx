import { useMemo, useState } from "react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { useCases, useFinance } from "@/hooks/useLabData";
import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { data: cases, isLoading: casesLoading } = useCases();
  const { expensesQuery, invoicesQuery } = useFinance();

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>("all");
  const [materialFilter, setMaterialFilter] = useState<string>("all");

  const totalCases = cases?.length ?? 0;

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

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.totalEgp, 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amountEgp, 0);
  const profit = totalRevenue - totalExpenses;

  const financeData = filteredInvoices.reduce<{
    month: string;
    revenue: number;
    expenses: number;
  }[]>((acc, inv) => {
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
      color: "hsl(var(--muted-foreground))",
    },
  } as const;

  return (
    <PageShell>
      <section className="grid gap-4 md:grid-cols-3">
        <CardShell className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Total Cases</CardTitle>
            <CardDescription>All cases across all doctors</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-semibold tracking-tight text-foreground">{totalCases}</p>
            </div>
            <Button variant="outline" size="lg">
              Add Case
            </Button>
          </CardContent>
        </CardShell>

        <CardShell>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today&apos;s Progress</CardTitle>
            <CardDescription>Cases moving through stages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>In Progress</span>
              <span>65%</span>
            </div>
            <Progress value={65} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Delivered</span>
              <span>35%</span>
            </div>
            <Progress value={35} />
          </CardContent>
        </CardShell>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Cases Overview</h2>
            <p className="text-sm text-muted-foreground">Filter and manage all lab cases.</p>
          </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Input placeholder="Search by code, patient, or doctor" className="w-full md:w-64" />
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="submitted">submitted</SelectItem>
                    <SelectItem value="Pouring/Scan">Pouring/Scan</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Waiting for Confirmation">Waiting for Confirmation</SelectItem>
                    <SelectItem value="Tryin Printing">Tryin Printing</SelectItem>
                    <SelectItem value="Tryin Ready to Deliver">Tryin Ready to Deliver</SelectItem>
                    <SelectItem value="Tryin Delivered">Tryin Delivered</SelectItem>
                    <SelectItem value="Sintring">Sintring</SelectItem>
                    <SelectItem value="Stain&Glaze">Stain&Glaze</SelectItem>
                    <SelectItem value="Final Ready to Deliver">Final Ready to Deliver</SelectItem>
                    <SelectItem value="Final Delivered">Final Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All doctors</SelectItem>
                    {cases?.map((c) => (
                      <SelectItem key={c.doctorId} value={c.doctorId}>
                        {c.doctorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
        </div>

        {casesLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <CardShell className="hidden md:block">
              <CardContent className="px-4 py-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Code</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Units</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases?.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer" onClick={() => navigate(`/cases/${item.id}`)}>
                        <TableCell className="font-medium text-primary">{item.code}</TableCell>
                        <TableCell>{item.patientName}</TableCell>
                        <TableCell>{item.doctorName}</TableCell>
                        <TableCell>{item.material}</TableCell>
                        <TableCell className="text-right">{item.units}</TableCell>
                        <TableCell className="text-right">{item.priceEgp.toLocaleString()} EGP</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell>
                          <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                            {item.stage}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-1 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/cases/${item.id}`);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CardShell>

            <div className="space-y-3 md:hidden">
              {cases?.map((item) => (
                <CardShell
                  key={item.id}
                  className="border border-border/80 cursor-pointer"
                  onClick={() => navigate(`/cases/${item.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{item.patientName}</CardTitle>
                      <span className="text-xs font-medium text-primary">{item.code}</span>
                    </div>
                    <CardDescription>{item.doctorName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material</span>
                      <span>{item.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span>{item.priceEgp.toLocaleString()} EGP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due</span>
                      <span>{item.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
                        {item.stage}
                      </span>
                      <div className="space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cases/${item.id}`);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CardShell>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <CardShell>
          <CardHeader>
            <CardTitle className="text-lg">Finance Overview</CardTitle>
            <CardDescription>Monthly revenue vs expenses (mocked for now).</CardDescription>
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

            <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-base font-semibold text-foreground">{totalRevenue.toLocaleString()} EGP</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-base font-semibold text-foreground">{totalExpenses.toLocaleString()} EGP</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="text-base font-semibold text-foreground">{profit.toLocaleString()} EGP</p>
              </div>
            </div>
            <div className="w-full max-w-xl mx-auto">
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </CardShell>


        <CardShell>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Snapshot</CardTitle>
            <CardDescription>Quick look at key materials in stock.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Zirconia Blocks</p>
                <p className="text-xs text-muted-foreground">Monolithic | A2</p>
              </div>
              <p className="text-sm font-semibold text-foreground">38 units</p>
            </div>
            <Progress value={72} />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Temporary PMMA</p>
                <p className="text-xs text-muted-foreground">Multi-layer</p>
              </div>
              <p className="text-sm font-semibold text-foreground">18 units</p>
            </div>
            <Progress value={48} />
          </CardContent>
        </CardShell>
      </section>
    </PageShell>
  );
};

export default DashboardHome;
