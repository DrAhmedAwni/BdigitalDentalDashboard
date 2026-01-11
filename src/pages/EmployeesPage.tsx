import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/hooks/useLabData";

const EmployeesPage = () => {
  const { employeesQuery, payrollQuery } = useEmployees();

  return (
    <PageShell>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Employees</h1>
        <p className="text-sm text-muted-foreground">Team list and payroll history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Employee List</CardTitle>
            <CardDescription>Overview of active and inactive staff.</CardDescription>
          </CardHeader>
          <CardContent>
            {employeesQuery.isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Salary Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeesQuery.data?.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.fullName}</TableCell>
                      <TableCell>{e.role}</TableCell>
                      <TableCell>{e.salaryType}</TableCell>
                      <TableCell>{e.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardShell>

        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Payroll History</CardTitle>
            <CardDescription>Recent payments by period and method.</CardDescription>
          </CardHeader>
          <CardContent>
            {payrollQuery.isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Paid At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollQuery.data?.map((p) => {
                    const employee = employeesQuery.data?.find((e) => e.id === p.employeeId);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{employee?.fullName ?? p.employeeId}</TableCell>
                        <TableCell>{p.periodLabel}</TableCell>
                        <TableCell>{p.amountEgp.toLocaleString()} EGP</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell>{p.paidAt}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardShell>
      </div>
    </PageShell>
  );
};

export default EmployeesPage;
