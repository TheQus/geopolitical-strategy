import { Action, Brigade } from '../types/index'
import { useGameStore } from '../stores/gameStore'

export class ActionProcessor {
  
  processAction(action: Action): void {
    const gameStore = useGameStore()
    
    // Increment progress based on production
    const country = gameStore.getCountry(action.countryId)
    if (!country) return
    
    const progressPerTurn = (country.production / action.duration) * 100
    const newProgress = Math.min(100, action.progress + progressPerTurn)
    
    gameStore.updateAction(action.id, newProgress)
    
    // Check if action is complete
    if (newProgress >= 100) {
      this.completeAction(action)
      gameStore.removeAction(action.id)
    }
  }
  
  private completeAction(action: Action): void {
    const gameStore = useGameStore()
    
    switch (action.type) {
      case 'create_brigade':
        this.createBrigade(action)
        break
      case 'build_structure':
        this.buildStructure(action)
        break
      case 'declare_war':
        this.declareWar(action)
        break
      case 'diplomatic_action':
        this.diplomaticAction(action)
        break
    }
  }
  
  private createBrigade(action: Action): void {
    const gameStore = useGameStore()
    const country = gameStore.getCountry(action.countryId)
    const province = gameStore.getProvince(action.data.provinceId)
    
    if (!country || !province) return
    
    // Check resources
    if (country.manpower < 50 || country.money < 100) return
    
    const brigade: Brigade = {
      id: this.generateId(),
      countryId: action.countryId,
      name: `${country.name} Brigade ${country.brigades.length + 1}`,
      strength: 75,
      morale: 80,
      experience: 0,
      provinceId: action.data.provinceId,
      status: 'idle'
    }
    
    // Deduct resources
    gameStore.updateCountry(action.countryId, {
      manpower: country.manpower - 50,
      money: country.money - 100,
      brigades: [...country.brigades, brigade]
    })
    
    gameStore.brigades.set(brigade.id, brigade)
    province.brigadesPresent.push(brigade.id)
    
    gameStore.addNewsEntry({
      id: this.generateId(),
      turn: gameStore.currentTurn,
      type: 'brigade_created',
      title: `${country.name} created a new brigade`,
      description: `A new military unit was trained in ${province.name}`,
      relatedCountries: [action.countryId],
      timestamp: Date.now()
    })
  }
  
  private buildStructure(action: Action): void {
    const gameStore = useGameStore()
    const country = gameStore.getCountry(action.countryId)
    const province = gameStore.getProvince(action.data.provinceId)
    
    if (!country || !province) return
    
    // Increase province production
    const structureBonus = 5
    province.productionValue += structureBonus
    
    gameStore.addNewsEntry({
      id: this.generateId(),
      turn: gameStore.currentTurn,
      type: 'province_conquered',
      title: `${country.name} built infrastructure`,
      description: `New structures were built in ${province.name}`,
      relatedCountries: [action.countryId],
      timestamp: Date.now()
    })
  }
  
  private declareWar(action: Action): void {
    const gameStore = useGameStore()
    const attacker = gameStore.getCountry(action.countryId)
    const defender = gameStore.getCountry(action.targetCountryId || '')
    
    if (!attacker || !defender) return
    
    const war = {
      id: this.generateId(),
      attackerId: action.countryId,
      defenderId: action.targetCountryId || '',
      startTurn: gameStore.currentTurn,
      status: 'active' as const,
      casualBelli: action.data.justification,
      provincesDisputed: action.data.provinces
    }
    
    gameStore.wars.set(war.id, war)
    gameStore.updateCountry(action.countryId, {
      wars: [...attacker.wars, war]
    })
    
    gameStore.addNewsEntry({
      id: this.generateId(),
      turn: gameStore.currentTurn,
      type: 'war_declared',
      title: `${attacker.name} declared war on ${defender.name}`,
      description: `Reason: ${action.data.justification}`,
      relatedCountries: [action.countryId, action.targetCountryId || ''],
      timestamp: Date.now()
    })
  }
  
  private diplomaticAction(action: Action): void {
    const gameStore = useGameStore()
    const country = gameStore.getCountry(action.countryId)
    const targetCountry = gameStore.getCountry(action.targetCountryId || '')
    
    if (!country || !targetCountry) return
    
    const actionType = action.data.type
    const change = action.data.relationChange || 5
    
    // Update relations
    const currentRelation = country.relations.get(action.targetCountryId || '') || 0
    const newRelation = Math.max(-100, Math.min(100, currentRelation + change))
    country.relations.set(action.targetCountryId || '', newRelation)
    
    if (action.data.type === 'form_alliance' && newRelation > 50) {
      if (!country.alliances.includes(action.targetCountryId || '')) {
        country.alliances.push(action.targetCountryId || '')
        targetCountry.alliances.push(action.countryId)
      }
    }
    
    gameStore.addNewsEntry({
      id: this.generateId(),
      turn: gameStore.currentTurn,
      type: 'treaty_signed',
      title: `Diplomatic agreement between ${country.name} and ${targetCountry.name}`,
      description: `Relations improved`,
      relatedCountries: [action.countryId, action.targetCountryId || ''],
      timestamp: Date.now()
    })
  }
  
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
