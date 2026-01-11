import { PageShell, CardShell } from "@/components/layout/PageShell";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  return (
    <PageShell>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure preferences and integration defaults.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Email and in-app alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-cases">Case status updates</Label>
              <Switch id="notif-cases" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-finance">Daily finance summary</Label>
              <Switch id="notif-finance" disabled />
            </div>
          </CardContent>
        </CardShell>

        <CardShell>
          <CardHeader>
            <CardTitle className="text-base">Antigravity Integration</CardTitle>
            <CardDescription>Preview of how data will sync.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              This frontend already uses typed hooks and a mock API layer. When you connect Antigravity, replace the
              mock service with real API calls while reusing the same TypeScript types.
            </p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              <li>Map <span className="font-mono text-xs">public.cases</span> to <span className="font-mono text-xs">LabCase</span>.</li>
              <li>Map finance tables to <span className="font-mono text-xs">Expense</span> and <span className="font-mono text-xs">Invoice</span>.</li>
              <li>Reuse doctor, inventory, and employee types across queries.</li>
            </ul>
          </CardContent>
        </CardShell>
      </div>
    </PageShell>
  );
};

export default SettingsPage;
