// fdc-logic-designer.js

/**
 * FDC Logic Designer JS
 * Path: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\fdc-tier1\fdc-logic-designer.js
 *
 * This script enables interactive drag-and-drop design of FDC (Functional Drug Complex) logic structures.
 * Users can add RNA/protein nodes, draw edges, assign activation rules, and export logic blueprints.
 */

const canvas = document.getElementById('logic-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.9;
canvas.height = 600;

let nodes = [];
let edges = [];
let selectedNode = null;

function drawNode(node) {
  ctx.beginPath();
  ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
  ctx.fillStyle = node.type === 'protein' ? '#4f46e5' : '#059669';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(node.label, node.x, node.y + 4);
}

function drawEdge(edge) {
  ctx.beginPath();
  ctx.moveTo(edge.from.x, edge.from.y);
  ctx.lineTo(edge.to.x, edge.to.y);
  ctx.strokeStyle = '#9ca3af';
  ctx.stroke();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  edges.forEach(drawEdge);
  nodes.forEach(drawNode);
}

canvas.addEventListener('mousedown', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  selectedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 30);
});

canvas.addEventListener('mousemove', (e) => {
  if (selectedNode) {
    selectedNode.x = e.offsetX;
    selectedNode.y = e.offsetY;
    render();
  }
});

canvas.addEventListener('mouseup', () => {
  selectedNode = null;
});

document.getElementById('add-protein').onclick = () => {
  nodes.push({ x: 100, y: 100, type: 'protein', label: 'Protein' + nodes.length });
  render();
};

document.getElementById('add-rna').onclick = () => {
  nodes.push({ x: 200, y: 100, type: 'rna', label: 'RNA' + nodes.length });
  render();
};

document.getElementById('connect-nodes').onclick = () => {
  if (nodes.length >= 2) {
    edges.push({ from: nodes[nodes.length - 2], to: nodes[nodes.length - 1] });
    render();
  }
};

document.getElementById('export-blueprint').onclick = () => {
  const data = { nodes, edges };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fdc_blueprint_' + Date.now() + '.fdc.json';
  a.click();
};

render();
