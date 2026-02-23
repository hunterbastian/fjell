// Prestige (New Dynasty) configuration
// Crowns = prestige currency, persist across resets
// Crown shop items = permanent upgrades

export const CROWN_SHOP = [
  {
    id: 'starting_resources',
    name: 'Royal Inheritance',
    desc: '+500 starting resources per level',
    icon: '💰',
    maxLevel: 10,
    baseCost: 5,
    costScale: 1.5,
    effect: { type: 'starting_resources', value: 500 },
  },
  {
    id: 'production_mult',
    name: 'Legacy of Industry',
    desc: '+10% production per level',
    icon: '⚙',
    maxLevel: 20,
    baseCost: 3,
    costScale: 1.3,
    effect: { type: 'production_mult', value: 0.10 },
  },
  {
    id: 'click_mult',
    name: 'Ancestral Might',
    desc: '+15% click power per level',
    icon: '💪',
    maxLevel: 15,
    baseCost: 3,
    costScale: 1.3,
    effect: { type: 'click_mult', value: 0.15 },
  },
  {
    id: 'research_speed',
    name: 'Scholarly Lineage',
    desc: '+20% research speed per level',
    icon: '📚',
    maxLevel: 10,
    baseCost: 5,
    costScale: 1.5,
    effect: { type: 'research_speed', value: 0.20 },
  },
  {
    id: 'momentum_mastery',
    name: 'Momentum Mastery',
    desc: '-10% momentum decay per level',
    icon: '🌀',
    maxLevel: 10,
    baseCost: 4,
    costScale: 1.4,
    effect: { type: 'momentum_decay', value: 0.10 },
  },
  {
    id: 'storage_mult',
    name: 'Grand Vaults',
    desc: '+25% storage capacity per level',
    icon: '🏛',
    maxLevel: 10,
    baseCost: 4,
    costScale: 1.4,
    effect: { type: 'storage_mult', value: 0.25 },
  },
  {
    id: 'event_fortune',
    name: 'Fortune\'s Favor',
    desc: '+20% positive event rewards per level',
    icon: '🍀',
    maxLevel: 5,
    baseCost: 8,
    costScale: 1.6,
    effect: { type: 'event_fortune', value: 0.20 },
  },
]

export const CROWN_SHOP_MAP = Object.fromEntries(CROWN_SHOP.map(s => [s.id, s]))

// Crown calculation: based on total resources earned this dynasty
// floor(sqrt(totalEssence / 1000))
// where totalEssence = sum of all totalEarned across resources
export const CROWN_FORMULA = {
  divisor: 1000,
}
