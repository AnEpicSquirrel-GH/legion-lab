'use strict';

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * @param {string} str - The string to escape
 * @returns {string} The escaped string safe for HTML insertion
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Validates that a URL is safe for image loading (http/https only).
 * Prevents javascript: or data: schemes.
 * @param {string} url - The URL to validate
 * @returns {boolean} True if the URL is safe for image loading
 */
function isSafeImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('https://') || trimmed.startsWith('http://');
}

/**
 * Converts a hex color to rgba format with specified alpha transparency.
 * @param {string} hex - Hex color code (e.g., '#FF0000')
 * @param {number} alpha - Alpha value between 0 and 1
 * @returns {string} rgba color string (e.g., 'rgba(255,0,0,0.5)')
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Syncs Zero's secondary weapon stars with the primary weapon.
 * Zero class has a unique mechanic where the Heavy (secondary) weapon must match the Long Sword (weapon) stars.
 * This updates all UI representations: data, expanded mode input, compact mode input, and collapsed chip.
 * @param {number} charIdx - Index of the character in the chars array
 * @param {number} stars - Number of stars to sync
 * @param {HTMLElement} section - Character section DOM element
 */
function syncZeroWeapons(charIdx, stars, section) {
  if (!chars[charIdx] || chars[charIdx].cls !== 'Zero') return;
  if (!chars[charIdx].gear['Secondary Weapon']) return;
  
  // Update data
  chars[charIdx].gear['Secondary Weapon'].stars = stars;
  
  // Sync expanded mode star input
  const secMainStarInput = section.querySelector(`.gear-slot[data-slot="Secondary Weapon"] .star-input`);
  if (secMainStarInput) secMainStarInput.value = String(stars);
  
  // Sync compact mode star input
  const secCompactStarInput = section.querySelector('.compact-star-wrap[data-slot="Secondary Weapon"] .compact-star-input');
  if (secCompactStarInput) secCompactStarInput.value = stars;
  
  // Sync collapsed mode chip
  const secChip = section.querySelector(`.summary-chip[data-slot="Secondary Weapon"]`);
  if (secChip && typeof applyChipStyle === 'function') {
    applyChipStyle(secChip, chars[charIdx].gear['Secondary Weapon'].item, stars);
  }
}
