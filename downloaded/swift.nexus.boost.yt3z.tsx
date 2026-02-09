import React, { useState } from "react";
import { Check, Trash2, Plus, Circle } from "lucide-react";

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Build an amazing todo app", completed: false },
    { id: 2, text: "Learn React hooks", completed: true },
    { id: 3, text: "Buy groceries for the week", completed: false },
    { id: 4, text: "Call mom on Sunday", completed: false },
    { id: 5, text: "Finish reading 'The Great Gatsby'", completed: false },
    { id: 6, text: "Go to the gym", completed: true },
    { id: 7, text: "Water the plants", completed: false },
    { id: 8, text: "Schedule dentist appointment", completed: false },
    { id: 9, text: "Learn TypeScript", completed: false },
    { id: 10, text: "Organize desk workspace", completed: true },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInputValue("");
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

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 py-8 px-4 flex items-center">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h1 className="text-3xl font-bold text-white text-center">
              My Todo List
            </h1>
            <p className="text-blue-100 text-center mt-2">
              {activeTodos} {activeTodos === 1 ? "task" : "tasks"} remaining
            </p>
          </div>

          {/* Input Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addTodo}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="p-6">
            {todos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tasks yet!</p>
                <p className="text-sm mt-2">Add a task to get started</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="flex-shrink-0"
                    >
                      {todo.completed ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      ) : (
                        <Circle
                          size={24}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        />
                      )}
                    </button>
                    
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-100"
                      }`}
                    >
                      {todo.text}
                    </span>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-gray-400">
          <p className="text-sm">
            Total: {todos.length} | Completed: {todos.length - activeTodos} | Active: {activeTodos}
          </p>
        </div>
      </div>
    </div>
  );
}