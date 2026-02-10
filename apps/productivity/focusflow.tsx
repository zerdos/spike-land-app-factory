import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Circle, ListTodo, Sparkles, Target, Undo2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';

const CATEGORIES = [
  { name: 'Work', emoji: '\u{1F4BC}' },
  { name: 'Personal', emoji: '\u{1F3E0}' },
  { name: 'Shopping', emoji: '\u{1F6D2}' },
  { name: 'Health', emoji: '\u{1F4AA}' },
];

const STORAGE_KEY = 'focusflow-tasks';

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    { id: 1, text: 'Design new landing page', category: 'Work', completed: false },
    { id: 2, text: 'Morning workout', category: 'Health', completed: true },
    { id: 3, text: 'Buy groceries for the week', category: 'Shopping', completed: false },
  ];
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('Work');
  const [filter, setFilter] = useState('all');
  const [lastDeleted, setLastDeleted] = useState<{ id: number; text: string; category: string; completed: boolean } | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, progress };
  }, [tasks]);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const addTask = (e: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      category: activeCategory,
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setInput('');
    toast.success('Task added');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) setLastDeleted(task);
    setTasks(tasks.filter(t => t.id !== id));
    toast.info('Task removed', {
      action: {
        label: 'Undo',
        onClick: () => {
          if (task) {
            setTasks(prev => [task, ...prev]);
            setLastDeleted(null);
            toast.success('Task restored');
          }
        },
      },
    });
  };

  const getCategoryEmoji = (name: string) => {
    return CATEGORIES.find(c => c.name === name)?.emoji || '';
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center" style={{ background: 'transparent' }}>
      {/* Subtle dot pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Toaster position="top-center" richColors />

      <Card className="w-full max-w-xl border-border/40 shadow-2xl shadow-black/10 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
        {/* Decorative top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />

        <CardHeader className="pb-4 pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-xl border border-violet-500/10">
                <Target className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-2xl tracking-tight font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">FocusFlow</CardTitle>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase mt-0.5">Stay productive</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1.5" />
                {stats.completed}/{stats.total}
              </Badge>
            </div>
          </div>
          <div className="space-y-2 bg-muted/10 rounded-xl p-3 border border-border/20">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Daily Progress</span>
              <span className={cn(
                "tabular-nums",
                stats.progress === 100 ? "text-emerald-400" : "text-foreground/80"
              )}>{stats.progress}%</span>
            </div>
            <div className="relative">
              <Progress value={stats.progress} className="h-2 bg-muted/20" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={addTask} className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-muted/10 border-border/30 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 h-11 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="h-11 w-11 bg-gradient-to-br from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 shadow-lg shadow-violet-500/20 disabled:shadow-none disabled:opacity-40"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <Badge
                  key={cat.name}
                  variant={activeCategory === cat.name ? 'default' : 'secondary'}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105 px-3 py-1.5 text-xs",
                    activeCategory === cat.name
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 border-0 shadow-md shadow-violet-500/20"
                      : "bg-muted/10 border-border/30 hover:bg-muted/20"
                  )}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <span className="mr-1">{cat.emoji}</span> {cat.name}
                </Badge>
              ))}
            </div>
          </form>

          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/10 border border-border/20 p-1 h-auto">
              <TabsTrigger value="all" className="text-xs py-2 data-[state=active]:bg-background/60 data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="active" className="text-xs py-2 data-[state=active]:bg-background/60 data-[state=active]:shadow-sm">Active</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs py-2 data-[state=active]:bg-background/60 data-[state=active]:shadow-sm">Done</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2 min-h-[280px]">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200",
                      task.completed
                        ? "bg-muted/5 border-border/10 opacity-60"
                        : "bg-muted/10 border-border/20 hover:border-violet-500/20 hover:bg-muted/15 hover:shadow-lg hover:shadow-violet-500/5"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          task.completed
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 shadow-sm shadow-emerald-500/30"
                            : "border-border/50 hover:border-violet-500/50 hover:bg-violet-500/5"
                        )}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </button>
                      <div className="flex flex-col min-w-0">
                        <span className={cn(
                          "text-sm font-medium transition-all truncate",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.text}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-bold mt-0.5">
                          {getCategoryEmoji(task.category)} {task.category}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-destructive/70 hover:text-destructive hover:bg-destructive/10 h-8 w-8 flex-shrink-0"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="bg-muted/10 p-5 rounded-2xl border border-border/10 mb-4">
                    <ListTodo className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-muted-foreground font-semibold text-sm">No tasks found</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Time to relax or add a new goal!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>

        <Separator className="opacity-20" />

        <CardFooter className="py-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground/70">
            {tasks.filter(t => !t.completed).length} items remaining
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground/70 hover:text-destructive/80 h-auto py-1 px-2"
            onClick={() => {
              const completed = tasks.filter(t => t.completed);
              if (completed.length > 0) {
                setTasks(tasks.filter(t => !t.completed));
                toast.info(`Cleared ${completed.length} completed task${completed.length > 1 ? 's' : ''}`, {
                  action: {
                    label: 'Undo',
                    onClick: () => {
                      setTasks(prev => [...prev, ...completed]);
                      toast.success('Tasks restored');
                    },
                  },
                });
              }
            }}
          >
            Clear Completed
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
