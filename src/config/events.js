// Event definitions
// Types: 'positive' (auto-apply), 'negative' (auto-apply), 'choice' (player picks)
// Effects: { type, target?, value }
//   - resource_flat: add/subtract flat amount to a resource
//   - resource_mult: multiply a resource's production for duration
//   - resource_pct: add/subtract % of current resource
//   - building_level: add/subtract building levels
//   - storage_flat: add flat storage temporarily (or permanently if no duration)

export const EVENTS = [
  // ═══ Positive Events ═══
  {
    id: 'wandering_merchant',
    name: 'Wandering Merchant',
    desc: 'A cloaked figure emerges from the mist, offering rare goods at fair prices.',
    icon: '🧳',
    type: 'positive',
    effects: [
      { type: 'resource_flat', target: 'gold', value: 200 },
      { type: 'resource_flat', target: 'iron', value: 50 },
    ],
    message: 'The merchant leaves behind gold and iron.',
    weight: 10,
  },
  {
    id: 'festival',
    name: 'Festival of Light',
    desc: 'The townsfolk celebrate with a grand festival, filling coffers and granaries.',
    icon: '🎪',
    type: 'positive',
    effects: [
      { type: 'resource_flat', target: 'gold', value: 300 },
      { type: 'resource_flat', target: 'food', value: 200 },
    ],
    message: 'The festival brings abundance to the realm.',
    weight: 8,
  },
  {
    id: 'bountiful_harvest',
    name: 'Bountiful Harvest',
    desc: 'The fields yield far more than expected this season.',
    icon: '🌾',
    type: 'positive',
    effects: [
      { type: 'resource_flat', target: 'food', value: 500 },
    ],
    message: 'Your granaries overflow with food.',
    weight: 10,
  },
  {
    id: 'angelic_visitation',
    name: 'Angelic Visitation',
    desc: 'A spectral figure descends from the heavens, blessing the realm.',
    icon: '👼',
    type: 'positive',
    effects: [
      { type: 'resource_flat', target: 'faith', value: 200 },
      { type: 'resource_flat', target: 'gold', value: 100 },
    ],
    message: 'Divine grace fills the kingdom.',
    weight: 6,
  },
  {
    id: 'ore_vein',
    name: 'Ore Vein Discovered',
    desc: 'Miners stumble upon a rich vein of ore deep underground.',
    icon: '💎',
    type: 'positive',
    effects: [
      { type: 'resource_flat', target: 'iron', value: 300 },
      { type: 'resource_flat', target: 'stone', value: 200 },
    ],
    message: 'The mine yields precious materials.',
    weight: 8,
  },
  {
    id: 'timber_surplus',
    name: 'Ancient Grove Found',
    desc: 'Scouts discover a grove of ancient trees, ripe for harvest.',
    icon: '🌲',
    type: 'positive',
    effects: [
      { type: 'resource_flat', target: 'wood', value: 400 },
    ],
    message: 'The lumber mills work overtime.',
    weight: 8,
  },

  // ═══ Negative Events ═══
  {
    id: 'plague',
    name: 'Plague',
    desc: 'A terrible sickness sweeps through the kingdom, consuming food reserves.',
    icon: '☠',
    type: 'negative',
    effects: [
      { type: 'resource_pct', target: 'food', value: -0.20 },
    ],
    message: 'The plague consumes 20% of your food.',
    weight: 8,
  },
  {
    id: 'bandit_raid',
    name: 'Bandit Raid',
    desc: 'Raiders descend upon the realm under cover of darkness.',
    icon: '🗡',
    type: 'negative',
    effects: [
      { type: 'resource_pct', target: 'gold', value: -0.15 },
      { type: 'resource_pct', target: 'iron', value: -0.10 },
    ],
    message: 'Bandits steal 15% of your gold and 10% of your iron.',
    weight: 10,
  },
  {
    id: 'drought',
    name: 'Drought',
    desc: 'The rains refuse to fall. Crops wither in the cursed soil.',
    icon: '🏜',
    type: 'negative',
    effects: [
      { type: 'resource_pct', target: 'food', value: -0.25 },
      { type: 'resource_pct', target: 'wood', value: -0.10 },
    ],
    message: 'Drought destroys 25% of food and 10% of wood.',
    weight: 7,
  },
  {
    id: 'heresy',
    name: 'Heresy',
    desc: 'Dark whispers spread among the faithful, shaking their resolve.',
    icon: '🔥',
    type: 'negative',
    effects: [
      { type: 'resource_pct', target: 'faith', value: -0.30 },
    ],
    message: 'Heresy claims 30% of your faith.',
    weight: 6,
  },
  {
    id: 'mine_collapse',
    name: 'Mine Collapse',
    desc: 'A section of the mine gives way, burying ore and stone.',
    icon: '⛏',
    type: 'negative',
    effects: [
      { type: 'resource_pct', target: 'stone', value: -0.15 },
      { type: 'resource_pct', target: 'iron', value: -0.15 },
    ],
    message: 'The collapse destroys 15% of stone and iron.',
    weight: 7,
  },

  // ═══ Choice Events ═══
  {
    id: 'cursed_artifact',
    name: 'Cursed Artifact',
    desc: 'A stranger offers a glowing artifact pulsing with dark energy. It radiates power, but at what cost?',
    icon: '🔮',
    type: 'choice',
    weight: 5,
    choices: [
      {
        label: 'Accept the artifact',
        desc: 'Gain 500 gold, but lose 50% faith',
        effects: [
          { type: 'resource_flat', target: 'gold', value: 500 },
          { type: 'resource_pct', target: 'faith', value: -0.50 },
        ],
        message: 'The artifact fills your coffers but darkens the soul.',
      },
      {
        label: 'Refuse and pray',
        desc: 'Gain 100 faith',
        effects: [
          { type: 'resource_flat', target: 'faith', value: 100 },
        ],
        message: 'You refuse the temptation. The gods are pleased.',
      },
    ],
  },
  {
    id: 'peasant_uprising',
    name: 'Peasant Uprising',
    desc: 'The peasants gather at the gates, demanding better conditions. How do you respond?',
    icon: '⚔',
    type: 'choice',
    weight: 5,
    choices: [
      {
        label: 'Negotiate',
        desc: 'Costs 200 gold, but gain 100 food and 50 faith',
        effects: [
          { type: 'resource_flat', target: 'gold', value: -200 },
          { type: 'resource_flat', target: 'food', value: 100 },
          { type: 'resource_flat', target: 'faith', value: 50 },
        ],
        message: 'A fair compromise is reached. The people are grateful.',
      },
      {
        label: 'Suppress',
        desc: 'Costs 100 iron, but risk losing 50 faith',
        effects: [
          { type: 'resource_flat', target: 'iron', value: -100 },
          { type: 'resource_flat', target: 'faith', value: -50 },
        ],
        message: 'The uprising is crushed. Fear replaces hope.',
      },
      {
        label: 'Concede',
        desc: 'Lose 300 gold but gain 150 faith',
        effects: [
          { type: 'resource_flat', target: 'gold', value: -300 },
          { type: 'resource_flat', target: 'faith', value: 150 },
        ],
        message: 'You yield to their demands. The people celebrate.',
      },
    ],
  },
  {
    id: 'dark_portal',
    name: 'Dark Portal',
    desc: 'A rift tears open in the courtyard, emanating strange energies. Something stirs within.',
    icon: '🌀',
    type: 'choice',
    weight: 4,
    choices: [
      {
        label: 'Enter the portal',
        desc: 'Risk it all: gain 300 of every resource, or lose 20% of everything',
        effects: [
          // Will be resolved with 50/50 chance in eventStore
          { type: 'portal_gamble' },
        ],
        message: '', // set dynamically
        gamble: true,
      },
      {
        label: 'Seal it with faith',
        desc: 'Costs 200 faith, gain 200 iron and 200 stone',
        effects: [
          { type: 'resource_flat', target: 'faith', value: -200 },
          { type: 'resource_flat', target: 'iron', value: 200 },
          { type: 'resource_flat', target: 'stone', value: 200 },
        ],
        message: 'The portal is sealed. Strange metals remain.',
      },
    ],
  },
  {
    id: 'traveling_scholar',
    name: 'Traveling Scholar',
    desc: 'A wise scholar seeks refuge in your realm. They offer knowledge in exchange for shelter.',
    icon: '📜',
    type: 'choice',
    weight: 6,
    choices: [
      {
        label: 'Welcome them',
        desc: 'Costs 100 gold and 50 food, gain 25 RP',
        effects: [
          { type: 'resource_flat', target: 'gold', value: -100 },
          { type: 'resource_flat', target: 'food', value: -50 },
          { type: 'rp_flat', value: 25 },
        ],
        message: 'The scholar shares ancient knowledge.',
      },
      {
        label: 'Turn them away',
        desc: 'No cost, no gain',
        effects: [],
        message: 'The scholar departs into the fog.',
      },
    ],
  },
  {
    id: 'foreign_envoy',
    name: 'Foreign Envoy',
    desc: 'An envoy from a distant kingdom arrives bearing gifts and a trade proposal.',
    icon: '👑',
    type: 'choice',
    weight: 6,
    choices: [
      {
        label: 'Accept the trade',
        desc: 'Give 200 wood, receive 300 gold',
        effects: [
          { type: 'resource_flat', target: 'wood', value: -200 },
          { type: 'resource_flat', target: 'gold', value: 300 },
        ],
        message: 'A prosperous trade agreement is struck.',
      },
      {
        label: 'Counter-offer',
        desc: 'Give 100 iron, receive 200 food and 100 wood',
        effects: [
          { type: 'resource_flat', target: 'iron', value: -100 },
          { type: 'resource_flat', target: 'food', value: 200 },
          { type: 'resource_flat', target: 'wood', value: 100 },
        ],
        message: 'The envoy accepts your shrewd counter-offer.',
      },
    ],
  },
]

export const EVENT_MAP = Object.fromEntries(EVENTS.map(e => [e.id, e]))

// Event timing
export const EVENT_TIMING = {
  minInterval: 120,  // minimum seconds between events
  maxInterval: 300,  // maximum seconds between events
  tavernReduction: 0.15, // per tavern level, reduces interval
}
