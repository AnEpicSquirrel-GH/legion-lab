'use strict';

try {
  const stored = localStorage.getItem('ll_gear_bg');
  // Migrate old '0'/'1' to new mode system
  if (stored === '0') window.gearBgMode = 'off';
  else if (stored === '1') window.gearBgMode = 'on';
  else window.gearBgMode = stored || 'off'; // 'off', 'on', or 'all'
  window.gearBgEnabled = window.gearBgMode !== 'off'; // Backward compat
} catch (e) {
  window.gearBgMode = 'on';
  window.gearBgEnabled = true;
}

/**
 * Checks if an item qualifies as "Lucky" for a given slot.
 * Lucky items (Genesis/Destiny weapons) can count toward set bonuses even if not technically part of the set.
 * @param {string} item - The item name
 * @param {string} slot - The equipment slot
 * @returns {boolean} True if the item counts as Lucky for this slot
 */
function isLuckyForSlot(item, slot) {
  if (!item || item === 'None') return false;
  if (typeof LUCKY_ITEMS !== 'undefined' && LUCKY_ITEMS[item] === slot) return true;
  if (slot === 'Weapon' && typeof ITEM_TIER !== 'undefined') {
    const tier = ITEM_TIER[item];
    if (tier === 'Pitched' || tier === 'Eternal') return true;  // Genesis / Destiny weapons (any class-specific label)
  }
  return false;
}

/**
 * Gets the minimum number of pieces required for a set to grant any bonus.
 * @param {Object} set - The gear set object
 * @param {string} charCategory - Character category (e.g., 'Warrior', 'Mage')
 * @returns {number} Minimum piece count (e.g., 2 for CRA, 3 for Boss)
 */
function getMinEffectTier(set, charCategory) {
  const effects = set.effectsByCategory?.[charCategory] || set.effectsByCategory?.Warrior || set.effects;
  if (!effects) return 999;
  const keys = Object.keys(effects).map(Number).filter(k => !isNaN(k) && k >= 0);
  return keys.length ? Math.min(...keys) : 999;
}

/**
 * Gets the highest bonus tier achieved for the given piece count.
 * @param {Object} set - The gear set object
 * @param {number} pieceCount - Number of set pieces equipped
 * @param {string} charCategory - Character category
 * @returns {number} Highest tier reached (e.g., 3 for Boss set with 4 pieces)
 */
function getAchievedBonusTier(set, pieceCount, charCategory) {
  const effects = set.effectsByCategory?.[charCategory] || set.effectsByCategory?.Warrior || set.effects;
  if (!effects) return 0;
  const keys = Object.keys(effects).map(Number).filter(k => !isNaN(k) && k >= 0 && k <= pieceCount);
  return keys.length ? Math.max(...keys) : 0;
}

/**
 * Counts equipped pieces for each gear set that meets minimum requirements.
 * @param {Object} char - Character object with gear data
 * @returns {Object} Map of setId to piece count (only sets meeting minimum requirements)
 */
function getSetCounts(char) {
  const counts = {};
  if (!char.gear || typeof GEAR_SETS === 'undefined') return counts;
  const charCategory = typeof CLASS_CATEGORY !== 'undefined' ? (CLASS_CATEGORY[char.cls] || 'Warrior') : 'Warrior';

  Object.entries(GEAR_SETS).forEach(([setId, set]) => {
    if (!set.slots || !set.items) return;
    const itemSet = set.items;
    let n = 0;
    set.slots.forEach(slot => {
      const item = char.gear[slot]?.item;
      if (!item || item === 'None') return;
      const slotItems = itemSet[slot];
      const inSet = slotItems && slotItems.has && slotItems.has(item);
      const inSetByResolver = typeof getSetForItem !== 'undefined' && getSetForItem(item, slot) === set;
      if (inSet || inSetByResolver) n++;
    });
    set.slots.forEach(slot => {
      const item = char.gear[slot]?.item;
      if (!item || item === 'None') return;
      const slotItems = itemSet[slot];
      const inSet = slotItems && slotItems.has && slotItems.has(item);
      const inSetByResolver = typeof getSetForItem !== 'undefined' && getSetForItem(item, slot) === set;
      if (!slotItems || inSet || inSetByResolver) return;
      if (!isLuckyForSlot(item, slot)) return;
      let otherCount = 0;
      set.slots.forEach(s => {
        if (s === slot) return;
        const o = char.gear[s]?.item;
        if (!o || o === 'None') return;
        const oSlotItems = itemSet[s];
        const oInSet = oSlotItems && oSlotItems.has && oSlotItems.has(o);
        const oInSetByResolver = typeof getSetForItem !== 'undefined' && getSetForItem(o, s) === set;
        if (oInSet || oInSetByResolver) otherCount++;
      });
      if (otherCount >= 3) n++;
    });
    const minTier = getMinEffectTier(set, charCategory);
    if (n >= minTier) counts[setId] = n;
  });
  return counts;
}

/** Cumulative effect lines up to the given bonus tier (use getAchievedBonusTier for which tier is hit). */
function getCumulativeEffectLinesForSet(setId, upToTier, charCategory) {
  const set = GEAR_SETS[setId];
  if (!set) return [];
  const effects = set.effectsByCategory?.[charCategory] || set.effectsByCategory?.Warrior || set.effects;
  if (!effects || upToTier < 1) return [];
  const lines = [];
  for (let n = 2; n <= upToTier && n <= 10; n++) {
    const arr = effects[n];
    if (arr) lines.push(...arr);
  }
  return lines;
}

/** Preferred display order for cumulative bonus stats. List each stat once; percent keys (e.g. "Boss Damage%") match the base name for ordering. */
const CUMULATIVE_STAT_ORDER = [
  'Weapon Attack', 'Magic Attack', 'Boss Damage', 'Ignore Enemy DEF', 'Critical Damage', 'Damage',
  'Damage Against Normal Monsters',
  'All Stats', 'STR', 'DEX', 'INT', 'LUK',
  'Max HP', 'Max HP%', 'Max MP', 'Max MP%',
  'Defense'
];

function cumulativeOrderIndex(key) {
  let i = CUMULATIVE_STAT_ORDER.indexOf(key);
  if (i >= 0) return i;
  if (key.endsWith('%')) {
    i = CUMULATIVE_STAT_ORDER.indexOf(key.slice(0, -1));
    if (i >= 0) return i;
  }
  return CUMULATIVE_STAT_ORDER.length;
}

/** Merge cumulative effect lines into combined totals (e.g. "All Stats: +10" + "Max HP: +1,000" → summed). */
function mergeCumulativeEffectLines(lines) {
  if (!lines || lines.length === 0) return [];
  const map = new Map();
  const unmerged = [];
  const re = /^(.+?):\s*\+([\d,]+)(%?)\s*$/;
  lines.forEach(line => {
    const t = line.trim();
    const m = t.match(re);
    if (!m) {
      unmerged.push(t);
      return;
    }
    const [, stat, numStr, pct] = m;
    const key = stat.trim() + (pct || '');
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (!map.has(key)) map.set(key, { stat: stat.trim(), total: 0, pct: !!pct });
    map.get(key).total += num;
  });
  const merged = Array.from(map.entries())
    .sort((a, b) => cumulativeOrderIndex(a[0]) - cumulativeOrderIndex(b[0]))
    .map(([, v]) => (v.pct ? `${v.stat}: +${v.total}%` : `${v.stat}: +${v.total.toLocaleString()}`));
  return merged.concat(unmerged);
}

/** Incremental set effects by tier (2, 3, 4...) for tooltip left column. */
function getSetEffectsByTier(setId, charCategory) {
  const set = GEAR_SETS[setId];
  if (!set) return null;
  return set.effectsByCategory?.[charCategory] || set.effectsByCategory?.Warrior || set.effects || null;
}

/** Build the Sets column (after sprite, before gear). */
function buildSetsCell(char, idx, section) {
  const cell = document.createElement('div');
  cell.className = 'char-sets-cell';
  cell.dataset.idx = idx;

  const headerEl = document.createElement('div');
  headerEl.className = 'sets-header';
  headerEl.textContent = 'Set Effects';

  const lineEl = document.createElement('div');
  lineEl.className = 'sets-line';

  const expandedBlock = document.createElement('div');
  expandedBlock.className = 'sets-expanded';

  cell.append(headerEl, lineEl, expandedBlock);
  return cell;
}

/** Update sets column from current character gear. */
function syncSetsCell(section) {
  const idx = parseInt(section?.dataset.idx, 10);
  if (isNaN(idx) || !chars[idx]) return;
  const char = chars[idx];
  const cell = section?.querySelector('.char-sets-cell');
  if (!cell) return;

  const lineEl = cell.querySelector('.sets-line');
  const expandedBlock = cell.querySelector('.sets-expanded');
  if (!lineEl || !expandedBlock) return;

  const counts = getSetCounts(char);
  const setIds = Object.keys(counts);
  const charCategory = typeof CLASS_CATEGORY !== 'undefined' ? (CLASS_CATEGORY[char.cls] || 'Warrior') : 'Warrior';

  lineEl.innerHTML = '';
  expandedBlock.innerHTML = '';

  if (setIds.length === 0) {
    lineEl.textContent = '—';
    return;
  }

  setIds.forEach(setId => {
    const n = counts[setId];
    const set = GEAR_SETS[setId];
    const name = set?.shortName ?? set?.name ?? setId;
    const color = set?.color ?? 'inherit';
    const achievedTier = getAchievedBonusTier(set, n, charCategory);
    const effectsByTier = getSetEffectsByTier(setId, charCategory);
    const cumulativeRaw = getCumulativeEffectLinesForSet(setId, achievedTier, charCategory);
    const cumulative = mergeCumulativeEffectLines(cumulativeRaw);
    const tag = document.createElement('span');
    tag.className = 'set-tag';
    tag.style.color = color;
    if (color && color !== 'inherit') {
      tag.style.background = color + '1A';
      tag.style.borderColor = color + '88';
    }
    tag.textContent = `${name} (${n})`;
    tag.dataset.setId = setId;
    tag.dataset.count = String(n);
    tag._tooltip = { setId, n, achievedTier, effectsByTier, cumulative, set, charCategory };
    lineEl.appendChild(tag);
    if (setIds.indexOf(setId) < setIds.length - 1) lineEl.appendChild(document.createTextNode(' '));
  });

  /* Expanded: same inline wrapping layout as collapsed; no per-set blocks */
  const expandedLine = document.createElement('div');
  expandedLine.className = 'sets-expanded-line';
  setIds.forEach(setId => {
    const n = counts[setId];
    const set = GEAR_SETS[setId];
    const name = set?.shortName ?? set?.name ?? setId;
    const color = set?.color ?? 'inherit';
    const achievedTier = getAchievedBonusTier(set, n, charCategory);
    const effectsByTier = getSetEffectsByTier(setId, charCategory);
    const cumulativeRaw = getCumulativeEffectLinesForSet(setId, achievedTier, charCategory);
    const cumulative = mergeCumulativeEffectLines(cumulativeRaw);
    const tag = document.createElement('span');
    tag.className = 'set-tag';
    tag.style.color = color;
    if (color && color !== 'inherit') {
      tag.style.background = color + '1A';
      tag.style.borderColor = color + '88';
    }
    tag.textContent = `${name} (${n})`;
    tag.dataset.setId = setId;
    tag.dataset.count = String(n);
    tag._tooltip = { setId, n, achievedTier, effectsByTier, cumulative, set, charCategory };
    expandedLine.appendChild(tag);
    if (setIds.indexOf(setId) < setIds.length - 1) expandedLine.appendChild(document.createTextNode(' '));
  });
  expandedBlock.appendChild(expandedLine);

  /* Total Cumulative Set Bonuses: merge cumulative from all sets into one list */
  const allCumulativeLines = [];
  setIds.forEach(setId => {
    const n = counts[setId];
    const set = GEAR_SETS[setId];
    const achievedTier = getAchievedBonusTier(set, n, charCategory);
    const raw = getCumulativeEffectLinesForSet(setId, achievedTier, charCategory);
    const merged = mergeCumulativeEffectLines(raw);
    allCumulativeLines.push(...merged);
  });
  const totalCumulative = mergeCumulativeEffectLines(allCumulativeLines);
  if (totalCumulative.length > 0) {
    const totalHead = document.createElement('div');
    totalHead.className = 'sets-total-cumulative-head';
    totalHead.textContent = 'Total Cumulative Set Bonuses';
    expandedBlock.appendChild(totalHead);
    const totalList = document.createElement('div');
    totalList.className = 'sets-total-cumulative';
    totalCumulative.forEach(line => {
      const p = document.createElement('div');
      p.className = 'sets-total-cumulative-line';
      p.textContent = line;
      totalList.appendChild(p);
    });
    expandedBlock.appendChild(totalList);
  }

  attachSetTooltip(lineEl);
  attachSetTooltip(expandedBlock);
}

let setsTooltipEl = null;
let setsTooltipTimer = null;

function attachSetTooltip(container) {
  if (!container) return;
  container.querySelectorAll('.set-tag, .set-block-title').forEach(el => {
    const data = el._tooltip;
    if (!data) return;
    el.addEventListener('mouseenter', function (e) {
      clearTimeout(setsTooltipTimer);
      setsTooltipTimer = setTimeout(() => showSetTooltip(e, data), 500);
    });
    el.addEventListener('mouseleave', function () {
      clearTimeout(setsTooltipTimer);
      setsTooltipTimer = null;
      hideSetTooltip();
    });
  });
}

function showSetTooltip(e, data) {
  if (!data || !data.set) return;
  if (!setsTooltipEl) {
    setsTooltipEl = document.createElement('div');
    setsTooltipEl.className = 'sets-tooltip';
    document.body.appendChild(setsTooltipEl);
  }
  const { setId, n, achievedTier, effectsByTier, cumulative, set } = data;
  const name = set.name ?? set.shortName ?? setId;
  const tierLabel = (achievedTier != null && achievedTier > 0) ? achievedTier : n;
  let leftHtml = '<div class="sets-tt-head">' + escHtml(name) + ' Effects</div>';
  if (effectsByTier) {
    [2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(i => {
      if (!effectsByTier[i]) return;
      leftHtml += `<div class="sets-tt-tier">${i} set:</div>`;
      effectsByTier[i].forEach(line => leftHtml += `<div class="sets-tt-line">${escHtml(line)}</div>`);
    });
  }
  let rightHtml = '<div class="sets-tt-head">Cumulative (' + tierLabel + ' set)</div>';
  (cumulative || []).forEach(line => rightHtml += `<div class="sets-tt-line">${escHtml(line)}</div>`);
  setsTooltipEl.innerHTML = '<div class="sets-tt-col">' + leftHtml + '</div><div class="sets-tt-col">' + rightHtml + '</div>';
  setsTooltipEl.style.display = 'flex';
  requestAnimationFrame(() => positionSetTooltip(e));
}

function positionSetTooltip(e) {
  if (!setsTooltipEl || setsTooltipEl.style.display !== 'flex') return;
  const rect = setsTooltipEl.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;
  const pad = 8;
  let left = x + pad;
  let top = y + pad;
  if (left + rect.width > window.innerWidth) left = x - rect.width - pad;
  if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - pad;
  if (top < 0) top = pad;
  if (left < 0) left = pad;
  setsTooltipEl.style.left = left + 'px';
  setsTooltipEl.style.top = top + 'px';
}

function hideSetTooltip() {
  if (setsTooltipEl) setsTooltipEl.style.display = 'none';
}

/**
 * Main render function - rebuilds the entire character list UI.
 * Clears existing content and creates fresh DOM elements for all characters.
 * Also updates toggle buttons and enforces character limits.
 */
function render() {
  document.querySelectorAll('.gear-sel-panel').forEach(p => p.remove());
  const list = document.getElementById('char-list');
  if (!list) return;
  list.innerHTML = '';
  const fragment = document.createDocumentFragment();
  chars.forEach((c, i) => fragment.appendChild(buildSection(c, i)));
  list.appendChild(fragment);
  updateToggleBtn();
  if (typeof multiSelectMode !== 'undefined' && multiSelectMode) {
    list.classList.add('multiselect-active');
  }
  var atLimit = typeof MAX_CHARACTERS !== 'undefined' && chars.length >= MAX_CHARACTERS;
  ['openAddBtn', 'openAddBtn2', 'openImportBtn'].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) {
      btn.disabled = atLimit;
      btn.title = atLimit ? 'Character limit (' + MAX_CHARACTERS + ') reached' : '';
    }
  });
}

/** Rebuild only the section at index (avoids full list re-render for single-character updates). */
function updateSection(idx) {
  const list = document.getElementById('char-list');
  if (!list || idx < 0 || idx >= chars.length) return;
  const sections = list.querySelectorAll('.char-section');
  const oldSection = sections[idx];
  if (!oldSection) return;
  const newSection = buildSection(chars[idx], idx);
  oldSection.replaceWith(newSection);
}

/**
 * Build a row of symbol cells (Arcane or Sacred): icon + level input with up/down buttons.
 * Locked (unavailable) symbols show no level (empty), not 1.
 */
function buildSymbolRow(symbolsList, char, charIdx, charLevel) {
  const row = document.createElement('div');
  if (!symbolsList || symbolsList.length === 0) return row;
  const symbols = char.symbols && typeof char.symbols === 'object' ? char.symbols : {};
  symbolsList.forEach(sym => {
    const cell = document.createElement('div');
    cell.className = 'symbol-cell';
    const locked = charLevel < sym.unlockLevel;
    if (locked) cell.classList.add('symbol-locked');
    const img = document.createElement('img');
    img.className = 'symbol-icon';
    img.src = 'MapleIcons/Symbols/' + sym.icon + '.png';
    img.alt = sym.id;
    img.title = locked ? sym.id + ' - Requires Lv. ' + sym.unlockLevel : sym.id;
    const lvWrap = document.createElement('div');
    lvWrap.className = 'symbol-lv-wrap';
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'symbol-lv';
    input.min = 1;
    input.max = sym.maxLevel;
    if (locked) {
      input.value = '';
      input.placeholder = '';
      input.disabled = true;
    } else {
      input.value = Math.min(sym.maxLevel, Math.max(1, parseInt(symbols[sym.id], 10) || 1));
    }
    input.title = 'Lv. 1–' + sym.maxLevel;
    input.addEventListener('focus', () => input.select());
    input.addEventListener('change', () => {
      if (locked || !chars[charIdx] || !chars[charIdx].symbols) return;
      let v = parseInt(input.value, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > sym.maxLevel) v = sym.maxLevel;
      input.value = v;
      chars[charIdx].symbols[sym.id] = v;
      if (typeof save === 'function') save();
    });
    function applyDelta(delta) {
      if (locked || !chars[charIdx] || !chars[charIdx].symbols) return;
      let v = parseInt(input.value, 10);
      if (isNaN(v)) v = 1;
      v = Math.min(sym.maxLevel, Math.max(1, v + delta));
      input.value = v;
      chars[charIdx].symbols[sym.id] = v;
      if (typeof save === 'function') save();
    }
    const spinner = document.createElement('div');
    spinner.className = 'symbol-spinner';
    const btnUp = document.createElement('button');
    btnUp.type = 'button';
    btnUp.className = 'symbol-btn symbol-btn-up';
    btnUp.tabIndex = -1;
    btnUp.textContent = '▲';
    btnUp.title = 'Increase level';
    if (locked) btnUp.disabled = true;
    btnUp.addEventListener('click', () => applyDelta(1));
    const btnDown = document.createElement('button');
    btnDown.type = 'button';
    btnDown.className = 'symbol-btn symbol-btn-down';
    btnDown.tabIndex = -1;
    btnDown.textContent = '▼';
    btnDown.title = 'Decrease level';
    if (locked) btnDown.disabled = true;
    btnDown.addEventListener('click', () => applyDelta(-1));
    spinner.append(btnUp, btnDown);
    lvWrap.append(input, spinner);
    cell.append(img, lvWrap);
    row.appendChild(cell);
  });
  return row;
}

function buildSection(char, idx) {
  const section = document.createElement('div');
  const viewMode = char.viewMode || 'expanded';
  section.className = 'char-section ' + viewMode + (idx % 2 === 1 ? ' zebra-odd' : '');
  section.dataset.idx = idx;

  /* ── left meta strip ── */
  const meta = document.createElement('div');
  meta.className = 'row-meta';

  const handle = document.createElement('span');
  handle.className = 'drag-handle';
  handle.textContent = '≡';
  handle.title = 'Drag to reorder / Click for options';

  handle.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.handle-menu').forEach(m => m.remove());
    const menu = document.createElement('div');
    menu.className = 'handle-menu';
    const editBtn = document.createElement('button');
    editBtn.textContent = '✎  Edit';
    editBtn.addEventListener('click', (e) => { e.stopPropagation(); menu.remove(); editChar(idx); });
    const presetBtn = document.createElement('button');
    presetBtn.textContent = '⚙  Gear Presets';
    presetBtn.addEventListener('click', (e) => { e.stopPropagation(); menu.remove(); openPresetModal(idx); });
    const starsBtn = document.createElement('button');
    starsBtn.textContent = '☆  Set All Starforce';
    starsBtn.addEventListener('click', (e) => { e.stopPropagation(); menu.remove(); openStarsModal(idx); });
    const delBtn = document.createElement('button');
    delBtn.className = 'menu-delete';
    delBtn.textContent = '✕  Delete';
    delBtn.addEventListener('click', (e) => { e.stopPropagation(); menu.remove(); deleteChar(idx); });
    menu.append(editBtn, presetBtn, starsBtn, delBtn);
    document.body.appendChild(menu);
    const rect = handle.getBoundingClientRect();
    menu.style.left = rect.left + 'px';
    const gap = 4;
    const paddingFromBottom = 12;
    const menuHeight = menu.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom - paddingFromBottom;
    if (spaceBelow >= menuHeight) {
      menu.style.top = (rect.bottom + gap) + 'px';
    } else {
      menu.style.top = (rect.top - menuHeight - gap) + 'px';
    }
    setTimeout(() => {
      document.addEventListener('click', () => menu.remove(), { once: true });
    }, 0);
  });

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.innerHTML = '&#9660;';
  const titles = { expanded: 'Compact', compact: 'Collapse', collapsed: 'Expand' };
  toggleBtn.title = titles[viewMode] || 'Toggle';
  toggleBtn.addEventListener('click', () => { toggleChar(idx); });

  const selCb = document.createElement('input');
  selCb.type = 'checkbox';
  selCb.className = 'row-select-cb';
  selCb.dataset.idx = idx;
  selCb.checked = selectedIndices.has(idx);
  selCb.addEventListener('change', () => {
    if (selCb.checked) selectedIndices.add(idx); else selectedIndices.delete(idx);
    updateMsBar();
  });
  meta.append(selCb, toggleBtn, handle);

  /* ── character info cell ── */
  const infoCell = document.createElement('div');
  infoCell.className = 'char-info-cell';

  const charLevel = char.level != null ? Number(char.level) : 0;
  const arcaneRow = buildSymbolRow(typeof ARCANE_SYMBOLS !== 'undefined' ? ARCANE_SYMBOLS : [], char, idx, charLevel);
  arcaneRow.className = 'arcane-symbols-row symbols-row';

  const spriteWrap = document.createElement('div');
  spriteWrap.className = 'char-sprite-wrap';
  
  // Inner Ability table (above sprite)
  if (typeof buildInnerAbilityTable === 'function') {
    const iaTable = buildInnerAbilityTable(char, idx);
    spriteWrap.appendChild(iaTable);
  }
  
  const spriteInner = document.createElement('div');
  spriteInner.className = 'char-sprite-inner';
  if (char.imageUrl && isSafeImageUrl(char.imageUrl)) {
    const img = document.createElement('img');
    img.className = 'char-sprite';
    img.loading = 'lazy';
    img.src = char.imageUrl.trim();
    img.alt = char.name;
    img.onerror = () => {
      spriteInner.innerHTML = '';
      const fallback = document.createElement('img');
      fallback.className = 'char-sprite';
      fallback.src = 'MapleIcons/Character_Self.png';
      fallback.alt = char.name || 'Character';
      fallback.onerror = () => {
        spriteInner.innerHTML = '';
        const ph = document.createElement('div');
        ph.className = 'char-sprite-placeholder';
        ph.textContent = '🧙';
        spriteInner.appendChild(ph);
      };
      spriteInner.appendChild(fallback);
    };
    spriteInner.appendChild(img);
  } else {
    const img = document.createElement('img');
    img.className = 'char-sprite';
    img.src = 'MapleIcons/Character_Self.png';
    img.alt = char.name || 'Character';
    img.onerror = () => {
      spriteInner.innerHTML = '';
      const ph = document.createElement('div');
      ph.className = 'char-sprite-placeholder';
      ph.textContent = '🧙';
      spriteInner.appendChild(ph);
    };
    spriteInner.appendChild(img);
  }
  spriteWrap.appendChild(spriteInner);

  const text = document.createElement('div');
  text.className = 'char-text';
  const canonicalClassForCat = (typeof CLASS_NAME_ALIAS !== 'undefined' && CLASS_NAME_ALIAS[char.cls]) ? CLASS_NAME_ALIAS[char.cls] : char.cls;
  const clsCategory = CLASS_CATEGORY[canonicalClassForCat] ?? null;
  const blockIcon = clsCategory ? LEGION_BLOCK_ICON[clsCategory] : null;
  const tileIcon  = getLegionTileIcon(char.cls, char.level);
  const rank      = getLegionRank(char.level, char.cls);
  const blockImg  = blockIcon
    ? `<img class="legion-block-icon" src="${escHtml(blockIcon)}" alt="${escHtml(clsCategory)}" title="${escHtml(clsCategory)}">`
    : '';
  text.innerHTML = `
    <div class="char-name" title="${escHtml(char.name)}">${escHtml(char.name)}</div>
    <div class="char-level">${char.level ? 'Lv. ' + char.level : 'Lv. ?'}</div>
    <div class="char-cls-world">
      <div class="cls-line">${blockImg}<span class="cls">${escHtml(char.cls || '—')}</span></div>
      <div class="world-part">${char.world ? escHtml(char.world) : ''}</div>
      <div class="legion-icons-row"></div>
    </div>
  `;

  if (char.cls) {
    const clsSpan = text.querySelector('.cls');
    if (clsSpan) {
      clsSpan.dataset.clsTooltip = char.cls;
      clsSpan.dataset.clsLevel   = char.level ?? '';
      if (clsCategory) clsSpan.dataset.clsCat = clsCategory;
    }
  }

  const sacredRow = buildSymbolRow(typeof SACRED_SYMBOLS !== 'undefined' ? SACRED_SYMBOLS : [], char, idx, charLevel);
  sacredRow.className = 'sacred-symbols-row symbols-row';

  const grandSacredRow = buildSymbolRow(typeof GRAND_SACRED_SYMBOLS !== 'undefined' ? GRAND_SACRED_SYMBOLS : [], char, idx, charLevel);
  grandSacredRow.className = 'grand-sacred-symbols-row symbols-row';

  const middleWrap = document.createElement('div');
  middleWrap.className = 'char-info-middle';
  middleWrap.appendChild(text);

  infoCell.append(middleWrap, arcaneRow, sacredRow);

  spriteWrap.appendChild(grandSacredRow);

  /* ── gear content ── */
  const gearContent = document.createElement('div');
  gearContent.className = 'gear-content';

  const gearRows = document.createElement('div');
  gearRows.className = 'gear-rows';

  [ROW_1_SLOTS, ROW_2_SLOTS].forEach(rowSlots => {
    const gearRow = document.createElement('div');
    gearRow.className = 'gear-row';
    rowSlots.forEach(slot => gearRow.appendChild(buildSlot(char, idx, slot, section)));
    gearRows.appendChild(gearRow);
  });

  const summary = document.createElement('div');
  summary.className = 'gear-summary';

  [ROW_1_SLOTS, ROW_2_SLOTS].forEach(rowSlots => {
    const summaryRow = document.createElement('div');
    summaryRow.className = 'summary-row';
    rowSlots.forEach(slot => summaryRow.appendChild(buildSummaryChip(char, slot)));
    summary.appendChild(summaryRow);
  });

  gearContent.append(gearRows, summary);

  // Build dedicated compact mode structure
  const compactGear = document.createElement('div');
  compactGear.className = 'compact-gear';
  
  [ROW_1_SLOTS, ROW_2_SLOTS].forEach((rowSlots, rowIndex) => {
    // Chip row
    const compactChipRow = document.createElement('div');
    compactChipRow.className = 'compact-chip-row';
    rowSlots.forEach(slot => {
      const gd = char.gear[slot] || { item: 'None', stars: 0 };
      const compactChip = document.createElement('div');
      compactChip.className = 'compact-chip';
      compactChip.dataset.slot = slot;
      const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(gd.item, slot) : null;
      compactChip.textContent = gd.item === 'None' ? `NO ${SLOT_ABBR[slot] ?? slot.toUpperCase()}` : gd.item;
      if (gearSet?.color) {
        compactChip.style.color = gearSet.color;
        compactChip.style.background = gearSet.color + '1A';
      } else {
        compactChip.style.background = '#373737';
      }
      compactChipRow.appendChild(compactChip);
    });
    compactGear.appendChild(compactChipRow);
    
    // Star row
    const compactStarRow = document.createElement('div');
    compactStarRow.className = 'compact-star-row';
    rowSlots.forEach(slot => {
      const gd = char.gear[slot] || { item: 'None', stars: 0 };
      const compactStarWrap = document.createElement('div');
      compactStarWrap.className = 'compact-star-wrap';
      compactStarWrap.dataset.slot = slot;
      
      const isOz = typeof isOzRing === 'function' && isOzRing(gd.item);
      
      // Check if this item can have stars
      const canHaveStar = (slot === 'Secondary Weapon' && char.cls === 'Zero') || 
                          (typeof itemHasStars === 'function' && itemHasStars(slot, gd.item));
      
      if (isOz) {
        // Oz Ring dropdown with wrapper and chevron to match Expanded
        const compactOzWrap = document.createElement('div');
        compactOzWrap.className = 'compact-oz-wrap';
        const ozSelect = document.createElement('select');
        ozSelect.className = 'compact-oz-select gear-select';
        [1, 2, 3, 4, 5, 6].forEach(n => {
          const opt = document.createElement('option');
          opt.value = n;
          opt.textContent = `Level ${n}`;
          const ozVal = (gd.stars >= 1 && gd.stars <= 6) ? gd.stars : 4;
          if (ozVal === n) opt.selected = true;
          ozSelect.appendChild(opt);
        });
        ozSelect.addEventListener('change', (e) => {
          const val = parseInt(e.target.value, 10);
          chars[idx].gear[slot] = chars[idx].gear[slot] || {};
          chars[idx].gear[slot].stars = val;
          save();
          const mainSelect = section.querySelector(`.gear-slot[data-slot="${slot}"] .oz-level-select`);
          if (mainSelect) mainSelect.value = val;
        });
        const ozChevron = document.createElement('span');
        ozChevron.className = 'compact-oz-chevron';
        ozChevron.setAttribute('aria-hidden', 'true');
        ozChevron.textContent = '▼';
        compactOzWrap.append(ozSelect, ozChevron);
        compactStarWrap.appendChild(compactOzWrap);
      } else if (canHaveStar) {
        // Regular star input - only show if item can have stars
        const compactStarInput = document.createElement('input');
        compactStarInput.type = 'text';
        compactStarInput.inputMode = 'numeric';
        compactStarInput.className = 'compact-star-input';
        compactStarInput.value = gd.stars || 0;
        
        // Check if this is Zero's secondary weapon or has fixed stars
        const isZeroHeavy = char.cls === 'Zero' && slot === 'Secondary Weapon';
        const fixedStars = typeof getFixedStars === 'function' ? getFixedStars(slot, gd.item) : null;
        
        if (isZeroHeavy || fixedStars != null) {
          compactStarInput.readOnly = true;
          compactStarInput.disabled = true;
        }
        
        compactStarInput.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10) || 0;
          const maxStars = typeof getMaxStars === 'function' ? getMaxStars(slot, gd.item) : 25;
          const clamped = Math.max(0, Math.min(maxStars, val));
          e.target.value = clamped;
        });
        
        compactStarInput.addEventListener('change', () => {
          const val = parseInt(compactStarInput.value, 10) || 0;
          const maxStars = typeof getMaxStars === 'function' ? getMaxStars(slot, gd.item) : 25;
          const clamped = Math.max(0, Math.min(maxStars, val));
          compactStarInput.value = clamped;
          chars[idx].gear[slot] = chars[idx].gear[slot] || {};
          chars[idx].gear[slot].stars = clamped;
          
          // If Zero's weapon changed, update secondary weapon
          if (char.cls === 'Zero' && slot === 'Weapon') {
            syncZeroWeapons(idx, clamped, section);
          }
          
          save();
          const mainStarInput = section.querySelector(`.gear-slot[data-slot="${slot}"] .star-input`);
          if (mainStarInput) mainStarInput.value = clamped;
          const mainChip = section.querySelector(`.summary-chip[data-slot="${slot}"]`);
          if (mainChip) applyChipStyle(mainChip, gd.item, clamped);
        });
        compactStarWrap.appendChild(compactStarInput);
        
        const starsLabel = document.createElement('span');
        starsLabel.className = 'compact-stars-label';
        starsLabel.textContent = 'Stars';
        compactStarWrap.appendChild(starsLabel);
      }
      
      const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(gd.item, slot) : null;
      if (gearSet?.color) {
        compactStarWrap.style.background = gearSet.color + '1A';
      } else {
        compactStarWrap.style.background = '#373737';
      }
      compactStarRow.appendChild(compactStarWrap);
    });
    compactGear.appendChild(compactStarRow);
  });
  
  gearContent.appendChild(compactGear);

  const setsCell = buildSetsCell(char, idx, section);

  const charRow = document.createElement('div');
  charRow.className = 'char-row';
  charRow.append(meta, infoCell, spriteWrap, setsCell, gearContent);
  section.appendChild(charRow);
  syncSetsCell(section);

  // Sync gear-slot border colors after section is built
  [ROW_1_SLOTS, ROW_2_SLOTS].flat().forEach(slot => {
    const gd = char.gear[slot] || { item: 'None', stars: 0 };
    syncChip(section, slot, gd.item ?? 'None', gd.stars ?? 0);
  });

  wireExclusiveSlots(section, ['Ring 1', 'Ring 2', 'Ring 3', 'Ring 4'], idx);
  wireExclusiveSlots(section, ['Pendant 1', 'Pendant 2'], idx);

  const topItem = char.gear['Top/Overall']?.item ?? 'None';
  if (ITEM_META[topItem]?.isOverall) {
    updateBottomForOverall(section, true, /*skipSave=*/true);
  }

  setupDnD(section, idx);

  return section;
}

/**
 * Wires a group of same-type slots (e.g. Ring 1–4, Pendant 1–2) so that
 * each slot's dropdown hides items already equipped in sibling slots,
 * and resets any sibling that would become a duplicate when a value is chosen.
 */
function wireExclusiveSlots(section, slotNames, charIdx) {
  const slots = slotNames.map(name => {
    const slotEl = section.querySelector(`.gear-slot[data-slot="${name}"]`);
    return slotEl ? { name, slotEl } : null;
  }).filter(Boolean);
  if (slots.length < 2) return;

  function refreshExclusions() {
    slots.forEach(({ slotEl: el }) => {
      const wrap = el.querySelector('.gear-sel-wrap');
      if (!wrap) return;
      const excluded = new Set();
      slots.forEach(({ slotEl: other }) => {
        if (other === el) return;
        const otherSel = other.querySelector('.gear-select');
        if (otherSel && otherSel.value !== 'None') excluded.add(otherSel.value);
      });
      wrap._excluded = excluded;
    });
  }

  slots.forEach(({ slotEl }) => {
    const sel = slotEl.querySelector('.gear-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
      if (sel.value !== 'None') {
        slots.forEach(({ slotEl: sib }) => {
          if (sib === slotEl) return;
          const sibSel = sib.querySelector('.gear-select');
          if (sibSel && sibSel.value === sel.value) {
            sibSel.value = 'None';
            sibSel.dispatchEvent(new Event('change'));
          }
        });
      }
      refreshExclusions();
    });
  });

  refreshExclusions();
}

/** Creates and styles a single summary chip for the collapsed view. */
function buildSummaryChip(char, slot) {
  const gd = char.gear[slot] || { item: 'None', stars: 0 };
  const chip = document.createElement('span');
  chip.className = 'summary-chip';
  chip.dataset.slot = slot;
  applyChipStyle(chip, gd.item ?? 'None', gd.stars ?? 0);
  return chip;
}

/** Finds a chip in the section's summary and refreshes its style + text. */
function syncChip(section, slot, itemLabel, stars) {
  if (!section) return;
  const chip = section.querySelector(`.summary-chip[data-slot="${slot}"]`);
  if (chip) applyChipStyle(chip, itemLabel, stars);
}

/**
 * Sets chip text, color, and tooltip.
 *   • Equipped item in a GEAR_SET → set color
 *   • Otherwise (including None) → default/white
 */
function applyChipStyle(chip, itemLabel, stars) {
  const slot   = chip.dataset.slot;
  const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(itemLabel, slot) : null;
  const isNone = itemLabel === 'None';

  let suffix = '';
  if (slot && !isNone) {
    if (itemHasStars(slot, itemLabel)) suffix = ' (' + stars + '\u2605)';
    else if (isOzRing(itemLabel)) suffix = ' Lv. ' + Math.max(1, Math.min(6, parseInt(stars, 10) || (typeof OZ_RING_DEFAULT_LEVEL !== 'undefined' ? OZ_RING_DEFAULT_LEVEL : 4)));
  }

  const ozLevel = isOzRing(itemLabel) ? Math.max(1, Math.min(6, parseInt(stars, 10) || (typeof OZ_RING_DEFAULT_LEVEL !== 'undefined' ? OZ_RING_DEFAULT_LEVEL : 4))) : null;
  chip.textContent = isNone
    ? `NO ${SLOT_ABBR[slot] ?? slot.toUpperCase()}`
    : itemLabel + (ozLevel != null ? ' ' + ozLevel : '');
  chip.title = `${slot}: ${itemLabel}${suffix}`;
  chip.classList.toggle('chip-none', isNone);

  if (!isNone && gearSet?.color) {
    chip.style.color       = gearSet.color;
    chip.style.borderRightColor = '';
    chip.style.background  = gearSet.color + '1A';
  } else {
    chip.style.color = '';
    chip.style.borderRightColor = '';
    chip.style.background  = 'rgba(255,255,255,0.06)';
  }

  // Apply matching background color to gear-slot in compact mode only
  const section = chip.closest('.char-section');
  if (section && section.classList.contains('compact') && slot) {
    const gearSlot = section.querySelector(`.gear-slot[data-slot="${slot}"]`);
    if (gearSlot) {
      if (!isNone && gearSet?.color) {
        gearSlot.style.background = gearSet.color + '1A';
      } else {
        gearSlot.style.background = '';
      }
    }
  }
}

/** Applies/removes the N/A state on the Bottom slot based on whether an Overall is equipped. */
function updateBottomForOverall(section, isOverall, skipSave = false) {
  const bottomSlot = section.querySelector('.gear-slot[data-slot="Bottom"]');
  if (!bottomSlot) return;

  const sel      = bottomSlot.querySelector('.gear-select');
  const iconWrap = bottomSlot.querySelector('.gear-icon-wrap');
  const charIdx  = parseInt(section.dataset.idx, 10);

  bottomSlot.classList.toggle('slot-na', isOverall);
  if (sel) sel.disabled = isOverall;

  if (isOverall) {
    if (!skipSave) {
      chars[charIdx].gear['Bottom'] = { item: 'None', stars: 0 };
      save();
    }
    if (sel) { sel.value = 'None'; sel._syncDisplay?.(); }
    if (iconWrap) { iconWrap.innerHTML = ''; const b = makeNaBadge(); b.title = 'N/A — Overall equipped'; iconWrap.appendChild(b); }
    bottomSlot.querySelectorAll('.star-row').forEach(r => r.classList.add('hidden'));
    syncChip(section, 'Bottom', 'None', 0);
  } else {
    if (iconWrap) { iconWrap.innerHTML = ''; iconWrap.appendChild(makeNaBadge()); }
  }
}

function buildSlot(char, charIdx, slot, section) {
  const gearData    = char.gear[slot] || { item: 'None', stars: 0 };
  let currentItem   = gearData.item ?? 'None';
  const slotEl      = document.createElement('div');
  slotEl.className  = 'gear-slot';
  slotEl.dataset.slot = slot;

  const hdr = document.createElement('div');
  hdr.className = 'slot-header';
  hdr.textContent = slot;

  const body = document.createElement('div');
  body.className = 'slot-body';

  const canonicalClass = (typeof CLASS_NAME_ALIAS !== 'undefined' && CLASS_NAME_ALIAS[char.cls]) ? CLASS_NAME_ALIAS[char.cls] : char.cls;
  const classWeapons = slot === 'Weapon' ? getWeaponItemsForClass(canonicalClass) : null;
  const allItems     = classWeapons ?? SLOT_ITEMS[slot] ?? [];
  const charCat      = CLASS_CATEGORY[canonicalClass] || '';

  // Resolve generic CRA Hat/Top/Bottom to class-specific name (e.g. CRA Hat → Royal Dunwitch Hat for Mages)
  if (typeof GENERIC_CRA_ARMOR_LABELS !== 'undefined' && GENERIC_CRA_ARMOR_LABELS.has(currentItem) &&
      (slot === 'Hat' || slot === 'Top/Overall' || slot === 'Bottom') && typeof resolvePresetGearSlot === 'function') {
    const resolved = resolvePresetGearSlot(slot, currentItem, canonicalClass);
    if (resolved && resolved !== currentItem) {
      currentItem = resolved;
      chars[charIdx].gear[slot] = { ...chars[charIdx].gear[slot], item: resolved };
      if (typeof save === 'function') save();
    }
  }
  // Resolve legacy generic Frozen / Princess No secondary to class-specific named item (Zero → set None)
  if (slot === 'Secondary Weapon' && typeof resolvePresetSecondary === 'function') {
    const resolved = resolvePresetSecondary(canonicalClass, currentItem);
    if (resolved && resolved !== currentItem) {
      currentItem = resolved;
      chars[charIdx].gear[slot] = { ...chars[charIdx].gear[slot], item: resolved };
      if (typeof save === 'function') save();
    } else if (currentItem === 'Frozen Secondary' || currentItem === 'Princess No Secondary') {
      currentItem = 'None';
      chars[charIdx].gear[slot] = { ...chars[charIdx].gear[slot], item: 'None' };
      if (typeof save === 'function') save();
    }
  }

  let items;
  let effectiveItem  = currentItem;
  if (slot === 'Secondary Weapon' && char.cls === 'Zero') {
    const weapon = char.gear['Weapon']?.item;
    const zeroItems = typeof getZeroSecondaryItems !== 'undefined' ? getZeroSecondaryItems(weapon) : [];
    const forcedHeavy = zeroItems.length ? zeroItems[0].label : 'Utgard Heavy Sword';
    const weaponStars = char.gear['Weapon']?.stars ?? 0;
    chars[charIdx].gear[slot] = { item: forcedHeavy, stars: weaponStars };
    effectiveItem = forcedHeavy;
    items = zeroItems.length ? zeroItems : [{ label: forcedHeavy, tier: ITEM_TIER[forcedHeavy] || 'Pensalir' }];
  } else if (classWeapons) {
    const hasCurrent = currentItem === 'None' || classWeapons.some(it => it.label === currentItem);
    items = hasCurrent
      ? classWeapons
      : [{ label: currentItem, tier: ITEM_TIER[currentItem] ?? 'None' }, ...classWeapons];
  } else {
    items = allItems.filter(it => {
      if (it.excl && it.excl.includes(canonicalClass)) return it.label === currentItem;
      // Hide generic CRA Hat/Top/Bottom from dropdown; we list the named variants (e.g. Royal Assassin Hood) per class
      if (typeof GENERIC_CRA_ARMOR_LABELS !== 'undefined' && GENERIC_CRA_ARMOR_LABELS.has(it.label) && it.label !== currentItem) return false;
      if (!it.cls || it.cls.length === 0) return true;
      if (it.cls.includes(canonicalClass)) return true;
      if (charCat && it.cls.includes(charCat)) return true;
      return it.label === currentItem;
    });
    // Secondary Weapon (non-Zero): show class-specific names only, like Weapons/Emblems — resolve generic options to class-specific so no duplicate (e.g. "Princess No Secondary" → "Princess No's Soul Orb" for Luminous)
    if (slot === 'Secondary Weapon' && char.cls !== 'Zero' && typeof resolvePresetSecondary === 'function') {
      const genericLabels = ['Lv. 100 Secondary', 'Frozen Secondary', 'Princess No Secondary'];
      items = items.map(it => {
        if (genericLabels.includes(it.label)) {
          const resolved = resolvePresetSecondary(canonicalClass, it.label);
          return resolved ? { label: resolved, tier: it.tier } : it;
        }
        return it;
      });
      items = items.filter((it, i, arr) => arr.findIndex(x => x.label === it.label) === i);
    }
  }
  // Ring slots: only one of each exclusive group (e.g. Guardian Angel / Dawn Guardian) across all four rings
  const RING_SLOTS_ARR = ['Ring 1', 'Ring 2', 'Ring 3', 'Ring 4'];
  if (RING_SLOTS_ARR.includes(slot) && typeof getRingExclusiveGroup === 'function') {
    const otherRingSlots = RING_SLOTS_ARR.filter(s => s !== slot);
    const otherHasGuardian = otherRingSlots.some(s => {
      const g = getRingExclusiveGroup(chars[charIdx].gear[s]?.item);
      return g != null;
    });
    const currentGroup = getRingExclusiveGroup(currentItem);
    if (otherHasGuardian && !currentGroup) {
      items = items.filter(it => getRingExclusiveGroup(it.label) == null);
    }
  }
  const { wrap: selWrap, sel } = makeGearSelect(items, effectiveItem, STANDALONE_SLOTS.has(slot), slot);
  if (slot === 'Secondary Weapon' && char.cls === 'Zero') sel.disabled = true;

  const iconWrap = document.createElement('div');
  iconWrap.className = 'gear-icon-wrap';

  const starRow = document.createElement('div');
  starRow.className = 'star-row';

  const starInput = document.createElement('input');
  starInput.type = 'text';
  starInput.inputMode = 'numeric';
  starInput.className = 'star-input';
  starInput.setAttribute('aria-label', 'Stars');
  const isZeroHeavy = slot === 'Secondary Weapon' && char.cls === 'Zero';
  const fixedStars = typeof getFixedStars === 'function' ? getFixedStars(slot, gearData.item ?? currentItem) : null;
  let initialStars = isZeroHeavy ? (char.gear['Weapon']?.stars ?? 0) : (gearData.stars ?? 0);
  if (fixedStars != null) {
    initialStars = fixedStars;
    if (gearData.item && chars[charIdx].gear[slot]) {
      chars[charIdx].gear[slot].stars = fixedStars;
      save();
    }
  } else if (!isZeroHeavy && typeof getMaxStars === 'function') {
    const maxStars = getMaxStars(slot, gearData.item ?? currentItem);
    initialStars = Math.max(0, Math.min(maxStars, initialStars));
    if (gearData.item && gearData.item !== 'None' && initialStars !== (gearData.stars ?? 0) && chars[charIdx].gear[slot]) {
      chars[charIdx].gear[slot].stars = initialStars;
      save();
    }
  }
  starInput.value = String(initialStars);
  if (isZeroHeavy || fixedStars != null) {
    starInput.readOnly = true;
    starInput.disabled = true;
  }

  const starLbl = document.createElement('span');
  starLbl.className = 'star-lbl';
  starLbl.textContent = 'Stars';
  starRow.append(starInput, starLbl);

  const ozRow = document.createElement('div');
  ozRow.className = 'star-row';

  const ozWrap = document.createElement('div');
  ozWrap.className = 'oz-level-wrap';
  const ozSel = document.createElement('select');
  ozSel.className = 'gear-select oz-level-select';
  ozSel.tabIndex = -1;
  const ozDefault = typeof OZ_RING_DEFAULT_LEVEL !== 'undefined' ? OZ_RING_DEFAULT_LEVEL : 4;
  [1, 2, 3, 4, 5, 6].forEach(n => {
    const o = document.createElement('option');
    o.value = n;
    o.textContent = `Level ${n}`;
    const ozVal = (gearData.stars >= 1 && gearData.stars <= 6) ? gearData.stars : ozDefault;
    if (ozVal === n) o.selected = true;
    ozSel.appendChild(o);
  });
  const ozChevron = document.createElement('span');
  ozChevron.className = 'oz-level-chevron';
  ozChevron.setAttribute('aria-hidden', 'true');
  ozChevron.textContent = '▼';
  ozWrap.append(ozSel, ozChevron);
  ozRow.append(ozWrap);

  const noneTxt = document.createElement('div');
  noneTxt.className = 'none-text hidden';

  function applyInputVisibility(itemLabel) {
    const showStar = (slot === 'Secondary Weapon' && char.cls === 'Zero') || itemHasStars(slot, itemLabel);
    const showOz   = itemLabel !== 'None' && isOzRing(itemLabel);
    starRow.classList.toggle('hidden', !showStar);
    ozRow.classList.toggle('hidden', !showOz);
  }
  applyInputVisibility(effectiveItem || currentItem);

  const tierForIcon = (slot === 'Secondary Weapon' && char.cls !== 'Zero' && currentItem !== 'None' && (typeof ITEM_TIER === 'undefined' || !ITEM_TIER[currentItem]))
    ? (currentItem.startsWith("Princess No's") ? 'PrincessNo' : currentItem.startsWith('Frozen ') ? 'Frozen' : 'Pensalir')
    : (ITEM_TIER[currentItem] ?? 'None');
  renderGearIcon(iconWrap, tierForIcon, slot, currentItem, canonicalClass);

  function applyStarValue() {
    const itemLabel = chars[charIdx].gear[slot]?.item ?? 'None';
    const fixedStars = typeof getFixedStars === 'function' ? getFixedStars(slot, itemLabel) : null;
    let v;
    if (fixedStars != null) {
      v = fixedStars;
    } else {
      const raw = starInput.value.replace(/\D/g, '');
      v = raw === '' ? 0 : parseInt(raw, 10);
      if (isNaN(v)) v = 0;
      const maxStars = typeof getMaxStars === 'function' ? getMaxStars(slot, itemLabel) : 30;
      v = Math.max(0, Math.min(maxStars, v));
    }
    starInput.value = String(v);
    chars[charIdx].gear[slot].stars = v;
    if (slot === 'Weapon' && chars[charIdx].cls === 'Zero') {
      syncZeroWeapons(charIdx, v, section);
    }
    save();
    syncChip(section, slot, chars[charIdx].gear[slot].item, v);
    syncSetsCell(section);
  }
  starInput.addEventListener('focus', () => {
    const itemLabel = chars[charIdx].gear[slot]?.item ?? 'None';
    if (typeof getFixedStars === 'function' && getFixedStars(slot, itemLabel) != null) return;
    starInput.select();
  });
  starInput.addEventListener('input', () => {
    const raw = starInput.value.replace(/\D/g, '');
    if (starInput.value !== raw) starInput.value = raw;
  });
  starInput.addEventListener('change', applyStarValue);
  starInput.addEventListener('blur', () => starInput.dispatchEvent(new Event('change')));

  ozSel.addEventListener('change', () => {
    const lv = parseInt(ozSel.value, 10);
    chars[charIdx].gear[slot].stars = lv;
    save();
    syncChip(section, slot, chars[charIdx].gear[slot].item, lv);
    syncSetsCell(section);
  });

  sel.addEventListener('change', () => {
    const newItem   = sel.value;
    let newTier     = ITEM_TIER[newItem] ?? 'None';
    if (slot === 'Secondary Weapon' && char.cls !== 'Zero' && newItem !== 'None' && newTier === 'None') {
      newTier = newItem.startsWith("Princess No's") ? 'PrincessNo' : newItem.startsWith('Frozen ') ? 'Frozen' : 'Pensalir';
    }
    const prevStars = chars[charIdx].gear[slot]?.stars ?? 0;
    const ozDefault = typeof OZ_RING_DEFAULT_LEVEL !== 'undefined' ? OZ_RING_DEFAULT_LEVEL : 4;
    let keepStars = newItem === 'None' ? 0
      : isOzRing(newItem) ? Math.max(1, Math.min(6, prevStars || ozDefault))
      : prevStars;
    const fixedStars = typeof getFixedStars === 'function' ? getFixedStars(slot, newItem) : null;
    if (fixedStars != null) keepStars = fixedStars;
    else {
      const maxStars = typeof getMaxStars === 'function' ? getMaxStars(slot, newItem) : 30;
      if (!isOzRing(newItem)) keepStars = Math.min(keepStars, maxStars);
    }

    chars[charIdx].gear[slot] = { item: newItem, stars: keepStars };
    if (slot === 'Weapon' && chars[charIdx].cls === 'Zero' && typeof getHeavySwordForLong !== 'undefined') {
      const heavy = getHeavySwordForLong(newItem);
      if (heavy && chars[charIdx].gear['Secondary Weapon']) {
        chars[charIdx].gear['Secondary Weapon'] = { item: heavy, stars: keepStars };
        const secSlot = section.querySelector('[data-slot="Secondary Weapon"]');
        if (secSlot) {
          const si = secSlot.querySelector('.star-input');
          if (si) si.value = String(keepStars);
        }
        syncChip(section, 'Secondary Weapon', heavy, keepStars);
      }
    }
    save();

    starInput.value = String(keepStars);
    ozSel.value     = keepStars || (typeof OZ_RING_DEFAULT_LEVEL !== 'undefined' ? OZ_RING_DEFAULT_LEVEL : 4);
    const isFixedStars = typeof getFixedStars === 'function' && getFixedStars(slot, newItem) != null;
    starInput.readOnly = isZeroHeavy || isFixedStars;
    starInput.disabled = isZeroHeavy || isFixedStars;
    applyInputVisibility(newItem);
    syncChip(section, slot, newItem, keepStars);
    syncSetsCell(section);

    if (RING_SLOTS_ARR.includes(slot) && typeof getRingExclusiveGroup === 'function') {
      const newGroup = getRingExclusiveGroup(newItem);
      const prevItem = chars[charIdx].gear[slot]?.item;
      const prevGroup = prevItem ? getRingExclusiveGroup(prevItem) : null;
      if (newGroup || prevGroup) updateSection(charIdx);
      else {
        renderGearIcon(iconWrap, newTier, slot, newItem, canonicalClass);
      }
      return;
    }

    renderGearIcon(iconWrap, newTier, slot, newItem, canonicalClass);

    if (slot === 'Top/Overall') {
      updateBottomForOverall(section, !!(ITEM_META[newItem]?.isOverall));
    }

    // Zero: Weapon is Long only; force Secondary to the matching Heavy and refresh Secondary slot UI
    if (slot === 'Weapon' && char.cls === 'Zero' && typeof getHeavySwordForLong !== 'undefined') {
      const heavy = getHeavySwordForLong(newItem);
      if (heavy) {
        chars[charIdx].gear['Secondary Weapon'] = { item: heavy, stars: 0 };
        save();
        const secSlotEl = section.querySelector('.gear-slot[data-slot="Secondary Weapon"]');
        if (secSlotEl) {
          const secSel = secSlotEl.querySelector('.gear-select');
          const secIconWrap = secSlotEl.querySelector('.gear-icon-wrap');
          const secChip = section.querySelector(`.summary-chip[data-slot="Secondary Weapon"]`);
          if (secSel) {
            secSel.innerHTML = '';
            const opt = document.createElement('option');
            opt.value = heavy;
            opt.textContent = heavy;
            opt.selected = true;
            secSel.appendChild(opt);
            if (secSel._syncDisplay) secSel._syncDisplay();
          }
          if (secIconWrap) renderGearIcon(secIconWrap, ITEM_TIER[heavy] ?? 'None', 'Secondary Weapon', heavy, canonicalClass);
          if (secChip) syncChip(section, 'Secondary Weapon', heavy, 0);
          syncSetsCell(section);
        }
      }
    }

    // Focus the star/Lv input so the user can type immediately (skip when fixed stars — implies not editable)
    const showStar = itemHasStars(slot, newItem);
    const showOz   = newItem !== 'None' && isOzRing(newItem);
    setTimeout(() => {
      if (showStar && !isFixedStars) {
        starInput.focus();
        starInput.select();
      } else if (showOz) {
        ozSel.focus();
      }
    }, 0);
  });

  const starWrap = document.createElement('div');
  starWrap.className = 'star-row-wrap';
  starWrap.append(starRow, ozRow);
  body.append(selWrap, iconWrap, starWrap, noneTxt);
  slotEl.append(hdr, body);
  return slotEl;
}

/**
 * Render gear icon from local MapleIcons/Gear Icons/.
 * Color (background/badge) is set-only; icon path still uses tier. Non-set items show no tint.
 */
function renderGearIcon(wrap, setName, slot, itemLabel, charClass) {
  wrap.innerHTML = '';
  const set = SETS[setName];
  const gearSet = typeof getSetForItem !== 'undefined' ? getSetForItem(itemLabel || '', slot) : null;
  const candidates = itemIconCandidates(setName, slot, itemLabel || '', charClass);
  const badgeSet = gearSet ? { color: gearSet.color, abbr: gearSet.shortName || gearSet.name } : null;

  if (candidates.length === 0) {
    wrap.style.background   = '';
    wrap.style.borderRadius = '';
    wrap.appendChild(badgeSet ? makeBadge(badgeSet) : makeNaBadge());
    return;
  }

  if (!set || setName === 'None') {
    if (window.gearBgEnabled) {
      wrap.style.background   = 'rgba(255,255,255,0.06)';
      wrap.style.borderRadius = '6px';
    } else {
      wrap.style.background   = '';
      wrap.style.borderRadius = '';
    }
  } else if (window.gearBgEnabled) {
    wrap.style.background   = gearSet?.color ? hexToRgba(gearSet.color, 0.25) : 'rgba(255,255,255,0.06)';
    wrap.style.borderRadius = '6px';
  } else {
    wrap.style.background   = '';
    wrap.style.borderRadius = '';
  }

  const img = document.createElement('img');
  img.className = 'gear-img';
  img.alt = itemLabel || slot;
  img.loading = 'lazy';

  function tryNext(remaining) {
    if (remaining.length === 0) { wrap.innerHTML = ''; wrap.appendChild(badgeSet ? makeBadge(badgeSet) : makeNaBadge()); return; }
    img.onerror = () => tryNext(remaining.slice(1));
    img.src = remaining[0];
  }
  tryNext(candidates);
  wrap.appendChild(img);
}

function makeBadge(set) {
  const div = document.createElement('div');
  div.className = 'gear-badge';
  div.style.background = set.color;
  div.textContent = set.abbr || set.shortName || '';
  return div;
}

function makeNaBadge() {
  const div = document.createElement('div');
  div.className = 'gear-badge gear-badge-na';
  return div;
}

function updateToggleBtn() {
  const btn = document.getElementById('toggleAllBtn');
  if (!btn) return;
  
  // Determine the most common mode among all characters
  const modeCounts = { expanded: 0, compact: 0, collapsed: 0 };
  chars.forEach(c => {
    const mode = c.viewMode || 'expanded';
    modeCounts[mode]++;
  });
  
  let currentMode = 'expanded';
  let maxCount = 0;
  for (const [mode, count] of Object.entries(modeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      currentMode = mode;
    }
  }
  
  // Show what action will happen when clicked (next state + "All")
  const nextMode = currentMode === 'expanded' ? 'compact' : currentMode === 'compact' ? 'collapsed' : 'expanded';
  const labels = { expanded: 'Expand', compact: 'Compact', collapsed: 'Collapse' };
  btn.textContent = labels[nextMode] + ' All';
}
if (typeof window !== 'undefined') window.updateToggleBtn = updateToggleBtn;
