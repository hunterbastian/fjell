// Building definitions
// cost: { resourceId: amount } — base cost at level 0
// produces: { resourceId: amountPerSec } — base rate per level
// unlock: { buildingId: level } — required buildings to unlock

export const BUILDINGS = [
  {
    id: 'farm',
    name: 'Farm',
    desc: 'Tills cursed soil to yield grain',
    icon: '🌾',
    cost: { gold: 10 },
    produces: { food: 0.5 },
    unlock: null,
  },
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    desc: 'Fells the dark forest timber',
    icon: '🪓',
    cost: { gold: 10 },
    produces: { wood: 0.5 },
    unlock: null,
  },
  {
    id: 'quarry',
    name: 'Quarry',
    desc: 'Carves stone from haunted cliffs',
    icon: '⛏',
    cost: { wood: 50 },
    produces: { stone: 0.3 },
    unlock: { lumber_mill: 3 },
  },
  {
    id: 'mine',
    name: 'Mine',
    desc: 'Burrows into the deep dark below',
    icon: '⚒',
    cost: { stone: 200 },
    produces: { iron: 0.2 },
    unlock: { quarry: 3 },
  },
  {
    id: 'market',
    name: 'Market',
    desc: 'Shadowy merchants peddle wares',
    icon: '⚖',
    cost: { wood: 100, stone: 100 },
    produces: { gold: 1.0 },
    unlock: { quarry: 1 },
  },
  {
    id: 'chapel',
    name: 'Chapel',
    desc: 'A candle flickers against the void',
    icon: '✟',
    cost: { gold: 500 },
    produces: { faith: 0.1 },
    unlock: { market: 3 },
  },
  {
    id: 'tavern',
    name: 'Tavern',
    desc: 'Rumors whisper of dark portents',
    icon: '🍺',
    cost: { gold: 200, wood: 50 },
    produces: {},
    unlock: { market: 1 },
    special: 'events',
  },
  {
    id: 'blacksmith',
    name: 'Blacksmith',
    desc: 'Forges arms in ember-glow',
    icon: '⚔',
    cost: { iron: 100, gold: 50 },
    produces: {},
    unlock: { mine: 3 },
    special: 'equipment',
  },
  {
    id: 'library',
    name: 'Library',
    desc: 'Forbidden tomes line endless shelves',
    icon: '📖',
    cost: { gold: 300, stone: 200 },
    produces: {},
    unlock: { market: 5 },
    special: 'research',
  },
  {
    id: 'castle',
    name: 'Castle',
    desc: 'A fortress to defy the darkness',
    icon: '🏰',
    cost: { gold: 1000, wood: 1000, stone: 1000, food: 1000, iron: 1000, faith: 1000 },
    produces: {},
    unlock: { farm: 10, lumber_mill: 10, quarry: 10, mine: 10, market: 10, chapel: 10 },
    special: 'prestige',
  },
]

export const COST_SCALE = 1.15
export const MAX_LEVEL = 50

// Lookup map
export const BUILDING_MAP = Object.fromEntries(BUILDINGS.map(b => [b.id, b]))
