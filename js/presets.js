'use strict';

// Generic preset weapon labels → WEAPON_TIER_ITEMS tier key.
// Pensalir weapons are the Utgard ones (Utgard Staff, Utgard Wand, etc.); we store generic "Pensalir Weapon" in presets and resolve to class-specific when applying.
const PRESET_WEAPON_TO_TIER = {
  'Pensalir Weapon':    'Pensalir',
  'Frozen Weapon':       'Frozen',
  'Absolab Weapon':    'Absolab',
  'Arcane Umbra Weapon': 'Arcane',
  'Genesis Weapon':    'Pitched',
  'Destiny Weapon':    'Eternal',
};

// When a class can use multiple weapon types, prefer in this order: 2H Sword > 2H Blunt > 2H Axe > Staff > Wand > 1H options (mages with Staff and Wand get Staff).
const WEAPON_TYPE_PRIORITY = [
  'Two-handed Sword', 'Two-handed Blunt', 'Two-handed Axe',
  'Staff', 'Wand',
  'One-handed Sword', 'One-handed Blunt', 'One-handed Axe',
  'Spear', 'Polearm', 'Bow', 'Crossbow', 'Ancient Bow', 'Dual Bowguns',
  'Claw', 'Dagger', 'Cane', 'Shining Rod', 'Memorial Staff', 'Lucent Gauntlet', 'Psy-limiter', 'Celestial Light',
  'Knuckle', 'Gun', 'Hand Cannon', 'Soul Shooter', 'Whip Blade', 'Chain', 'Ritual Fan', 'Chakram',
  'Bladecaster', 'Martial Brace', 'Fan', 'Katana', 'Whispershot', 'Arm Cannon', 'Desperado',
  'Long Sword', 'Heavy Sword', 'Sword',
];

/**
 * Resolve a generic preset weapon label (e.g. 'Arcane Umbra Weapon') to the class-specific weapon label.
 * Uses CLASS_WEAPON_DATA and WEAPON_TIER_ITEMS; prefers Staff over Wand, 2H Sword/Blunt/Axe over 1H.
 * @param {string} charClass
 * @param {string} genericWeaponLabel
 * @returns {string|null} Actual weapon label or null if class/tier not found
 */
/** Generic preset secondary labels that resolve to class-specific item when applying. */
const PRESET_SECONDARY_GENERIC = new Set(['Lv. 100 Secondary', 'Frozen Secondary', 'Princess No Secondary']);

/** Cygnus Knights (Jewel): Lv. 100 secondary is Ereve Brilliance. Mihile uses Soul Shield only. */
const CYGNUS_KNIGHTS_JEWEL = ['Dawn Warrior', 'Blaze Wizard', 'Wind Archer', 'Night Walker', 'Thunder Breaker'];

/** Every class (except Dual Blade, Zero) → Lv. 100 secondary item label. Used for preset resolution and uniformity. */
const LV100_SECONDARY_BY_CLASS = {
  // Explorers
  'Hero': 'Virtues Medallion',
  'Paladin': 'Sacred Rosary',
  'Dark Knight': 'Berserk Chain',
  'Arch Mage (Fire, Poison)': 'Rusty Book (Epode)',
  'Arch Mage (Ice, Lightning)': 'Rusty Book (Epode)',
  'Bishop': 'White Gold Book (Epode)',
  'Bowmaster': 'Blasted Feather',
  'Marksman': 'True Shot',
  'Pathfinder': 'Perfect Relic',
  'Night Lord': 'Death Sender Charm',
  'Shadower': 'Deimos Shadow Shield',
  'Buccaneer': 'Wrist Armor',
  'Corsair': 'Falcon Eye',
  'Cannon Master': 'Center Fire Bomb',
  // Cygnus
  'Mihile': 'Soul Shield of Justice',
  'Dawn Warrior': 'Ereve Brilliance',
  'Blaze Wizard': 'Ereve Brilliance',
  'Wind Archer': 'Ereve Brilliance',
  'Night Walker': 'Ereve Brilliance',
  'Thunder Breaker': 'Ereve Brilliance',
  // Heroes
  'Aran': 'Dragon Mass',
  'Evan': 'Deimos Sage Shield',
  'Luminous': 'Karma Orb',
  'Mercedes': 'Infinite Magic Arrows',
  'Phantom': 'Carte Finale',
  'Shade': 'Golden Fox Marble',
  // Resistance
  'Battle Mage': 'Deimos Sage Shield',
  'Blaster': 'Masterwork Charges',
  'Demon Slayer': 'Force Shield of Extremes',
  'Demon Avenger': 'Force Shield of Extremes',
  'Mechanic': 'Eternal Magnum',
  'Wild Hunter': 'Wild Heron',
  'Xenon': 'Octa Core Controller',
  // Nova
  'Kaiser': 'Nova Truth Essence',
  'Angelic Buster': 'Green Soul Ring',
  'Cadena': 'Transmitter Type-A',
  'Kain': 'D100 Custom Weapon Belt',
  // Flora
  'Adele': 'Noble Bladebinder',
  'Illium': 'Glory Lucent Wings',
  'Khali': 'Infinite Hex Seeker',
  'Ark': 'Ultimate Path',
  // Anima
  'Hoyoung': 'Moonstone Fan Tassel',
  'Lara': 'Radiant Four-Jade Ornament',
  'Ren': 'Violet Imugi Gem',
  // Sengoku
  'Hayato': 'Fire Phoenix Blade',
  'Kanna': 'Pandemonium Talisman',
  // Jianghu
  'Lynn': 'Golden Pearl Leaf',
  'Mo Xuan': 'Boundless Brace Band',
  // Friends World
  'Kinesis': 'Queen Chess Piece',
  // Shine
  'Sia Astelle': 'Evolving Compass',
};

/** Every class (except Zero) → named Frozen secondary. Used for Frozen Set and preset resolution. */
const FROZEN_SECONDARY_BY_CLASS = {
  // Explorers
  'Hero': 'Frozen Medallion',
  'Paladin': 'Frozen Rosary',
  'Dark Knight': 'Frozen Chain',
  'Arch Mage (Fire, Poison)': 'Frozen Rusty Book (Epode)',
  'Arch Mage (Ice, Lightning)': 'Frozen Rusty Book (Epode)',
  'Bishop': 'Frozen White Gold Book (Epode)',
  'Bowmaster': 'Frozen Feather',
  'Marksman': 'Frozen True Shot',
  'Pathfinder': 'Frozen Relic',
  'Night Lord': 'Frozen Death Sender Charm',
  'Shadower': 'Frozen Shadow',
  'Dual Blade': 'Frozen Katara',
  'Buccaneer': 'Frozen Wrist Armor',
  'Corsair': 'Frozen Falcon Eye',
  'Cannon Master': 'Frozen Center Fire Bomb',
  // Cygnus
  'Mihile': 'Frozen Soul Shield',
  'Dawn Warrior': 'Frozen Ereve Brilliance',
  'Blaze Wizard': 'Frozen Ereve Brilliance',
  'Wind Archer': 'Frozen Ereve Brilliance',
  'Night Walker': 'Frozen Ereve Brilliance',
  'Thunder Breaker': 'Frozen Ereve Brilliance',
  // Heroes
  'Aran': 'Frozen Dragon Mass',
  'Evan': "Frozen Dragon Master's Legacy",
  'Luminous': 'Frozen Orb',
  'Mercedes': 'Frozen Magic Arrows',
  'Phantom': 'Carte Frozen',
  'Shade': 'Frozen Fox Marble',
  // Resistance
  'Battle Mage': 'Frozen Maximizer Ball',
  'Blaster': 'Frozen Charges',
  'Demon Slayer': 'Frozen Force Shield',
  'Demon Avenger': 'Frozen Force Shield',
  'Mechanic': 'Frozen Magnum',
  'Wild Hunter': 'Frozen Wild Heron',
  'Xenon': 'Frozen Octa Core Controller',
  // Nova
  'Kaiser': 'Frozen Dragon Essence',
  'Angelic Buster': 'Frozen Soul Ring',
  'Cadena': 'Frozen Transmitter',
  'Kain': 'Frozen D100 Weapon Belt',
  // Flora
  'Adele': 'Frozen Shiny Bladebinder',
  'Illium': 'Frozen Lucent Wings',
  'Khali': 'Frozen Infinite Hex Seeker',
  'Ark': 'Frozen Path',
  // Anima
  'Hoyoung': 'Frozen Fan Tassel',
  'Lara': 'Frozen Four-Jade Ornament',
  'Ren': 'Frozen Imugi Gem',
  // Sengoku
  'Hayato': 'Frozen Blade',
  'Kanna': 'Frozen Talisman',
  // Jianghu
  'Lynn': 'Frozen Pearl Leaf',
  'Mo Xuan': 'Frozen Brace Band',
  // Friends World
  'Kinesis': 'Frozen Queen Chess Piece',
  // Shine
  'Sia Astelle': 'Frozen Compass',
};

/** Every class (except Zero) → named Princess No secondary. Used only for preset resolution; dropdown shows named items. */
const PRINCESS_NO_SECONDARY_BY_CLASS = {
  // Explorers
  'Hero': "Princess No's Medal",
  'Paladin': "Princess No's Rosary",
  'Dark Knight': "Princess No's Flower Chain",
  'Arch Mage (Fire, Poison)': "Princess No's Flaming Book",
  'Arch Mage (Ice, Lightning)': "Princess No's Damp Book",
  'Bishop': "Princess No's Golden Book",
  'Bowmaster': "Princess No's Feather",
  'Marksman': "Princess No's Wreath",
  'Pathfinder': "Princess No's Immortal Relic",
  'Night Lord': "Princess No's Charm",
  'Shadower': "Princess No's Purple Shadow",
  'Dual Blade': "Princess No's Poisoned Sword",
  'Buccaneer': "Princess No's Skull Armor",
  'Corsair': "Princess No's Falcon Eye",
  'Cannon Master': "Princess No's Fire Bomb",
  // Cygnus
  'Mihile': "Princess No's Soul Shield",
  'Dawn Warrior': "Princess No's Floral Jewel",
  'Blaze Wizard': "Princess No's Floral Jewel",
  'Wind Archer': "Princess No's Floral Jewel",
  'Night Walker': "Princess No's Floral Jewel",
  'Thunder Breaker': "Princess No's Floral Jewel",
  // Heroes
  'Aran': "Princess No's Flower Ballast",
  'Evan': "Princess No's Dragon Legacy",
  'Luminous': "Princess No's Soul Orb",
  'Mercedes': "Princess No's Accursed Arrow",
  'Phantom': "Princess No's Carte",
  'Shade': "Princess No's Fox Marble",
  // Resistance
  'Battle Mage': "Princess No's Accursed Marble",
  'Blaster': "Princess No's Megaton Charges",
  'Demon Slayer': "Princess No's Accursed Shield",
  'Demon Avenger': "Princess No's Accursed Shield",
  'Mechanic': "Princess No's Magnum",
  'Wild Hunter': "Princess No's Arrowhead",
  'Xenon': "Princess No's Controller",
  // Nova
  'Kaiser': "Princess No's Dragon Essence",
  'Angelic Buster': "Princess No's Soul Ring",
  'Cadena': "Princess No's Transmitter",
  'Kain': "Princess No's Immortal Weapon Belt",
  // Flora
  'Adele': "Princess No's Immortal Bladebinder",
  'Illium': "Princess No's Lucent Wings",
  'Khali': "Princess No's Immortal Hex Seeker",
  'Ark': "Princess No's Path",
  // Anima
  'Hoyoung': "Princess No's Fan Tassel",
  'Lara': "Princess No's Immortal Four-Jade Ornament",
  'Ren': "Princess No's Imugi Gem",
  // Sengoku
  'Hayato': "Princess No's Wakizashi",
  'Kanna': "Princess No's Talisman",
  // Jianghu
  'Lynn': "Princess No's Leaf",
  'Mo Xuan': "Princess No's Brace Band",
  // Friends World
  'Kinesis': "Princess No's Oriental King Chess Piece",
  // Shine
  'Sia Astelle': "Princess No's Compass",
};

/**
 * Resolve a generic preset secondary (Lv. 100, Frozen, Princess No) to the class-specific item.
 * @param {string} charClass
 * @param {string} genericLabel
 * @returns {string|null} resolved label or null to skip
 */
function resolvePresetSecondary(charClass, genericLabel) {
  if (!PRESET_SECONDARY_GENERIC.has(genericLabel)) return null;
  if (genericLabel === 'Frozen Secondary') {
    if (charClass === 'Zero') return null;
    return FROZEN_SECONDARY_BY_CLASS[charClass] || null;
  }
  if (genericLabel === 'Lv. 100 Secondary') {
    if (LV100_SECONDARY_BY_CLASS[charClass]) return LV100_SECONDARY_BY_CLASS[charClass];
    return genericLabel;
  }
  if (genericLabel === 'Princess No Secondary') {
    if (charClass === 'Zero') return null;
    return PRINCESS_NO_SECONDARY_BY_CLASS[charClass] || null;
  }
  return null;
}

function resolvePresetWeapon(charClass, genericWeaponLabel) {
  const tierKey = PRESET_WEAPON_TO_TIER[genericWeaponLabel];
  if (!tierKey || typeof CLASS_WEAPON_DATA === 'undefined' || typeof WEAPON_TIER_ITEMS === 'undefined') return null;
  const canonicalClass = (typeof CLASS_NAME_ALIAS !== 'undefined' && charClass && CLASS_NAME_ALIAS[charClass]) ? CLASS_NAME_ALIAS[charClass] : charClass;
  // Zero omits Frozen (no Frozen weapon or secondary)
  if (canonicalClass === 'Zero' && tierKey === 'Frozen') return null;
  const data = CLASS_WEAPON_DATA[canonicalClass];
  if (!data || !data.weaponTypes || !data.weaponTypes.length) return null;
  const typesWithTier = data.weaponTypes.filter(wType => WEAPON_TIER_ITEMS[wType]?.[tierKey]);
  if (!typesWithTier.length) return null;
  const preferred = WEAPON_TYPE_PRIORITY.find(t => typesWithTier.includes(t));
  const chosenType = preferred !== undefined ? preferred : typesWithTier[0];
  const entry = WEAPON_TIER_ITEMS[chosenType]?.[tierKey];
  return entry ? entry.label : null;
}

/**
 * Resolve a canonical preset label (e.g. CRA Top, CRA Hat, CRA Bottom) to the class-specific item.
 * Used when applying presets so the correct variant is applied per character class.
 * @param {string} slot - e.g. 'Hat', 'Top/Overall', 'Bottom'
 * @param {string} itemLabel - canonical label from preset (e.g. 'CRA Top')
 * @param {string} charClass - character class
 * @returns {string} resolved label (class-specific or original if no resolution)
 */
function resolvePresetGearSlot(slot, itemLabel, charClass) {
  if (!itemLabel || !charClass || typeof GEAR_SETS === 'undefined' || typeof SLOT_ITEMS === 'undefined') return itemLabel;
  if (!GEAR_PRESET_CANONICAL_SLOTS || !GEAR_PRESET_CANONICAL_SLOTS.has(slot)) return itemLabel;
  const slotItems = SLOT_ITEMS[slot];
  if (!slotItems || !slotItems.length) return itemLabel;
  let setLabels = null;
  for (const setDef of Object.values(GEAR_SETS)) {
    const items = setDef.items && setDef.items[slot];
    if (items && (items.has?.(itemLabel) || (Array.isArray(items) && items.includes(itemLabel)))) {
      setLabels = items instanceof Set ? Array.from(items) : items;
      break;
    }
  }
  if (!setLabels || !setLabels.length) return itemLabel;
  const byLabel = {};
  slotItems.forEach(it => { byLabel[it.label] = it; });
  let classMatch = null;
  let canonicalFallback = null;
  for (const label of setLabels) {
    const it = byLabel[label];
    if (!it) continue;
    if (!it.cls) canonicalFallback = label;
    if (it.cls && it.cls.includes(charClass)) { classMatch = label; break; }
  }
  return classMatch || canonicalFallback || itemLabel;
}

function isValidGearPreset(p) {
  return p && typeof p.name === 'string' && p.gear && typeof p.gear === 'object';
}

/** Full list: custom equipment presets first, then built-in (for dropdowns and lookup). */
function getFullGearPresetList() {
  const custom = typeof getCustomGearPresets === 'function' ? getCustomGearPresets() : [];
  const valid = Array.isArray(custom) ? custom.filter(isValidGearPreset) : [];
  return [...valid, ...GEAR_PRESETS];
}

/** Full list: custom accessory presets first, then built-in. */
function getFullAccessoryPresetList() {
  const custom = typeof getCustomAccessoryPresets === 'function' ? getCustomAccessoryPresets() : [];
  const valid = Array.isArray(custom) ? custom.filter(isValidGearPreset) : [];
  return [...valid, ...ACCESSORY_PRESETS];
}

/** Order for applying multiple accessory presets: custom first (by array order), then built-in order. */
function getFullAccessoryPresetOrder() {
  const custom = typeof getCustomAccessoryPresets === 'function' ? getCustomAccessoryPresets() : [];
  const valid = Array.isArray(custom) ? custom.filter(isValidGearPreset) : [];
  return [...valid.map(p => p.name), ...ACCESSORY_PRESETS.map(p => p.name)];
}

function applyPreset(gear, presetName, charClass) {
  const all = getFullGearPresetList();
  const preset = all.find(p => p.name === presetName);
  if (!preset || !preset.gear || typeof preset.gear !== 'object') return;
  const canonicalClass = (typeof CLASS_NAME_ALIAS !== 'undefined' && charClass && CLASS_NAME_ALIAS[charClass]) ? CLASS_NAME_ALIAS[charClass] : charClass;
  Object.entries(preset.gear).forEach(([slot, itemLabel]) => {
    let label = itemLabel;
    if (label === '__SILVER_EMBLEM__') {
      label = (canonicalClass && typeof CLASS_SILVER_EMBLEM !== 'undefined' && CLASS_SILVER_EMBLEM[canonicalClass]) || null;
      if (!label) return;
    }
    if (label === '__GOLD_EMBLEM__') {
      label = (canonicalClass && CLASS_GOLD_EMBLEM[canonicalClass]) || null;
      if (!label) return;
    }
    if (slot === 'Weapon' && PRESET_WEAPON_TO_TIER[label] && canonicalClass) {
      const resolved = resolvePresetWeapon(canonicalClass, label);
      if (resolved) label = resolved;
      else if (label === 'Frozen Weapon') return; // Zero omits Frozen
    }
    if (slot === 'Secondary Weapon' && canonicalClass && typeof resolvePresetSecondary === 'function') {
      const resolved = resolvePresetSecondary(canonicalClass, label);
      if (resolved) label = resolved;
      else if (label === 'Princess No Secondary' || label === 'Frozen Secondary') return; // Zero: no generic, skip slot; Zero block sets heavy
    }
    if (canonicalClass && typeof resolvePresetGearSlot === 'function') {
      const resolved = resolvePresetGearSlot(slot, label, canonicalClass);
      if (resolved) label = resolved;
    }
    gear[slot] = { item: label, stars: 0 };
  });
  // Overalls occupy both Top/Overall and Bottom — clear Bottom when an overall is chosen (use resolved top label from gear)
  const topLabel = gear['Top/Overall']?.item;
  if (topLabel && ITEM_META[topLabel]?.isOverall) {
    gear['Bottom'] = { item: 'None', stars: 0 };
  }
  // Zero: Secondary is the Heavy that pairs with the Long, or Utgard Heavy when no weapon/default needed
  if (canonicalClass === 'Zero' && typeof getHeavySwordForLong !== 'undefined') {
    const weaponItem = gear['Weapon']?.item;
    const heavy = weaponItem && weaponItem !== 'None' ? getHeavySwordForLong(weaponItem) : null;
    gear['Secondary Weapon'] = { item: heavy || 'Utgard Heavy Sword', stars: 0 };
  }
}

// Accessory preset order (priority: later overwrites earlier when no space). Exposed for UI.
function ACCESSORY_PRESET_ORDER() { return ACCESSORY_PRESETS.map(p => p.name); }
if (typeof window !== 'undefined') window.ACCESSORY_PRESET_ORDER = ACCESSORY_PRESET_ORDER;
const RING_SLOTS = ['Ring 1', 'Ring 2', 'Ring 3', 'Ring 4'];
const PENDANT_SLOTS = ['Pendant 1', 'Pendant 2'];

// Tier order for overwrite: lower index = lower tier (replaced first when no space).
const TIER_ORDER = ['None', 'Frozen', 'Pensalir', 'Dawn', 'PrincessNo', 'Gollux', 'OzRing', 'Fafnir', 'Sweetwater', 'Absolab', 'Arcane', 'Pitched', 'Brilliant', 'Eternal'];
function tierRank(itemLabel) {
  if (!itemLabel || itemLabel === 'None') return 0;
  const tier = typeof ITEM_TIER !== 'undefined' ? ITEM_TIER[itemLabel] : null;
  const idx = TIER_ORDER.indexOf(tier || 'None');
  return idx >= 0 ? idx : 0;
}

/**
 * Apply multiple accessory presets in order. Uses next available slot in a family (rings, pendants);
 * when no space, overwrites the slot that has the lowest-tier item (e.g. Brilliant replaces Dawn before Pitched).
 * @param {Object} gear - character gear object (mutated)
 * @param {string[]} selectedPresetNames - names of presets to apply, in any order (will be sorted by ACCESSORY_PRESET_ORDER)
 */
function applyAccessoryPresets(gear, selectedPresetNames) {
  if (!selectedPresetNames || selectedPresetNames.length === 0) return;
  const order = getFullAccessoryPresetOrder();
  const orderedSelected = order.filter(name => selectedPresetNames.includes(name));
  const presetList = getFullAccessoryPresetList();

  const slotState = {};
  [...RING_SLOTS, ...PENDANT_SLOTS, 'Badge', 'Shoulder', 'Pocket', 'Belt', 'Face Accessory', 'Eye Accessory', 'Earring', 'Medal'].forEach(slot => {
    slotState[slot] = { presetIndex: -1, item: (gear[slot] && gear[slot].item) ? gear[slot].item : 'None' };
  });

  const ringExclusivePlaced = {};
  RING_SLOTS.forEach(s => {
    const groupKey = typeof getRingExclusiveGroupKey === 'function' ? getRingExclusiveGroupKey(slotState[s].item) : null;
    if (groupKey) ringExclusivePlaced[groupKey] = true;
  });

  const guardianRequestedCount = typeof getRingExclusiveGroupKey === 'function' ? (() => {
    let n = 0;
    orderedSelected.forEach(presetName => {
      const preset = presetList.find(p => p.name === presetName);
      if (!preset || !preset.gear) return;
      Object.values(preset.gear).forEach(item => {
        if (getRingExclusiveGroupKey(item)) n++;
      });
    });
    return n;
  })() : 0;
  const useHighTierGuardian = guardianRequestedCount > 1;

  function slotFamily(slot) {
    if (RING_SLOTS.includes(slot)) return RING_SLOTS;
    if (PENDANT_SLOTS.includes(slot)) return PENDANT_SLOTS;
    return null;
  }

  orderedSelected.forEach((presetName, presetIndex) => {
    const preset = presetList.find(p => p.name === presetName);
    if (!preset || !preset.gear || typeof preset.gear !== 'object') return;
    Object.entries(preset.gear).forEach(([slot, item]) => {
      const family = slotFamily(slot);
      if (family) {
        let assignItem = item;
        if (RING_SLOTS.includes(slot) && typeof getRingExclusiveGroupKey === 'function' && typeof RING_EXCLUSIVE_GROUPS !== 'undefined') {
          const groupKey = getRingExclusiveGroupKey(item);
          if (groupKey) {
            if (ringExclusivePlaced[groupKey]) return;
            assignItem = useHighTierGuardian ? RING_EXCLUSIVE_GROUPS[groupKey].highTier : item;
            ringExclusivePlaced[groupKey] = true;
          }
        }
        // Don't assign the same item to another slot (avoids duplicates when applying same preset again)
        const alreadyIn = family.find(s => slotState[s].item === assignItem);
        if (alreadyIn) {
          slotState[alreadyIn] = { presetIndex, item: assignItem };
          return;
        }
        let target = family.find(s => slotState[s].item === 'None');
        if (!target) {
          const minRank = Math.min(...family.map(s => tierRank(slotState[s].item)));
          target = family.find(s => tierRank(slotState[s].item) === minRank);
        }
        if (target) slotState[target] = { presetIndex, item: assignItem };
      } else {
        slotState[slot] = { presetIndex, item };
      }
    });
  });

  Object.entries(slotState).forEach(([slot, { item }]) => {
    gear[slot] = { item, stars: 0 };
  });
}

function setAllStars(gear, count) {
  if (!gear || count === null || count === undefined) return;
  const n = Math.max(0, parseInt(count, 10));
  if (isNaN(n)) return;
  SLOTS.forEach(slot => {
    const entry = gear[slot];
    if (entry && entry.item && entry.item !== 'None' && itemHasStars(slot, entry.item)) {
      const fixedStars = typeof getFixedStars === 'function' ? getFixedStars(slot, entry.item) : null;
      if (fixedStars != null) {
        entry.stars = fixedStars;
      } else {
        const maxStars = typeof getMaxStars === 'function' ? getMaxStars(slot, entry.item) : 30;
        entry.stars = Math.min(n, maxStars);
      }
    }
  });
}

/** Returns set color only; no tier-based color. Use getSetForItem when slot is known, else ''. */
function tierColor(label, slot) {
  if (!label || label === 'None' || typeof getSetForItem === 'undefined') return '';
  if (slot == null) return '';
  return getSetForItem(label, slot)?.color ?? '';
}

/** Syncs a gear <select> element's text color to the selected item's set color (white if not in a set). */
function syncGearSelectColor(sel, slot) {
  sel.style.color = tierColor(sel.value, slot);
}

/**
 * Populates a gear <select> with tier-grouped options.
 * Option color is set-only (via getSetForItem when slot provided); otherwise white.
 */
function addTieredOptions(sel, items, current, slot = null) {
  let lastTier = null;
  items.forEach(it => {
    if (lastTier !== null && it.tier !== lastTier) {
      const div = document.createElement('option');
      div.disabled = true;
      div.textContent = '────────────';
      div.style.color = '#666';
      div.style.backgroundColor = '#2b2b2b';
      div.style.fontSize = '8px';
      sel.appendChild(div);
    }
    lastTier = it.tier;
    const opt = document.createElement('option');
    opt.value = it.label;
    opt.textContent = it.label;
    if (it.label === current) opt.selected = true;
    const c = tierColor(it.label, slot);
    if (c) {
      opt.style.color = c;
      opt.style.backgroundColor = '#2b2b2b';
    }
    sel.appendChild(opt);
  });
  syncGearSelectColor(sel, slot);
}

/**
 * Builds a custom-styled gear dropdown.
 * Returns { wrap, sel } — wrap is inserted into the DOM; sel is the hidden
 * native <select class="gear-select"> that owns all change-event listeners and
 * the .value property, so existing buildSlot code continues to work unchanged.
 */
function makeGearSelect(items, currentValue, standalone = false, slot = null) {
  const initVal = currentValue || 'None';

  /** Set-only color: if item is in a GEAR_SET for this slot, return set color; else '' (white). */
  function itemColorForLabel(label) {
    if (!label || label === 'None' || typeof getSetForItem === 'undefined' || slot == null) return '';
    return getSetForItem(label, slot)?.color ?? '';
  }

  // ── hidden native select: event backbone ──
  const sel = document.createElement('select');
  sel.className = 'gear-select';
  sel.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;';
  const noneOpt = document.createElement('option');
  noneOpt.value = 'None'; noneOpt.textContent = 'None';
  sel.appendChild(noneOpt);
  items.forEach(it => {
    const o = document.createElement('option');
    o.value = it.label; o.textContent = it.label;
    sel.appendChild(o);
  });
  // Ensure current value exists as an option so the display shows the weapon name (e.g. when list was generic but saved item is class-specific)
  if (initVal !== 'None' && !items.some(it => it.label === initVal)) {
    const opt = document.createElement('option');
    opt.value = initVal;
    opt.textContent = initVal;
    sel.insertBefore(opt, sel.options[1] || null);
  }
  sel.value = initVal;

  // ── visible wrapper (text + chevron so arrow is always visible) ──
  const wrap = document.createElement('div');
  wrap.className = 'gear-sel-wrap';
  const disp = document.createElement('div');
  disp.className = 'gear-sel-disp';
  const dispText = document.createElement('span');
  dispText.className = 'gear-sel-disp-text';
  const dispChevron = document.createElement('span');
  dispChevron.className = 'gear-sel-disp-chevron';
  dispChevron.textContent = '▼';
  dispChevron.setAttribute('aria-hidden', 'true');
  disp.appendChild(dispText);
  disp.appendChild(dispChevron);

  // ── floating panel: appended to body to escape overflow:hidden ──
  const panel = document.createElement('div');
  panel.className = 'gear-sel-panel';
  document.body.appendChild(panel);

  let isOpen = false;

  function syncDisplay() {
    dispText.textContent = sel.value;
    const c = itemColorForLabel(sel.value);
    disp.style.color = c || '';
    if (c) dispText.style.color = c; else dispText.style.color = '';
  }
  sel._syncDisplay = syncDisplay;

  function buildOptions() {
    const excluded = (wrap._excluded instanceof Set) ? wrap._excluded : new Set();
    panel.innerHTML = '';
    const noneEl = document.createElement('div');
    noneEl.className = 'gear-sel-opt' + (sel.value === 'None' ? ' sel-active' : '');
    noneEl.textContent = 'None'; noneEl.dataset.val = 'None';
    panel.appendChild(noneEl);
    let lastTier = null;
    items.forEach(it => {
      if (excluded.has(it.label) && it.label !== sel.value) return;
      if (lastTier !== null && it.tier !== lastTier) {
        const sep = document.createElement('div');
        sep.className = 'gear-sel-sep';
        panel.appendChild(sep);
      }
      if (it.dividerAbove) {
        const sep = document.createElement('div');
        sep.className = 'gear-sel-sep';
        panel.appendChild(sep);
      }
      lastTier = it.tier;
      const el = document.createElement('div');
      el.className = 'gear-sel-opt' + (it.label === sel.value ? ' sel-active' : '');
      el.textContent = it.label; el.dataset.val = it.label;
      const c = itemColorForLabel(it.label);
      if (c) el.style.color = c;
      panel.appendChild(el);
    });
  }

  function positionPanel() {
    const r = disp.getBoundingClientRect();
    panel.style.left     = r.left + 'px';
    panel.style.minWidth = r.width + 'px';
    const gap = 2;
    const paddingFromBottom = 12;
    const spaceBelow = window.innerHeight - r.bottom - paddingFromBottom;
    const panelHeight = panel.offsetHeight;
    if (spaceBelow >= panelHeight) {
      panel.style.top = (r.bottom + gap) + 'px';
    } else {
      panel.style.top = (r.top - panelHeight - gap) + 'px';
    }
  }

  function open() {
    if (wrap.classList.contains('disabled')) return;
    buildOptions();
    panel.classList.add('open');
    wrap.classList.add('open');
    isOpen = true;
    positionPanel();
  }

  function close() {
    panel.classList.remove('open');
    wrap.classList.remove('open');
    isOpen = false;
  }

  disp.addEventListener('mousedown', (e) => { e.preventDefault(); isOpen ? close() : open(); });

  panel.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const el = e.target.closest('.gear-sel-opt');
    if (!el) return;
    sel.value = el.dataset.val;
    syncDisplay();
    close();
    sel.dispatchEvent(new Event('change'));
  });

  function outsideClick(e) {
    if (!wrap.contains(e.target) && e.target !== panel && !panel.contains(e.target)) close();
  }
  document.addEventListener('mousedown', outsideClick);
  window.addEventListener('scroll', (e) => { if (!panel.contains(e.target)) close(); }, { passive: true, capture: true });

  new MutationObserver(() => {
    wrap.classList.toggle('disabled', sel.disabled);
    if (sel.disabled) close();
  }).observe(sel, { attributes: true, attributeFilter: ['disabled'] });

  syncDisplay();
  wrap.append(disp, sel);
  return { wrap, sel };
}

/* ── Starforce quick-select helper ─────────────────────────────
   Wires up .sf-quick buttons inside `container` to the `input`.
   Clicking a button sets the input value and highlights it.
   Typing in the input syncs button highlights.
   Returns a `reset(val)` function that sets input + highlights. */
function initSfQuick(container, input) {
  const btns = Array.from(container.querySelectorAll('.sf-quick'));
  function syncBtns() {
    const v = input.value.trim();
    btns.forEach(b => b.classList.toggle('active', b.dataset.sf === v));
  }
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.sf;
      syncBtns();
    });
  });
  input.addEventListener('input', syncBtns);
  return {
    reset(val) {
      input.value = (val != null) ? val : '';
      syncBtns();
    },
  };
}
