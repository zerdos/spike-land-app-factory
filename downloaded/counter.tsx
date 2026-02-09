import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { cn } from "@/lib/utils";

// Add global animations
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceSmall {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-bounce-small {
  animation: bounceSmall 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fadeIn,
  .animate-bounce-small,
  .transition-transform,
  .transition-colors {
    animation: none !important;
    transition: none !important;
  }
}
`;

const Counter = () => {
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);
  const { isDarkMode } = useDarkMode();

  // Add the global styles to the document
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Animation trigger effect
  useEffect(() => {
    if (count !== 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  // Color selection based on count value
  const getCountColor = () => {
    const colorMap = {
      positive: isDarkMode
        ? [
            "text-green-400",
            "text-emerald-400",
            "text-teal-400",
            "text-cyan-400",
            "text-blue-400",
          ]
        : [
            "text-green-600",
            "text-emerald-600",
            "text-teal-600",
            "text-cyan-600",
            "text-blue-600",
          ],
      negative: isDarkMode
        ? [
            "text-red-400",
            "text-rose-400",
            "text-pink-400",
            "text-purple-400",
            "text-violet-400",
          ]
        : [
            "text-red-600",
            "text-rose-600",
            "text-pink-600",
            "text-purple-600",
            "text-violet-600",
          ],
      zero: isDarkMode ? "text-slate-400" : "text-slate-600",
    };

    if (count === 0) return colorMap.zero;
    if (count > 0) {
      const index = Math.min(Math.abs(count) - 1, colorMap.positive.length - 1);
      return colorMap.positive[index];
    } else {
      const index = Math.min(Math.abs(count) - 1, colorMap.negative.length - 1);
      return colorMap.negative[index];
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    setCount(count - 1);
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-screen transition-colors duration-500",
        isDarkMode ? "bg-slate-900" : "bg-slate-100"
      )}
    >
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card
        className={cn(
          "w-full max-w-md backdrop-blur-md border animate-fadeIn",
          isDarkMode
            ? "bg-slate-800/40 border-slate-700 shadow-xl"
            : "bg-white/80 border-slate-200 shadow-md"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle
            className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-slate-800"
            )}
          >
            Counter
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div
            className={cn(
              "text-6xl font-bold transition-colors duration-300 relative",
              getCountColor(),
              animate ? "animate-bounce-small" : ""
            )}
            key={count} // Key changes trigger re-render with animation
          >
            {count}
          </div>
          <div className="flex space-x-4">
            <Button
              size="lg"
              variant="default"
              onClick={incrementCount}
              className={cn(
                "text-xl px-6 transition-transform duration-200 active:scale-95",
                count >= 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  : ""
              )}
            >
              +1
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={decrementCount}
              className={cn(
                "text-xl px-6 transition-transform duration-200 active:scale-95",
                count <= 0
                  ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                  : ""
              )}
            >
              -1
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Counter;
