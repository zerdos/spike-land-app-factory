import { useState } from 'react';

export default function ColorPicker() {
  const [red, setRed] = useState(100);
  const [green, setGreen] = useState(150);
  const [blue, setBlue] = useState(200);

  const rgbToHex = (r, g, b) => {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const currentColor = `rgb(${red}, ${green}, ${blue})`;
  const hexColor = rgbToHex(red, green, blue);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Color Picker
        </h1>

        <div 
          className="w-full h-48 rounded-xl mb-8 shadow-lg transition-all duration-200"
          style={{ backgroundColor: currentColor }}
        />

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">RGB:</span>
            <span className="font-mono text-gray-900">
              {red}, {green}, {blue}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">HEX:</span>
            <span className="font-mono text-gray-900">{hexColor}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-red-600">Red</label>
              <span className="text-sm font-mono text-gray-700">{red}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={red}
              onChange={(e) => setRed(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-green-600">Green</label>
              <span className="text-sm font-mono text-gray-700">{green}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={green}
              onChange={(e) => setGreen(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-blue-600">Blue</label>
              <span className="text-sm font-mono text-gray-700">{blue}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={blue}
              onChange={(e) => setBlue(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(hexColor)}
          className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          Copy HEX Color
        </button>
      </div>
    </div>
  );
}