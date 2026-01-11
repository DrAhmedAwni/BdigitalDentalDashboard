import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const cases = [
  {
    code: "G8835",
    patient: "Hesham",
    doctor: "Mohamed Eldemellawy",
    doctorCode: "DR-54",
    material: "Monolithic Zirconia",
    units: 2,
    price: "2,500 EGP",
    dueDate: "2026-01-10",
    stage: "Final Delivered",
  },
  {
    code: "E6514",
    patient: "Sggs",
    doctor: "Ahmed Awni",
    doctorCode: "DR-52",
    material: "Monolithic Zirconia",
    units: 1,
    price: "1,250 EGP",
    dueDate: "2026-01-07",
    stage: "Final Delivered",
  },
];

const financeData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 46000, expenses: 31000 },
  { month: "Mar", revenue: 39000, expenses: 26000 },
  { month: "Apr", revenue: 51000, expenses: 30000 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--muted-foreground))",
  },
};

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Total Cases</CardTitle>
            <CardDescription>All cases across all doctors</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-semibold tracking-tight text-foreground">28</p>
            </div>
            <Button variant="outline" size="lg">
              Add Case
            </Button>
          </CardContent>
        </Card>

        <Card>
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
        </Card>
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All doctors</SelectItem>
                  <SelectItem value="awni">Ahmed Awni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card className="hidden md:block">
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
                {cases.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell className="font-medium text-primary">{item.code}</TableCell>
                    <TableCell>{item.patient}</TableCell>
                    <TableCell>{item.doctor}</TableCell>
                    <TableCell>{item.material}</TableCell>
                    <TableCell className="text-right">{item.units}</TableCell>
                    <TableCell className="text-right">{item.price}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        {item.stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-3 md:hidden">
          {cases.map((item) => (
            <Card key={item.code} className="border border-border/80">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{item.patient}</CardTitle>
                  <span className="text-xs font-medium text-primary">{item.code}</span>
                </div>
                <CardDescription>{item.doctor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material</span>
                  <span>{item.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span>{item.price}</span>
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
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Finance Overview</CardTitle>
            <CardDescription>Monthly revenue vs expenses (placeholder data).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-base font-semibold text-foreground">152,000 EGP</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-base font-semibold text-foreground">87,000 EGP</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="text-base font-semibold text-foreground">65,000 EGP</p>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
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
                <p className="font-medium">E.max Ingots</p>
                <p className="text-xs text-muted-foreground">HT | A1</p>
              </div>
              <p className="text-sm font-semibold text-foreground">24 units</p>
            </div>
            <Progress value={54} />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Implant Components</p>
                <p className="text-xs text-muted-foreground">Multi-brand</p>
              </div>
              <p className="text-sm font-semibold text-foreground">61 units</p>
            </div>
            <Progress value={88} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardHome;
