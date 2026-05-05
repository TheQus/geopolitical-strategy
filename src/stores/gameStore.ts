import { create } from 'zustand'
import { GameState, UIState, Country, Province, Action } from '../types/index'

interface GameStore extends GameState {
  // Game control
  nextTurn: () => void
  setPaused: (paused: boolean) => void
  
  // Country management
  getCountry: (id: string) => Country | undefined
  addCountry: (country: Country) => void
  updateCountry: (id: string, updates: Partial<Country>) => void
  
  // Province management
  getProvince: (id: string) => Province | undefined
  setProvinceOwner: (provinceId: string, newOwnerId: string) => void
  
  // Action management
  addAction: (action: Action) => void
  removeAction: (actionId: string) => void
  updateAction: (actionId: string, progress: number) => void
  
  // News
  addNewsEntry: (entry: any) => void
}

interface UIStore extends UIState {
  selectCountry: (id: string | null) => void
  selectProvince: (id: string | null) => void
  setViewMode: (mode: 'map' | 'diplomacy' | 'military' | 'economy') => void
  toggleActionQueue: () => void
  toggleNewsLog: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentTurn: 1,
  gameSpeed: 'normal',
  isPaused: false,
  countries: new Map(),
  provinces: new Map(),
  brigades: new Map(),
  wars: new Map(),
  actions: [],
  playerCountryId: '',
  newsLog: [],
  mapWidth: 2000,
  mapHeight: 1200,
  
  // Game control
  nextTurn: () => set(state => ({ currentTurn: state.currentTurn + 1 })),
  setPaused: (paused) => set({ isPaused: paused }),
  
  // Country management
  getCountry: (id) => get().countries.get(id),
  addCountry: (country) => set(state => {
    const newCountries = new Map(state.countries)
    newCountries.set(country.id, country)
    return { countries: newCountries }
  }),
  updateCountry: (id, updates) => set(state => {
    const country = state.countries.get(id)
    if (!country) return state
    const newCountries = new Map(state.countries)
    newCountries.set(id, { ...country, ...updates })
    return { countries: newCountries }
  }),
  
  // Province management
  getProvince: (id) => get().provinces.get(id),
  setProvinceOwner: (provinceId, newOwnerId) => set(state => {
    const province = state.provinces.get(provinceId)
    if (!province) return state
    
    const newProvinces = new Map(state.provinces)
    newProvinces.set(provinceId, { ...province, ownerCountryId: newOwnerId })
    
    // Update country provinces lists
    const oldOwner = state.countries.get(province.ownerCountryId)
    const newOwner = state.countries.get(newOwnerId)
    
    const newCountries = new Map(state.countries)
    if (oldOwner) {
      newCountries.set(oldOwner.id, {
        ...oldOwner,
        provinces: oldOwner.provinces.filter(p => p !== provinceId)
      })
    }
    if (newOwner) {
      newCountries.set(newOwner.id, {
        ...newOwner,
        provinces: [...newOwner.provinces, provinceId]
      })
    }
    
    return { provinces: newProvinces, countries: newCountries }
  }),
  
  // Action management
  addAction: (action) => set(state => ({
    actions: [...state.actions, action]
  })),
  removeAction: (actionId) => set(state => ({
    actions: state.actions.filter(a => a.id !== actionId)
  })),
  updateAction: (actionId, progress) => set(state => ({
    actions: state.actions.map(a => 
      a.id === actionId ? { ...a, progress } : a
    )
  })),
  
  // News
  addNewsEntry: (entry) => set(state => ({
    newsLog: [...state.newsLog, entry].slice(-100) // Keep last 100 entries
  }))
}))

export const useUIStore = create<UIStore>((set) => ({
  // Initial UI state
  selectedCountryId: null,
  selectedProvinceId: null,
  viewMode: 'map',
  showActionQueue: true,
  showNewsLog: true,
  
  // UI controls
  selectCountry: (id) => set({ selectedCountryId: id }),
  selectProvince: (id) => set({ selectedProvinceId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleActionQueue: () => set(state => ({ showActionQueue: !state.showActionQueue })),
  toggleNewsLog: () => set(state => ({ showNewsLog: !state.showNewsLog }))
}))
