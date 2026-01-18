import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamic imports for all templates
const templates = {
  basic: lazy(() => import("../templates/basic")),
  "with-form": lazy(() => import("../templates/with-form")),
  "with-chart": lazy(() => import("../templates/with-chart")),
  "with-game": lazy(() => import("../templates/with-game")),
  "with-timer": lazy(() => import("../templates/with-timer")),
};

type TemplateName = keyof typeof templates;

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName | null>(null);
  const [appFiles, setAppFiles] = useState<string[]>([]);

  // In a real implementation, this would scan the apps directory
  useEffect(() => {
    // Placeholder - in production, this would use the filesystem or an API
    setAppFiles([]);
  }, []);

  const SelectedComponent = selectedTemplate ? templates[selectedTemplate] : null;

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
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="apps">Generated Apps</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            {selectedTemplate ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Previewing: {selectedTemplate}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Back to List
                  </Button>
                </div>
                <div className="rounded-lg border">
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                      </div>
                    }
                  >
                    {SelectedComponent && <SelectedComponent />}
                  </Suspense>
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
                      onClick={() => setSelectedTemplate(name as TemplateName)}
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
            {appFiles.length === 0 ? (
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
                {appFiles.map((file) => (
                  <Card key={file}>
                    <CardHeader>
                      <CardTitle className="text-lg">{file}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Preview</Button>
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
