'use strict';

// ── Inner Ability (IA) Data ──────────────────────────────────────────────

/** Inner Ability rarities and their colors */
const IA_RARITIES = {
  Rare:      { name: 'Rare',      color: '#3A9BC9', order: 1 },  // Darker blue/cyan
  Epic:      { name: 'Epic',      color: '#8B1FA3', order: 2 },  // Darker purple
  Unique:    { name: 'Unique',    color: '#E89F00', order: 3 },  // Orange-gold
  Legendary: { name: 'Legendary', color: '#8FBE00', order: 4 },  // Darker lime green
};

/** Get max allowed rarity for lines 2 and 3 based on line 1 rarity */
function getMaxSecondaryRarity(firstLineRarity) {
  if (!firstLineRarity || firstLineRarity === 'None') return null;
  if (firstLineRarity === 'Legendary') return 'Unique';
  if (firstLineRarity === 'Unique') return 'Epic';
  if (firstLineRarity === 'Epic') return 'Rare';
  if (firstLineRarity === 'Rare') return 'Rare';
  return null;
}

/** Get available rarities for a given line number and first line rarity */
function getAvailableRarities(lineNumber, firstLineRarity) {
  if (lineNumber === 1) {
    return ['Legendary', 'Unique', 'Epic', 'Rare'];
  }
  // Lines 2 and 3
  const maxRarity = getMaxSecondaryRarity(firstLineRarity);
  if (!maxRarity) return [];
  
  const rarities = [];
  if (maxRarity === 'Unique' || maxRarity === 'Epic' || maxRarity === 'Rare') rarities.push('Rare');
  if (maxRarity === 'Unique' || maxRarity === 'Epic') rarities.push('Epic');
  if (maxRarity === 'Unique') rarities.push('Unique');
  
  return rarities.reverse(); // Return in descending order
}

/** Inner Ability stat lines organized by: Rarity → Type → Values */
const IA_LINES = {
  Legendary: {
    'Attack Speed': ['+1'],
    'Passive Skill Level': ['+1'],
    'Enemy Hit by Skills': ['+1'],
    'Boss Damage': ['+20%', '+19%', '+18%', '+17%', '+16%', '+15%'],
    'Buff Duration': ['+50%', '+49%', '+48%', '+47%', '+45%', '+44%'],
    'Cooldown Skip Chance': ['+20%', '+19%', '+18%'],
    'Damage to Abnormal Status Monsters': ['+10%', '+9%'],
    'Damage to Normal Monsters': ['+10%', '+9%'],
    'Item Drop Rate': ['+20%', '+19%', '+18%'],
    'Mesos Obtained': ['+20%', '+19%', '+18%'],
    'Attack': ['+30', '+27'],
    'Magic Attack': ['+30', '+27'],
    'All Stats': ['+40', '+39', '+38', '+37', '+36', '+35'],
    'Attack per Levels': ['per 10 Levels', 'per 12 Levels', 'per 14 Levels', 'per 16 Levels'],
    'Magic Attack per Levels': ['per 10 Levels', 'per 12 Levels', 'per 14 Levels', 'per 16 Levels'],
    'Critical Rate': ['+30%', '+29%', '+28%', '+27%', '+26%', '+25%'],
    'STR': ['+40', '+39', '+38', '+37', '+36', '+35'],
    'DEX': ['+40', '+39', '+38', '+37', '+36', '+35'],
    'INT': ['+40', '+39', '+38', '+37', '+36', '+35'],
    'LUK': ['+40', '+39', '+38', '+37', '+36', '+35'],
    'Max HP': ['+20%', '+19%', '+18%'],
    'Max MP': ['+20%', '+19%', '+18%'],
  },
  Unique: {
    'Boss Damage': ['+10%', '+9%', '+8%', '+7%', '+6%', '+5%'],
    'Buff Duration': ['+38%', '+37%', '+35%', '+34%', '+33%', '+32%'],
    'Cooldown Skip Chance': ['+10%', '+9%', '+8%'],
    'Damage to Abnormal Status Monsters': ['+8%', '+7%'],
    'Damage to Normal Monsters': ['+8%', '+7%'],
    'Item Drop Rate': ['+15%', '+14%', '+13%'],
    'Mesos Obtained': ['+15%', '+14%', '+13%'],
    'Attack': ['+21', '+18', '+15'],
    'Magic Attack': ['+21', '+18', '+15'],
    'All Stats': ['+30', '+29', '+28', '+27', '+26', '+25'],
    'Critical Rate': ['+20%', '+19%', '+18%', '+17%', '+16%', '+15%'],
    'STR': ['+30', '+29', '+28'],
    'DEX': ['+30', '+29', '+28'],
    'INT': ['+30', '+29', '+28'],
    'LUK': ['+30', '+29', '+28'],
    'Max HP': ['+10%', '+9%', '+8%', '+7%', '+6%', '+5%'],
    'Max MP': ['+10%', '+9%', '+8%', '+7%', '+6%', '+5%'],
  },
  Epic: {
    'Buff Duration': ['+25%', '+24%', '+23%', '+22%', '+20%', '+19%'],
    'Damage to Abnormal Status Monsters': ['+7%', '+5%', '+4%'],
    'Damage to Normal Monsters': ['+7%', '+5%', '+4%'],
    'Item Drop Rate': ['+10%', '+9%', '+8%'],
    'Mesos Obtained': ['+10%', '+9%', '+8%'],
    'Attack': ['+12', '+9', '+6'],
    'Magic Attack': ['+12', '+9', '+6'],
    'All Stats': ['+20', '+19', '+18', '+17', '+16', '+15'],
    'Critical Rate': ['+10%', '+9%', '+8%', '+7%', '+6%', '+5%'],
    'STR': ['+20', '+19', '+18'],
    'DEX': ['+20', '+19', '+18'],
    'INT': ['+20', '+19', '+18'],
    'LUK': ['+20', '+19', '+18'],
    'Max HP': ['+300', '+285', '+270', '+255', '+240', '+225'],
    'Max MP': ['+300', '+285', '+270', '+255', '+240', '+225'],
  },
  Rare: {
    'Buff Duration': ['+13%', '+12%', '+10%', '+9%', '+8%', '+7%'],
    'Damage to Abnormal Status Monsters': ['+3%', '+2%'],
    'Damage to Normal Monsters': ['+3%', '+2%'],
    'Item Drop Rate': ['+5%', '+4%', '+3%'],
    'Mesos Obtained': ['+5%', '+4%', '+3%'],
    'All Stats': ['+10', '+9', '+8', '+7', '+6', '+5'],
    'STR': ['+10', '+9', '+8'],
    'DEX': ['+10', '+9', '+8'],
    'INT': ['+10', '+9', '+8'],
    'LUK': ['+10', '+9', '+8'],
    'Max HP': ['+150', '+135', '+120', '+105', '+90', '+75'],
    'Max MP': ['+150', '+135', '+120', '+105', '+90', '+75'],
  },
};

/** Get available types for a given rarity */
function getIATypes(rarity) {
  if (!rarity || !IA_LINES[rarity]) return [];
  return Object.keys(IA_LINES[rarity]);
}

/** Get available values for a given rarity and type */
function getIAValues(rarity, type) {
  if (!rarity || !type || !IA_LINES[rarity] || !IA_LINES[rarity][type]) return [];
  return IA_LINES[rarity][type];
}

/** Format full IA line display (e.g., "Boss Damage +20%") */
function formatIALine(type, value, useAcronyms = false) {
  if (!type || !value) return '';
  
  // Apply acronyms for display if requested
  let displayType = type;
  if (useAcronyms) {
    if (type === 'Damage to Abnormal Status Monsters') displayType = 'Abnormal';
    else if (type === 'Damage to Normal Monsters') displayType = 'Norm Dam';
    else if (type === 'Buff Duration') displayType = 'Buff Dur';
    else if (type === 'Boss Damage') displayType = 'Boss Dam';
    else if (type === 'Item Drop Rate') displayType = 'Drop Rate';
    else if (type === 'Mesos Obtained') displayType = 'Mesos';
    else if (type === 'Cooldown Skip Chance') displayType = 'Cooldown';
    else if (type === 'Magic Attack') displayType = 'M Attack';
  }
  
  // Handle "per Levels" types specially
  if (type === 'Attack per Levels' || type === 'Magic Attack per Levels') {
    const baseStat = type.replace(' per Levels', '');
    const shortStat = useAcronyms && type === 'Magic Attack per Levels' ? 'M Attack' : baseStat;
    return `${shortStat} +1 ${value}`;
  }
  // For types that are already descriptive, just append value (no colon)
  if (type === 'Passive Skill Level' || type === 'Enemy Hit by Skills' || type === 'Attack Speed') {
    return `${displayType} ${value}`;
  }
  return `${displayType} ${value}`;
}
