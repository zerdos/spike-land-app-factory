import React, { useState } from 'react';

export default function PuppyAgeCalculator() {
  const [puppyAge, setPuppyAge] = useState('');
  const [humanAge, setHumanAge] = useState(null);

  const calculateHumanAge = () => {
    const age = parseFloat(puppyAge);
    if (isNaN(age) || age < 0) {
      setHumanAge(null);
      return;
    }
    
    // Puppy age calculation (common formula):
    // First year = 15 human years
    // Second year = 9 human years
    // Each year after = 5 human years
    let human;
    if (age <= 1) {
      human = age * 15;
    } else if (age <= 2) {
      human = 15 + (age - 1) * 9;
    } else {
      human = 15 + 9 + (age - 2) * 5;
    }
    
    setHumanAge(Math.round(human));
  };

  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🐶 Pixie</h1>
          <p className="text-gray-600">Puppy Age Calculator</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="puppyAge" className="block text-sm font-medium text-gray-700 mb-2">
              How old is your puppy? (in years)
            </label>
            <input
              id="puppyAge"
              type="number"
              step="0.1"
              min="0"
              value={puppyAge}
              onChange={(e) => setPuppyAge(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && calculateHumanAge()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
              placeholder="e.g., 1.5"
            />
          </div>

          <button
            onClick={calculateHumanAge}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Calculate Human Age
          </button>

          {humanAge !== null && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center animate-fadeIn">
              <p className="text-gray-700 mb-2">Your puppy is approximately</p>
              <p className="text-5xl font-bold text-red-600 mb-2">{humanAge}</p>
              <p className="text-gray-700">years old in human years! 🎉</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Formula:</strong><br />
              1st year = 15 human years<br />
              2nd year = 9 human years<br />
              Each year after = 5 human years
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}