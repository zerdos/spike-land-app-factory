import React, { useState } from 'react';

export default function App() {
  const [r, setR] = useState(128);
  const [g, setG] = useState(128);
  const [b, setB] = useState(128);

  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Color Picker</h1>
        
        <div 
          className="w-full h-40 rounded-lg mb-6 border-4 border-gray-200"
          style={{ backgroundColor: hex }}
        />
        
        <div className="bg-gray-100 rounded p-3 mb-6 text-center">
          <p className="text-xl font-mono font-bold">{hex}</p>
          <p className="text-sm text-gray-600">RGB({r}, {g}, {b})</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-red-600">Red</label>
              <span className="font-mono text-sm">{r}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-green-600">Green</label>
              <span className="font-mono text-sm">{g}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={g}
              onChange={(e) => setG(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-blue-600">Blue</label>
              <span className="font-mono text-sm">{b}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <button
          onClick={() => navigator.clipboard.writeText(hex)}
          className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold"
        >
          Copy Hex Code
        </button>
      </div>
    </div>
  );
}