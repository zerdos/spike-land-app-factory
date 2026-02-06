import { useState, lazy, Suspense, Component, type ReactNode, type ErrorInfo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

class ErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(err: Error) { return { error: err.message }; }
  componentDidCatch(err: Error, info: ErrorInfo) { console.error("Preview error:", err, info); }
  componentDidUpdate(prev: { children: ReactNode }) {
    if (prev.children !== this.props.children) this.setState({ error: null });
  }
  render() {
    if (this.state.error) return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-destructive">Render Error</CardTitle>
          <CardDescription>{this.state.error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => { this.setState({ error: null }); this.props.onReset(); }}>
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
    return this.props.children;
  }
}

// Dynamic imports for all templates
const templates = {
  basic: lazy(() => import("../templates/basic")),
  "with-form": lazy(() => import("../templates/with-form")),
  "with-chart": lazy(() => import("../templates/with-chart")),
  "with-game": lazy(() => import("../templates/with-game")),
  "with-timer": lazy(() => import("../templates/with-timer")),
};

type TemplateName = keyof typeof templates;

// Discover apps from apps/**/*.tsx via Vite glob import
const appModules = import.meta.glob<{ default: React.ComponentType }>("../apps/**/*.tsx");

const appEntries = Object.keys(appModules).map((path) => {
  // path looks like "../apps/interactive/rubik.tsx"
  const match = path.match(/\.\.\/apps\/([^/]+)\/([^/]+)\.tsx$/);
  const category = match?.[1] ?? "unknown";
  const name = match?.[2] ?? path;
  return {
    key: `${category}/${name}`,
    category,
    name,
    component: lazy(appModules[path]),
  };
});

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("preview");

  const activeApp = selectedApp ? appEntries.find((a) => a.key === selectedApp) : null;
  const SelectedComponent = selectedTemplate
    ? templates[selectedTemplate]
    : activeApp
      ? activeApp.component
      : null;
  const previewLabel = selectedTemplate ?? activeApp?.name ?? null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Jules App Factory</h1>
              <p className="text-sm text-muted-foreground">
                Development preview for React apps
              </p>
            </div>
            <Badge variant="outline">Dev Mode</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="apps">Generated Apps</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            {SelectedComponent ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Previewing: {previewLabel}
                  </h2>
                  <Button variant="outline" onClick={() => { setSelectedTemplate(null); setSelectedApp(null); }}>
                    Back to List
                  </Button>
                </div>
                <div className="rounded-lg border">
                  <ErrorBoundary onReset={() => { setSelectedTemplate(null); setSelectedApp(null); }}>
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        </div>
                      }
                    >
                      {SelectedComponent && <SelectedComponent />}
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select an App to Preview</CardTitle>
                  <CardDescription>
                    Choose a template or generated app from the tabs above
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Use this dev server to test apps locally before deploying to
                    testing.spike.land
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.keys(templates).map((name) => (
                <Card key={name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <CardDescription>
                      {name === "basic" && "Minimal starting point for simple apps"}
                      {name === "with-form" && "Template for form-based input apps"}
                      {name === "with-chart" && "Data visualization template with recharts"}
                      {name === "with-game" && "Interactive game template"}
                      {name === "with-timer" && "Timer/countdown template"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => { setSelectedTemplate(name as TemplateName); setSelectedApp(null); setActiveTab("preview"); }}
                      className="w-full"
                    >
                      Preview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Generated Apps Tab */}
          <TabsContent value="apps">
            {appEntries.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Apps Generated Yet</CardTitle>
                  <CardDescription>
                    Use the orchestration scripts to generate apps
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Run the following commands to get started:
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    <p># Initialize a new app</p>
                    <p>yarn orchestrate:init pomodoro-timer utility</p>
                    <br />
                    <p># Get the next task for Jules</p>
                    <p>yarn orchestrate:next</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appEntries.map((app) => (
                  <Card key={app.key} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <Badge variant="secondary">{app.category}</Badge>
                      </div>
                      <CardDescription>{app.key}.tsx</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => { setSelectedApp(app.key); setSelectedTemplate(null); setActiveTab("preview"); }}
                      >
                        Preview
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Jules App Factory | spike.land
        </div>
      </footer>
    </div>
  );
}

export default App;
