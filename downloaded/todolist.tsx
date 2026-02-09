import React, { useState } from 'react';
import { Check, Trash2, Plus } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
        },
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const activeTodos = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-emerald-800 mb-2 tracking-tight">
            Todo List
          </h1>
          <p className="text-emerald-600 text-lg">
            {activeTodos} active task{activeTodos !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-emerald-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors duration-200 text-gray-700 placeholder-emerald-300"
            />
            <button
              onClick={addTodo}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-emerald-100">
              <div className="text-emerald-300 mb-3">
                <Check size={64} className="mx-auto opacity-50" />
              </div>
              <p className="text-emerald-600 text-lg">
                No tasks yet. Add one to get started!
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-xl shadow-md p-4 border-2 transition-all duration-300 hover:shadow-lg ${
                  todo.completed
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-transparent hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      todo.completed
                        ? 'bg-emerald-500 border-emerald-500 scale-110'
                        : 'border-emerald-300 hover:border-emerald-500'
                    }`}
                  >
                    {todo.completed && (
                      <Check size={16} className="text-white animate-in zoom-in duration-200" />
                    )}
                  </button>

                  {/* Todo Text */}
                  <span
                    className={`flex-1 text-lg transition-all duration-300 ${
                      todo.completed
                        ? 'text-emerald-600 line-through opacity-60'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {todos.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-emerald-600 text-sm">
              {todos.filter((t) => t.completed).length} of {todos.length} completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}