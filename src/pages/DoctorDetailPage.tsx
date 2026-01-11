import { useParams } from "react-router-dom";
import { PageShell, CardShell, TableSkeleton } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDoctor, useDoctorCases } from "@/hooks/useLabData";
import { useToast } from "@/hooks/use-toast";

const DoctorDetailPage = () => {
  const { doctorId } = useParams();
  const { data: doctor, isLoading } = useDoctor(doctorId);
  const { data: cases, isLoading: casesLoading } = useDoctorCases(doctorId);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <PageShell>
        <TableSkeleton />
      </PageShell>
    );
  }

  if (!doctor) {
    return (
      <PageShell>
        <p className="text-sm text-muted-foreground">Doctor not found.</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Doctor Detail</p>
          <h1 className="text-xl font-semibold tracking-tight">{doctor.fullName}</h1>
          <p className="text-sm text-muted-foreground">{doctor.workplace}</p>
        </div>
        <Button
          onClick={() =>
            toast({ title: "Message Doctor", description: "Messaging will be enabled via backend integration." })
          }
        >
          Message
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
            <CardDescription>Preferred channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Doctor Code</p>
              <p className="font-medium">{doctor.doctorCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{doctor.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{doctor.phone}</p>
            </div>
          </CardContent>
        </CardShell>

        <CardShell className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Cases</CardTitle>
            <CardDescription>Cases assigned to this doctor.</CardDescription>
          </CardHeader>
          <CardContent>
            {casesLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Code</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases?.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.code}</TableCell>
                      <TableCell>{c.patientName}</TableCell>
                      <TableCell>{c.material}</TableCell>
                      <TableCell>{c.stage}</TableCell>
                      <TableCell>{c.dueDate}</TableCell>
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

export default DoctorDetailPage;
