import { api, RAW_DATE_FORMAT } from '../config'
import moment from 'moment'
import rp from 'request-promise'

interface ApiResult {
  points: Measure[]
  lastHours: Measure[]
  minTemp: number
  maxTemp: number
}

interface Measure {
  date: string
  temperature: number
}

export interface Point {
  date: string
  temperature: number
}

export const findMinMax = (
  measures: Measure[]
): { min: number; max: number } => {
  let min = 100
  let max = 0

  measures.map(measure => {
    max = measure.temperature > max ? measure.temperature : max
    min = measure.temperature < min ? measure.temperature : min
  })

  return {
    min,
    max,
  }
}

export const getTemperatureLogs = async (): Promise<ApiResult> => {
  const result = await rp(api.baseUrl + api.getLogs, { json: true })
  console.log(result)
  return {
    minTemp: result.minTemp,
    maxTemp: result.maxTemp,
    lastHours: result.lastHours,
    points: result.points,
  }
}
