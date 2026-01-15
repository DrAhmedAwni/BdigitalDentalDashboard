import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCases } from "@/hooks/useLabData";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { EditCaseDialog } from "@/components/EditCaseDialog";
import { useState } from "react";
import { LabCase } from "@/types/lab";
import { supabaseLabApi } from "@/services/supabaseLabApi";

const CasesPage = () => {
  const { data: cases, isLoading, error, refetch } = useCases();
  const navigate = useNavigate();
  const [editingCase, setEditingCase] = useState<LabCase | null>(null);

  const handleSaveCase = async (updates: Partial<LabCase>) => {
    if (!editingCase) return;

    try {
      await supabaseLabApi.updateCase(editingCase.id, updates);
      toast.success("Case updated successfully", {
        description: `${editingCase.caseCode} has been updated.`,
      });
      refetch(); // Refresh the cases list
    } catch (error) {
      toast.error("Failed to update case", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cases</h1>
          <p className="text-sm text-muted-foreground">Full overview of all lab cases.</p>
        </div>
        <Button
          onClick={() =>
            toast("Add Case", { description: "This will open a case creation flow once Antigravity is wired." })
          }
        >
          Add Case
        </Button>
      </div>

      <CardShell>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="text-base">Cases Table</CardTitle>
              <CardDescription>Search, filter, and manage cases.</CardDescription>
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="space-y-4">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Code</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases?.map((c) => (
                      <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/cases/${c.id}`)}>
                        <TableCell className="font-medium text-primary">{c.code}</TableCell>
                        <TableCell>{c.patientName}</TableCell>
                        <TableCell>{c.doctorName}</TableCell>
                        <TableCell>{c.material}</TableCell>
                        <TableCell>{c.units}</TableCell>
                        <TableCell>{c.priceEgp.toLocaleString()} EGP</TableCell>
                        <TableCell>{c.dueDate}</TableCell>
                        <TableCell>{c.stage}</TableCell>
                        <TableCell className="space-x-1 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/cases/${c.id}`);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCase(c);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast("Delete Case", {
                                description: "Deletion will call a real API once connected.",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {cases?.map((c) => (
                  <CardShell
                    key={c.id}
                    className="border border-border/80 cursor-pointer"
                    onClick={() => navigate(`/cases/${c.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{c.patientName}</CardTitle>
                        <span className="text-xs font-medium text-primary">{c.code}</span>
                      </div>
                      <CardDescription>{c.doctorName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span>{c.material}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stage</span>
                        <span>{c.stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due</span>
                        <span>{c.dueDate}</span>
                      </div>
                    </CardContent>
                  </CardShell>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </CardShell>

      {/* Edit Case Dialog */}
      {editingCase && (
        <EditCaseDialog
          caseData={editingCase}
          open={!!editingCase}
          onOpenChange={(open) => !open && setEditingCase(null)}
          onSave={handleSaveCase}
        />
      )}
    </PageShell>
  );
};

export default CasesPage;
