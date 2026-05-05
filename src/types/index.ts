// ================ COUNTRY ================
export type Ideology = 'democratic' | 'authoritarian' | 'communist' | 'fascist' | 'monarchist'

export interface Country {
  id: string
  name: string
  leader: string
  ideology: Ideology
  capital: string
  
  // Resources
  manpower: number
  maxManpower: number
  production: number // Economic output per turn
  money: number
  
  // Military
  brigades: Brigade[]
  wars: War[]
  
  // Diplomacy
  relations: Map<string, number> // countryId -> relation value (-100 to 100)
  alliances: string[] // countryIds
  
  // Territory
  provinces: string[] // provinceIds
  
  // Game state
  color: string
  isAI: boolean
  isPlayer: boolean
  isAlive: boolean
}

// ================ PROVINCE ================
export interface Province {
  id: string
  name: string
  ownerCountryId: string
  x: number
  y: number
  width: number
  height: number
  
  // Production
  manpowerGrowth: number
  productionValue: number
  
  // Military
  brigadesPresent: string[] // brigadeIds
  
  // Stability
  stability: number // 0-100
  separatism: number // 0-100 (if 100, separatist movement)
}

// ================ MILITARY ================
export interface Brigade {
  id: string
  countryId: string
  name: string
  strength: number // 0-100
  morale: number // 0-100
  experience: number // 0-100
  provinceId: string
  status: 'idle' | 'moving' | 'attacking' | 'defending'
}

export interface War {
  id: string
  attackerId: string
  defenderId: string
  startTurn: number
  status: 'active' | 'won' | 'lost' | 'peace'
  casualBelli: string // Justification for war
  provincesDisputed: string[] // provinceIds
}

// ================ DIPLOMACY ================
export interface DiplomaticRelation {
  countryA: string
  countryB: string
  relation: number // -100 to 100
  alliance: boolean
  pact: DiplomaticPact | null
}

export interface DiplomaticPact {
  type: 'trade' | 'defense' | 'non-aggression'
  startTurn: number
  endTurn: number | null
}

// ================ ACTION QUEUE ================
export type ActionType = 'create_brigade' | 'build_structure' | 'declare_war' | 'diplomatic_action'

export interface Action {
  id: string
  countryId: string
  type: ActionType
  progress: number // 0-100
  duration: number // turns needed
  data: any
  startTurn: number
  targetCountryId?: string // for diplomatic actions
}

// ================ GAME STATE ================
export interface GameState {
  currentTurn: number
  gameSpeed: 'slow' | 'normal' | 'fast'
  isPaused: boolean
  
  countries: Map<string, Country>
  provinces: Map<string, Province>
  brigades: Map<string, Brigade>
  wars: Map<string, War>
  actions: Action[]
  
  playerCountryId: string
  newsLog: NewsEntry[]
  
  mapWidth: number
  mapHeight: number
}

// ================ NEWS ================
export interface NewsEntry {
  id: string
  turn: number
  type: 'war_declared' | 'war_ended' | 'treaty_signed' | 'brigade_created' | 'province_conquered' | 'country_fell'
  title: string
  description: string
  relatedCountries: string[]
  timestamp: number
}

// ================ UI STATE ================
export interface UIState {
  selectedCountryId: string | null
  selectedProvinceId: string | null
  viewMode: 'map' | 'diplomacy' | 'military' | 'economy'
  showActionQueue: boolean
  showNewsLog: boolean
}
