// Click mode definitions
// resources: { resourceId: multiplier } — what resources this mode gives per click
// unlock: { buildingId: level } — required building to unlock this mode

export const CLICK_MODES = [
  {
    id: 'decree',
    name: 'Royal Decree',
    desc: 'Collect taxes from your subjects',
    icon: '👑',
    resources: { gold: 1 },
    unlock: null,
  },
  {
    id: 'harvest',
    name: 'Harvest',
    desc: 'Reap the fields by hand',
    icon: '🌾',
    resources: { food: 1 },
    unlock: { farm: 5 },
  },
  {
    id: 'fell',
    name: 'Fell Timber',
    desc: 'Swing the axe yourself',
    icon: '🪓',
    resources: { wood: 1 },
    unlock: { lumber_mill: 5 },
  },
  {
    id: 'mine_strike',
    name: 'Mine Strike',
    desc: 'Delve into the deep',
    icon: '⛏',
    resources: { stone: 0.7, iron: 0.3 },
    unlock: { quarry: 5 },
  },
  {
    id: 'prayer',
    name: 'Prayer',
    desc: 'Whisper to the forgotten gods',
    icon: '✟',
    resources: { faith: 1 },
    unlock: { chapel: 5 },
  },
]

// Momentum thresholds and bonuses
export const MOMENTUM = {
  perClick: 2,
  decayPerSec: 1,
  max: 100,
  tiers: [
    { min: 0,  bonus: 0,    label: '' },
    { min: 25, bonus: 0.25, label: 'Warm' },
    { min: 50, bonus: 0.75, label: 'Hot' },
    { min: 75, bonus: 1.50, label: 'Blazing' },
    { min: 100, bonus: 2.50, label: 'Inferno' },
  ],
}

export const CRIT_BASE_CHANCE = 0.05
export const CRIT_BASE_MULT = 10
