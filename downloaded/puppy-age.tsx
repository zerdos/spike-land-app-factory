import { useState, useMemo } from "react";
import { Dog, Calculator, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type DogSize = "small" | "medium" | "large" | "giant";

const SIZE_Multipliers: Record<DogSize, number> = {
  small: 4,
  medium: 5,
  large: 6,
  giant: 7,
};

const SIZE_LABELS: Record<DogSize, string> = {
  small: "Small (under 20 lbs)",
  medium: "Medium (20-50 lbs)",
  large: "Large (50-100 lbs)",
  giant: "Giant (over 100 lbs)",
};

export default function App() {
  const [years, setYears] = useState<string>("0");
  const [months, setMonths] = useState<string>("0");
  const [size, setSize] = useState<DogSize>("medium");

  const humanAge = useMemo(() => {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    
    if (y === 0 && m === 0) return 0;

    const totalYears = y + m / 12;

    if (totalYears <= 1) {
      return totalYears * 15;
    }
    
    if (totalYears <= 2) {
      return 15 + (totalYears - 1) * 9;
    }

    const base = 24; // 15 + 9
    const subsequentYears = totalYears - 2;
    return base + subsequentYears * SIZE_Multipliers[size];
  }, [years, months, size]);

  const handleReset = () => {
    setYears("0");
    setMonths("0");
    setSize("medium");
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Dog className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Puppy Age Calculator</CardTitle>
              <CardDescription>Convert dog years to human years</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="years">Years</Label>
              <Input 
                id="years" 
                type="number" 
                min="0" 
                max="30"
                value={years} 
                onChange={(e) => setYears(e.target.value)}
                placeholder="0"
                aria-label="Age in years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="months">Months</Label>
              <Input 
                id="months" 
                type="number" 
                min="0" 
                max="11"
                value={months} 
                onChange={(e) => setMonths(e.target.value)}
                placeholder="0"
                aria-label="Age in months"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Dog Size</Label>
            <Select value={size} onValueChange={(v) => setSize(v as DogSize)}>
              <SelectTrigger id="size" aria-label="Select dog size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (under 20 lbs)</SelectItem>
                <SelectItem value="medium">Medium (21-50 lbs)</SelectItem>
                <SelectItem value="large">Large (51-100 lbs)</SelectItem>
                <SelectItem value="giant">Giant (over 100 lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 bg-muted rounded-lg text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Human Age</p>
            <div className="text-5xl font-bold text-primary tracking-tight">
              {Math.floor(humanAge)}
              <span className="text-xl ml-1 text-muted-foreground font-normal">years</span>
            </div>
            {humanAge > 0 && (
              <Badge variant="outline" className="mt-2">
                {years}y {months}m old {size} dog
              </Badge>
            )}
          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="ghost" size="sm" onClick={handleReset} aria-label="Reset calculator">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
             <Info className="h-3 w-3" />
             Based on AVMA guidelines
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
