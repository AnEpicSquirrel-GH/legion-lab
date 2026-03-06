# Class reference — weapons, secondaries, armor, emblems

Use this table to verify and correct class-specific data in `js/classes.js`, `js/data.js`, `js/icons.js`, and `js/weapons.js`. **Do not regress:** e.g. Luminous uses **Shining Rod only** (no Staff/Wand); Battle Mage uses **Staff only** (no Wand).

---

## Quick rules

| Rule | Example |
|------|--------|
| **Weapon types** are exclusive per class; never add a type the class cannot equip in-game. | Luminous: Shining Rod only. Kanna: Fan only. Illium: Lucent Gauntlet only. |
| **CRA armor** is one of five named sets (Warrior / Mage / Archer / Thief / Pirate). Xenon uses **Thief** set for icons (wiki: Thief for class-dependent content). | Mage set = Royal Dunwitch Hat, Eagle Eye Dunwitch Robe, Trixter Dunwitch Pants. |
| **Emblems** are per faction or per class (Explorer Maple Leaf, Cygnus, Heroes, Resistance, etc.). | Xenon = Resistance → Silver/Gold Resistance Emblem. |
| **Secondary** must match the class’s in-game secondary type (Magic Book, Orb, Katara, etc.). | Luminous = Orb. Dual Blade = Katara (excluded from generic “Lv. 100 Secondary”). |

---

## Reference table

| Class | Faction | Weapon types | Secondary | CRA armor set | Silver emblem | Gold emblem |
|-------|---------|--------------|-----------|---------------|---------------|-------------|
| **Hero** | Explorer | Two-handed Sword, Two-handed Axe, One-handed Sword, One-handed Axe | Medallion | Warrior (Royal Warrior Helm, Eagle Eye Warrior Armor, Trixter Warrior Pants) | Silver Maple Leaf | Gold Maple Leaf |
| **Paladin** | Explorer | Two-handed Blunt, Two-handed Sword, One-handed Blunt, One-handed Sword | Rosary | Warrior | Silver Maple Leaf | Gold Maple Leaf |
| **Dark Knight** | Explorer | Spear, Polearm | Iron Chain | Warrior | Silver Maple Leaf | Gold Maple Leaf |
| **Arch Mage (Fire, Poison)** | Explorer | Staff, Wand | Magic Book | Mage (Royal Dunwitch Hat, Eagle Eye Dunwitch Robe, Trixter Dunwitch Pants) | Silver Maple Leaf | Gold Maple Leaf |
| **Arch Mage (Ice, Lightning)** | Explorer | Staff, Wand | Magic Book | Mage | Silver Maple Leaf | Gold Maple Leaf |
| **Bishop** | Explorer | Staff, Wand | Magic Book | Mage | Silver Maple Leaf | Gold Maple Leaf |
| **Bowmaster** | Explorer | Bow | Arrow Fletching | Archer (Royal Ranger Beret, Eagle Eye Ranger Cowl, Trixter Ranger Pants) | Silver Maple Leaf | Gold Maple Leaf |
| **Marksman** | Explorer | Crossbow | Bow Thimble | Archer | Silver Maple Leaf | Gold Maple Leaf |
| **Pathfinder** | Explorer | Ancient Bow | Relic | Archer | Silver Maple Leaf | Gold Maple Leaf |
| **Night Lord** | Explorer | Claw | Charm | Thief (Royal Assassin Hood, Eagle Eye Assassin Shirt, Trixter Assassin Pants) | Silver Maple Leaf | Gold Maple Leaf |
| **Shadower** | Explorer | Dagger | Dagger Scabbard | Thief | Silver Maple Leaf | Gold Maple Leaf |
| **Dual Blade** | Explorer | Dagger | **Katara** (no generic Lv. 100 Secondary) | Thief | Silver Maple Leaf | Gold Maple Leaf |
| **Buccaneer** | Explorer | Knuckle | Wrist Band | Pirate (Royal Wanderer Hat, Eagle Eye Wanderer Coat, Trixter Wanderer Pants) | Silver Maple Leaf | Gold Maple Leaf |
| **Corsair** | Explorer | Gun | Far Sight | Pirate | Silver Maple Leaf | Gold Maple Leaf |
| **Cannon Master** | Explorer | Hand Cannon | Powder Keg | Pirate | Silver Maple Leaf | Gold Maple Leaf |
| **Dawn Warrior** | Cygnus | Two-handed Sword, One-handed Sword | Jewel (Cygnus) | Warrior | Silver Cygnus | Gold Cygnus |
| **Mihile** | Cygnus | One-handed Sword | Soul Shield | Warrior | Silver Cygnus | Gold Cygnus |
| **Blaze Wizard** | Cygnus | Staff, Wand | Jewel | Mage | Silver Cygnus | Gold Cygnus |
| **Wind Archer** | Cygnus | Bow | Jewel | Archer | Silver Cygnus | Gold Cygnus |
| **Night Walker** | Cygnus | Claw | Jewel | Thief | Silver Cygnus | Gold Cygnus |
| **Thunder Breaker** | Cygnus | Knuckle | Jewel | Pirate | Silver Cygnus | Gold Cygnus |
| **Aran** | Hero | Polearm | Mass | Warrior | Silver Heroes (Aran) | Gold Heroes (Aran) |
| **Evan** | Hero | Staff, Wand | Document | Mage | Silver Heroes (Evan) | Gold Heroes (Evan) |
| **Mercedes** | Hero | Dual Bowguns | Magic Arrow | Archer | Silver Heroes (Mercedes) | Gold Heroes (Mercedes) |
| **Phantom** | Hero | Cane | Card | Thief | Silver Heroes (Phantom) | Gold Heroes (Phantom) |
| **Luminous** | Hero | **Shining Rod only** (no Staff, no Wand) | Orb | Mage | Silver Heroes (Luminous) | Gold Heroes (Luminous) |
| **Shade (Eunwol)** | Hero | Knuckle | Fox Marble | Pirate | Silver Heroes (Shade) | Gold Heroes (Shade) |
| **Demon Slayer** | Resistance | One-handed Axe, One-handed Blunt | Demon Aegis | Warrior | Silver Demon | Gold Demon |
| **Demon Avenger** | Resistance | Desperado | Abyssal Path | Warrior | Silver Demon | Gold Demon |
| **Blaster** | Resistance | Arm Cannon | Charge | Warrior | Silver Resistance | Gold Resistance |
| **Battle Mage** | Resistance | **Staff only** (no Wand) | Magic Marble | Mage | Silver Resistance | Gold Resistance |
| **Wild Hunter** | Resistance | Crossbow | Arrowhead | Archer | Silver Resistance | Gold Resistance |
| **Mechanic** | Resistance | Gun | Magnum | Pirate | Silver Resistance | Gold Resistance |
| **Xenon** | Resistance | Whip Blade | Controller | **Thief** (icons: Thief armor; can equip Thief/Pirate in-game) | Silver Resistance | Gold Resistance |
| **Kinesis** | Resistance | Psy-limiter | Chess Piece | Mage | Silver Kinesis | Gold Kinesis |
| **Kaiser** | Nova | Two-handed Sword | Dragon Essence | Warrior | Lesser Dragon | Dragon |
| **Angelic Buster** | Nova | Soul Shooter | Soul Ring | Pirate | Lesser Angel | Angel |
| **Cadena** | Nova | Chain | Warp Forge | Thief | Silver Agent | Gold Agent |
| **Kain** | Nova | Whispershot | Weapon Belt | Archer | Silver Hitman | Gold Hitman |
| **Adele** | Flora | Bladecaster | Bladebinder | Warrior | Silver Knight's | Gold Knight's |
| **Illium** | Flora | Lucent Gauntlet only | Lucent Wings | Mage | Silver Crystal | Gold Crystal |
| **Khali** | Flora | Chakram | Hex Seeker | Thief | Silver Chaser | Gold Chaser |
| **Ark** | Flora | Martial Brace | Abyssal Path | Thief | Silver Abyssal | Gold Abyssal |
| **Hoyoung** | Anima | Ritual Fan | Fan Tassel | Thief | Silver Three Paths | Gold Three Paths |
| **Lara** | Anima | Wand | Ornament | Mage | Silver Earthseer | Gold Earthseer |
| **Mo Xuan** | Jianghu | Martial Brace | Brace Band | Pirate | Silver Xuanshan School | Gold Xuanshan School |
| **Hayato** | Sengoku | Katana | Kodachi | Warrior | Silver Crescent | Gold Crescent |
| **Kanna** | Sengoku | **Fan only** (Spirit Walker Fan) | Talisman | Mage | Silver Blossom | Gold Blossom |
| **Zero** | Transcendent | Long Sword + Heavy Sword (Secondary = Heavy) | — (no secondary slot) | Warrior | Eternal Time | Eternal Time |
| **Ren** | Anima | Sword | Imugi Gem | Warrior | Silver Sword | Gold Sword |
| **Sia Astelle** | Shine | Celestial Light | Compass | Mage | Silver Guardian | Gold Guardian |
| **Lynn** | Jianghu | Memorial Staff only | Leaf | Mage | Silver Forest | Gold Forest |

---

## Where to edit

| What | File | Symbol / location |
|------|------|-------------------|
| Weapon types, secondary type, faction | `js/classes.js` | `CLASS_WEAPON_DATA` |
| Gear category (for armor icons: Warrior/Mage/Archer/Thief/Pirate/Xenon) | `js/classes.js` | `CLASS_CATEGORY` |
| CRA / named armor (which classes get which Hat, Top, Bottom) | `js/data.js` | `SLOT_ITEMS['Hat']`, `'Top/Overall'`, `'Bottom'` — `cls` arrays |
| Silver / Gold emblem per class | `js/classes.js` | `CLASS_SILVER_EMBLEM`, `CLASS_GOLD_EMBLEM` |
| Emblem dropdown (which classes can select which emblem) | `js/data.js` | `SLOT_ITEMS['Emblem']` — `cls` arrays |
| Secondary icon (Lv. 100, Frozen, Princess No) | `js/icons.js` | `SECONDARY_ICON_MAP` |
| Weapon tier items (label + icon per type and tier) | `js/weapons.js` | `WEAPON_TIER_ITEMS` |
| Weapon type priority (when class has multiple types) | `js/presets.js` | `WEAPON_TYPE_PRIORITY` |

---

## Secondary naming (uniformity)

- **Cygnus Knights:** Lv. 100 secondary is **Ereve Brilliance** (Jewel) for Dawn Warrior, Blaze Wizard, Wind Archer, Night Walker, Thunder Breaker. **Mihile** uses **Soul Shield only** — Lv. 100 = **Soul Shield of Justice** (not Ereve Brilliance).
- **Explorers:** Lv. 100 secondary uses the **named item** (e.g. Virtues Medallion, Berserk Chain, Rusty Book (Epode)) so the UI and presets refer to the known name. Map: `js/presets.js` `EXPLORER_LV100_SECONDARY`; options: `js/data.js` `SLOT_ITEMS['Secondary Weapon']` (Explorer and Cygnus are excluded from generic "Lv. 100 Secondary").

---

## Explorer secondaries (no category fallback)

Every **Explorer** class must have an **explicit** entry in `SECONDARY_ICON_MAP` for each generic secondary (Lv. 100, Frozen, Princess No) and for the **named** Lv. 100 item (e.g. `Virtues Medallion|Hero`). If we only used the category fallback (e.g. Mage, Pirate), wrong icons would show: e.g. **Bishop** would get **Princess No's Flaming Book** (F/P book) when the lookup fails and falls back to `Princess No Secondary|Mage`. Similarly, **Buccaneer** and **Corsair** would get **Center Fire Bomb** (Cannon Master) if they fell back to Pirate.

**Explorer Mage secondaries (all three must be explicit):**

| Class | Lv. 100 | Frozen | Princess No |
|-------|---------|--------|-------------|
| Arch Mage (Fire, Poison) | Rusty_Book_(Epode) | Frozen_Rusty_Book | Princess_No's_Flaming_Book |
| Arch Mage (Ice, Lightning) | Rusty_Book_(Epode) | Frozen_Rusty_Book | Princess_No's_Damp_Book |
| Bishop | Frozen_White_Gold_Book | Frozen_White_Gold_Book | Princess_No's_Golden_Book |

**Explorer Pirate secondaries (each uses a different type):**

| Class | Lv. 100 | Frozen | Princess No |
|-------|---------|--------|-------------|
| Buccaneer | Wrist_Armor (Wrist Band) | Frozen_Wrist_Armor | Princess_No's_Skull_Armor |
| Corsair | Falcon_Eye (Far Sight) | Frozen_Falcon_Eye | Princess_No's_Falcon_Eye |
| Cannon Master | Center_Fire_Bomb (Powder Keg) | Frozen_Center_Fire_Bomb | Princess_No's_Fire_Bomb |

**Explorer Warriors (each uses a different secondary type):**

| Class | Secondary type | Lv. 100 | Frozen | Princess No |
|-------|----------------|---------|--------|-------------|
| Hero | Medallion | Virtues_Medallion | Frozen_Medal | Princess_No's_Medal |
| Paladin | Rosary (or Shield with 1H) | Deimos_Warrior_Shield | Frozen_Rosary | Princess_No's_Rosary |
| Dark Knight | Iron Chain | Berserk_Chain | Frozen_Chain | Princess_No's_Flower_Chain |

**Explorer Archers (each uses a different secondary type):**

| Class | Secondary type | Lv. 100 | Frozen | Princess No |
|-------|----------------|---------|--------|-------------|
| Bowmaster | Arrow Fletching | Blasted_Feather | Frozen_Feather | Princess_No's_Feather |
| Marksman | Bow Thimble | True_Shot | Frozen_True_Shot | Princess_No's_Wreath |
| Pathfinder | Relic | Perfect_Relic | Frozen_Relic | Princess_No's_Immortal_Relic |

**Explorer Thieves (each uses a different secondary type; Dual Blade uses Katara, excluded from generic):**

| Class | Secondary type | Lv. 100 | Frozen | Princess No |
|-------|----------------|---------|--------|-------------|
| Night Lord | Charm | Death_Sender_Charm | Frozen_Death_Sender_Charm | Princess_No's_Charm |
| Shadower | Dagger Scabbard | Slashing_Shadow | Frozen_Shadow | Princess_No's_Purple_Shadow |

Class names are trimmed before lookup so that stored values like `"Bishop "` still match.

---

## Faction secondaries (Heroes, Resistance, Cygnus, Friends, Flora, Sengoku, Anima, Jianghu, Shine, Transcendent)

Each of these factions has **explicit** Lv. 100 / Frozen / Princess No entries in `SECONDARY_ICON_MAP` where the class’s secondary type differs from the category fallback (e.g. Aran = Mass, not Warrior shield; Battle Mage = Magic Marble, not Mage book).

**Heroes** (Aran, Evan, Luminous, Mercedes, Phantom, Shade):

| Class | Secondary type | Lv. 100 | Frozen | Princess No |
|-------|----------------|---------|--------|-------------|
| Aran | Mass | Dragon_Mass | Frozen_Dragon_Mass | Princess_No's_Flower_Ballast |
| Evan | Document | Dragon_Master's_Legacy | Frozen_Dragon_Master's_Legacy | Princess_No's_Dragon_Legacy |
| Luminous | Orb | Karma_Orb | Frozen_Orb | Princess_No's_Soul_Orb |
| Mercedes | Magic Arrow | Golden_Pearl_Leaf | Frozen_Pearl_Leaf | Princess_No's_Accursed_Arrow |
| Phantom | Card | Carte_Finale | Carte_Frozen_Maple | Princess_No's_Carte |
| Shade (Eunwol) | Fox Marble | Golden_Fox_Marble | Frozen_Fox_Marble | Princess_No's_Fox_Marble |

**Resistance** (Battle Mage, Blaster, Demon Slayer, Demon Avenger, Mechanic, Wild Hunter, Xenon; Kinesis = Friends World):

| Class | Secondary type | Lv. 100 | Frozen | Princess No |
|-------|----------------|---------|--------|-------------|
| Battle Mage | Magic Marble | Maximizer_Ball | Frozen_Maximizer_Ball | Princess_No's_Accursed_Marble |
| Blaster | Charge | Masterwork_Charges | Frozen_Charges | Princess_No's_Megaton_Charges |
| Demon Slayer / Avenger | Demon Aegis | Force_Shield_of_Extremes | Frozen_Force_Shield | Princess_No's_Accursed_Shield |
| Mechanic | Magnum | Eternal_Magnum | Frozen_Magnum | Princess_No's_Magnum |
| Wild Hunter | Arrowhead | Wild_Heron | Frozen_Wild_Heron | Princess_No's_Arrowhead |
| Xenon | Controller | Octa_Core_Controller | Frozen_Octo_Core_Controller | Princess_No's_Controller |

**Cygnus** (Dawn Warrior, Blaze Wizard, Wind Archer, Night Walker, Thunder Breaker): Lv. 100 = **Ereve Brilliance** (Jewel). **Mihile** uses **Soul Shield only**: Lv. 100 = Soul_Shield_of_Justice; Frozen = Frozen_Soul_Shield; Princess No = Princess_No's_Soul_Shield. Other five use Ereve_Brilliance / Floral_Jewel.

**Friends World — Kinesis:** Chess Piece. Lv. 100: Queen_Chess_Piece; Frozen: Frozen_Queen_Chess_Piece; Princess No: Princess_No's_Oriental_King_Chess_Piece.

**Flora** (Adele, Ark, Illium, Khali): All have explicit Lv. 100, Frozen, and Princess No (Bladebinder, Path, Lucent Wings, Hex Seeker).

**Sengoku** (Hayato, Kanna): Hayato = Kodachi (Fire_Phoenix_Blade, Frozen_Blade, Princess_No's_Wakizashi). Kanna = Talisman (Pandemonium_Talisman, Frozen_Talisman, Princess_No's_Talisman).

**Anima** (Hoyoung, Lara, Ren): Hoyoung = Fan Tassel; Lara = Ornament (Radiant_Four-Jade_Ornament, Frozen_Four-Jade_Ornament, Princess_No's_Immortal_Four-Jade_Ornament); Ren = Imugi Gem (Violet_Imugi_Gem, Frozen_Imugi_Gem, Princess_No's_Imugi_Gem).

**Jianghu** (Mo Xuan, Lynn): Mo Xuan = Brace Band (Boundless_Brace_Band, Frozen_Brace_Band, Princess_No's_Brace_Band); Lynn = Leaf (Golden_Pearl_Leaf, Frozen_Pearl_Leaf, Princess_No's_Leaf).

**Shine — Sia Astelle:** Compass. Lv. 100: Evolving_Compass; Frozen: Frozen_Compass; Princess No: Princess_No's_Compass.

**Transcendent — Zero:** No traditional secondary; Secondary slot holds Heavy Sword (paired with Long Sword). Lv. 100 Secondary map entry is a placeholder; Zero is not excluded from the dropdown but uses the same slot for the second weapon.

---

## Class-specific notes

- **Luminous:** Mage category, but **Shining Rod only**. Never add Staff or Wand. Secondary = Orb (e.g. Karma Orb for Lv. 100).
- **Battle Mage:** **Staff only**, no Wand. Secondary = Magic Marble. Mage CRA armor.
- **Kanna:** **Fan only** (Spirit Walker Fan in WEAPON_TIER_ITEMS). Secondary = Talisman. Mage CRA armor.
- **Illium:** **Lucent Gauntlet only**. Secondary = Lucent Wings. Mage CRA armor.
- **Lara:** Wand only (Anima). Mage CRA armor.
- **Lynn:** **Memorial Staff only**. Secondary = Leaf. Mage CRA armor.
- **Xenon:** Thief/Pirate hybrid. **Armor icons** use Thief set (no Xenon assets). **Emblem** = Resistance (Silver/Gold Resistance Emblem). Secondary = Controller.
- **Zero:** Weapon = Long Sword only in dropdown; Secondary slot shows Heavy Sword that pairs with selected Long. No traditional secondary.
- **Dual Blade:** Secondary = Katara only. Excluded from generic “Lv. 100 Secondary” / “Frozen Secondary” / “Princess No Secondary”; has own Katara options.
- **Demon Slayer / Demon Avenger:** They use **Demon Aegis** secondaries, not the generic “Princess No Secondary” label. When you apply the **Princess No Secondary** preset, it resolves to **Princess No's Accursed Shield** (Lv 140, from Princess No / Captivating Fragments). **Ruin Force Shield** is a different item (Lv 100, from Damien); both are Demon-only and selectable in the dropdown.
- **Cadena:** Secondary in-game is often called “Transmitter”; we use **Warp Forge** as the type name.
- **Explorer Mages (F/P, I/L, Bishop):** Each has its own Magic Book icon for Lv. 100 / Frozen / Princess No. **Bishop** Lv. 100 = **White Gold Book (Epode)** in-game; we use `Frozen_White_Gold_Book` (no separate Lv. 100 asset). Bishop must never fall back to Mage category (would show F/P’s Flaming Book). All three are explicit in `SECONDARY_ICON_MAP`.
- **Explorer Pirates (Buccaneer, Corsair, Cannon Master):** Each has a different secondary type (Wrist Band, Far Sight, Powder Keg). Buccaneer and Corsair have explicit Lv. 100 entries so they do not fall back to Pirate → Center_Fire_Bomb.
- **Explorer Thieves (Night Lord, Shadower):** Night Lord = **Charm** (Lv 100: Death Sender Charm); Shadower = **Dagger Scabbard** (Lv 100: Slashing Shadow). They must not share the same icon; Night Lord was corrected from Slashing_Shadow to Death_Sender_Charm.

---

## Secondary icon audit (SECONDARY_ICON_MAP)

All secondary icons are resolved in `js/icons.js` via `SECONDARY_ICON_MAP` with key `Item Label|effectiveClass`. Class is normalized: `render.js` uses `canonicalClass` (from `CLASS_NAME_ALIAS` or `char.cls`) when building slots; **`app.js`** uses **`canonicalClass`** when refreshing gear icons (e.g. after toggling backgrounds) so Bishop and other aliased classes always get the correct icon. Lookup order: `Item Label|effectiveClass` then `Item Label|category`; class string is trimmed.

### Full icon mapping table (verify nothing missing)

Every row is a `SECONDARY_ICON_MAP` entry. Icon = filename in `MapleIcons/Gear Icons/Secondary Weapons/` (add `.png`). **Dual Blade** is excluded from Lv. 100 / Frozen / Princess No (uses Katara only). **Cannoneer** uses the same mappings as Cannon Master.

| Preset | Class | Icon |
|--------|-------|------|
| Lv. 100 Secondary | Warrior | Force_Shield_of_Extremes |
| Lv. 100 Secondary | Mage | Rusty_Book_(Epode) |
| Lv. 100 Secondary | Archer | True_Shot |
| Lv. 100 Secondary | Thief | Slashing_Shadow |
| Lv. 100 Secondary | Pirate | Center_Fire_Bomb |
| Lv. 100 Secondary | Hero | Virtues_Medallion |
| Lv. 100 Secondary | Paladin | Deimos_Warrior_Shield |
| Lv. 100 Secondary | Dark Knight | Berserk_Chain |
| Lv. 100 Secondary | Mihile | Soul_Shield_of_Justice |
| Lv. 100 Secondary | Blaze Wizard | Ereve_Brilliance |
| Lv. 100 Secondary | Wind Archer | Ereve_Brilliance |
| Lv. 100 Secondary | Night Walker | Ereve_Brilliance |
| Lv. 100 Secondary | Dawn Warrior | Ereve_Brilliance |
| Lv. 100 Secondary | Thunder Breaker | Ereve_Brilliance |
| Lv. 100 Secondary | Arch Mage (Fire, Poison) | Rusty_Book_(Epode) |
| Lv. 100 Secondary | Arch Mage (Ice, Lightning) | Rusty_Book_(Epode) |
| Lv. 100 Secondary | Bishop | Frozen_White_Gold_Book |
| Lv. 100 Secondary | Aran | Dragon_Mass |
| Lv. 100 Secondary | Evan | Dragon_Master's_Legacy |
| Lv. 100 Secondary | Luminous | Karma_Orb |
| Lv. 100 Secondary | Mercedes | Golden_Pearl_Leaf |
| Lv. 100 Secondary | Phantom | Carte_Finale |
| Lv. 100 Secondary | Shade (Eunwol) | Golden_Fox_Marble |
| Lv. 100 Secondary | Bowmaster | Blasted_Feather |
| Lv. 100 Secondary | Marksman | True_Shot |
| Lv. 100 Secondary | Pathfinder | Perfect_Relic |
| Lv. 100 Secondary | Battle Mage | Maximizer_Ball |
| Lv. 100 Secondary | Wild Hunter | Wild_Heron |
| Lv. 100 Secondary | Blaster | Masterwork_Charges |
| Lv. 100 Secondary | Mechanic | Eternal_Magnum |
| Lv. 100 Secondary | Night Lord | Death_Sender_Charm |
| Lv. 100 Secondary | Shadower | Slashing_Shadow |
| Lv. 100 Secondary | Demon Slayer | Force_Shield_of_Extremes |
| Lv. 100 Secondary | Demon Avenger | Force_Shield_of_Extremes |
| Lv. 100 Secondary | Kaiser | Frozen_Dragon_Essence |
| Lv. 100 Secondary | Angelic Buster | Eternal_Magnum |
| Lv. 100 Secondary | Adele | Noble_Bladebinder |
| Lv. 100 Secondary | Illium | Glory_Lucent_Wings |
| Lv. 100 Secondary | Ark | Ultimate_Path |
| Lv. 100 Secondary | Khali | Infinite_Hex_Seeker |
| Lv. 100 Secondary | Kain | D100_Custom_Weapon_Belt |
| Lv. 100 Secondary | Hayato | Fire_Phoenix_Blade |
| Lv. 100 Secondary | Kanna | Pandemonium_Talisman |
| Lv. 100 Secondary | Hoyoung | Moonstone_Fan_Tassel |
| Lv. 100 Secondary | Lara | Radiant_Four-Jade_Ornament |
| Lv. 100 Secondary | Mo Xuan | Boundless_Brace_Band |
| Lv. 100 Secondary | Lynn | Golden_Pearl_Leaf |
| Lv. 100 Secondary | Ren | Violet_Imugi_Gem |
| Lv. 100 Secondary | Sia Astelle | Evolving_Compass |
| Lv. 100 Secondary | Kinesis | Queen_Chess_Piece |
| Lv. 100 Secondary | Zero | Dragon_Master's_Legacy |
| Lv. 100 Secondary | Xenon | Octa_Core_Controller |
| Lv. 100 Secondary | Buccaneer | Wrist_Armor |
| Lv. 100 Secondary | Corsair | Falcon_Eye |
| Lv. 100 Secondary | Cannon Master | Center_Fire_Bomb |
| Ruin Force Shield | Demon Slayer | Ruin_Force_Shield |
| Ruin Force Shield | Demon Avenger | Ruin_Force_Shield |
| Princess No's Accursed Shield | Demon Slayer | Princess_No's_Accursed_Shield |
| Princess No's Accursed Shield | Demon Avenger | Princess_No's_Accursed_Shield |
| Frozen Secondary | Warrior | Frozen_Force_Shield |
| Frozen Secondary | Mage | Frozen_Metallic_Book |
| Frozen Secondary | Archer | Frozen_Magic_Arrows |
| Frozen Secondary | Thief | Frozen_Compass |
| Frozen Secondary | Pirate | Frozen_Maximizer_Ball |
| Frozen Secondary | Xenon | Frozen_Octo_Core_Controller |
| Frozen Secondary | Hero | Frozen_Medal |
| Frozen Secondary | Paladin | Frozen_Rosary |
| Frozen Secondary | Dark Knight | Frozen_Chain |
| Frozen Secondary | Arch Mage (Fire, Poison) | Frozen_Rusty_Book |
| Frozen Secondary | Arch Mage (Ice, Lightning) | Frozen_Rusty_Book |
| Frozen Secondary | Bishop | Frozen_White_Gold_Book |
| Frozen Secondary | Bowmaster | Frozen_Feather |
| Frozen Secondary | Marksman | Frozen_True_Shot |
| Frozen Secondary | Pathfinder | Frozen_Relic |
| Frozen Secondary | Night Lord | Frozen_Death_Sender_Charm |
| Frozen Secondary | Shadower | Frozen_Shadow |
| Frozen Secondary | Buccaneer | Frozen_Wrist_Armor |
| Frozen Secondary | Corsair | Frozen_Falcon_Eye |
| Frozen Secondary | Cannon Master | Frozen_Center_Fire_Bomb |
| Frozen Secondary | Dawn Warrior | Frozen_Ereve_Brilliance |
| Frozen Secondary | Mihile | Frozen_Soul_Shield |
| Frozen Secondary | Blaze Wizard | Frozen_Ereve_Brilliance |
| Frozen Secondary | Wind Archer | Frozen_Ereve_Brilliance |
| Frozen Secondary | Night Walker | Frozen_Ereve_Brilliance |
| Frozen Secondary | Thunder Breaker | Frozen_Ereve_Brilliance |
| Frozen Secondary | Aran | Frozen_Dragon_Mass |
| Frozen Secondary | Evan | Frozen_Dragon_Master's_Legacy |
| Frozen Secondary | Mercedes | Frozen_Pearl_Leaf |
| Frozen Secondary | Phantom | Carte_Frozen_Maple |
| Frozen Secondary | Luminous | Frozen_Orb |
| Frozen Secondary | Shade (Eunwol) | Frozen_Fox_Marble |
| Frozen Secondary | Demon Slayer | Frozen_Force_Shield |
| Frozen Secondary | Demon Avenger | Frozen_Force_Shield |
| Frozen Secondary | Blaster | Frozen_Charges |
| Frozen Secondary | Battle Mage | Frozen_Maximizer_Ball |
| Frozen Secondary | Wild Hunter | Frozen_Wild_Heron |
| Frozen Secondary | Mechanic | Frozen_Magnum |
| Frozen Secondary | Kinesis | Frozen_Queen_Chess_Piece |
| Frozen Secondary | Kaiser | Frozen_Dragon_Essence |
| Frozen Secondary | Angelic Buster | Frozen_Soul_Ring |
| Frozen Secondary | Cadena | Frozen_Transmitter |
| Frozen Secondary | Kain | Frozen_D100_Weapon_Belt |
| Frozen Secondary | Adele | Frozen_Shiny_Bladebinder |
| Frozen Secondary | Illium | Frozen_Lucent_Wings |
| Frozen Secondary | Khali | Frozen_Infinite_Hex_Seeker |
| Frozen Secondary | Ark | Frozen_Path |
| Frozen Secondary | Hoyoung | Frozen_Fan_Tassel |
| Frozen Secondary | Lara | Frozen_Four-Jade_Ornament |
| Frozen Secondary | Mo Xuan | Frozen_Brace_Band |
| Frozen Secondary | Hayato | Frozen_Blade |
| Frozen Secondary | Kanna | Frozen_Talisman |
| Frozen Secondary | Sia Astelle | Frozen_Compass |
| Frozen Secondary | Lynn | Frozen_Pearl_Leaf |
| Frozen Secondary | Ren | Frozen_Imugi_Gem |
| Princess No Secondary | Warrior | Princess_No's_Skull_Armor |
| Princess No Secondary | Mage | Princess_No's_Flaming_Book |
| Princess No Secondary | Archer | Princess_No's_Accursed_Arrow |
| Princess No Secondary | Thief | Princess_No's_Compass |
| Princess No Secondary | Pirate | Princess_No's_Imugi_Gem |
| Princess No Secondary | Xenon | Princess_No's_Controller |
| Princess No Secondary | Hero | Princess_No's_Medal |
| Princess No Secondary | Paladin | Princess_No's_Rosary |
| Princess No Secondary | Dark Knight | Princess_No's_Flower_Chain |
| Princess No Secondary | Arch Mage (Fire, Poison) | Princess_No's_Flaming_Book |
| Princess No Secondary | Arch Mage (Ice, Lightning) | Princess_No's_Damp_Book |
| Princess No Secondary | Bishop | Princess_No's_Golden_Book |
| Princess No Secondary | Bowmaster | Princess_No's_Feather |
| Princess No Secondary | Marksman | Princess_No's_Wreath |
| Princess No Secondary | Pathfinder | Princess_No's_Immortal_Relic |
| Princess No Secondary | Night Lord | Princess_No's_Charm |
| Princess No Secondary | Shadower | Princess_No's_Purple_Shadow |
| Princess No Secondary | Buccaneer | Princess_No's_Skull_Armor |
| Princess No Secondary | Corsair | Princess_No's_Falcon_Eye |
| Princess No Secondary | Cannon Master | Princess_No's_Fire_Bomb |
| Princess No Secondary | Dawn Warrior | Princess_No's_Floral_Jewel |
| Princess No Secondary | Mihile | Princess_No's_Soul_Shield |
| Princess No Secondary | Blaze Wizard | Princess_No's_Floral_Jewel |
| Princess No Secondary | Wind Archer | Princess_No's_Floral_Jewel |
| Princess No Secondary | Night Walker | Princess_No's_Floral_Jewel |
| Princess No Secondary | Thunder Breaker | Princess_No's_Floral_Jewel |
| Princess No Secondary | Aran | Princess_No's_Flower_Ballast |
| Princess No Secondary | Evan | Princess_No's_Dragon_Legacy |
| Princess No Secondary | Mercedes | Princess_No's_Accursed_Arrow |
| Princess No Secondary | Phantom | Princess_No's_Carte |
| Princess No Secondary | Luminous | Princess_No's_Soul_Orb |
| Princess No Secondary | Shade (Eunwol) | Princess_No's_Fox_Marble |
| Princess No Secondary | Demon Slayer | Princess_No's_Accursed_Shield |
| Princess No Secondary | Demon Avenger | Princess_No's_Accursed_Shield |
| Princess No Secondary | Blaster | Princess_No's_Megaton_Charges |
| Princess No Secondary | Battle Mage | Princess_No's_Accursed_Marble |
| Princess No Secondary | Wild Hunter | Princess_No's_Arrowhead |
| Princess No Secondary | Mechanic | Princess_No's_Magnum |
| Princess No Secondary | Kinesis | Princess_No's_Oriental_King_Chess_Piece |
| Princess No Secondary | Kaiser | Princess_No's_Dragon_Essence |
| Princess No Secondary | Angelic Buster | Princess_No's_Soul_Ring |
| Princess No Secondary | Cadena | Princess_No's_Transmitter |
| Princess No Secondary | Kain | Princess_No's_Immortal_Weapon_Belt |
| Princess No Secondary | Adele | Princess_No's_Immortal_Bladebinder |
| Princess No Secondary | Illium | Princess_No's_Lucent_Wings |
| Princess No Secondary | Khali | Princess_No's_Immortal_Hex_Seeker |
| Princess No Secondary | Ark | Princess_No's_Path |
| Princess No Secondary | Hoyoung | Princess_No's_Fan_Tassel |
| Princess No Secondary | Lara | Princess_No's_Immortal_Four-Jade_Ornament |
| Princess No Secondary | Mo Xuan | Princess_No's_Brace_Band |
| Princess No Secondary | Hayato | Princess_No's_Wakizashi |
| Princess No Secondary | Kanna | Princess_No's_Talisman |
| Princess No Secondary | Sia Astelle | Princess_No's_Compass |
| Princess No Secondary | Lynn | Princess_No's_Leaf |
| Princess No Secondary | Ren | Princess_No's_Imugi_Gem |

*Backward compatibility:* The map also has entries for the legacy label `Eternal Secondary` (Warrior, Mage, Archer, Thief, Pirate, Xenon, Luminous, Evan, Kanna, Blaze Wizard) so old saved data that used that label still resolves to the same Frozen_ icons. The dropdown only offers Lv. 100, Frozen, Princess No; no classes are missing from the Frozen Secondary list above.

**Asset fallbacks (icon file missing; we point to an existing file):**

| Preset / Class | Intended asset | Actual map value | Note |
|----------------|----------------|------------------|------|
| Bishop Lv. 100 | White Gold Book (Epode) | Frozen_White_Gold_Book | No non-Frozen White Gold Book asset; wiki: Bishop Lv 100 = White Gold Book \<Epode\>. |
| Hero Frozen Secondary | Frozen_Medal | Frozen_Medal | Use Frozen_ prefix; add Frozen_Medal.png to repo if icon 404s. |
| Lynn Frozen Secondary | Frozen_Leaf | Frozen_Pearl_Leaf | No Frozen_Leaf.png; use Frozen_Pearl_Leaf (same leaf type). |

**Icon naming style (in repo):** No `Eqp_` prefix. Use `Frozen_` for Frozen-tier secondaries.

**Verification:** Every value in `SECONDARY_ICON_MAP` has been checked against files in `MapleIcons/Gear Icons/Secondary Weapons/`. Only the fallbacks in the table above use a different filename than the “ideal” asset.

---

**Duplicate audit (shared icons):** Expected: Cygnus (except Mihile) share Jewel; Demon Slayer & Avenger share Aegis; Xenon uses Controller (Mechanic uses Magnum); F/P & I/L share book icons; Zero placeholder. **Corrected:** Kaiser was sharing Dragon_Mass with Aran; Lv. 100 Kaiser now uses Frozen_Dragon_Essence. **Verify:** Buccaneer and Warrior both use Princess_No's_Skull_Armor for Princess No.

*Generated for Legion Lab. Update this table when changing class data so future corrections stay consistent.*
