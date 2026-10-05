export interface Market {
  code: string
  name: string
  price: number | null
  unit: string
  currency: string
  fetchedAt: string | null
  observedAt: string | null
  source: string
  stale: boolean
  sourceStatus: 'PENDING' | 'OK' | 'ERROR'
  consecutiveFailures: number
  nextAttemptAt: string | null
  error: string | null
}
export interface Availability<T> {
  status: string
  data: T | null
  fetchedAt: string | null
  message: string | null
}
export interface Saved { id: string; recordedAt: string; values: Record<string, number> }
export interface Report { id: string; text: string; recordedAt: string }
export interface City {
  city: string
  reference: string
  goa: number
  goaPlus: number
  gasoline95: number | null
  gasoline95Plus: number | null
  gasoline98: number | null
}
export interface Summary {
  markets: Market[]
  closing: Availability<Saved>
  premiums: Availability<Saved>
  reports: Availability<Report[]>
  variations: {
    gasoilNwe: number; gasoilMed: number; closingGasoilNwe: number
    gasoilChange: number; gasolineChange: number; unit: string
  } | null
  cities: City[]
  stale: boolean
  calculationStatus: string
}
