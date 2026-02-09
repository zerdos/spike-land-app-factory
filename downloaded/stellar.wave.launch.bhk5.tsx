import React, { useState } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Sparkles className="w-16 h-16 text-purple-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800">
            Hello, World! 🚀
          </h1>
          
          <p className="text-gray-600">
            Welcome to your React playground
          </p>

          <div className="space-y-4">
            <div className="bg-purple-100 rounded-xl p-6">
              <p className="text-2xl font-semibold text-purple-700">
                Counter: {count}
              </p>
              <div className="flex gap-3 mt-4 justify-center">
                <button
                  onClick={() => setCount(count + 1)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Increment
                </button>
                <button
                  onClick={() => setCount(0)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <button
              onClick={() => setLiked(!liked)}
              className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                liked
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Heart
                className={`inline-block w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`}
              />
              {liked ? 'Liked!' : 'Like this app'}
            </button>
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
}