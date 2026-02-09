import { useState, useEffect } from "react";

const AnalogWatch = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "orange",
      }}
    >
      <div
        style={{
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "white",
          border: "8px solid orange",
          position: "relative",
          boxShadow: "0 0 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Numbers */}
        {numbers.map((num, i) => {
          const angle = (i * 30 - 60) * (Math.PI / 180);
          const radius = 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#333",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              {num}
            </span>
          );
        })}

        {/* Hour hand */}
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "60px",
            background: "#333",
            left: "50%",
            bottom: "50%",
            marginLeft: "-4px",
            transformOrigin: "bottom center",
            transform: `rotate(${hourDeg}deg)`,
            borderRadius: "4px",
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            position: "absolute",
            width: "5px",
            height: "90px",
            background: "#333",
            left: "50%",
            bottom: "50%",
            marginLeft: "-2.5px",
            transformOrigin: "bottom center",
            transform: `rotate(${minuteDeg}deg)`,
            borderRadius: "3px",
          }}
        />

        {/* Second hand */}
        <div
          style={{
            position: "absolute",
            width: "2px",
            height: "100px",
            background: "#e74c3c",
            left: "50%",
            bottom: "50%",
            marginLeft: "-1px",
            transformOrigin: "bottom center",
            transform: `rotate(${secondDeg}deg)`,
          }}
        />

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            background: "#e74c3c",
            border: "3px solid #333",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default AnalogWatch;