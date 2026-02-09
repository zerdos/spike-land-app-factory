import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', padding: '2rem' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
            📝 Todo List
          </h1>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', outline: 'none' }}
            />
            <button
              onClick={addTodo}
              style={{ background: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem 0' }}>
                No tasks yet. Add one above to get started! 🚀
              </p>
            ) : (
              todos.map(todo => (
                <div
                  key={todo.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    border: `2px solid ${todo.completed ? '#e5e7eb' : '#c7d2fe'}`,
                    background: todo.completed ? '#f9fafb' : 'white'
                  }}
                >
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    style={{ 
                      width: '1.5rem', 
                      height: '1.5rem', 
                      borderRadius: '50%', 
                      border: `2px solid ${todo.completed ? '#22c55e' : '#d1d5db'}`,
                      background: todo.completed ? '#22c55e' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                  >
                    {todo.completed && '✓'}
                  </button>

                  <span
                    style={{ 
                      flex: 1, 
                      fontSize: '1.125rem',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#9ca3af' : '#1f2937'
                    }}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{ 
                      color: '#ef4444', 
                      background: 'transparent',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '1.25rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {todos.length > 0 && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
              <span>{todos.filter(t => !t.completed).length} active tasks</span>
              <span>{todos.filter(t => t.completed).length} completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}