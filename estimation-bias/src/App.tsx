import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Activity } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfile } from "@/components/user-profile";
import { LoginPage } from "@/components/login-page";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/utils/useAuth";
import PERTAnalysis from "./layout/PERT";
import TimeSeriesAnalysis from "./layout/TimeSeries";
import MultilinearRegression from "./layout/MultilinearRegression";

interface Task {
  taskName: string;
  timeEstimate: number;
}

function App() {
  const { authenticated, loading, login, logout } = useAuth();
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [selectedNewTasks, setSelectedNewsTasks] = useState<Task[]>([]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="spe-ui-theme">
      {!authenticated ? (
        <LoginPage loading={loading} onLogin={login} />
      ) : (
        <div className="min-h-screen bg-background">
          {/* Navbar */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400 shadow-sm">
                  <Activity
                    className="h-4.5 w-4.5 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <span className="text-base font-semibold tracking-tight">
                  SPE
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Software Project Estimator
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Separator orientation="vertical" className="mx-1 h-6" />
                <UserProfile onLogout={logout} />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <Tabs
              defaultValue="pert"
              onValueChange={(val) =>
                toast(
                  `Switched to ${val === "pert" ? "PERT" : val === "time-series" ? "Time Series" : "Regression"} analysis`
                )
              }
            >
              <TabsList className="mb-6">
                <TabsTrigger value="pert">PERT</TabsTrigger>
                <TabsTrigger value="time-series">Time Series</TabsTrigger>
                <TabsTrigger value="regression">Regression</TabsTrigger>
              </TabsList>

              <TabsContent value="pert">
                <PERTAnalysis
                  selectedTasks={selectedTasks}
                  setSelectedTasks={setSelectedTasks}
                />
              </TabsContent>

              <TabsContent value="time-series">
                <TimeSeriesAnalysis
                  setSelectedNewTasks={setSelectedNewsTasks}
                  selectedNewTasks={selectedNewTasks}
                />
              </TabsContent>

              <TabsContent value="regression">
                <MultilinearRegression />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      )}

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          className: "font-sans",
        }}
      />
    </ThemeProvider>
  );
}

export default App;
