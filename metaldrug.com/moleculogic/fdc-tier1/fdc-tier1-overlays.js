// fdc-tier1-overlays.js

/**
 * FDC Tier 1 Overlay Engine
 * 
 * This module enhances the FDC Tier 1 blueprint viewer by dynamically
 * rendering entropy, risk, and confidence overlays. It flags segments
 * of the blueprint for visual alerting and research prioritization.
 *
 * Path: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\fdc-tier1\fdc-tier1-overlays.js
 */

// Overlay thresholds
const ENTROPY_THRESHOLD = 0.7;
const RISK_KEYWORDS = ['undefined', 'missing', 'unstable'];
const CONFIDENCE_PATTERNS = ['stable ring', 'approved', 'clinically validated'];

// Entry point after blueprint JSON is loaded
function applyFDCOverlays(blueprintData) {
  if (!blueprintData || !Array.isArray(blueprintData.components)) return;

  blueprintData.components.forEach((component, index) => {
    const elementId = `fdc-component-${index}`;
    const element = document.getElementById(elementId);
    if (!element) return;

    const entropyScore = parseFloat(component.entropy || 0);
    const logicStr = component.logic?.toLowerCase() || '';
    let riskLevel = 'low';
    let confidence = 'unknown';

    // Determine risk level
    if (RISK_KEYWORDS.some(keyword => logicStr.includes(keyword))) {
      riskLevel = 'high';
    } else if (entropyScore > ENTROPY_THRESHOLD) {
      riskLevel = 'moderate';
    }

    // Determine confidence
    if (CONFIDENCE_PATTERNS.some(term => logicStr.includes(term))) {
      confidence = 'high';
    } else if (entropyScore > 0.6) {
      confidence = 'medium';
    }

    // Build overlay
    const badge = document.createElement('div');
    badge.className = `absolute top-0 right-0 m-1 px-2 py-1 rounded text-xs font-bold text-white`;
    badge.style.backgroundColor = getOverlayColor(riskLevel);
    badge.innerText = `${riskLevel.toUpperCase()} | ${confidence.toUpperCase()}`;

    element.style.position = 'relative';
    element.appendChild(badge);
  });
}

function getOverlayColor(riskLevel) {
  switch (riskLevel) {
    case 'high': return '#dc2626'; // red
    case 'moderate': return '#f59e0b'; // yellow
    default: return '#10b981'; // green
  }
}

// Expose for external usage
window.applyFDCOverlays = applyFDCOverlays;
