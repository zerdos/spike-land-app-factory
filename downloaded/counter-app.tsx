import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-12 space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Counter App
        </h1>
        
        <div className="text-center">
          <div className="text-8xl font-bold text-indigo-600 mb-8">
            {count}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={decrement}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            −
          </button>
          
          <button
            onClick={increment}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}