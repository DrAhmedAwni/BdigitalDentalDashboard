import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCases } from "@/hooks/useLabData";
import { useNavigate } from "react-router-dom";

const CasesPage = () => {
  const { data: cases, isLoading } = useCases();
  const navigate = useNavigate();

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cases</h1>
          <p className="text-sm text-muted-foreground">Full overview of all lab cases.</p>
        </div>
        <Button onClick={() => console.log("Add Case clicked - connect Antigravity later")}>
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
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
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
                      <TableHead>Status</TableHead>
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
                        <TableCell>{c.status}</TableCell>
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
                              console.log("Edit Case clicked - wire to Antigravity later");
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Delete Case clicked - wire to Antigravity later");
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
    </PageShell>
  );
};

export default CasesPage;
