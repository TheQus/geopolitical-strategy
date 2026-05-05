import { createStore } from 'zustand/vanilla'
import { reactive } from 'vue'
import { GameState, UIState, Country, Province, Action } from '../types/index'

interface GameStore extends GameState {
  nextTurn: () => void
  setPaused: (paused: boolean) => void
  getCountry: (id: string) => Country | undefined
  addCountry: (country: Country) => void
  updateCountry: (id: string, updates: Partial<Country>) => void
  getProvince: (id: string) => Province | undefined
  setProvinceOwner: (provinceId: string, newOwnerId: string) => void
  addAction: (action: Action) => void
  removeAction: (actionId: string) => void
  updateAction: (actionId: string, progress: number) => void
  addNewsEntry: (entry: any) => void
}

interface UIStore extends UIState {
  selectCountry: (id: string | null) => void
  selectProvince: (id: string | null) => void
  setViewMode: (mode: 'map' | 'diplomacy' | 'military' | 'economy') => void
  toggleActionQueue: () => void
  toggleNewsLog: () => void
}

// 1. Создаем Vanilla Store (без привязки к React)
const gameStoreVanilla = createStore<GameStore>((set, get) => ({
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
  
  nextTurn: () => set(state => ({ currentTurn: state.currentTurn + 1 })),
  setPaused: (paused) => set({ isPaused: paused }),
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
  getProvince: (id) => get().provinces.get(id),
  setProvinceOwner: (provinceId, newOwnerId) => set(state => {
    const province = state.provinces.get(provinceId)
    if (!province) return state
    const newProvinces = new Map(state.provinces)
    newProvinces.set(provinceId, { ...province, ownerCountryId: newOwnerId })
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
  addAction: (action) => set(state => ({ actions: [...state.actions, action] })),
  removeAction: (actionId) => set(state => ({ actions: state.actions.filter(a => a.id !== actionId) })),
  updateAction: (actionId, progress) => set(state => ({
    actions: state.actions.map(a => a.id === actionId ? { ...a, progress } : a)
  })),
  addNewsEntry: (entry) => set(state => ({
    newsLog: [...state.newsLog, entry].slice(-100)
  }))
}))

const uiStoreVanilla = createStore<UIStore>((set) => ({
  selectedCountryId: null,
  selectedProvinceId: null,
  viewMode: 'map',
  showActionQueue: true,
  showNewsLog: true,
  selectCountry: (id) => set({ selectedCountryId: id }),
  selectProvince: (id) => set({ selectedProvinceId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleActionQueue: () => set(state => ({ showActionQueue: !state.showActionQueue })),
  toggleNewsLog: () => set(state => ({ showNewsLog: !state.showNewsLog }))
}))

// 2. Делаем сторы реактивными для Vue
export const gameStore = reactive(gameStoreVanilla.getState())
export const uiStore = reactive(uiStoreVanilla.getState())

// Синхронизация: когда Zustand меняется, обновляем реактивный объект Vue
gameStoreVanilla.subscribe((state) => {
  Object.assign(gameStore, state)
})
uiStoreVanilla.subscribe((state) => {
  Object.assign(uiStore, state)
})

// 3. Экспортируем методы (чтобы использовать их в компонентах)
export const { nextTurn, setPaused, addCountry, updateCountry, setProvinceOwner, addAction, removeAction, updateAction, addNewsEntry } = gameStoreVanilla.getState()
export const { selectCountry, selectProvince, setViewMode, toggleActionQueue, toggleNewsLog } = uiStoreVanilla.getState()
