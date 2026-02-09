import React, { useState, useEffect } from "react";
import { Trash2, Plus, Check, Circle } from "lucide-react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("todos");
      if (saved) {
        setTodos(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load todos:", error);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save todos:", error);
    }
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
        },
      ]);
      setInputValue("");
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">My Todo App</h1>
            <p className="text-orange-100">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>

          {/* Input Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                onClick={addTodo}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="max-h-96 overflow-y-auto">
            {todos.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-lg">No tasks yet!</p>
                <p className="text-sm mt-2">Add your first task above to get started.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="flex-shrink-0 transition-all"
                    >
                      {todo.completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      ) : (
                        <Circle
                          size={24}
                          className="text-gray-300 hover:text-orange-500"
                        />
                      )}
                    </button>

                    <span
                      className={`flex-1 transition-all ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}