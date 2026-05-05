import { Country, DiplomaticRelation, DiplomaticPact } from '../types/index'
import { useGameStore } from '../stores/gameStore'

export class DiplomacySystem {
  
  getRelation(countryAId: string, countryBId: string): number {
    const gameStore = useGameStore()
    const countryA = gameStore.getCountry(countryAId)
    
    if (!countryA) return 0
    return countryA.relations.get(countryBId) || 0
  }
  
  setRelation(countryAId: string, countryBId: string, value: number): void {
    const gameStore = useGameStore()
    const countryA = gameStore.getCountry(countryAId)
    const countryB = gameStore.getCountry(countryBId)
    
    if (!countryA || !countryB) return
    
    const clampedValue = Math.max(-100, Math.min(100, value))
    countryA.relations.set(countryBId, clampedValue)
    countryB.relations.set(countryAId, clampedValue)
  }
  
  modifyRelation(countryAId: string, countryBId: string, delta: number): void {
    const currentRelation = this.getRelation(countryAId, countryBId)
    this.setRelation(countryAId, countryBId, currentRelation + delta)
  }
  
  formAlliance(countryAId: string, countryBId: string): boolean {
    const gameStore = useGameStore()
    const countryA = gameStore.getCountry(countryAId)
    const countryB = gameStore.getCountry(countryBId)
    
    if (!countryA || !countryB) return false
    
    const relation = this.getRelation(countryAId, countryBId)
    if (relation < 50) return false // Need positive relations
    
    if (!countryA.alliances.includes(countryBId)) {
      countryA.alliances.push(countryBId)
    }
    if (!countryB.alliances.includes(countryAId)) {
      countryB.alliances.push(countryAId)
    }
    
    return true
  }
  
  breakAlliance(countryAId: string, countryBId: string): void {
    const gameStore = useGameStore()
    const countryA = gameStore.getCountry(countryAId)
    const countryB = gameStore.getCountry(countryBId)
    
    if (!countryA || !countryB) return
    
    countryA.alliances = countryA.alliances.filter(id => id !== countryBId)
    countryB.alliances = countryB.alliances.filter(id => id !== countryAId)
    
    this.modifyRelation(countryAId, countryBId, -20)
  }
  
  getIdeologyAlignment(ideology1: string, ideology2: string): number {
    const alignments: Record<string, Record<string, number>> = {
      democratic: { democratic: 20, authoritarian: -30, communist: -20, fascist: -40, monarchist: 0 },
      authoritarian: { authoritarian: 20, democratic: -30, communist: 0, fascist: 10, monarchist: 10 },
      communist: { communist: 20, democratic: -20, authoritarian: 0, fascist: -50, monarchist: -30 },
      fascist: { fascist: 20, democratic: -40, authoritarian: 10, communist: -50, monarchist: -10 },
      monarchist: { monarchist: 20, democratic: 0, authoritarian: 10, communist: -30, fascist: -10 }
    }
    
    return alignments[ideology1]?.[ideology2] || 0
  }
  
  getRelationDescription(relation: number): string {
    if (relation >= 75) return 'Excellent'
    if (relation >= 50) return 'Good'
    if (relation >= 25) return 'Neutral'
    if (relation >= 0) return 'Cold'
    if (relation >= -50) return 'Hostile'
    return 'Enemies'
  }
  
  shouldBreakAlliance(countryId: string, allyId: string): boolean {
    const gameStore = useGameStore()
    const relation = this.getRelation(countryId, allyId)
    
    // Break alliance if relations fall below threshold
    if (relation < -30) return true
    
    const country = gameStore.getCountry(countryId)
    const ally = gameStore.getCountry(allyId)
    
    if (!country || !ally) return false
    
    // Break alliance if in war with mutual enemies
    const enemyCountries = country.wars.map(w => 
      w.attackerId === countryId ? w.defenderId : w.attackerId
    )
    
    const allyEnemies = ally.wars.map(w => 
      w.attackerId === allyId ? w.defenderId : w.attackerId
    )
    
    // If both are at war with the same country, strengthen alliance
    const commonEnemies = enemyCountries.filter(e => allyEnemies.includes(e))
    if (commonEnemies.length > 0) {
      this.modifyRelation(countryId, allyId, 10)
      return false
    }
    
    return false
  }
}
