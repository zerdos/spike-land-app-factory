import React from "react";

const ClaudeCodeIntro = () => {
  const claudeCodeCmd = `claude mcp add spike-land npx @spike-npm-land/mcp-server@latest`;

  const desktopConfig = `{
  "mcpServers": {
    "spike-land": {
      "command": "npx",
      "args": ["-y", "@spike-npm-land/mcp-server@latest"]
    }
  }
}`;

  const prompts = [
    "Create a todo app with local storage",
    "Build an analog clock with smooth animations",
    "Make a markdown editor with live preview",
    "Create a pomodoro timer with sound alerts",
    "Build a currency converter with live rates",
  ];

  const features = [
    {
      icon: "⚡",
      title: "Instant Deploy",
      desc: "No build steps, no waiting. Your app is live immediately.",
    },
    {
      icon: "🎨",
      title: "Tailwind CSS",
      desc: "Full utility classes and custom styles supported.",
    },
    {
      icon: "⚛️",
      title: "React + TSX",
      desc: "Write modern React with TypeScript out of the box.",
    },
    {
      icon: "🔗",
      title: "Shareable URLs",
      desc: "Every app gets a unique link you can share.",
    },
    {
      icon: "👁️",
      title: "Visual Feedback",
      desc: "Claude can screenshot and see what it built.",
    },
    {
      icon: "🔄",
      title: "Live Updates",
      desc: "Edit and iterate - changes appear in real-time.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(124, 58, 237, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
        }}
      />
      r{/* Grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 py-20">
        {/* Hero */}
        <header className="text-center mb-24">
          <div className="inline-flex gap-2 mb-8">
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
              MCP Server
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
              Live Codespaces
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            <span className="text-white">Build React Apps</span>
            <br />
            <span className="bg-gradient-to-r  from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              with Claude Code
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            This page was created entirely by{" "}
            <span className="text-white font-medium">Claude Code</span> using
            the{" "}
            <span className="text-violet-400 font-medium">
              spike.land MCP server
            </span>
            . Create live React applications instantly — just describe what you
            want.
          </p>
        </header>

        {/* What is this */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-6">What is this?</h2>
          <div className="text-lg text-zinc-400 leading-relaxed space-y-4">
            <p>
              <span className="text-white font-medium">spike.land</span>{" "}
              provides a Model Context Protocol (MCP) server that extends Claude
              Code with the ability to create, update, and manage live React
              applications.
            </p>
            <p>
              No deployment pipelines. No build configuration. No hosting setup.
              Just describe your app and watch it come to life at a shareable
              URL.
            </p>
          </div>
        </section>

        {/* Setup */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-10">Get Started</h2>

          {/* Claude Code CLI */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">
                Claude Code (CLI)
              </h3>
              <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Recommended
              </span>
            </div>
            <p className="text-zinc-400 mb-4 ml-11">
              Run this single command in your terminal:
            </p>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 ml-11">
              <div className="flex items-center justify-between gap-4">
                <code className="text-emerald-400 font-mono text-sm break-all">
                  {claudeCodeCmd}
                </code>
              </div>
            </div>
          </div>

          {/* Claude Desktop */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">
                Claude Desktop
              </h3>
            </div>
            <p className="text-zinc-400 mb-4 ml-11">
              Add this to your config file:
            </p>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 ml-11">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-zinc-500 text-xs font-mono">
                  claude_desktop_config.json
                </span>
              </div>
              <pre className="text-sm text-emerald-400 font-mono overflow-x-auto">
                {desktopConfig}
              </pre>
            </div>
          </div>

          <p className="text-zinc-500 text-sm mt-6 ml-11">
            After adding, restart Claude Code or Claude Desktop to activate the
            MCP server.
          </p>
        </section>

        {/* Example prompts */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-4">Just Ask</h2>
          <p className="text-zinc-400 mb-8">
            Here are some things you can ask Claude to build:
          </p>

          <div className="space-y-3">
            {prompts.map((prompt, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-violet-500/40 hover:bg-zinc-900/80 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-mono text-lg flex-shrink-0">
                  &gt;
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  &quot;{prompt}&quot;
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-10">Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-16 px-8 rounded-2xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-pink-500/10 border border-violet-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Open Claude Code and try:
          </p>
          <div className="inline-block bg-zinc-900 border border-zinc-700 rounded-lg px-6 py-4 font-mono text-violet-400">
            Create a [your idea here] on spike.land
          </div>
          <p className="text-zinc-500 text-sm mt-6">
            Your app will be instantly available at
            <br />
            <span className="text-violet-400 font-mono">
              testing.spike.land/live/your-app-name
            </span>
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-zinc-800 text-center">
          <p className="text-zinc-500">
            Built with Claude Code + spike.land MCP
          </p>
          <p className="text-zinc-600 text-sm mt-2">SPIKE LAND LTD</p>
        </footer>
      </div>
    </div>
  );
};

export default ClaudeCodeIntro;
