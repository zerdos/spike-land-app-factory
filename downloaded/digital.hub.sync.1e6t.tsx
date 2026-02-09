import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check, Circle } from "lucide-react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
      }
    }
  }, []);

  // Sync todos across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "todos" && e.newValue) {
        try {
          setTodos(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync todos", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([newTodo, ...todos]);
      setInput("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
          <p className="text-indigo-100">
            {activeTodos} active · {completedTodos} completed
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={addTodo} className="p-6 border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="max-h-96 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Circle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent"
                          : "border-gray-300 hover:border-purple-500"
                      }`}
                    >
                      {todo.completed && <Check size={16} className="text-white" />}
                    </button>
                    <span
                      className={`flex-1 transition-all duration-200 ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {completedTodos > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-600 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              Clear {completedTodos} completed task{completedTodos !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}