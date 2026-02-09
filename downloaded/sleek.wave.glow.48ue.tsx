import React, { useState } from "react";
import { Plus, Trash2, Check, Circle, CheckCircle2, ListTodo, Target } from "lucide-react";

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Welcome to your todo app!", completed: false },
    { id: 2, text: "Click the circle to complete a task", completed: false },
    { id: 3, text: "Click the trash to delete", completed: true }
  ]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-red-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            My Tasks
          </h1>
          <p className="text-gray-300 text-lg">
            {activeTodos} {activeTodos === 1 ? 'task' : 'tasks'} remaining
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <ListTodo className="text-blue-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{todos.length}</div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="text-green-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{completedTodos}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Target className="text-purple-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <div className="text-sm text-gray-400">Complete</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-lg"
            />
            <button
              onClick={addTodo}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 font-semibold shadow-lg"
            >
              <Plus size={24} />
              Add
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No tasks yet!</p>
              <p className="text-sm mt-2">Add your first task above to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-700/50 transition-colors group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 transition-all transform hover:scale-110 active:scale-95"
                  >
                    {todo.completed ? (
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <Circle size={24} className="text-gray-500 hover:text-purple-400" />
                    )}
                  </button>
                  
                  <span
                    className={`flex-1 text-lg transition-all ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-200"
                    }`}
                  >
                    {todo.text}
                  </span>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-gray-500 hover:text-red-400 transition-all transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="mt-6 text-center text-gray-400 text-sm">
            {completedTodos} of {todos.length} tasks completed
          </div>
        )}
      </div>
    </div>
  );
}