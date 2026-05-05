import { War, Country } from '../types/index'
import { useGameStore } from '../stores/gameStore'

export class WarSystem {
  
  declareWar(attackerId: string, defenderId: string, justification: string, provincesToConquer: string[]): boolean {
    const gameStore = useGameStore()
    const attacker = gameStore.getCountry(attackerId)
    const defender = gameStore.getCountry(defenderId)
    
    if (!attacker || !defender || !attacker.isAlive || !defender.isAlive) {
      return false
    }
    
    // Check if already at war
    if (attacker.wars.some(w => w.defenderId === defenderId && w.status === 'active')) {
      return false
    }
    
    // Check if attacking country has enough brigades
    if (attacker.brigades.length === 0) {
      return false
    }
    
    const war: War = {
      id: `war-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attackerId,
      defenderId,
      startTurn: gameStore.currentTurn,
      status: 'active',
      casualBelli: justification,
      provincesDisputed: provincesToConquer
    }
    
    gameStore.wars.set(war.id, war)
    
    return true
  }
  
  endWar(warId: string, victor: 'attacker' | 'defender'): void {
    const gameStore = useGameStore()
    const war = gameStore.wars.get(warId)
    
    if (!war) return
    
    war.status = victor === 'attacker' ? 'won' : 'lost'
  }
  
  calculateBattleOutcome(
    attackerBrigades: number,
    defenderBrigades: number,
    attackerProduction: number,
    defenderProduction: number
  ): 'attacker_wins' | 'defender_wins' | 'stalemate' {
    
    const attackPower = attackerBrigades * 10 + attackerProduction * 2
    const defensePower = defenderBrigades * 12 + defenderProduction * 2 // Defender has 20% advantage
    
    const random = Math.random() * 20 - 10 // -10 to +10 variance
    
    const attackResult = attackPower + random
    const defenseResult = defensePower
    
    if (attackResult > defenseResult * 1.1) {
      return 'attacker_wins'
    } else if (defenseResult > attackResult * 1.1) {
      return 'defender_wins'
    } else {
      return 'stalemate'
    }
  }
  
  getWarStatus(warId: string): War | undefined {
    const gameStore = useGameStore()
    return gameStore.wars.get(warId)
  }
  
  getActiveWars(countryId: string): War[] {
    const gameStore = useGameStore()
    return Array.from(gameStore.wars.values()).filter(
      w => (w.attackerId === countryId || w.defenderId === countryId) && w.status === 'active'
    )
  }
}
