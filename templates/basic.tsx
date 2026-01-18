/**
 * Basic Template
 *
 * A minimal starting point for simple apps.
 * Use this for apps that primarily display information or have simple interactions.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>App Title</CardTitle>
            <CardDescription>A brief description of what this app does.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main content */}
            <div className="text-center">
              <p className="text-4xl font-bold">{count}</p>
              <p className="text-muted-foreground">Current value</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setCount((c) => c - 1)}>
                Decrease
              </Button>
              <Button onClick={() => setCount((c) => c + 1)}>Increase</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
