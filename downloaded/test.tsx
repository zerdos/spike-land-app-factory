import { useDarkMode } from "@/hooks/use-dark-mode";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function TestPage() {
  const { isDarkMode } = useDarkMode();
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-500",
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      )}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="space-y-6">
          <div
            className={cn(
              "inline-block p-4 rounded-full mb-6 transition-all duration-300",
              isDarkMode
                ? "bg-purple-800/30 border border-purple-600/50"
                : "bg-white/80 border border-indigo-200 shadow-lg"
            )}
          >
            <div className="text-6xl">🚀</div>
          </div>

          <h1
            className={cn(
              "text-5xl md:text-7xl font-bold mb-6 transition-all duration-300",
              isDarkMode
                ? "bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            )}
          >
            Welcome to the Test Zone
          </h1>

          <p
            className={cn(
              "text-xl md:text-2xl mb-8 leading-relaxed",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}
          >
            This is your playground for creativity and experimentation.
            <br />
            Edit, customize, and share with the world!
          </p>
        </div>

        {/* Interactive Section */}
        <div className="space-y-6">
          <button
            onClick={handleClick}
            className={cn(
              "px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
              isDarkMode
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25"
            )}
          >
            Click me! ({clickCount})
          </button>

          {clickCount > 0 && (
            <div
              className={cn(
                "p-6 rounded-2xl transition-all duration-500 transform animate-in fade-in slide-in-from-bottom-4",
                isDarkMode
                  ? "bg-white/10 backdrop-blur-sm border border-white/20"
                  : "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl"
              )}
            >
              <p className="text-lg">
                🎉 You've clicked {clickCount} time{clickCount !== 1 ? "s" : ""}
                !{clickCount >= 10 && " You're on fire! 🔥"}
                {clickCount >= 25 && " Unstoppable! ⚡"}
              </p>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: "✨",
              title: "Beautiful Design",
              desc: "Modern and responsive",
            },
            { icon: "🌙", title: "Dark Mode", desc: "Easy on the eyes" },
            { icon: "🎨", title: "Customizable", desc: "Make it your own" },
          ].map((feature, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-2xl transition-all duration-300 hover:scale-105",
                isDarkMode
                  ? "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15"
                  : "bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl"
              )}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-300/20">
          <p
            className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            Built with React, Tailwind CSS, and lots of ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
