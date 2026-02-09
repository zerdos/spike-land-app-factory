import React, { useState } from "react";
import { Calculator, Triangle, Ruler, Info, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [problemType, setProblemType] = useState("pythagorean");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [inputs, setInputs] = useState({
    a: 3,
    b: 4,
    c: 5,
    angle1: 60,
    angle2: 60,
    angle3: 60,
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const calculate = () => {
    const a = parseFloat(inputs.a);
    const b = parseFloat(inputs.b);
    const c = parseFloat(inputs.c);
    const angle1 = parseFloat(inputs.angle1);
    const angle2 = parseFloat(inputs.angle2);
    const angle3 = parseFloat(inputs.angle3);

    let calculationResult = null;

    switch (problemType) {
      case "pythagorean":
        if (!isNaN(a) && !isNaN(b)) {
          const hypotenuse = Math.sqrt(a * a + b * b);
          calculationResult = {
            title: "Pythagorean Theorem Result",
            value: `c = ${hypotenuse.toFixed(2)}`,
            formula: "c² = a² + b²",
            explanation: `Using sides a=${a} and b=${b}, the hypotenuse c = √(${a}² + ${b}²) = ${hypotenuse.toFixed(2)}`,
          };
        } else if (!isNaN(a) && !isNaN(c)) {
          const side = Math.sqrt(c * c - a * a);
          calculationResult = {
            title: "Pythagorean Theorem Result",
            value: `b = ${side.toFixed(2)}`,
            formula: "b² = c² - a²",
            explanation: `Using side a=${a} and hypotenuse c=${c}, the side b = √(${c}² - ${a}²) = ${side.toFixed(2)}`,
          };
        } else if (!isNaN(b) && !isNaN(c)) {
          const side = Math.sqrt(c * c - b * b);
          calculationResult = {
            title: "Pythagorean Theorem Result",
            value: `a = ${side.toFixed(2)}`,
            formula: "a² = c² - b²",
            explanation: `Using side b=${b} and hypotenuse c=${c}, the side a = √(${c}² - ${b}²) = ${side.toFixed(2)}`,
          };
        }
        break;

      case "area":
        if (!isNaN(a) && !isNaN(b)) {
          const area = (a * b) / 2;
          calculationResult = {
            title: "Triangle Area",
            value: `Area = ${area.toFixed(2)} square units`,
            formula: "Area = (base × height) / 2",
            explanation: `With base=${a} and height=${b}, Area = (${a} × ${b}) / 2 = ${area.toFixed(2)}`,
          };
        } else if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
          // Heron's formula
          const s = (a + b + c) / 2;
          const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          calculationResult = {
            title: "Triangle Area (Heron's Formula)",
            value: `Area = ${area.toFixed(2)} square units`,
            formula: "Area = √[s(s-a)(s-b)(s-c)]",
            explanation: `With sides a=${a}, b=${b}, c=${c}, semi-perimeter s=${s.toFixed(2)}, Area = ${area.toFixed(2)}`,
          };
        }
        break;

      case "angles":
        if (!isNaN(angle1) && !isNaN(angle2)) {
          const missing = 180 - angle1 - angle2;
          calculationResult = {
            title: "Missing Angle",
            value: `Angle 3 = ${missing.toFixed(2)}°`,
            formula: "Sum of angles = 180°",
            explanation: `In a triangle, all angles sum to 180°. With angles ${angle1}° and ${angle2}°, the third angle = 180° - ${angle1}° - ${angle2}° = ${missing.toFixed(2)}°`,
          };
        } else if (!isNaN(angle1)) {
          calculationResult = {
            title: "Remaining Angles",
            value: `Sum of other two angles = ${(180 - angle1).toFixed(2)}°`,
            formula: "Sum of angles = 180°",
            explanation: `With one angle = ${angle1}°, the sum of the other two angles = 180° - ${angle1}° = ${(180 - angle1).toFixed(2)}°`,
          };
        }
        break;

      case "perimeter":
        if (!isNaN(a) && !isNaN(b) && !isNaN(c)) {
          const perimeter = a + b + c;
          calculationResult = {
            title: "Triangle Perimeter",
            value: `Perimeter = ${perimeter.toFixed(2)} units`,
            formula: "Perimeter = a + b + c",
            explanation: `Sum of all sides: ${a} + ${b} + ${c} = ${perimeter.toFixed(2)}`,
          };
        }
        break;
    }

    setResult(calculationResult);
  };

  const resetInputs = () => {
    setInputs({
      a: 3,
      b: 4,
      c: 5,
      angle1: 60,
      angle2: 60,
      angle3: 60,
    });
    setResult(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900" 
        : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
    } p-6`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-8 relative"
        >
          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              localStorage.setItem('darkMode', JSON.stringify(newMode));
            }}
            className={`absolute right-0 top-0 p-3 rounded-full ${
              darkMode ? "bg-yellow-400 text-gray-900" : "bg-indigo-600 text-white"
            } shadow-lg transition-all duration-300`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </motion.button>

          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Triangle className={`w-12 h-12 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
            </motion.div>
            <h1 className={`text-5xl font-bold bg-gradient-to-r ${
              darkMode 
                ? "from-purple-400 to-pink-400" 
                : "from-purple-600 to-pink-600"
            } bg-clip-text text-transparent`}>
              Triangle Solver
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Solve all your triangle math problems with ease
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Panel - Problem Type Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl shadow-xl p-6 border-2 ${
              darkMode 
                ? "bg-gray-800 border-purple-500" 
                : "bg-white border-purple-200"
            }`}
          >
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}>
              <Calculator className={`w-6 h-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              Select Problem Type
            </h2>

            <div className="space-y-3">
              {[
                {
                  id: "pythagorean",
                  label: "Pythagorean Theorem",
                  desc: "Find missing side of right triangle",
                },
                {
                  id: "area",
                  label: "Triangle Area",
                  desc: "Calculate area from sides or base & height",
                },
                {
                  id: "angles",
                  label: "Angle Calculator",
                  desc: "Find missing angles (sum = 180°)",
                },
                {
                  id: "perimeter",
                  label: "Perimeter",
                  desc: "Calculate total length of all sides",
                },
              ].map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setProblemType(type.id);
                    resetInputs();
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    problemType === type.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="font-semibold text-lg">{type.label}</div>
                  <div
                    className={`text-sm ${
                      problemType === type.id
                        ? "text-purple-100"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {type.desc}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`mt-6 border-2 rounded-xl p-4 ${
                darkMode
                  ? "bg-blue-900 border-blue-600"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`} />
                <div className={`text-sm ${darkMode ? "text-blue-200" : "text-blue-900"}`}>
                  {problemType === "pythagorean" && (
                    <span>
                      Enter any two sides of a right triangle to find the third.
                      Use 'a' and 'b' for legs, 'c' for hypotenuse.
                    </span>
                  )}
                  {problemType === "area" && (
                    <span>
                      Enter base & height (a, b), or all three sides (a, b, c)
                      for Heron's formula.
                    </span>
                  )}
                  {problemType === "angles" && (
                    <span>
                      Enter one or two angles to find the remaining angle(s).
                      All angles must sum to 180°.
                    </span>
                  )}
                  {problemType === "perimeter" && (
                    <span>
                      Enter all three sides (a, b, c) to calculate the
                      perimeter.
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Input & Results */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-2xl shadow-xl p-6 border-2 ${
              darkMode 
                ? "bg-gray-800 border-purple-500" 
                : "bg-white border-purple-200"
            }`}
          >
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}>
              <Ruler className={`w-6 h-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
              Enter Values
            </h2>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              {problemType !== "angles" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Side a: {inputs.a}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.1"
                      value={inputs.a}
                      onChange={(e) => handleInputChange("a", e.target.value)}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={inputs.a}
                      onChange={(e) => handleInputChange("a", e.target.value)}
                      placeholder="Enter side a"
                      className={`w-full mt-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-400"
                          : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                      }`}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Side b: {inputs.b}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.1"
                      value={inputs.b}
                      onChange={(e) => handleInputChange("b", e.target.value)}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={inputs.b}
                      onChange={(e) => handleInputChange("b", e.target.value)}
                      placeholder="Enter side b"
                      className={`w-full mt-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-400"
                          : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                      }`}
                    />
                  </motion.div>
                  {(problemType === "area" || problemType === "perimeter") && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Side c: {inputs.c}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="0.1"
                        value={inputs.c}
                        onChange={(e) => handleInputChange("c", e.target.value)}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <input
                        type="number"
                        value={inputs.c}
                        onChange={(e) => handleInputChange("c", e.target.value)}
                        placeholder="Enter side c"
                        className={`w-full mt-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-400"
                            : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                        }`}
                      />
                    </motion.div>
                  )}
                  {problemType === "pythagorean" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Hypotenuse c (optional): {inputs.c}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="0.1"
                        value={inputs.c}
                        onChange={(e) => handleInputChange("c", e.target.value)}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <input
                        type="number"
                        value={inputs.c}
                        onChange={(e) => handleInputChange("c", e.target.value)}
                        placeholder="Enter hypotenuse c"
                        className={`w-full mt-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-400"
                            : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                        }`}
                      />
                    </motion.div>
                  )}
                </>
              )}

              {problemType === "angles" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Angle 1 (degrees): {inputs.angle1}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="1"
                      value={inputs.angle1}
                      onChange={(e) =>
                        handleInputChange("angle1", e.target.value)
                      }
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={inputs.angle1}
                      onChange={(e) =>
                        handleInputChange("angle1", e.target.value)
                      }
                      placeholder="Enter angle 1"
                      className={`w-full mt-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-400"
                          : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                      }`}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className={`block text-sm font-semibold mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Angle 2 (degrees, optional): {inputs.angle2}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="1"
                      value={inputs.angle2}
                      onChange={(e) =>
                        handleInputChange("angle2", e.target.value)
                      }
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={inputs.angle2}
                      onChange={(e) =>
                        handleInputChange("angle2", e.target.value)
                      }
                      placeholder="Enter angle 2"
                      className={`w-full mt-2 px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-purple-400"
                          : "bg-white border-gray-300 text-gray-900 focus:border-purple-500"
                      }`}
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={calculate}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                Calculate
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetInputs}
                className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Clear
              </motion.button>
            </div>

            {/* Result */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={`border-2 rounded-xl p-6 ${
                    darkMode
                      ? "bg-gradient-to-br from-green-900 to-emerald-900 border-green-500"
                      : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
                  }`}
                >
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-green-300" : "text-green-800"
                    }`}
                  >
                    {result.title}
                  </motion.h3>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`text-3xl font-bold mb-3 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {result.value}
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-sm font-mono px-3 py-2 rounded border mb-2 ${
                      darkMode
                        ? "bg-gray-800 border-green-600 text-green-300"
                        : "bg-white border-green-200 text-gray-900"
                    }`}
                  >
                    {result.formula}
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {result.explanation}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Visual Triangle Representation */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`mt-8 rounded-2xl shadow-xl p-8 border-2 ${
            darkMode 
              ? "bg-gray-800 border-purple-500" 
              : "bg-white border-purple-200"
          }`}
        >
          <h3 className={`text-2xl font-bold mb-6 text-center ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}>
            Triangle Visualization
          </h3>
          <div className="flex justify-center items-center">
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              width="400"
              height="300"
              viewBox="0 0 400 300"
              className={`border-2 rounded-lg ${
                darkMode
                  ? "border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800"
                  : "border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50"
              }`}
            >
              {/* Triangle */}
              <motion.polygon
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.7 }}
                points="200,50 100,250 300,250"
                fill={darkMode ? "rgba(168, 85, 247, 0.3)" : "rgba(168, 85, 247, 0.2)"}
                stroke={darkMode ? "#a855f7" : "#9333ea"}
                strokeWidth="3"
              />
              
              {/* Labels */}
              <motion.text 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                x="200" 
                y="40" 
                textAnchor="middle" 
                fill={darkMode ? "#c084fc" : "#7c3aed"} 
                fontWeight="bold" 
                fontSize="16"
              >
                A
              </motion.text>
              <motion.text 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 }}
                x="90" 
                y="260" 
                textAnchor="middle" 
                fill={darkMode ? "#c084fc" : "#7c3aed"} 
                fontWeight="bold" 
                fontSize="16"
              >
                B
              </motion.text>
              <motion.text 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                x="310" 
                y="260" 
                textAnchor="middle" 
                fill={darkMode ? "#c084fc" : "#7c3aed"} 
                fontWeight="bold" 
                fontSize="16"
              >
                C
              </motion.text>
              
              {/* Side labels */}
              <motion.text 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                x="150" 
                y="160" 
                textAnchor="middle" 
                fill={darkMode ? "#f472b6" : "#db2777"} 
                fontWeight="600" 
                fontSize="14"
              >
                side b
              </motion.text>
              <motion.text 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                x="250" 
                y="160" 
                textAnchor="middle" 
                fill={darkMode ? "#f472b6" : "#db2777"} 
                fontWeight="600" 
                fontSize="14"
              >
                side a
              </motion.text>
              <motion.text 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                x="200" 
                y="270" 
                textAnchor="middle" 
                fill={darkMode ? "#f472b6" : "#db2777"} 
                fontWeight="600" 
                fontSize="14"
              >
                side c
              </motion.text>
            </motion.svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}