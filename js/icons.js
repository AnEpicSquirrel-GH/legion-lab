'use strict';

// Filename overrides where the item label doesn't map cleanly to the file name
const ITEM_ICON_OVERRIDE = {
  'Pink Bean Cup':           'Pink_Holy_Cup',
  'Stone of Eternal Life':   'Stone_of_Eternal_Life',
  'Dea Sidus Earrings':      'Dea_Sidus_Earring',
  'Superior Gollux Pendant': 'Superior_Engraved_Gollux_Pendant',
  'Superior Gollux Belt':    'Superior_Engraved_Gollux_Belt',
  'Cursed Blue Spellbook':        'Cursed_Blue_Spellbook',
  // Badges
  'Ghost Ship Exorcist Badge':    'Ghost_Ship_Exorcist',
  'Sengoku High Badge':           'Sengoku_Hakase_Badge',
  'Seven Days Badge':             'Seven_Days_Badge',
  // Android Hearts
  'Glimmering Wondroid Heart':    'HeartWondroid',      // no dedicated icon; shares Wondroid art
  // Medals
  'Generic Medal':               'The_Legend_of_Mitra',
  'Antellion Guardian':           'Antellion_Guardian',
  'Chaos Vellum Crusher':         'Chaos_Vellum_Crusher',
  'Chaos Von Bon Crusher':        'Chaos_Von_Bon_Crusher',
  "Fritto's Friend":              "Fritto's_Friend",
  'Hyper Burning':                'HYPER_BURNING',
  'One Who Has Godly Control':    'One_Who_Has_Godly_Control',
  "Pollo's Friend":               "Pollo's_Friend",
  'Seven Day Monster Parker':     'Seven_Day_Monster_Parker',
  'Victoria Cup (20)':            'Victoria_Cup_(20)',
  'Weapon Jump Ring':        'Level_Jump_Ring',
  'Total Damage Ring':       'Totalling_Ring',
  'Dawn Guardian Angel Ring': 'Guardian_Angel_Ring',  // shares the same art
  // Totems (icons in Gear Icons/Totems/, named by group)
  'Dark Doom Totems':        'DarkTotem',
  'Afterlands Souviner':     'AfterlandsTotem',
  'Guild Castle Brooch':     'GuildTotem',
  'Antique Totems':          'AntiqueTotem',
  // Offset Totems (icons in Totems/Offset Totems/)
  'Dark Doom Totem':         'Dark_Totem',
  'Nine-Tailed Fox':         'Nine-Tailed_Fox_Totem',
  'Ancient Slate Replica':   'Ancient_Slate_Replica',
  'Frenzy Totem':            'Frenzy_Totem',
  'Chains of Resentment':    'Chains_of_Resentment',
  // Secondary Weapons (Frozen event items — named per class)
  'Carte Frozen':            'Carte_Frozen_Maple',
  'Frozen Katara':           'Frozen_Katara',
  'Frozen Dragon Essence':   'Nova_Frozen_Essence',
  'Frozen Medallion':        'Frozen_Medal',
  'Frozen Rosary':           'Frozen_Rosary',
  'Frozen Chain':            'Frozen_Chain',
  'Frozen Rusty Book (Epode)': 'Frozen_Rusty_Book',
  'Frozen White Gold Book (Epode)': 'Frozen_White_Gold_Book',
  'Frozen Feather':          'Frozen_Feather',
  'Frozen True Shot':        'Frozen_True_Shot',
  'Frozen Relic':            'Frozen_Relic',
  'Frozen Death Sender Charm': 'Frozen_Death_Sender_Charm',
  'Frozen Shadow':           'Frozen_Shadow',
  'Frozen Wrist Armor':      'Frozen_Wrist_Armor',
  'Frozen Falcon Eye':       'Frozen_Falcon_Eye',
  'Frozen Center Fire Bomb': 'Frozen_Center_Fire_Bomb',
  'Frozen Soul Shield':      'Frozen_Soul_Shield',
  'Frozen Ereve Brilliance': 'Frozen_Ereve_Brilliance',
  'Frozen Dragon Mass':      'Frozen_Dragon_Mass',
  "Frozen Dragon Master's Legacy": "Frozen_Dragon_Master's_Legacy",
  'Frozen Orb':              'Frozen_Orb',
  'Frozen Pearl Leaf':       'Frozen_Pearl_Leaf',
  'Frozen Fox Marble':       'Frozen_Fox_Marble',
  'Frozen Maximizer Ball':   'Frozen_Maximizer_Ball',
  'Frozen Charges':          'Frozen_Charges',
  'Frozen Force Shield':     'Frozen_Force_Shield',
  'Frozen Magnum':           'Frozen_Magnum',
  'Frozen Wild Heron':       'Frozen_Wild_Heron',
  'Frozen Octa Core Controller': 'Frozen_Octo_Core_Controller',
  'Frozen Queen Chess Piece': 'Frozen_Queen_Chess_Piece',
  'Frozen Soul Ring':        'Frozen_Soul_Ring',
  'Frozen Transmitter':      'Frozen_Transmitter',
  'Frozen D100 Weapon Belt': 'Frozen_D100_Weapon_Belt',
  'Frozen Shiny Bladebinder': 'Frozen_Shiny_Bladebinder',
  'Frozen Lucent Wings':     'Frozen_Lucent_Wings',
  'Frozen Infinite Hex Seeker': 'Frozen_Infinite_Hex_Seeker',
  'Frozen Path':             'Frozen_Path',
  'Frozen Fan Tassel':       'Frozen_Fan_Tassel',
  'Frozen Four-Jade Ornament': 'Frozen_Four-Jade_Ornament',
  'Frozen Imugi Gem':       'Frozen_Imugi_Gem',
  'Frozen Blade':            'Frozen_Blade',
  'Frozen Talisman':         'Frozen_Talisman',
  'Frozen Brace Band':       'Frozen_Brace_Band',
  'Frozen Compass':          'Frozen_Compass',
  'Deimos Warrior Shield':   'Deimos_Warrior_Shield',
  'Deimos Sage Shield':      'Deimos_Sage_Shield',
  'Deimos Shadow Shield':    'Deimos_Shadow_Shield',
  'Ruin Force Shield':       'Ruin_Force_Shield',
  "Princess No's Poisoned Sword": "Princess_No's_Poisoned_Sword",
  "Princess No's Medal": "Princess_No's_Medal",
  "Princess No's Rosary": "Princess_No's_Rosary",
  "Princess No's Flower Chain": "Princess_No's_Flower_Chain",
  "Princess No's Flaming Book": "Princess_No's_Flaming_Book",
  "Princess No's Damp Book": "Princess_No's_Damp_Book",
  "Princess No's Golden Book": "Princess_No's_Golden_Book",
  "Princess No's Feather": "Princess_No's_Feather",
  "Princess No's Wreath": "Princess_No's_Wreath",
  "Princess No's Immortal Relic": "Princess_No's_Immortal_Relic",
  "Princess No's Charm": "Princess_No's_Charm",
  "Princess No's Purple Shadow": "Princess_No's_Purple_Shadow",
  "Princess No's Skull Armor": "Princess_No's_Skull_Armor",
  "Princess No's Falcon Eye": "Princess_No's_Falcon_Eye",
  "Princess No's Fire Bomb": "Princess_No's_Fire_Bomb",
  "Princess No's Soul Shield": "Princess_No's_Soul_Shield",
  "Princess No's Floral Jewel": "Princess_No's_Floral_Jewel",
  "Princess No's Flower Ballast": "Princess_No's_Flower_Ballast",
  "Princess No's Dragon Legacy": "Princess_No's_Dragon_Legacy",
  "Princess No's Soul Orb": "Princess_No's_Soul_Orb",
  "Princess No's Accursed Arrow": "Princess_No's_Accursed_Arrow",
  "Princess No's Carte": "Princess_No's_Carte",
  "Princess No's Fox Marble": "Princess_No's_Fox_Marble",
  "Princess No's Accursed Shield": "Princess_No's_Accursed_Shield",
  "Princess No's Megaton Charges": "Princess_No's_Megaton_Charges",
  "Princess No's Accursed Marble": "Princess_No's_Accursed_Marble",
  "Princess No's Arrowhead": "Princess_No's_Arrowhead",
  "Princess No's Magnum": "Princess_No's_Magnum",
  "Princess No's Oriental King Chess Piece": "Princess_No's_Oriental_King_Chess_Piece",
  "Princess No's Controller": "Princess_No's_Controller",
  "Princess No's Dragon Essence": "Princess_No's_Dragon_Essence",
  "Princess No's Soul Ring": "Princess_No's_Soul_Ring",
  "Princess No's Transmitter": "Princess_No's_Transmitter",
  "Princess No's Immortal Weapon Belt": "Princess_No's_Immortal_Weapon_Belt",
  "Princess No's Immortal Bladebinder": "Princess_No's_Immortal_Bladebinder",
  "Princess No's Lucent Wings": "Princess_No's_Lucent_Wings",
  "Princess No's Immortal Hex Seeker": "Princess_No's_Immortal_Hex_Seeker",
  "Princess No's Path": "Princess_No's_Path",
  "Princess No's Fan Tassel": "Princess_No's_Fan_Tassel",
  "Princess No's Immortal Four-Jade Ornament": "Princess_No's_Immortal_Four-Jade_Ornament",
  "Princess No's Imugi Gem": "Princess_No's_Imugi_Gem",
  "Princess No's Wakizashi": "Princess_No's_Wakizashi",
  "Princess No's Talisman": "Princess_No's_Talisman",
  "Princess No's Leaf": "Princess_No's_Leaf",
  "Princess No's Brace Band": "Princess_No's_Brace_Band",
  "Princess No's Compass": "Princess_No's_Compass",
  'Ereve Brilliance':        'Ereve_Brilliance',
  'Soul Shield of Justice': 'Soul_Shield_of_Justice',
  'Noble Bladebinder':       'Noble_Bladebinder',
  'White Gold Book (Epode)': 'Frozen_White_Gold_Book',  // Bishop Lv. 100; no non-Frozen asset
  // Emblems — Silver / Lesser tier
  'Silver Maple Leaf Emblem':          'Silver_Maple_Leaf_Emblem',
  'Silver Cygnus Emblem':              'Silver_Cygnus_Emblem',
  'Silver Heroes Emblem (Aran)':       'Silver_Heroes_Emblem_(Aran)',
  'Silver Heroes Emblem (Evan)':       'Silver_Heroes_Emblem_(Evan)',
  'Silver Heroes Emblem (Mercedes)':   'Silver_Heroes_Emblem_(Mercedes)',
  'Silver Heroes Emblem (Phantom)':    'Silver_Heroes_Emblem_(Phantom)',
  'Silver Heroes Emblem (Luminous)':   'Silver_Heroes_Emblem_(Luminous)',
  'Silver Heroes Emblem (Shade)':      'Silver_Heroes_Emblem_(Shade)',
  'Silver Demon Emblem':               'Silver_Demon_Emblem',
  'Silver Resistance Emblem':          'Silver_Resistance_Emblem',
  'Silver Kinesis Emblem':             'Silver_Kinesis_Emblem',
  'Lesser Dragon Emblem':              'Lesser_Dragon_Emblem',
  'Lesser Angel Emblem':               'Lesser_Angel_Emblem',
  'Silver Agent Emblem':               'Silver_Agent_Emblem',
  'Silver Hitman Emblem':              'Silver_Hitman_Emblem',
  "Silver Knight's Emblem":            "Silver_Knight's_Emblem",
  'Silver Crystal Emblem':             'Silver_Crystal_Emblem',
  'Silver Chaser Emblem':              'Silver_Chaser_Emblem',
  'Silver Abyssal Emblem':             'Silver_Abyssal_Emblem',
  'Silver Three Paths Emblem':         'Silver_Three_Paths_Emblem',
  'Silver Earthseer Emblem':           'Silver_Earthseer_Emblem',
  'Silver Xuanshan School Emblem':     'Silver_Xuanshan_School_Emblem',
  'Silver Crescent Emblem':            'Silver_Crescent_Emblem',
  'Silver Blossom Emblem':             'Silver_Blossom_Emblem',
  'Silver Sword Emblem':               'Silver_Sword_Emblem',
  'Silver Guardian Emblem':            'Silver_Guardian_Emblem',
  'Silver Forest Emblem':              'Silver_Forest_Emblem',
  // Emblems — Gold tier
  'Gold Maple Leaf Emblem':          'Gold_Maple_Leaf_Emblem',
  'Gold Cygnus Emblem':              'Gold_Cygnus_Emblem',
  'Gold Heroes Emblem (Aran)':       'Gold_Heroes_Emblem_(Aran)',
  'Gold Heroes Emblem (Evan)':       'Gold_Heroes_Emblem_(Evan)',
  'Gold Heroes Emblem (Mercedes)':   'Gold_Heroes_Emblem_(Mercedes)',
  'Gold Heroes Emblem (Phantom)':    'Gold_Heroes_Emblem_(Phantom)',
  'Gold Heroes Emblem (Luminous)':   'Gold_Heroes_Emblem_(Luminous)',
  'Gold Heroes Emblem (Shade)':      'Gold_Heroes_Emblem_(Shade)',
  'Gold Demon Emblem':               'Gold_Demon_Emblem',
  'Gold Resistance Emblem':          'Gold_Resistance_Emblem',
  'Gold Kinesis Emblem':             'Gold_Kinesis_Emblem',
  'Dragon Emblem':                   'Dragon_Emblem',
  'Angel Emblem':                    'Angel_Emblem',
  'Gold Agent Emblem':               'Gold_Agent_Emblem',
  'Gold Hitman Emblem':              'Gold_Hitman_Emblem',
  "Gold Knight's Emblem":            "Gold_Knight's_Emblem",
  'Gold Crystal Emblem':             'Gold_Crystal_Emblem',
  'Gold Chaser Emblem':              'Gold_Chaser_Emblem',
  'Gold Abyssal Emblem':             'Gold_Abyssal_Emblem',
  'Gold Three Paths Emblem':         'Gold_Three_Paths_Emblem',
  'Gold Earthseer Emblem':           'Gold_Earthseer_Emblem',
  'Gold Xuanshan School Emblem':     'Gold_Xuanshan_School_Emblem',
  'Gold Crescent Emblem':            'Gold_Crescent_Emblem',
  'Gold Blossom Emblem':             'Gold_Blossom_Emblem',
  'Eternal Time Emblem':             'Eternal_Time_Emblem',
  'Gold Sword Emblem':               'Gold_Sword_Emblem',
  'Gold Guardian Emblem':            'Gold_Guardian_Emblem',
  'Gold Forest Emblem':              'Gold_Forest_Emblem',
};

// Mitra's Rage icon suffix differs from CLASS_CATEGORY keys
const EMBLEM_ICON_CLASS = {
  Warrior: 'Warrior', Mage: 'Magician', Archer: 'Bowman',
  Thief: 'Thief', Pirate: 'Pirate', Xenon: 'Pirate',
};

// Secondary weapon icon filenames keyed by 'Item Label|ClassCategory'
const SECONDARY_ICON_MAP = {
  // ── Lv. 100 Secondary (class-specific visuals) ─────────────────────
  // Category fallbacks (used if no specific class entry matches)
  'Lv. 100 Secondary|Warrior': 'Force_Shield_of_Extremes',
  'Lv. 100 Secondary|Mage':    'Rusty_Book_(Epode)',
  'Lv. 100 Secondary|Archer':  'True_Shot',
  'Lv. 100 Secondary|Thief':   'Slashing_Shadow',
  'Lv. 100 Secondary|Pirate':  'Center_Fire_Bomb',
  // Explorer Warriors
  'Lv. 100 Secondary|Hero':        'Virtues_Medallion',
  'Lv. 100 Secondary|Paladin':     'Deimos_Warrior_Shield',
  'Lv. 100 Secondary|Dark Knight': 'Berserk_Chain',        // Iron Chain type; old 3rd job was Berserker
  // Cygnus Knights (Jewel except Mihile = Soul Shield)
  'Lv. 100 Secondary|Mihile':          'Soul_Shield_of_Justice',
  'Lv. 100 Secondary|Blaze Wizard':    'Ereve_Brilliance',   // Jewel
  'Lv. 100 Secondary|Wind Archer':     'Ereve_Brilliance',   // Jewel
  'Lv. 100 Secondary|Night Walker':    'Ereve_Brilliance',   // Jewel
  'Lv. 100 Secondary|Dawn Warrior':   'Ereve_Brilliance',   // Jewel
  'Lv. 100 Secondary|Thunder Breaker': 'Ereve_Brilliance',   // Jewel
  // Explorer Mages (each explicit so Bishop never falls back to Mage → Flaming Book)
  'Lv. 100 Secondary|Arch Mage (Fire, Poison)':   'Rusty_Book_(Epode)',  // F/P: Rusty Book (Epode)
  'Lv. 100 Secondary|Arch Mage (Ice, Lightning)': 'Metallic_Blue_Book_(Epode)',  // I/L: Metallic Blue (distinct from F/P Rusty)
  'Lv. 100 Secondary|Bishop':                     'Frozen_White_Gold_Book', // Bishop: White Gold Book (Epode) Lv 100; no non-Frozen asset, use Frozen_White_Gold_Book
  // Heroes (each explicit: Aran/Evan/Shade ≠ Warrior/Mage/Pirate fallback)
  'Lv. 100 Secondary|Aran':     'Dragon_Mass',          // Mass (Polearm)
  'Lv. 100 Secondary|Evan':    "Dragon_Master's_Legacy", // Document (Staff/Wand)
  'Lv. 100 Secondary|Luminous': 'Karma_Orb',
  'Lv. 100 Secondary|Mercedes': 'Golden_Pearl_Leaf',   // Magic Arrow (Leaf icon used for Mercedes secondary)
  'Lv. 100 Secondary|Phantom':  'Carte_Finale',
  'Lv. 100 Secondary|Shade (Eunwol)': 'Golden_Fox_Marble', // Fox Marble
  // Explorer Archers (Arrow Fletching / Bow Thimble / Relic)
  'Lv. 100 Secondary|Bowmaster':  'Blasted_Feather',   // Arrow Fletching
  'Lv. 100 Secondary|Marksman':   'True_Shot',         // Bow Thimble
  'Lv. 100 Secondary|Pathfinder': 'Perfect_Relic',
  // Resistance (Battle Mage = Magic Marble, not Mage book)
  'Lv. 100 Secondary|Battle Mage': 'Maximizer_Ball',   // Magic Marble
  'Lv. 100 Secondary|Wild Hunter': 'Wild_Heron',       // Arrowhead
  'Lv. 100 Secondary|Blaster':    'Masterwork_Charges',
  'Lv. 100 Secondary|Mechanic':   'Eternal_Magnum',   // Magnum (not Controller)
  // Explorer Thieves (Night Lord = Charm; Shadower = Dagger Scabbard)
  'Lv. 100 Secondary|Night Lord': 'Death_Sender_Charm',   // Charm (Lv 100)
  'Lv. 100 Secondary|Shadower':   'Slashing_Shadow',       // Dagger Scabbard (Lv 100)
  // Demon — both use Force Shield (Demon Aegis) type
  'Lv. 100 Secondary|Demon Slayer':  'Force_Shield_of_Extremes',
  'Lv. 100 Secondary|Demon Avenger': 'Force_Shield_of_Extremes',
  // Nova / Flora / Anima
  'Lv. 100 Secondary|Kaiser':        'Nova_Truth_Essence',  // Kaiser Lv. 100
  'Lv. 100 Secondary|Angelic Buster':'Eternal_Magnum',
  'Lv. 100 Secondary|Adele':         'Noble_Bladebinder',
  'Lv. 100 Secondary|Illium':        'Glory_Lucent_Wings',   // Lucent Wings
  'Lv. 100 Secondary|Ark':           'Ultimate_Path',       // Abyssal Path
  'Lv. 100 Secondary|Khali':         'Infinite_Hex_Seeker', // Hex Seeker exclusive to Khali (wiki)
  'Lv. 100 Secondary|Kain':          'D100_Custom_Weapon_Belt', // Weapon Belt (wiki)
  // Sengoku / Anima / Jianghu / Shine (each explicit: Lara/Lynn ≠ Mage, Mo Xuan ≠ Pirate, Sia ≠ Thief)
  'Lv. 100 Secondary|Hayato':        'Fire_Phoenix_Blade',   // Kodachi
  'Lv. 100 Secondary|Kanna':         'Pandemonium_Talisman',
  'Lv. 100 Secondary|Hoyoung':       'Moonstone_Fan_Tassel', // Fan Tassel (wiki)
  'Lv. 100 Secondary|Lara':          'Radiant_Four-Jade_Ornament', // Ornament (Anima)
  'Lv. 100 Secondary|Mo Xuan':       'Boundless_Brace_Band', // Brace Band (Jianghu)
  'Lv. 100 Secondary|Lynn':          'Golden_Pearl_Leaf',    // Leaf (Jianghu; shared leaf asset)
  'Lv. 100 Secondary|Ren':           'Violet_Imugi_Gem',      // Imugi Gem (Anima)
  'Lv. 100 Secondary|Sia Astelle':   'Evolving_Compass',      // Compass (Shine)
  // Kinesis: Chess Piece (Friends World; not Hex Seeker)
  'Lv. 100 Secondary|Kinesis':       'Queen_Chess_Piece',
  'Lv. 100 Secondary|Zero':          "Dragon_Master's_Legacy", // Transcendent: no traditional secondary (Heavy Sword in slot)
  'Lv. 100 Secondary|Xenon':         'Octa_Core_Controller',  // Controller (wiki; was Transmitter = Cadena)
  // Explorer Pirates (each explicit: Buccaneer/Corsair ≠ Cannon Master)
  'Lv. 100 Secondary|Buccaneer':     'Wrist_Armor',        // Wrist Band
  'Lv. 100 Secondary|Corsair':      'Falcon_Eye',          // Far Sight
  'Lv. 100 Secondary|Cannon Master': 'Center_Fire_Bomb',   // Powder Keg (wiki)
  'Lv. 100 Secondary|Cannoneer':     'Center_Fire_Bomb',   // alias for Cannon Master

  // ── Dual Blade Princess No ───────────────────────────────────────────
  "Princess No's Poisoned Sword|Dual Blade": "Princess_No's_Poisoned_Sword",
  // ── Demon Aegis (Demon Slayer / Demon Avenger) ────────────────────────
  'Ruin Force Shield|Demon Slayer':  'Ruin_Force_Shield',
  'Ruin Force Shield|Demon Avenger': 'Ruin_Force_Shield',
  "Princess No's Accursed Shield|Demon Slayer":  "Princess_No's_Accursed_Shield",
  "Princess No's Accursed Shield|Demon Avenger": "Princess_No's_Accursed_Shield",

  // ── Named Lv. 100 secondaries (Explorer + Cygnus uniformity; Mihile = Soul Shield only) ─────────
  'Soul Shield of Justice|Mihile': 'Soul_Shield_of_Justice',
  'Virtues Medallion|Hero': 'Virtues_Medallion',
  'Deimos Warrior Shield|Paladin': 'Deimos_Warrior_Shield',
  'Berserk Chain|Dark Knight': 'Berserk_Chain',
  'Rusty Book (Epode)|Arch Mage (Fire, Poison)': 'Rusty_Book_(Epode)',
  'Rusty Book (Epode)|Arch Mage (Ice, Lightning)': 'Metallic_Blue_Book_(Epode)',  // I/L uses Metallic Blue book icon
  'White Gold Book (Epode)|Bishop': 'Frozen_White_Gold_Book',
  'Blasted Feather|Bowmaster': 'Blasted_Feather',
  'True Shot|Marksman': 'True_Shot',
  'Perfect Relic|Pathfinder': 'Perfect_Relic',
  'Death Sender Charm|Night Lord': 'Death_Sender_Charm',
  'Deimos Shadow Shield|Shadower': 'Slashing_Shadow',
  'Wrist Armor|Buccaneer': 'Wrist_Armor',
  'Falcon Eye|Corsair': 'Falcon_Eye',
  'Center Fire Bomb|Cannon Master': 'Center_Fire_Bomb',
  // Heroes
  'Dragon Mass|Aran': 'Dragon_Mass',
  'Karma Orb|Luminous': 'Karma_Orb',
  'Golden Pearl Leaf|Mercedes': 'Golden_Pearl_Leaf',
  'Golden Pearl Leaf|Lynn': 'Golden_Pearl_Leaf',
  'Carte Finale|Phantom': 'Carte_Finale',
  'Golden Fox Marble|Shade (Eunwol)': 'Golden_Fox_Marble',
  // Resistance
  'Masterwork Charges|Blaster': 'Masterwork_Charges',
  'Eternal Magnum|Mechanic': 'Eternal_Magnum',
  'Eternal Magnum|Angelic Buster': 'Eternal_Magnum',
  'Wild Heron|Wild Hunter': 'Wild_Heron',
  'Octa Core Controller|Xenon': 'Octa_Core_Controller',
  'Queen Chess Piece|Kinesis': 'Queen_Chess_Piece',
  // Nova
  'Nova Truth Essence|Kaiser': 'Nova_Truth_Essence',
  'Warp Forge|Cadena': 'Warp_Forge',
  'D100 Custom Weapon Belt|Kain': 'D100_Custom_Weapon_Belt',
  // Flora
  'Glory Lucent Wings|Illium': 'Glory_Lucent_Wings',
  'Infinite Hex Seeker|Khali': 'Infinite_Hex_Seeker',
  'Ultimate Path|Ark': 'Ultimate_Path',
  // Anima
  'Moonstone Fan Tassel|Hoyoung': 'Moonstone_Fan_Tassel',
  'Radiant Four-Jade Ornament|Lara': 'Radiant_Four-Jade_Ornament',
  'Violet Imugi Gem|Ren': 'Violet_Imugi_Gem',
  // Sengoku
  'Fire Phoenix Blade|Hayato': 'Fire_Phoenix_Blade',
  'Pandemonium Talisman|Kanna': 'Pandemonium_Talisman',
  // Jianghu
  'Boundless Brace Band|Mo Xuan': 'Boundless_Brace_Band',
  // Shine
  'Evolving Compass|Sia Astelle': 'Evolving_Compass',

  // ── Princess No Secondary (wiki-aligned per class) ──────────────────
  // No Warrior fallback for Skull Armor; only Buccaneer has explicit Princess_No's_Skull_Armor
  "Princess No Secondary|Mage":                       "Princess_No's_Flaming_Book",
  "Princess No Secondary|Archer":                     "Princess_No's_Accursed_Arrow",
  "Princess No Secondary|Thief":                      "Princess_No's_Compass",
  "Princess No Secondary|Pirate":                     "Princess_No's_Imugi_Gem",
  "Princess No Secondary|Xenon":                      "Princess_No's_Controller",
  // Explorer Warriors
  "Princess No Secondary|Hero":                       "Princess_No's_Medal",
  "Princess No Secondary|Paladin":                    "Princess_No's_Rosary",
  "Princess No Secondary|Dark Knight":                "Princess_No's_Flower_Chain",
  // Explorer Mages
  "Princess No Secondary|Arch Mage (Fire, Poison)":   "Princess_No's_Flaming_Book",
  "Princess No Secondary|Arch Mage (Ice, Lightning)": "Princess_No's_Damp_Book",
  "Princess No Secondary|Bishop":                     "Princess_No's_Golden_Book",
  // Explorer Archers
  "Princess No Secondary|Bowmaster":                  "Princess_No's_Feather",
  "Princess No Secondary|Marksman":                   "Princess_No's_Wreath",
  "Princess No Secondary|Pathfinder":                 "Princess_No's_Immortal_Relic",
  // Explorer Thieves (Dual Blade = Princess No's Poisoned Sword)
  "Princess No Secondary|Night Lord":                 "Princess_No's_Charm",
  "Princess No Secondary|Shadower":                   "Princess_No's_Purple_Shadow",
  "Princess No Secondary|Dual Blade":                 "Princess_No's_Poisoned_Sword",
  // Explorer Pirates
  "Princess No Secondary|Buccaneer":                  "Princess_No's_Skull_Armor",
  "Princess No Secondary|Corsair":                    "Princess_No's_Falcon_Eye",
  "Princess No Secondary|Cannon Master":              "Princess_No's_Fire_Bomb",
  // Cygnus
  "Princess No Secondary|Dawn Warrior":               "Princess_No's_Floral_Jewel",
  "Princess No Secondary|Mihile":                     "Princess_No's_Soul_Shield",
  "Princess No Secondary|Blaze Wizard":               "Princess_No's_Floral_Jewel",
  "Princess No Secondary|Wind Archer":                "Princess_No's_Floral_Jewel",
  "Princess No Secondary|Night Walker":               "Princess_No's_Floral_Jewel",
  "Princess No Secondary|Thunder Breaker":            "Princess_No's_Floral_Jewel",
  // Heroes
  "Princess No Secondary|Aran":                       "Princess_No's_Flower_Ballast",
  "Princess No Secondary|Evan":                       "Princess_No's_Dragon_Legacy",
  "Princess No Secondary|Mercedes":                   "Princess_No's_Accursed_Arrow",
  "Princess No Secondary|Phantom":                    "Princess_No's_Carte",
  "Princess No Secondary|Luminous":                   "Princess_No's_Soul_Orb",
  "Princess No Secondary|Shade (Eunwol)":             "Princess_No's_Fox_Marble",
  // Resistance
  "Princess No Secondary|Demon Slayer":               "Princess_No's_Accursed_Shield",
  "Princess No Secondary|Demon Avenger":              "Princess_No's_Accursed_Shield",
  "Princess No Secondary|Blaster":                    "Princess_No's_Megaton_Charges",
  "Princess No Secondary|Battle Mage":               "Princess_No's_Accursed_Marble",
  "Princess No Secondary|Wild Hunter":                "Princess_No's_Arrowhead",
  "Princess No Secondary|Mechanic":                  "Princess_No's_Magnum",   // Magnum (not Controller)
  "Princess No Secondary|Kinesis":                   "Princess_No's_Oriental_King_Chess_Piece",
  // Nova
  "Princess No Secondary|Kaiser":                     "Princess_No's_Dragon_Essence",
  "Princess No Secondary|Angelic Buster":             "Princess_No's_Soul_Ring",
  "Princess No Secondary|Cadena":                    "Princess_No's_Transmitter",
  "Princess No Secondary|Kain":                       "Princess_No's_Immortal_Weapon_Belt",
  // Flora
  "Princess No Secondary|Adele":                      "Princess_No's_Immortal_Bladebinder",
  "Princess No Secondary|Illium":                    "Princess_No's_Lucent_Wings",
  "Princess No Secondary|Khali":                     "Princess_No's_Immortal_Hex_Seeker",
  // Anima / Jianghu / Sengoku / Shine
  "Princess No Secondary|Ark":                       "Princess_No's_Path",
  "Princess No Secondary|Hoyoung":                    "Princess_No's_Fan_Tassel",
  "Princess No Secondary|Lara":                      "Princess_No's_Immortal_Four-Jade_Ornament",
  "Princess No Secondary|Mo Xuan":                    "Princess_No's_Brace_Band",
  "Princess No Secondary|Hayato":                     "Princess_No's_Wakizashi",
  "Princess No Secondary|Kanna":                      "Princess_No's_Talisman",
  "Princess No Secondary|Sia Astelle":                "Princess_No's_Compass",
  "Princess No Secondary|Lynn":                      "Princess_No's_Leaf",
  "Princess No Secondary|Ren":                       "Princess_No's_Imugi_Gem",

  // ── Legacy "Eternal Secondary" label (old saved data; Frozen_ icons only) ──
  'Eternal Secondary|Warrior':                    'Frozen_Force_Shield',
  'Eternal Secondary|Mage':                       'Frozen_Talisman',
  'Eternal Secondary|Luminous':                   'Frozen_Orb',
  'Eternal Secondary|Evan':                       "Frozen_Dragon_Master's_Legacy",
  'Eternal Secondary|Kanna':                      'Frozen_Talisman',
  'Eternal Secondary|Blaze Wizard':               'Frozen_Ereve_Brilliance',
  'Eternal Secondary|Archer':                     'Frozen_Falcon_Eye',
  'Eternal Secondary|Thief':                      'Frozen_Death_Sender_Charm',
  'Eternal Secondary|Pirate':                     'Frozen_Magnum',
  'Eternal Secondary|Xenon':                      'Frozen_Octo_Core_Controller',
};

/** Converts an item label to a snake_case filename base (no extension). */
function labelToFilename(label) { return label.replace(/\s+/g, '_'); }

/**
 * Resolves the local icon path for a gear piece.
 * Naming convention: SetSlotClass.png  (e.g. AbsoHatWarrior.png)
 * Shared slots (no class variant): SetSlot.png  (e.g. AbsoCape.png)
 */
function gearIconPath(setName, slot, charClass) {
  const prefix = SET_PREFIX[setName];
  if (!prefix) return null;

  // Top/Overall suffix depends on whether the set uses an Overall or a Top
  const suffix = slot === 'Top/Overall'
    ? (SET_USES_OVERALL.has(setName) ? 'Overall' : 'Top')
    : SLOT_SUFFIX[slot];
  if (!suffix) return null;

  if (CLASS_SPECIFIC_SLOTS.has(slot)) {
    const effectiveClass = (typeof CLASS_NAME_ALIAS !== 'undefined' && CLASS_NAME_ALIAS[charClass]) || charClass;
    let cat = CLASS_CATEGORY[effectiveClass] || 'Warrior';
    // Xenon: MapleIcons has no Xenon armor; wiki treats Xenon as Thief for class-dependent content (Hat/Top/Bottom)
    const isXenon = (charClass && String(charClass).trim() === 'Xenon') || cat === 'Xenon';
    if (isXenon && (slot === 'Hat' || slot === 'Top/Overall' || slot === 'Bottom')) {
      cat = 'Thief';
    }
    return `MapleIcons/Gear Icons/${prefix}${suffix}${cat}.png`;
  }
  return `MapleIcons/Gear Icons/${prefix}${suffix}.png`;
}

/** Path for the generic (no-class) variant, e.g. AbsoCape.png */
function gearIconPathGeneric(setName, slot) {
  const prefix = SET_PREFIX[setName];
  const suffix = slot === 'Top/Overall'
    ? (SET_USES_OVERALL.has(setName) ? 'Overall' : 'Top')
    : SLOT_SUFFIX[slot];
  if (!prefix || !suffix) return null;
  return `MapleIcons/Gear Icons/${prefix}${suffix}.png`;
}

/**
 * Returns ordered candidate icon paths for a given item.
 * Tries the most specific path first, falling back to tier-based then badge.
 */
function itemIconCandidates(setName, slot, itemLabel, charClass) {
  const candidates = [];

  // ── Android Heart ──────────────────────────────────────────────
  if (slot === 'Android Heart') {
    const override = ITEM_ICON_OVERRIDE[itemLabel];
    const key = override ?? ('Heart' + itemLabel.replace(/\s*Heart\s*/gi, '').replace(/\s+/g, ''));
    candidates.push(`MapleIcons/Gear Icons/${key}.webp`);
    candidates.push(`MapleIcons/Gear Icons/${key}.png`);
    return candidates;
  }

  // ── Medal ───────────────────────────────────────────────────────
  if (slot === 'Medal' && itemLabel !== 'None') {
    const fname = ITEM_ICON_OVERRIDE[itemLabel] || labelToFilename(itemLabel);
    candidates.push(`MapleIcons/Gear Icons/Accessories/Medals/${fname}.png`);
    candidates.push(`MapleIcons/Gear Icons/Accessories/${fname}.png`);
    return candidates;
  }

  // ── Emblem ──────────────────────────────────────────────────────
  if (slot === 'Emblem' && itemLabel !== 'None') {
    const fname = ITEM_ICON_OVERRIDE[itemLabel] || labelToFilename(itemLabel);
    if (itemLabel === "Mitra's Rage") {
      const cat = CLASS_CATEGORY[charClass] || 'Warrior';
      const suffix = EMBLEM_ICON_CLASS[cat] || cat;
      candidates.push(`MapleIcons/Gear Icons/Accessories/${fname}_${suffix}.png`);
    } else {
      candidates.push(`MapleIcons/Gear Icons/Emblems/${fname}.png`);
      candidates.push(`MapleIcons/Gear Icons/Accessories/${fname}.png`);
    }
    return candidates;
  }

  // ── Offset Totem (icons in Totems/Offset Totems/) ────────────────
  if (slot === 'Offset Totem' && itemLabel !== 'None') {
    const fname = ITEM_ICON_OVERRIDE[itemLabel] || labelToFilename(itemLabel);
    candidates.push(`MapleIcons/Gear Icons/Totems/Offset Totems/${fname}.png`);
    return candidates;
  }

  // ── Totem (icons in Totems folder) ─────────────────────────────
  if (slot === 'Totem' && itemLabel !== 'None') {
    const fname = ITEM_ICON_OVERRIDE[itemLabel] || labelToFilename(itemLabel);
    candidates.push(`MapleIcons/Gear Icons/Totems/${fname}.png`);
    return candidates;
  }

  // ── Accessories ────────────────────────────────────────────────
  if (ACCESSORY_SLOTS.has(slot) && itemLabel !== 'None') {
    const fname = ITEM_ICON_OVERRIDE[itemLabel] || labelToFilename(itemLabel);
    if (OZ_RING_LABELS.has(itemLabel)) {
      candidates.push(`MapleIcons/Gear Icons/Accessories/Oz Rings/${fname}.png`);
    } else if (itemLabel === "Mitra's Rage") {
      const cat = CLASS_CATEGORY[charClass] || 'Warrior';
      const suffix = EMBLEM_ICON_CLASS[cat] || cat;
      candidates.push(`MapleIcons/Gear Icons/Accessories/${fname}_${suffix}.png`);
    } else {
      candidates.push(`MapleIcons/Gear Icons/Accessories/${fname}.png`);
    }
  }

  // ── Secondary Weapon ───────────────────────────────────────────
  if (slot === 'Secondary Weapon' && itemLabel !== 'None') {
    // Zero: Heavy Sword in Secondary uses the same weapon icon (Weapons folder)
    const wIcon = WEAPON_LABEL_ICON[itemLabel];
    if (wIcon) candidates.push(`MapleIcons/Gear Icons/Weapons/${wIcon}.png`);
    const rawClass = (typeof CLASS_NAME_ALIAS !== 'undefined' && CLASS_NAME_ALIAS[charClass]) || charClass;
    const effectiveClass = typeof rawClass === 'string' ? rawClass.trim() : rawClass;
    const cat = CLASS_CATEGORY[effectiveClass] || 'Warrior';
    // Check class-specific entry first (Explorers must have explicit entries to avoid wrong category fallback, e.g. Bishop → Mage → Flaming Book)
    let classFname = SECONDARY_ICON_MAP[`${itemLabel}|${effectiveClass}`]
                  || SECONDARY_ICON_MAP[`${itemLabel}|${cat}`];
    // Class-specific resolved names (e.g. Princess No's Soul Orb) are keyed as "Princess No Secondary|Class" in the map
    if (!classFname && (itemLabel.startsWith("Princess No's") || (itemLabel.startsWith('Frozen ') && itemLabel !== 'Frozen Secondary'))) {
      const generic = itemLabel.startsWith("Princess No's") ? 'Princess No Secondary' : 'Frozen Secondary';
      classFname = SECONDARY_ICON_MAP[`${generic}|${effectiveClass}`] || SECONDARY_ICON_MAP[`${generic}|${cat}`];
    }
    if (classFname) candidates.push(`MapleIcons/Gear Icons/Secondary Weapons/${classFname}.png`);
    // Direct lookup for class-agnostic items (katara, standalone secondaries, etc.)
    const directFname = ITEM_ICON_OVERRIDE[itemLabel] || labelToFilename(itemLabel);
    candidates.push(`MapleIcons/Gear Icons/Secondary Weapons/${directFname}.png`);
    // Fallback: some secondary icons live in the Accessories folder
    candidates.push(`MapleIcons/Gear Icons/Accessories/${directFname}.png`);
  }

  // ── Weapon slot — prefer class-specific icon from WEAPON_TIER_ITEMS ──
  if (slot === 'Weapon' && itemLabel !== 'None') {
    const effectiveClass = (typeof CLASS_NAME_ALIAS !== 'undefined' && CLASS_NAME_ALIAS[charClass]) || charClass;
    let iconLabel = itemLabel;
    if (!WEAPON_LABEL_ICON[itemLabel] && typeof resolvePresetWeapon === 'function') {
      const resolved = resolvePresetWeapon(effectiveClass, itemLabel);
      if (resolved) iconLabel = resolved;
    }
    const wIcon = WEAPON_LABEL_ICON[iconLabel];
    if (wIcon) candidates.push(`MapleIcons/Gear Icons/Weapons/${wIcon}.png`);
  }

  // ── Tier-based fallbacks (armor slots etc.) ────────────────────
  const classPath   = gearIconPath(setName, slot, charClass);
  const genericPath = gearIconPathGeneric(setName, slot);
  if (classPath)   candidates.push(classPath);
  if (genericPath) candidates.push(genericPath);

  return candidates;
}

// NOTE: icons are kept local only. Use rename-icons.ps1 to download & name files.
