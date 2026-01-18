/**
 * Form Template
 *
 * A template for apps that collect user input through forms.
 * Use this for calculators, converters, generators, and data entry apps.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  name: string;
  email: string;
  category: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    category: "",
  });
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Process the form data
    setResult(`Hello, ${formData.name}! Your ${formData.category} request has been received.`);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", category: "" });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Form App</CardTitle>
            <CardDescription>Enter your information below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>

              {/* Select Input */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleSelectChange("category")}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>

            {/* Result */}
            {result && (
              <div className="mt-6 rounded-lg bg-muted p-4">
                <p className="text-sm">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
