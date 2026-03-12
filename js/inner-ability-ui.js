'use strict';

/**
 * Builds the Inner Ability (IA) table for a character
 * @param {Object} char - Character data
 * @param {number} idx - Character index
 * @returns {HTMLElement} The IA table element
 */
function buildInnerAbilityTable(char, idx) {
  const iaTable = document.createElement('div');
  iaTable.className = 'ia-table';
  
  // Initialize IA data if not present
  if (!char.innerAbility) {
    char.innerAbility = {
      line1: { rarity: null, type: null, value: null },
      line2: { rarity: null, type: null, value: null },
      line3: { rarity: null, type: null, value: null },
    };
  }
  
  // Header
  const header = document.createElement('div');
  header.className = 'ia-header';
  header.textContent = 'Inner Ability';
  iaTable.appendChild(header);
  
  // Build each line button
  for (let lineNum = 1; lineNum <= 3; lineNum++) {
    const lineKey = `line${lineNum}`;
    const lineData = char.innerAbility[lineKey];
    const iaLineBtn = buildIALineButton(char, idx, lineNum, lineData);
    iaTable.appendChild(iaLineBtn);
  }
  
  return iaTable;
}

/**
 * Builds a single IA line button with cascading dropdown panels
 * @param {Object} char - Character data
 * @param {number} idx - Character index
 * @param {number} lineNum - Line number (1, 2, or 3)
 * @param {Object} lineData - Current line data {rarity, type, value}
 * @returns {HTMLElement} The IA line button element
 */
function buildIALineButton(char, idx, lineNum, lineData) {
  const lineKey = `line${lineNum}`;
  // Lines 2 and 3 are only locked if Line 1 hasn't been set yet
  const isLocked = lineNum > 1 && !char.innerAbility.line1.rarity;
  
  const btn = document.createElement('div');
  btn.className = 'ia-line-btn';
  btn.dataset.idx = idx;
  btn.dataset.line = lineNum;
  
  if (isLocked) {
    btn.classList.add('ia-locked');
  }
  
  // Apply rarity color background only if line is fully configured (has rarity, type, AND value)
  const isFullyConfigured = lineData.rarity && lineData.type && lineData.value;
  if (isFullyConfigured && IA_RARITIES[lineData.rarity]) {
    btn.style.backgroundColor = IA_RARITIES[lineData.rarity].color;
    btn.style.color = '#fff';
    btn.style.fontWeight = '700';
    btn.classList.add('ia-configured');
  }
  
  // Display text
  const displayText = getIALineDisplayText(lineData, lineNum, isLocked);
  btn.textContent = displayText;
  
  // Add tooltip showing full line details (no acronyms)
  if (isFullyConfigured) {
    const tooltipText = `${lineData.rarity}: ${formatIALine(lineData.type, lineData.value, false)}`;
    btn.title = tooltipText;
  } else if (lineData.rarity && lineData.type) {
    btn.title = `${lineData.rarity}: ${lineData.type} (select value)`;
  } else if (lineData.rarity) {
    btn.title = `${lineData.rarity} (select type)`;
  } else if (isLocked) {
    btn.title = 'Set Line 1 first';
  } else {
    btn.title = 'Click to set Inner Ability';
  }
  
  // Click handler to open cascading panel
  if (!isLocked) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openIAPanel(char, idx, lineNum, btn);
    });
  }
  
  return btn;
}

/**
 * Gets display text for an IA line
 */
function getIALineDisplayText(lineData, lineNum, isLocked) {
  if (isLocked) {
    return 'Set Line 1';
  }
  if (!lineData.rarity) {
    return 'Line ' + lineNum;
  }
  if (!lineData.type) {
    return lineData.rarity;
  }
  if (!lineData.value) {
    return `${lineData.rarity} ${lineData.type}`;
  }
  // Use acronyms for display
  return formatIALine(lineData.type, lineData.value, true);
}

/**
 * Gets types that are already used in other lines
 * Exception: "All Stats" can appear on multiple lines (default case)
 */
function getUsedTypes(char, currentLineNum) {
  const usedTypes = [];
  for (let i = 1; i <= 3; i++) {
    if (i !== currentLineNum) {
      const lineData = char.innerAbility[`line${i}`];
      if (lineData && lineData.type) {
        // "All Stats" can be duplicated, so don't add it to used types
        if (lineData.type !== 'All Stats') {
          usedTypes.push(lineData.type);
        }
      }
    }
  }
  return usedTypes;
}

/**
 * Opens the cascading IA selection panel
 */
function openIAPanel(char, idx, lineNum, btnElement) {
  // If clicking the same button, close and return
  const existingPanel = document.querySelector('.ia-panel');
  if (existingPanel && 
      existingPanel.dataset.activeIdx === String(idx) && 
      existingPanel.dataset.activeLine === String(lineNum)) {
    closeIAPanel();
    return;
  }
  
  // Close any existing IA panel
  closeIAPanel();
  
  const lineKey = `line${lineNum}`;
  const lineData = char.innerAbility[lineKey];
  
  // Create main panel
  const panel = document.createElement('div');
  panel.className = 'ia-panel';
  panel.dataset.activeIdx = idx;
  panel.dataset.activeLine = lineNum;
  document.body.appendChild(panel);
  
  // Stage 1: Rarity selection
  const raritySection = document.createElement('div');
  raritySection.className = 'ia-panel-section';
  
  const availableRarities = lineNum === 1 
    ? ['Legendary', 'Unique', 'Epic', 'Rare']
    : getAvailableRarities(lineNum, char.innerAbility.line1.rarity);
  
  availableRarities.forEach(rarity => {
    const opt = document.createElement('div');
    opt.className = 'ia-panel-opt';
    if (lineData.rarity === rarity) opt.classList.add('ia-active');
    opt.textContent = rarity;
    opt.style.color = IA_RARITIES[rarity].color;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectIARarity(char, idx, lineNum, rarity);
    });
    raritySection.appendChild(opt);
  });
  
  panel.appendChild(raritySection);
  
  // Stage 2: Type selection (if rarity is selected)
  if (lineData.rarity) {
    const typeSection = document.createElement('div');
    typeSection.className = 'ia-panel-section';
    
    const allTypes = getIATypes(lineData.rarity);
    const usedTypes = getUsedTypes(char, lineNum);
    const availableTypes = allTypes.filter(type => !usedTypes.includes(type));
    
    availableTypes.forEach(type => {
      const opt = document.createElement('div');
      opt.className = 'ia-panel-opt';
      if (lineData.type === type) opt.classList.add('ia-active');
      opt.textContent = type;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        selectIAType(char, idx, lineNum, type);
      });
      typeSection.appendChild(opt);
    });
    
    panel.appendChild(typeSection);
  }
  
  // Stage 3: Value selection (if type is selected)
  if (lineData.rarity && lineData.type) {
    const valueSection = document.createElement('div');
    valueSection.className = 'ia-panel-section';
    
    const values = getIAValues(lineData.rarity, lineData.type);
    values.forEach(value => {
      const opt = document.createElement('div');
      opt.className = 'ia-panel-opt';
      if (lineData.value === value) opt.classList.add('ia-active');
      opt.textContent = value;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        selectIAValue(char, idx, lineNum, value);
        closeIAPanel();
      });
      valueSection.appendChild(opt);
    });
    
    panel.appendChild(valueSection);
  }
  
  // Position panel after all content is added so we can measure height
  const rect = btnElement.getBoundingClientRect();
  const panelHeight = panel.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  // Position to the right of the button
  panel.style.left = (rect.right + 4) + 'px';
  
  // Position above or below based on available space
  if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
    // Open upwards
    panel.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
    panel.style.top = 'auto';
  } else {
    // Open downwards (default)
    panel.style.top = rect.top + 'px';
    panel.style.bottom = 'auto';
  }
  
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', handleOutsideIAClick);
  }, 0);
}

/**
 * Closes the IA panel
 */
function closeIAPanel() {
  const existing = document.querySelector('.ia-panel');
  if (existing) {
    existing.remove();
    document.removeEventListener('click', handleOutsideIAClick);
  }
}

/**
 * Handles clicks outside the IA panel
 */
function handleOutsideIAClick(e) {
  if (!e.target.closest('.ia-panel') && !e.target.closest('.ia-line-btn')) {
    closeIAPanel();
  }
}

/**
 * Selects an IA rarity (draft mode - doesn't save until value is selected)
 */
function selectIARarity(char, idx, lineNum, rarity) {
  const panel = document.querySelector('.ia-panel');
  if (!panel) return;
  
  // Store draft selection on the panel (don't modify char data yet)
  panel.dataset.draftRarity = rarity;
  delete panel.dataset.draftType; // Reset type when rarity changes
  delete panel.dataset.draftValue; // Reset value when rarity changes
  
  // Update the rarity section to show the newly selected rarity as active
  const raritySections = panel.querySelectorAll('.ia-panel-section');
  if (raritySections.length > 0) {
    // Update active states in rarity section (first section)
    const raritySection = raritySections[0];
    raritySection.querySelectorAll('.ia-panel-opt').forEach(opt => {
      opt.classList.toggle('ia-active', opt.textContent === rarity);
    });
  }
  
  // Update panel dynamically to show type selection (no re-render)
  updateIAPanelForTypeSelection(char, idx, lineNum);
}

/**
 * Selects an IA type (draft mode - doesn't save until value is selected)
 */
function selectIAType(char, idx, lineNum, type) {
  const panel = document.querySelector('.ia-panel');
  if (!panel) return;
  
  // Store draft selection on the panel (don't modify char data yet)
  panel.dataset.draftType = type;
  delete panel.dataset.draftValue; // Reset value when type changes
  
  // Update the type section to show the newly selected type as active
  const typeSections = panel.querySelectorAll('.ia-panel-section');
  if (typeSections.length > 1) {
    // Update active states in type section (second section)
    const typeSection = typeSections[1];
    typeSection.querySelectorAll('.ia-panel-opt').forEach(opt => {
      opt.classList.toggle('ia-active', opt.textContent === type);
    });
  }
  
  // Update panel dynamically to show value selection (no re-render)
  updateIAPanelForValueSelection(char, idx, lineNum);
}

/**
 * Selects an IA value (commits the full selection)
 */
function selectIAValue(char, idx, lineNum, value) {
  const panel = document.querySelector('.ia-panel');
  const lineKey = `line${lineNum}`;
  
  // Get the rarity and type from draft state or existing data
  const rarity = panel?.dataset.draftRarity || char.innerAbility[lineKey].rarity;
  const type = panel?.dataset.draftType || char.innerAbility[lineKey].type;
  
  // Only save if we have all three values
  if (!rarity || !type || !value) return;
  
  // Commit the full selection
  char.innerAbility[lineKey] = {
    rarity: rarity,
    type: type,
    value: value,
  };
  
  // If changing line 1, reset lines 2 and 3 (since rarity constraints change)
  if (lineNum === 1 && char.innerAbility.line1.rarity !== rarity) {
    char.innerAbility.line2 = { rarity: null, type: null, value: null };
    char.innerAbility.line3 = { rarity: null, type: null, value: null };
  }
  
  if (typeof save === 'function') save();
  
  // Update only the specific IA button, not the entire character list
  const btn = document.querySelector(`.ia-line-btn[data-idx="${idx}"][data-line="${lineNum}"]`);
  if (btn && typeof buildInnerAbilityTable === 'function') {
    // Find the IA table and rebuild just that button
    const iaTable = btn.closest('.ia-table');
    if (iaTable) {
      const lineData = char.innerAbility[lineKey];
      const newBtn = buildIALineButton(char, idx, lineNum, lineData);
      btn.replaceWith(newBtn);
    }
  }
  
  closeIAPanel();
}

/**
 * Updates the panel to show type selection after rarity is chosen
 */
function updateIAPanelForTypeSelection(char, idx, lineNum) {
  const panel = document.querySelector('.ia-panel');
  if (!panel) return;
  
  const lineData = char.innerAbility[`line${lineNum}`];
  
  // Get rarity from draft or saved state
  const currentRarity = panel.dataset.draftRarity || lineData.rarity;
  if (!currentRarity) return;
  
  // Remove existing type and value sections if they exist
  const existingSections = panel.querySelectorAll('.ia-panel-section');
  if (existingSections.length > 1) {
    for (let i = existingSections.length - 1; i >= 1; i--) {
      existingSections[i].remove();
    }
  }
  
  // Add type section
  const typeSection = document.createElement('div');
  typeSection.className = 'ia-panel-section';
  
  const allTypes = getIATypes(currentRarity);
  const usedTypes = getUsedTypes(char, lineNum);
  const availableTypes = allTypes.filter(type => !usedTypes.includes(type));
  
  // Get currently selected type from draft or saved state
  const currentType = panel.dataset.draftType || lineData.type;
  
  availableTypes.forEach(type => {
    const opt = document.createElement('div');
    opt.className = 'ia-panel-opt';
    if (currentType === type) opt.classList.add('ia-active');
    opt.textContent = type;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectIAType(char, idx, lineNum, type);
    });
    typeSection.appendChild(opt);
  });
  
  panel.appendChild(typeSection);
}

/**
 * Updates the panel to show value selection after type is chosen
 */
function updateIAPanelForValueSelection(char, idx, lineNum) {
  const panel = document.querySelector('.ia-panel');
  if (!panel) return;
  
  const lineData = char.innerAbility[`line${lineNum}`];
  
  // Get rarity and type from draft or saved state
  const currentRarity = panel.dataset.draftRarity || lineData.rarity;
  const currentType = panel.dataset.draftType || lineData.type;
  if (!currentRarity || !currentType) return;
  
  // Remove existing value section if it exists
  const existingSections = panel.querySelectorAll('.ia-panel-section');
  if (existingSections.length > 2) {
    existingSections[2].remove();
  }
  
  // Add value section
  const valueSection = document.createElement('div');
  valueSection.className = 'ia-panel-section';
  
  const values = getIAValues(currentRarity, currentType);
  
  // Get currently selected value from draft or saved state
  const currentValue = panel.dataset.draftValue || lineData.value;
  
  values.forEach(value => {
    const opt = document.createElement('div');
    opt.className = 'ia-panel-opt';
    if (currentValue === value) opt.classList.add('ia-active');
    opt.textContent = value;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      selectIAValue(char, idx, lineNum, value);
    });
    valueSection.appendChild(opt);
  });
  
  panel.appendChild(valueSection);
}
