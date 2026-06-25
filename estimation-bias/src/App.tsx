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
import { Task } from "@/types";
import PERTAnalysis from "./layout/PERT";
import TimeSeriesAnalysis from "./layout/TimeSeries";
import MultilinearRegression from "./layout/MultilinearRegression";

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
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <Activity
                    className="h-4 w-4 text-primary-foreground"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold tracking-tight">
                    SPE
                  </span>
                  <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                    Software Project Estimator
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <ThemeToggle />
                <Separator orientation="vertical" className="mx-2 h-5" />
                <UserProfile onLogout={logout} />
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                Estimation Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Analyze and predict software project timelines using statistical
                models
              </p>
            </div>

            <Tabs
              defaultValue="pert"
              onValueChange={(val) =>
                toast(
                  `Switched to ${val === "pert" ? "PERT" : val === "time-series" ? "Time Series" : "Regression"} analysis`,
                )
              }
            >
              <TabsList className="mb-6">
                <TabsTrigger value="pert">PERT Analysis</TabsTrigger>
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
