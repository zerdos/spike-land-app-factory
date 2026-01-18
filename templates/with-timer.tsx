/**
 * Timer Template
 *
 * A template for countdown timers, stopwatches, and time-based apps.
 * Use this for pomodoro timers, workout timers, meditation timers, etc.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

type TimerMode = "focus" | "break";

interface TimerSettings {
  focusMinutes: number;
  breakMinutes: number;
}

export default function App() {
  const [settings, setSettings] = useState<TimerSettings>({
    focusMinutes: 25,
    breakMinutes: 5,
  });
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(settings.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("timer-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      setTimeLeft(parsed.focusMinutes * 60);
    }

    // Create audio element for notification
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2DgYF7d3R5fn+AgH9+fX18fH1+f4CBgoKCgoKBgH9+fXx7enp6enp7e3x9fn9/gIGBgYGBgYGAgIB/fn59fHx8fH19fn5/f4CAgICAgIB/f35+fX19fX5+fn9/f4CAgICAgIB/f39+fn5+fn5/f39/f4CAgICAgIB/f39/fn5+fn5+f39/f39/gICAgICAgH9/f39/fn5+fn9/f39/f39/gICAgICAf39/f39/fn5/f39/f39/f39/gICAgICAf39/f39/f39/f39/f39/f4CAgICAgIB/f39/f39/f39/f39/f39/gICAgICAf39/f39/f39/f39/f39/f4CAgICAgH9/f39/f39/f39/f39/f39/gICAg==");
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("timer-settings", JSON.stringify(settings));
  }, [settings]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Timer complete
          audioRef.current?.play().catch(() => {});
          handleTimerComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    if (mode === "focus") {
      setSessionsCompleted((s) => s + 1);
      setMode("break");
      setTimeLeft(settings.breakMinutes * 60);
    } else {
      setMode("focus");
      setTimeLeft(settings.focusMinutes * 60);
    }
  }, [mode, settings]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const totalTime = mode === "focus" ? settings.focusMinutes * 60 : settings.breakMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Control handlers
  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? settings.focusMinutes * 60 : settings.breakMinutes * 60);
  };

  const skipPhase = () => {
    setIsRunning(false);
    if (mode === "focus") {
      setMode("break");
      setTimeLeft(settings.breakMinutes * 60);
    } else {
      setMode("focus");
      setTimeLeft(settings.focusMinutes * 60);
    }
  };

  const updateSettings = (key: keyof TimerSettings, value: number) => {
    setSettings((s) => ({ ...s, [key]: value }));
    if (!isRunning) {
      if (key === "focusMinutes" && mode === "focus") {
        setTimeLeft(value * 60);
      } else if (key === "breakMinutes" && mode === "break") {
        setTimeLeft(value * 60);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-4">
        {/* Main Timer Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Focus Timer</CardTitle>
            <CardDescription>
              {sessionsCompleted} sessions completed today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Indicator */}
            <div className="flex justify-center">
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  mode === "focus"
                    ? "bg-primary text-primary-foreground"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                }`}
              >
                {mode === "focus" ? "🎯 Focus Time" : "☕ Break Time"}
              </div>
            </div>

            {/* Timer Display */}
            <div className="relative">
              {/* Progress Ring (simplified as a bar) */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all ${
                    mode === "focus" ? "bg-primary" : "bg-green-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Time Display */}
              <div className="text-center">
                <p className="text-7xl font-mono font-bold tracking-tight">
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button size="icon" variant="outline" onClick={resetTimer}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="lg" onClick={toggleTimer} className="gap-2 px-8">
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
              <Button size="icon" variant="outline" onClick={skipPhase}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="focus" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="focus">Focus</TabsTrigger>
                <TabsTrigger value="break">Break</TabsTrigger>
              </TabsList>
              <TabsContent value="focus" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Focus Duration</span>
                    <span className="font-medium">{settings.focusMinutes} min</span>
                  </div>
                  <Slider
                    value={[settings.focusMinutes]}
                    onValueChange={([value]) => updateSettings("focusMinutes", value)}
                    min={5}
                    max={60}
                    step={5}
                    disabled={isRunning}
                  />
                </div>
              </TabsContent>
              <TabsContent value="break" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Break Duration</span>
                    <span className="font-medium">{settings.breakMinutes} min</span>
                  </div>
                  <Slider
                    value={[settings.breakMinutes]}
                    onValueChange={([value]) => updateSettings("breakMinutes", value)}
                    min={1}
                    max={30}
                    step={1}
                    disabled={isRunning}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
