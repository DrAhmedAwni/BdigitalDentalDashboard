import { useParams, useNavigate, Link } from "react-router-dom";
import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCase } from "@/hooks/useLabData";
import { useToast } from "@/hooks/use-toast";

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const { data: labCase, isLoading } = useCase(caseId);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PageShell>
        <TableSkeleton />
      </PageShell>
    );
  }

  if (!labCase) {
    return (
      <PageShell>
        <p className="text-sm text-muted-foreground">Case not found.</p>
      </PageShell>
    );
  }

  const history = [
    { stage: "Received", date: "2025-12-30" },
    { stage: "Design", date: "2026-01-01" },
    { stage: "Production", date: "2026-01-03" },
    { stage: "Final Delivered", date: labCase.dueDate },
  ];

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Case Detail</p>
          <h1 className="text-xl font-semibold tracking-tight">
            {labCase.code} · {labCase.patientName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Doctor: <Link to="/doctors" className="story-link">{labCase.doctorName}</Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Reopen Case", description: "Connect Antigravity to update real case status." })
            }
          >
            Reopen
          </Button>
          <Button
            onClick={() =>
              toast({ title: "Duplicate Case", description: "This action will be wired to Antigravity later." })
            }
          >
            Duplicate
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CardShell className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Clinical Details</CardTitle>
            <CardDescription>Key information for this case.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="text-muted-foreground">Patient</p>
              <p className="font-medium">{labCase.patientName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Doctor</p>
              <p className="font-medium">{labCase.doctorName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Material</p>
              <p className="font-medium">{labCase.material}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Units</p>
              <p className="font-medium">{labCase.units}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">{labCase.priceEgp.toLocaleString()} EGP</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{labCase.dueDate}</p>
            </div>
          </CardContent>
        </CardShell>

        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common workflows for this case.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => toast({ title: "Print Ticket", description: "Will trigger a print template via Antigravity." })}
            >
              Print Ticket<span className="text-xs text-muted-foreground">PDF</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigate("/finance")}
            >
              View Invoice<span className="text-xs text-muted-foreground">Finance</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => toast({ title: "Add Note", description: "Notes will sync once backend is wired." })}
            >
              Add Doctor Note<span className="text-xs text-muted-foreground">Coming soon</span>
            </Button>
          </CardContent>
        </CardShell>
      </div>

      <CardShell>
        <CardHeader>
          <CardTitle className="text-base">Stage Timeline</CardTitle>
          <CardDescription>Chronological history of this case.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.stage}>
                  <TableCell>{item.stage}</TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </CardShell>
    </PageShell>
  );
};

export default CaseDetailPage;
