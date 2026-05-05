import { Province, Country } from '../types/index'

export class MapGenerator {
  
  generateMap(width: number, height: number, countryCount: number): {
    provinces: Province[]
    countries: Country[]
  } {
    const provinces: Province[] = []
    const countries: Country[] = []
    
    // Generate countries
    const baseCountries = [
      { name: 'Atlantia', leader: 'President Adams', ideology: 'democratic' as const, capital: 'New York' },
      { name: 'Europia', leader: 'Chancellor Schmidt', ideology: 'democratic' as const, capital: 'Berlin' },
      { name: 'Russavia', leader: 'General Petrov', ideology: 'authoritarian' as const, capital: 'Moscow' },
      { name: 'Sinatia', leader: 'Chairman Liu', ideology: 'communist' as const, capital: 'Beijing' },
      { name: 'Asiaria', leader: 'Emperor Tanaka', ideology: 'monarchist' as const, capital: 'Tokyo' }
    ]
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
    
    baseCountries.forEach((countryData, index) => {
      const country: Country = {
        id: `country-${index}`,
        name: countryData.name,
        leader: countryData.leader,
        ideology: countryData.ideology,
        capital: countryData.capital,
        manpower: 1000,
        maxManpower: 2000,
        production: 50,
        money: 5000,
        brigades: [],
        wars: [],
        relations: new Map(),
        alliances: [],
        provinces: [],
        color: colors[index],
        isAI: index !== 0,
        isPlayer: index === 0,
        isAlive: true
      }
      countries.push(country)
    })
    
    // Generate provinces (grid-based)
    const provincesPerCountry = 6
    const cols = 10
    const rows = 8
    const cellWidth = width / cols
    const cellHeight = height / rows
    
    let provinceIndex = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const countryIndex = Math.floor(provinceIndex / provincesPerCountry) % countries.length
        
        const province: Province = {
          id: `province-${provinceIndex}`,
          name: `Province ${provinceIndex + 1}`,
          ownerCountryId: countries[countryIndex].id,
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
          manpowerGrowth: 5,
          productionValue: 10 + Math.random() * 10,
          brigadesPresent: [],
          stability: 80 + Math.random() * 20,
          separatism: Math.random() * 20
        }
        
        provinces.push(province)
        countries[countryIndex].provinces.push(province.id)
        provinceIndex++
      }
    }
    
    return { provinces, countries }
  }
}
