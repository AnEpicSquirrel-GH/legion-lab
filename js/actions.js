'use strict';

/* ────────────────────────────────────────────────────────────────
   CHARACTER ACTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Toggles a character's view mode through the cycle: expanded → compact → collapsed → expanded.
 * Updates the DOM without re-rendering by applying/removing CSS classes and inline styles.
 * @param {number} idx - Index of the character in the chars array
 */
function toggleChar(idx) {
  // Cycle through: expanded -> compact -> collapsed -> expanded
  const current = chars[idx].viewMode || 'expanded';
  const modes = ['expanded', 'compact', 'collapsed'];
  const currentIndex = modes.indexOf(current);
  const nextIndex = (currentIndex + 1) % modes.length;
  const previousMode = chars[idx].viewMode;
  chars[idx].viewMode = modes[nextIndex];
  
  save();
  const section = document.querySelector(`#char-list .char-section[data-idx="${idx}"]`);
  if (section) {
    // Clear inline styles from compact mode if switching away from it
    if (previousMode === 'compact') {
      section.querySelectorAll('.compact-chip, .compact-star-wrap').forEach(el => {
        el.style.background = '';
        el.style.color = '';
      });
      section.querySelectorAll('.gear-slot').forEach(slot => {
        slot.style.background = '';
      });
    }
    
    section.classList.remove('expanded', 'compact', 'collapsed');
    section.classList.add(chars[idx].viewMode);
    
    // Re-apply inline styles when switching TO compact mode
    if (chars[idx].viewMode === 'compact') {
      const char = chars[idx];
      section.querySelectorAll('.compact-chip').forEach(chip => {
        const slot = chip.dataset.slot;
        const gd = char.gear[slot] || { item: 'None', stars: 0 };
        const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(gd.item, slot) : null;
        if (gearSet?.color) {
          chip.style.color = gearSet.color;
          chip.style.background = gearSet.color + '1A';
        } else {
          chip.style.background = '#373737';
        }
      });
      section.querySelectorAll('.compact-star-wrap').forEach(wrap => {
        const slot = wrap.dataset.slot;
        const gd = char.gear[slot] || { item: 'None', stars: 0 };
        const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(gd.item, slot) : null;
        if (gearSet?.color) {
          wrap.style.background = gearSet.color + '1A';
        } else {
          wrap.style.background = '#373737';
        }
      });
    }
    
    const btn = section.querySelector('.toggle-btn');
    if (btn) {
      const titles = { expanded: 'Compact', compact: 'Collapse', collapsed: 'Expand' };
      btn.title = titles[chars[idx].viewMode] || 'Toggle';
    }
  }
  if (typeof updateToggleBtn === 'function') updateToggleBtn();
}

/**
 * Toggles all characters to the next view mode in the cycle.
 * Determines the most common current mode and cycles all characters to the next mode.
 * Optimized to avoid full re-render by manipulating CSS classes and inline styles.
 */
function toggleAll() {
  // Cycle through all three modes: expanded -> compact -> collapsed -> expanded
  // Determine the most common mode, or default to expanded
  const modeCounts = { expanded: 0, compact: 0, collapsed: 0 };
  chars.forEach(c => {
    const mode = c.viewMode || 'expanded';
    modeCounts[mode]++;
  });
  
  // Find the most common mode
  let currentMode = 'expanded';
  let maxCount = 0;
  for (const [mode, count] of Object.entries(modeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      currentMode = mode;
    }
  }
  
  // Cycle to next mode
  const modes = ['expanded', 'compact', 'collapsed'];
  const currentIndex = modes.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  const targetMode = modes[nextIndex];
  
  chars.forEach(c => { c.viewMode = targetMode; });
  save();
  
  document.querySelectorAll('#char-list .char-section').forEach((section, i) => {
    const idx = parseInt(section.dataset.idx, 10);
    if (isNaN(idx)) return;
    
    // Clear inline styles from compact mode if switching away from it
    if (currentMode === 'compact') {
      section.querySelectorAll('.compact-chip, .compact-star-wrap').forEach(el => {
        el.style.background = '';
        el.style.color = '';
      });
      section.querySelectorAll('.gear-slot').forEach(slot => {
        slot.style.background = '';
      });
    }
    
    section.classList.remove('expanded', 'compact', 'collapsed');
    section.classList.add(chars[idx].viewMode);
    
    // Re-apply inline styles when switching TO compact mode
    if (targetMode === 'compact') {
      const char = chars[idx];
      section.querySelectorAll('.compact-chip').forEach(chip => {
        const slot = chip.dataset.slot;
        const gd = char.gear[slot] || { item: 'None', stars: 0 };
        const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(gd.item, slot) : null;
        if (gearSet?.color) {
          chip.style.color = gearSet.color;
          chip.style.background = gearSet.color + '1A';
        } else {
          chip.style.background = '#373737';
        }
      });
      section.querySelectorAll('.compact-star-wrap').forEach(wrap => {
        const slot = wrap.dataset.slot;
        const gd = char.gear[slot] || { item: 'None', stars: 0 };
        const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(gd.item, slot) : null;
        if (gearSet?.color) {
          wrap.style.background = gearSet.color + '1A';
        } else {
          wrap.style.background = '#373737';
        }
      });
    }
    
    const btn = section.querySelector('.toggle-btn');
    if (btn) {
      const titles = { expanded: 'Compact', compact: 'Collapse', collapsed: 'Expand' };
      btn.title = titles[chars[idx].viewMode] || 'Toggle';
    }
  });
  if (typeof updateToggleBtn === 'function') updateToggleBtn();
}

function deleteChar(idx) {
  if (typeof window.openDeleteConfirmModal === 'function') {
    window.openDeleteConfirmModal([idx]);
  } else {
    if (!confirm(`Remove "${chars[idx].name}" from your list?`)) return;
    chars.splice(idx, 1);
    save();
    render();
  }
}

function editChar(idx) {
  const c = chars[idx];
  editingIdx = idx;
  openModal({
    name:     c.name,
    level:    c.level ?? '',
    cls:      c.cls   ?? '',
    world:    c.world ?? '',
    imageUrl: c.imageUrl ?? '',
  });
  document.getElementById('modalTitle').textContent = 'Edit Character';
  document.getElementById('confirmAddBtn').textContent = 'Save Changes';
}

/* Small transient status label near a character row (best-effort) */
function showTempStatus(idx, msg, cls, ms = 3000) {
  const sec = document.querySelector(`.char-section[data-idx="${idx}"]`);
  if (!sec) return;
  let lbl = sec.querySelector('.refresh-lbl');
  if (!lbl) {
    lbl = document.createElement('span');
    lbl.className = 'refresh-lbl';
    lbl.style.cssText = 'font-size:10px;margin-left:4px;';
    const nameEl = sec.querySelector('.char-name');
    if (nameEl) nameEl.parentElement.appendChild(lbl);
  }
  lbl.textContent = msg;
  lbl.style.color = cls === 'ok' ? 'var(--success)' : cls === 'err' ? 'var(--danger)' : 'var(--accent)';
  clearTimeout(lbl._t);
  lbl._t = setTimeout(() => { lbl.textContent = ''; }, ms);
}

/* ────────────────────────────────────────────────────────────────
   DRAG & DROP
──────────────────────────────────────────────────────────────── */
function _dndClearIndicators() {
  document.querySelectorAll('.char-section').forEach(s => s.classList.remove('drop-before', 'drop-after'));
}

function _dndDropBefore(section, clientY) {
  const rect = section.getBoundingClientRect();
  return clientY < rect.top + rect.height / 2;
}

function setupDnD(section, idx) {
  const handle = section.querySelector('.drag-handle');
  if (handle) {
    handle.draggable = true;
    handle.addEventListener('dragstart', (e) => {
      dragSrcIdx = idx;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => section.style.opacity = '.4', 0);
    });
    handle.addEventListener('dragend', () => {
      section.style.opacity = '';
      _dndClearIndicators();
      dragSrcIdx = null;
    });
  }

  section.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragSrcIdx === null || dragSrcIdx === idx) return;

    document.querySelectorAll('.char-section').forEach(s => {
      if (s !== section) s.classList.remove('drop-before', 'drop-after');
    });
    const before = _dndDropBefore(section, e.clientY);
    section.classList.toggle('drop-before', before);
    section.classList.toggle('drop-after', !before);
  });

  section.addEventListener('dragleave', (e) => {
    if (!section.contains(e.relatedTarget)) {
      section.classList.remove('drop-before', 'drop-after');
    }
  });

  section.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dragSrcIdx === null || dragSrcIdx === idx) {
      _dndClearIndicators();
      return;
    }

    const before = _dndDropBefore(section, e.clientY);
    _dndClearIndicators();

    const [moved] = chars.splice(dragSrcIdx, 1);
    const adj = dragSrcIdx < idx ? idx - 1 : idx;
    chars.splice(before ? adj : adj + 1, 0, moved);
    save();
    render();
  });
}
