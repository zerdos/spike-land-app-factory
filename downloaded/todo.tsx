// todo.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Moon as MoonIcon,
  Sun as SunIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  tags: string[];
}

const TodoList: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [tagInput, setTagInput] = useState("yo, hey");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filterTag, setFilterTag] = useState<string>("");

  const loadTodos = useCallback(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    loadTodos();
    window.addEventListener("storage", loadTodos);
    return () => {
      window.removeEventListener("storage", loadTodos);
    };
  }, [loadTodos]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        tags: tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputValue("");
      setTagInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setInputValue(todo.text);
    setTagInput(todo.tags.join(", "));
  };

  const saveEdit = () => {
    if (editingTodo) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editingTodo.id
            ? {
                ...todo,
                text: inputValue,
                tags: tagInput
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== ""),
              }
            : todo
        )
      );
      setEditingTodo(null);
      setInputValue("");
      setTagInput("");
    }
  };

  const allTags = Array.from(new Set(todos.flatMap((todo) => todo.tags)));

  const filteredTodos = filterTag
    ? todos.filter((todo) => todo.tags.includes(filterTag))
    : todos;

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center min-h-screen  p-8 transition-all duration-500",
        isDarkMode
          ? "bg-gradient-to-br from-orange-900 via-amber-800 to-red-900 bg-animate"
          : "bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 bg-animate"
      )}
    >
      <Card
        className={cn(
          "w-full max-w-md p-6 rounded-xl border-2 transition-all duration-300",
          isDarkMode
            ? "bg-gray-800/90 text-white shadow-xl shadow-orange-600/30 border-orange-700"
            : "bg-white/90 text-gray-900 shadow-xl shadow-orange-400/30 border-orange-300"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 animate-gradient-x">
            My Todo App
          </h2>
          <ThemeToggle />
        </div>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="new-todo"
              className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500"
            >
              Add a new todo
            </Label>
            <div className="flex mt-1">
              <Input
                id="new-todo"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className={cn(
                  "border-2 focus:ring-2 focus:ring-purple-400 transition-all duration-300",
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                )}
                placeholder="What needs to be done?"
              />
              <Button
                onClick={addTodo}
                className="ml-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold shadow-md shadow-pink-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div>
            <Label
              htmlFor="tags"
              className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className={cn(
                "mt-1 border-2 focus:ring-2 focus:ring-purple-400 transition-all duration-300",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}
              placeholder="work, personal, urgent"
            />
          </div>
          <div>
            <Label
              htmlFor="filter"
              className="font-medium text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Filter by tag
            </Label>
            <Input
              id="filter"
              list="tag-options"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              placeholder="Select or type a tag"
              className={cn(
                "mt-1 border-2 focus:ring-2 focus:ring-purple-400 transition-all duration-300",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}
            />
            <datalist id="tag-options">
              <option value="">All</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <ul className="mt-6 space-y-3">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={cn(
                "flex items-center space-x-2 p-3 rounded-lg transition-all duration-300",
                isDarkMode
                  ? todo.completed
                    ? "bg-gray-700/50 border-l-4 border-green-500"
                    : "bg-gray-700/30 border-l-4 border-blue-500 hover:bg-gray-700/50"
                  : todo.completed
                    ? "bg-gray-100 border-l-4 border-green-400"
                    : "bg-gray-50 border-l-4 border-blue-400 hover:bg-gray-100"
              )}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className={cn(
                  todo.completed ? "border-green-500" : "border-blue-500"
                )}
              />
              <span
                className={cn(
                  "flex-grow font-medium",
                  todo.completed
                    ? "line-through text-gray-400"
                    : isDarkMode
                      ? "text-white"
                      : "text-gray-800"
                )}
              >
                {todo.text}
              </span>
              <div className="flex space-x-1">
                {todo.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium px-2 py-1 shadow-sm animate-pulse-slow"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => editTodo(todo)}
                className={cn(
                  "border-2 transition-colors duration-200",
                  isDarkMode
                    ? "hover:bg-blue-600 hover:border-blue-500"
                    : "hover:bg-blue-200 hover:border-blue-400"
                )}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className={cn(
                  "border-2 transition-colors duration-200",
                  isDarkMode
                    ? "hover:bg-pink-600 hover:border-pink-500"
                    : "hover:bg-pink-200 hover:border-pink-400"
                )}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent
          className={cn(
            "border-2 rounded-xl",
            isDarkMode
              ? "bg-gray-800 border-purple-700"
              : "bg-white border-purple-300"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Edit Todo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-todo" className="font-medium">
                Todo text
              </Label>
              <Input
                id="edit-todo"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={cn(
                  "mt-1 border-2",
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                )}
              />
            </div>
            <div>
              <Label htmlFor="edit-tags" className="font-medium">
                Tags (comma-separated)
              </Label>
              <Input
                id="edit-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className={cn(
                  "mt-1 border-2",
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                )}
              />
            </div>
            <Button
              onClick={saveEdit}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold shadow-md shadow-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
