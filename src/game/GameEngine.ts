import { GameState, Country, Province, Brigade, Action, NewsEntry } from '../types/index'
import { useGameStore } from '../stores/gameStore'
import { ActionProcessor } from './ActionProcessor'
import { AIController } from '../ai/AIController'

export class GameEngine {
  private gameStore = useGameStore()
  private actionProcessor: ActionProcessor
  private aiController: AIController
  private gameInterval: number | null = null
  
  constructor() {
    this.actionProcessor = new ActionProcessor()
    this.aiController = new AIController()
  }
  
  // Initialize the game
  initialize(countries: Country[], provinces: Province[]): void {
    countries.forEach(country => this.gameStore.addCountry(country))
    provinces.forEach(province => {
      this.gameStore.getProvince(province.id) || 
        this.gameStore.provinces.set(province.id, province)
    })
  }
  
  // Main game loop
  startGameLoop(): void {
    if (this.gameInterval) return
    
    const speeds = { slow: 2000, normal: 1000, fast: 500 }
    const delay = speeds[this.gameStore.gameSpeed]
    
    this.gameInterval = window.setInterval(() => {
      if (!this.gameStore.isPaused) {
        this.processTurn()
      }
    }, delay)
  }
  
  stopGameLoop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
      this.gameInterval = null
    }
  }
  
  // Process one turn
  private processTurn(): void {
    const gameStore = useGameStore()
    
    // Process all actions
    const actions = [...gameStore.actions]
    for (const action of actions) {
      this.actionProcessor.processAction(action)
    }
    
    // Update resource production
    this.updateResourceProduction()
    
    // AI decision making
    gameStore.countries.forEach(country => {
      if (country.isAI && country.isAlive) {
        this.aiController.makeDecisions(country)
      }
    })
    
    // Check for wars and battles
    this.processWars()
    
    // Check for country stability
    this.updateStability()
    
    // Advance turn
    gameStore.nextTurn()
  }
  
  // Update resource production for all countries
  private updateResourceProduction(): void {
    const gameStore = useGameStore()
    
    gameStore.countries.forEach(country => {
      let totalProduction = 0
      let totalManpower = 0
      
      country.provinces.forEach(provinceId => {
        const province = gameStore.getProvince(provinceId)
        if (province) {
          totalProduction += province.productionValue
          totalManpower += province.manpowerGrowth
        }
      })
      
      gameStore.updateCountry(country.id, {
        money: country.money + totalProduction,
        manpower: Math.min(country.manpower + totalManpower, country.maxManpower)
      })
    })
  }
  
  // Process ongoing wars
  private processWars(): void {
    const gameStore = useGameStore()
    
    gameStore.wars.forEach(war => {
      if (war.status !== 'active') return
      
      const attacker = gameStore.getCountry(war.attackerId)
      const defender = gameStore.getCountry(war.defenderId)
      
      if (!attacker || !defender) return
      
      // Simple battle resolution
      const attackPower = attacker.brigades.length * 10 + attacker.production
      const defensePower = defender.brigades.length * 15 + defender.production
      
      if (attackPower > defensePower) {
        // Attacker gains province
        if (war.provincesDisputed.length > 0) {
          const provinceToConquer = war.provincesDisputed[0]
          gameStore.setProvinceOwner(provinceToConquer, war.attackerId)
          
          gameStore.addNewsEntry({
            id: this.generateId(),
            turn: gameStore.currentTurn,
            type: 'province_conquered',
            title: `${attacker.name} conquered a province`,
            description: `${attacker.name} conquered a province from ${defender.name}`,
            relatedCountries: [war.attackerId, war.defenderId],
            timestamp: Date.now()
          })
        }
      }
    })
  }
  
  // Update province stability and separatism
  private updateStability(): void {
    const gameStore = useGameStore()
    
    gameStore.provinces.forEach(province => {
      // Stability changes based on owner ideology and development
      const owner = gameStore.getCountry(province.ownerCountryId)
      if (!owner) return
      
      // Reduce separatism if stable
      if (province.stability > 75) {
        province.separatism = Math.max(0, province.separatism - 2)
      } else if (province.stability < 40) {
        province.separatism = Math.min(100, province.separatism + 3)
      }
      
      // If separatism reaches 100, country may split
      if (province.separatism >= 100) {
        this.createSeparatistCountry(province)
      }
    })
  }
  
  // Create a new country from a separatist province
  private createSeparatistCountry(province: Province): void {
    const gameStore = useGameStore()
    const owner = gameStore.getCountry(province.ownerCountryId)
    
    if (!owner) return
    
    const newCountry: Country = {
      id: this.generateId(),
      name: `${province.name} Liberation Front`,
      leader: 'Separatist Leader',
      ideology: owner.ideology,
      capital: province.name,
      manpower: 100,
      maxManpower: 500,
      production: 10,
      money: 0,
      brigades: [],
      wars: [],
      relations: new Map(),
      alliances: [],
      provinces: [province.id],
      color: this.generateColor(),
      isAI: true,
      isPlayer: false,
      isAlive: true
    }
    
    gameStore.addCountry(newCountry)
    gameStore.setProvinceOwner(province.id, newCountry.id)
    
    gameStore.addNewsEntry({
      id: this.generateId(),
      turn: gameStore.currentTurn,
      type: 'war_declared',
      title: `Separatist movement in ${province.name}`,
      description: `A new country has emerged from separatist movements`,
      relatedCountries: [owner.id, newCountry.id],
      timestamp: Date.now()
    })
  }
  
  // Utility functions
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private generateColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']
    return colors[Math.floor(Math.random() * colors.length)]
  }
}
