import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Delete, Divide, Minus, Plus, X } from "lucide-react";

export default function App() {
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplayValue(num);
      setWaitingForNewValue(false);
    } else {
      setDisplayValue(displayValue === "0" ? num : displayValue + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplayValue("0.");
      setWaitingForNewValue(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const handleOperator = (nextOperator: string) => {
    const value = parseFloat(displayValue);

    if (operator && waitingForNewValue) {
      setOperator(nextOperator);
      return;
    }

    if (displayValue === "Error") {
       setDisplayValue("Error");
       setPreviousValue(null);
       setOperator(null);
       setWaitingForNewValue(true);
       return;
    }

    if (previousValue === null) {
      setPreviousValue(displayValue);
    } else if (operator) {
      const prev = parseFloat(previousValue);
      const val = parseFloat(displayValue);
      // Handle chaining with Error state
      if (isNaN(prev) || isNaN(val)) {
         setDisplayValue("Error");
         setPreviousValue(null);
         setOperator(null);
         return;
      }

      const result = calculate(prev, val, operator);
      setDisplayValue(String(result));
      setPreviousValue(String(result));
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, current: number, op: string): number | string => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "*":
        return prev * current;
      case "/":
        if (current === 0) return "Error";
        return prev / current;
      default:
        return current;
    }
  };

  const handleEqual = () => {
    if (!operator || previousValue === null) return;

    const value = parseFloat(displayValue);
    const result = calculate(parseFloat(previousValue), value, operator);

    setDisplayValue(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplayValue("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (waitingForNewValue) return;
    if (displayValue.length === 1 || displayValue === "Error") {
      setDisplayValue("0");
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary p-4 rounded-lg mb-4 text-right text-3xl font-mono truncate h-16 flex items-center justify-end" aria-label="Display">
            {displayValue}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={handleClear} className="col-span-2">AC</Button>
            <Button variant="outline" onClick={handleBackspace} aria-label="Backspace"><Delete className="h-4 w-4" /></Button>
            <Button variant="secondary" onClick={() => handleOperator("/")} aria-label="Divide"><Divide className="h-4 w-4" /></Button>

            <Button variant="outline" onClick={() => handleNumber("7")}>7</Button>
            <Button variant="outline" onClick={() => handleNumber("8")}>8</Button>
            <Button variant="outline" onClick={() => handleNumber("9")}>9</Button>
            <Button variant="secondary" onClick={() => handleOperator("*")} aria-label="Multiply"><X className="h-4 w-4" /></Button>

            <Button variant="outline" onClick={() => handleNumber("4")}>4</Button>
            <Button variant="outline" onClick={() => handleNumber("5")}>5</Button>
            <Button variant="outline" onClick={() => handleNumber("6")}>6</Button>
            <Button variant="secondary" onClick={() => handleOperator("-")} aria-label="Subtract"><Minus className="h-4 w-4" /></Button>

            <Button variant="outline" onClick={() => handleNumber("1")}>1</Button>
            <Button variant="outline" onClick={() => handleNumber("2")}>2</Button>
            <Button variant="outline" onClick={() => handleNumber("3")}>3</Button>
            <Button variant="secondary" onClick={() => handleOperator("+")} aria-label="Add"><Plus className="h-4 w-4" /></Button>

            <Button variant="outline" onClick={() => handleNumber("0")} className="col-span-2">0</Button>
            <Button variant="outline" onClick={handleDecimal}>.</Button>
            <Button onClick={handleEqual} aria-label="Equals">=</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
