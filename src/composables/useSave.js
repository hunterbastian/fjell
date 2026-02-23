const SAVE_KEY = 'realm_of_ruin_save'
const SAVE_VERSION = 1

export function saveToStorage(state) {
  try {
    const data = { v: SAVE_VERSION, ts: Date.now(), ...state }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || data.v !== SAVE_VERSION) return null
    return data
  } catch {
    return null
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY)
}

export function getTimeSinceLastSave() {
  const data = loadFromStorage()
  if (!data || !data.ts) return 0
  return (Date.now() - data.ts) / 1000
}
