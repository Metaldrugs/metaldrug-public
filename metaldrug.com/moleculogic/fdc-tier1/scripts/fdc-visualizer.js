// fdc-visualizer.js

/**
 * FDC Visualizer Module
 * ----------------------
 * Provides dynamic UI rendering of Functional Drug Complex (FDC) logic overlays,
 * molecular component visualization, and live state updates for Tier 1 previews.
 * Integrates with fdc-validator.js and fdc-simulation.js.
 */

const fdcVisualizer = (() => {
  const canvasId = "fdc-canvas";
  let ctx;

  function initCanvas() {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    clearCanvas();
  }

  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function drawNode(x, y, label, color = "#4F46E5") {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 4);
  }

  function drawConnection(x1, y1, x2, y2) {
    if (!ctx) return;
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function renderGraph(components) {
    if (!ctx || !Array.isArray(components)) return;
    clearCanvas();

    const spacing = ctx.canvas.width / (components.length + 1);
    const centerY = ctx.canvas.height / 2;

    components.forEach((component, index) => {
      const x = spacing * (index + 1);
      const y = centerY;
      drawNode(x, y, component.name);

      if (index > 0) {
        const prevX = spacing * index;
        drawConnection(prevX, centerY, x, y);
      }
    });
  }

  return {
    initCanvas,
    renderGraph,
    clearCanvas
  };
})();

window.addEventListener("load", fdcVisualizer.initCanvas);
