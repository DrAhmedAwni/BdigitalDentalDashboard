import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDoctors } from "@/hooks/useLabData";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const DoctorsPage = () => {
  const { data: doctors, isLoading, error, refetch } = useDoctors();
  const navigate = useNavigate();

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground">Manage referring doctors and their contact details.</p>
        </div>
        <Button
          onClick={() =>
            toast("Add Doctor", { description: "This will open a doctor creation form later." })
          }
        >
          Add Doctor
        </Button>
      </div>

      <CardShell>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="text-base">Doctor Directory</CardTitle>
              <CardDescription>Click a doctor to view their cases.</CardDescription>
            </div>
            <Input placeholder="Search by name or code" className="w-full md:w-64" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Workplace</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors?.map((d) => (
                  <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate(`/doctors/${d.id}`)}>
                    <TableCell className="font-medium">{d.fullName}</TableCell>
                    <TableCell>{d.doctorCode}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>{d.phone}</TableCell>
                    <TableCell>{d.workplace}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/doctors/${d.id}`);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("Edit Doctor", {
                            description: "Editing will sync with Antigravity doctors later.",
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </CardShell>
    </PageShell>
  );
};

export default DoctorsPage;
