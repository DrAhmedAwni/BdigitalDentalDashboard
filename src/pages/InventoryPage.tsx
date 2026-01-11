import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "@/hooks/useLabData";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

const InventoryPage = () => {
  const { productsQuery, movementsQuery } = useInventory();
  const loading = productsQuery.isLoading || movementsQuery.isLoading;

  const chartData = productsQuery.data?.map((p) => ({
    name: p.name,
    quantity: p.quantityInStock,
  }));

  const chartConfig = {
    quantity: {
      label: "Quantity in stock",
      color: "hsl(var(--primary))",
    },
  } as const;

  return (
    <PageShell>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Products, stock levels, and movement history.</p>
      </div>

      <CardShell>
        <CardHeader>
          <CardTitle className="text-base">Stock Levels</CardTitle>
          <CardDescription>Visual overview of available products.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : (
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="quantity" name="Quantity" fill="var(--color-quantity)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </CardShell>

      <div className="grid gap-4 md:grid-cols-2">
        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Product List</CardTitle>
            <CardDescription>All active inventory products.</CardDescription>
          </CardHeader>
          <CardContent>
            {productsQuery.isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsQuery.data?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.unitPriceEgp.toLocaleString()} EGP</TableCell>
                      <TableCell>{p.quantityInStock}</TableCell>
                      <TableCell>{p.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CardShell>

        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Stock Movements</CardTitle>
            <CardDescription>Purchases and consumption changes.</CardDescription>
          </CardHeader>
          <CardContent>
            {movementsQuery.isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movementsQuery.data?.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.productName}</TableCell>
                      <TableCell>{m.quantity}</TableCell>
                      <TableCell>{m.moveType}</TableCell>
                      <TableCell>{m.date}</TableCell>
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

export default InventoryPage;
