/**
 * Chart Template
 *
 * A template for data visualization apps using recharts.
 * Use this for trackers, dashboards, and analytics displays.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data - replace with your own data structure
const sampleLineData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 500 },
  { name: "Thu", value: 280 },
  { name: "Fri", value: 590 },
  { name: "Sat", value: 350 },
  { name: "Sun", value: 400 },
];

const samplePieData = [
  { name: "Category A", value: 400, color: "hsl(var(--primary))" },
  { name: "Category B", value: 300, color: "hsl(var(--secondary))" },
  { name: "Category C", value: 200, color: "hsl(var(--accent))" },
  { name: "Category D", value: 100, color: "hsl(var(--muted))" },
];

type ChartType = "line" | "bar" | "pie";

export default function App() {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [data, setData] = useState(sampleLineData);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chart-data");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem("chart-data", JSON.stringify(data));
  }, [data]);

  const addDataPoint = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const newPoint = {
      name: days[data.length % 7],
      value: Math.floor(Math.random() * 500) + 100,
    };
    setData([...data, newPoint]);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = Math.round(total / data.length);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{average}</p>
              <p className="text-sm text-muted-foreground">Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{data.length}</p>
              <p className="text-sm text-muted-foreground">Data Points</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Visualization</CardTitle>
                <CardDescription>Track your metrics over time</CardDescription>
              </div>
              <div className="flex gap-2">
                {(["line", "bar", "pie"] as ChartType[]).map((type) => (
                  <Badge
                    key={type}
                    variant={chartType === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setChartType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={samplePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {samplePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button onClick={addDataPoint}>Add Data Point</Button>
              <Button variant="outline" onClick={() => setData(sampleLineData)}>
                Reset Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
