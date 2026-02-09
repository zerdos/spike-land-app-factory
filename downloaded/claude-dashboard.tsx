/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";

// Dashboard Component
export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    projects: 0,
    tasks: 0
  });

  // Animate counters on mount - REAL SPIKE DATA
  useEffect(() => {
    const targetStats = { users: 6, revenue: 1, projects: 3, tasks: 5 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setStats({
        users: Math.round(targetStats.users * eased),
        revenue: Math.round(targetStats.revenue * eased),
        projects: Math.round(targetStats.projects * eased),
        tasks: Math.round(targetStats.tasks * eased)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  const activities = [
    { user: "Spike", action: "fixed TypeScript errors", target: "Issue #981", time: "10 min ago", avatar: "⚡" },
    { user: "Zoltan", action: "vibe coded", target: "claude-dashboard", time: "15 min ago", avatar: "ZE" },
    { user: "Spike", action: "created package", target: "vibe-dev", time: "1 hour ago", avatar: "⚡" },
    { user: "Spike", action: "scheduled cron", target: "morning-briefing", time: "2 hours ago", avatar: "⚡" },
  ];

  const chartData = [35, 55, 45, 70, 65, 80, 75];
  const maxChart = Math.max(...chartData);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #0f1a15 50%, #0a0f0c 100%)",
      padding: "24px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#e2e8f0"
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 10s ease-in-out infinite reverse"
        }} />
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "30%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(163, 230, 53, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 12s ease-in-out infinite"
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px -12px rgba(16, 185, 129, 0.25);
        }
        .activity-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .action-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px -5px rgba(16, 185, 129, 0.4);
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          animation: "slideIn 0.6s ease-out"
        }}>
          <div>
            <h1 style={{
              fontSize: "36px",
              fontWeight: "800",
              margin: 0,
              background: "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #a3e635 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Dashboard
            </h1>
            <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "12px 20px",
              textAlign: "right"
            }}>
              <div style={{ fontSize: "24px", fontWeight: "600", color: "#f1f5f9" }}>
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          {[
            { label: "Modified Files", value: stats.users.toLocaleString(), trend: "branch", up: true, color: "#10b981", icon: "📝" },
            { label: "New Packages", value: stats.revenue.toString(), trend: "vibe-dev", up: true, color: "#14b8a6", icon: "📦" },
            { label: "Tasks Done", value: `${stats.projects}/5`, trend: "+3 today", up: true, color: "#a3e635", icon: "✅" },
            { label: "Sub-agents", value: stats.tasks > 0 ? "1" : "0", trend: "completed", up: true, color: "#facc15", icon: "🤖" }
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "24px",
                transition: "all 0.3s ease",
                animation: `slideIn 0.6s ease-out ${i * 0.1}s both`,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "120px",
                height: "120px",
                background: `radial-gradient(circle at top right, ${stat.color}15 0%, transparent 70%)`,
                borderRadius: "0 20px 0 100%"
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ fontSize: "28px" }}>{stat.icon}</span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: stat.up ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: stat.up ? "#10b981" : "#ef4444"
                }}>
                  {stat.up ? "↑" : "↓"} {stat.trend}
                </span>
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#f1f5f9", marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px"
        }}>
          {/* Chart Section */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "24px",
            animation: "slideIn 0.6s ease-out 0.4s both"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#f1f5f9" }}>
                Weekly Activity
              </h2>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Week", "Month", "Year"].map((period, i) => (
                  <button key={period} style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    background: i === 0 ? "linear-gradient(135deg, #10b981, #14b8a6)" : "rgba(255, 255, 255, 0.05)",
                    color: i === 0 ? "#0a0a0a" : "#94a3b8",
                    transition: "all 0.2s ease"
                  }}>
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "200px", padding: "0 8px" }}>
              {chartData.map((value, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "100%",
                    height: `${(value / maxChart) * 100}%`,
                    background: `linear-gradient(180deg, ${i === chartData.length - 1 ? '#10b981' : '#14b8a6'}90 0%, ${i === chartData.length - 1 ? '#10b981' : '#14b8a6'}20 100%)`,
                    borderRadius: "8px 8px 4px 4px",
                    position: "relative",
                    transition: "height 1s ease-out",
                    animation: `slideIn 0.6s ease-out ${0.5 + i * 0.1}s both`
                  }}>
                    <div style={{
                      position: "absolute",
                      top: "-24px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#10b981"
                    }}>
                      {value}
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "24px",
            animation: "slideIn 0.6s ease-out 0.5s both"
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "600", color: "#f1f5f9" }}>
              Recent Activity
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activities.map((activity, i) => (
                <div
                  key={i}
                  className="activity-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "12px",
                    transition: "background 0.2s ease",
                    animation: `slideIn 0.4s ease-out ${0.6 + i * 0.1}s both`
                  }}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${['#10b981', '#14b8a6', '#a3e635', '#facc15'][i]}40, ${['#10b981', '#14b8a6', '#a3e635', '#facc15'][i]}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: ['#10b981', '#14b8a6', '#a3e635', '#facc15'][i]
                  }}>
                    {activity.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", color: "#e2e8f0" }}>
                      <span style={{ fontWeight: "600" }}>{activity.user}</span>
                      {" "}{activity.action}{" "}
                      <span style={{ color: "#10b981" }}>{activity.target}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          marginTop: "24px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "24px",
          animation: "slideIn 0.6s ease-out 0.7s both"
        }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "600", color: "#f1f5f9" }}>
            Quick Actions
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "New Project", icon: "➕", gradient: "linear-gradient(135deg, #10b981, #059669)" },
              { label: "Add User", icon: "👤", gradient: "linear-gradient(135deg, #14b8a6, #0d9488)" },
              { label: "Create Task", icon: "📝", gradient: "linear-gradient(135deg, #a3e635, #84cc16)" },
              { label: "View Reports", icon: "📊", gradient: "linear-gradient(135deg, #facc15, #eab308)" },
              { label: "Settings", icon: "⚙️", gradient: "linear-gradient(135deg, #64748b, #475569)" }
            ].map((action, i) => (
              <button
                key={i}
                className="action-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: "14px",
                  background: action.gradient,
                  color: "#0a0a0a",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  animation: `slideIn 0.4s ease-out ${0.8 + i * 0.05}s both`
                }}
              >
                <span style={{ fontSize: "18px" }}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: "32px",
          textAlign: "center",
          color: "#475569",
          fontSize: "12px",
          animation: "slideIn 0.6s ease-out 1s both"
        }}>
          Built with 💚 by Claude • Deployed on spike.land
        </footer>
      </div>
    </div>
  );
}