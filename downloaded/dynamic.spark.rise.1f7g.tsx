import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

export default function App() {
  const canvasRef = useRef(null);
  const [maxIterations, setMaxIterations] = useState(() => {
    const saved = localStorage.getItem("mandelbrot_maxIterations");
    return saved ? parseInt(saved) : 100;
  });
  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem("mandelbrot_zoom");
    return saved ? parseFloat(saved) : 1;
  });
  const [centerX, setCenterX] = useState(() => {
    const saved = localStorage.getItem("mandelbrot_centerX");
    return saved ? parseFloat(saved) : -0.5;
  });
  const [centerY, setCenterY] = useState(() => {
    const saved = localStorage.getItem("mandelbrot_centerY");
    return saved ? parseFloat(saved) : 0;
  });
  const [isRendering, setIsRendering] = useState(false);

  const mandelbrot = (cx, cy, maxIter) => {
    let x = 0;
    let y = 0;
    let iteration = 0;

    while (x * x + y * y <= 4 && iteration < maxIter) {
      const xtemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xtemp;
      iteration++;
    }

    return iteration;
  };

  const getColor = (iteration, maxIter) => {
    if (iteration === maxIter) {
      return [0, 0, 0];
    }

    const ratio = iteration / maxIter;
    const hue = ratio * 360;
    const saturation = 100;
    const lightness = ratio < 1 ? 50 : 0;

    // Convert HSL to RGB
    const h = hue / 60;
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = lightness / 100 - c / 2;

    let r, g, b;
    if (h < 1) [r, g, b] = [c, x, 0];
    else if (h < 2) [r, g, b] = [x, c, 0];
    else if (h < 3) [r, g, b] = [0, c, x];
    else if (h < 4) [r, g, b] = [0, x, c];
    else if (h < 5) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  };

  const renderMandelbrot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    const scale = 3 / zoom;
    const xMin = centerX - scale;
    const xMax = centerX + scale;
    const yMin = centerY - scale * (height / width);
    const yMax = centerY + scale * (height / width);

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x0 = xMin + (px / width) * (xMax - xMin);
        const y0 = yMin + (py / height) * (yMax - yMin);

        const iteration = mandelbrot(x0, y0, maxIterations);
        const [r, g, b] = getColor(iteration, maxIterations);

        const index = (py * width + px) * 4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsRendering(false);
  };

  useEffect(() => {
    renderMandelbrot();
  }, [zoom, centerX, centerY, maxIterations]);

  useEffect(() => {
    localStorage.setItem("mandelbrot_zoom", zoom.toString());
    localStorage.setItem("mandelbrot_centerX", centerX.toString());
    localStorage.setItem("mandelbrot_centerY", centerY.toString());
    localStorage.setItem("mandelbrot_maxIterations", maxIterations.toString());
  }, [zoom, centerX, centerY, maxIterations]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = 3 / zoom;
    const xMin = centerX - scale;
    const xMax = centerX + scale;
    const yMin = centerY - scale * (canvas.height / canvas.width);
    const yMax = centerY + scale * (canvas.height / canvas.width);

    const clickX = xMin + (x / canvas.width) * (xMax - xMin);
    const clickY = yMin + (y / canvas.height) * (yMax - yMin);

    setCenterX(clickX);
    setCenterY(clickY);
    setZoom(zoom * 2);
  };

  const handleZoomIn = () => setZoom(zoom * 2);
  const handleZoomOut = () => setZoom(zoom / 2);
  const handleReset = () => {
    setZoom(1);
    setCenterX(-0.5);
    setCenterY(0);
    setMaxIterations(100);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "mandelbrot.png";
    link.href = url;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-2">
            Mandelbrot Set Explorer
          </h1>
          <p className="text-gray-300">
            Click anywhere on the fractal to zoom in • Use controls to navigate
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onClick={handleCanvasClick}
              className="border-4 border-purple-400/30 rounded-lg cursor-crosshair shadow-2xl hover:border-purple-400/50 transition-colors"
            />

            {isRendering && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-6 py-3 rounded-lg">
                Rendering...
              </div>
            )}

            <div className="mt-6 w-full space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleZoomOut}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <ZoomOut size={20} />
                  Zoom Out
                </button>
                <button
                  onClick={handleZoomIn}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <ZoomIn size={20} />
                  Zoom In
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <Download size={20} />
                  Download
                </button>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <label className="block text-white mb-2">
                  Max Iterations: {maxIterations}
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-white bg-white/5 rounded-lg p-4">
                <div>
                  <div className="text-gray-400 text-sm">Zoom Level</div>
                  <div className="text-xl font-bold">{zoom.toFixed(2)}x</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Center X</div>
                  <div className="text-xl font-bold">{centerX.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Center Y</div>
                  <div className="text-xl font-bold">{centerY.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-300 text-sm">
          <p>
            The Mandelbrot set is a fractal defined by the iterative equation z
            = z² + c
          </p>
          <p className="mt-1">
            Higher iteration counts reveal more detail but take longer to render
          </p>
        </div>
      </div>
    </div>
  );
}