import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/dental-lab-logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({
      title: "Data refresh queued",
      description: "The dashboard will load the latest lab data once connected.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logout placeholder",
      description: "Connect authentication to enable real logout.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="mr-1 md:hidden" />
              <img src={logo} alt="B-Digital Dental Lab logo" className="h-8 w-auto md:h-10" />
            </div>

            <div className="hidden flex-col items-center md:flex">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Total Cases</span>
              <span className="text-2xl font-semibold text-foreground">28</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end text-right text-xs md:hidden">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Cases</span>
                <span className="text-base font-semibold text-foreground">28</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Refresh
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl gap-4 px-4 pb-10 pt-4 md:px-6">
          <AppSidebar />
          <main className="flex-1 pb-8">
            <div className="space-y-6 animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
