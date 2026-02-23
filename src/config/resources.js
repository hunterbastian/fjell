export const RESOURCES = [
  { id: 'gold',  name: 'Gold',  icon: 'G', color: 'var(--gold)',  startCap: 1000 },
  { id: 'wood',  name: 'Wood',  icon: 'W', color: 'var(--wood)',  startCap: 1000 },
  { id: 'stone', name: 'Stone', icon: 'S', color: 'var(--stone)', startCap: 1000 },
  { id: 'food',  name: 'Food',  icon: 'F', color: 'var(--food)',  startCap: 1000 },
  { id: 'iron',  name: 'Iron',  icon: 'I', color: 'var(--iron)',  startCap: 1000 },
  { id: 'faith', name: 'Faith', icon: 'P', color: 'var(--faith)', startCap: 1000 },
]

// Lookup map for quick access
export const RES = Object.fromEntries(RESOURCES.map((r, i) => [r.id, i]))
