import { Country, Action } from '../types/index'
import { useGameStore } from '../stores/gameStore'
import { DiplomacySystem } from '../game/DiplomacySystem'
import { WarSystem } from '../game/WarSystem'

export class AIController {
  private diplomacySystem: DiplomacySystem
  private warSystem: WarSystem
  
  constructor() {
    this.diplomacySystem = new DiplomacySystem()
    this.warSystem = new WarSystem()
  }
  
  makeDecisions(country: Country): void {
    const gameStore = useGameStore()
    
    // Check if can afford actions
    if (country.money < 500 || country.manpower < 200) {
      return
    }
    
    const decisions = [
      () => this.considerBuildingArmies(country),
      () => this.considerDiplomacy(country),
      () => this.considerWar(country),
      () => this.considerExpansion(country)
    ]
    
    // Randomly select a decision
    const randomDecision = decisions[Math.floor(Math.random() * decisions.length)]
    randomDecision()
  }
  
  private considerBuildingArmies(country: Country): void {
    const gameStore = useGameStore()
    
    // Build armies if military strength is low
    const militaryRatio = country.brigades.length / country.provinces.length
    if (militaryRatio < 0.5) {
      const action: Action = {
        id: this.generateId(),
        countryId: country.id,
        type: 'create_brigade',
        progress: 0,
        duration: 5 + Math.random() * 5,
        data: { provinceId: country.provinces[0] },
        startTurn: gameStore.currentTurn
      }
      gameStore.addAction(action)
    }
  }
  
  private considerDiplomacy(country: Country): void {
    const gameStore = useGameStore()
    
    // Form alliances with friendly nations
    gameStore.countries.forEach(otherCountry => {
      if (otherCountry.id === country.id || country.alliances.includes(otherCountry.id)) {
        return
      }
      
      const relation = this.diplomacySystem.getRelation(country.id, otherCountry.id)
      
      // If relations are neutral or better, consider alliance
      if (relation > 30) {
        if (Math.random() > 0.7) {
          this.diplomacySystem.formAlliance(country.id, otherCountry.id)
        }
      } else if (relation < -30) {
        // If relations are bad, might become enemy
        return
      } else {
        // Try to improve relations
        const action: Action = {
          id: this.generateId(),
          countryId: country.id,
          type: 'diplomatic_action',
          progress: 0,
          duration: 3,
          data: { type: 'improve_relations', relationChange: 5 },
          startTurn: gameStore.currentTurn,
          targetCountryId: otherCountry.id
        }
        if (Math.random() > 0.8) {
          gameStore.addAction(action)
        }
      }
    })
  }
  
  private considerWar(country: Country): void {
    const gameStore = useGameStore()
    
    // Only consider war if have sufficient brigades
    if (country.brigades.length < 3) return
    
    gameStore.countries.forEach(targetCountry => {
      if (targetCountry.id === country.id || country.alliances.includes(targetCountry.id)) {
        return
      }
      
      // War evaluation
      const relation = this.diplomacySystem.getRelation(country.id, targetCountry.id)
      const militaryAdvantage = (country.brigades.length / (targetCountry.brigades.length + 1)) * 100
      
      // Declare war if we have military advantage and bad relations
      if (militaryAdvantage > 150 && relation < -50) {
        if (Math.random() > 0.85) {
          this.warSystem.declareWar(
            country.id,
            targetCountry.id,
            'Territorial dispute',
            targetCountry.provinces.slice(0, 2)
          )
        }
      }
    })
  }
  
  private considerExpansion(country: Country): void {
    const gameStore = useGameStore()
    
    // Build infrastructure in provinces
    if (country.provinces.length > 0 && Math.random() > 0.7) {
      const randomProvince = country.provinces[
        Math.floor(Math.random() * country.provinces.length)
      ]
      
      const action: Action = {
        id: this.generateId(),
        countryId: country.id,
        type: 'build_structure',
        progress: 0,
        duration: 8,
        data: { provinceId: randomProvince },
        startTurn: gameStore.currentTurn
      }
      gameStore.addAction(action)
    }
  }
  
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
