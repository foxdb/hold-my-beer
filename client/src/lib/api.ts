import { api } from '../config'

interface ApiResult {
  metadata: {
    minTemp: number
    maxTemp: number
  }
  points: Point[]
}

interface OverallApiResult {
  metadata: {
    minTemp: number
    maxTemp: number
  }
  points: Point[]
  hash: number
}

export interface Point {
  date: string
  temperature: number
}

export const findMinMax = (points: Point[]): { min: number; max: number } => {
  let min = 100
  let max = 0

  points.map(measure => {
    max = measure.temperature > max ? measure.temperature : max
    min = measure.temperature < min ? measure.temperature : min
  })

  return {
    min,
    max,
  }
}

export const getTemperatureLogs = async (): Promise<ApiResult> =>
  fetch(api.baseUrl + api.getLogs).then(res => res.json())

export const getRecentTemperatureLogs = async (): Promise<ApiResult> =>
  fetch(api.baseUrl + api.recentLogs).then(res => res.json())

export const getOverallTemperatureLogs = async (
  downsamplingMethod: string = api.defaultGetOverallLogs
): Promise<OverallApiResult> => {
  const result = await fetch(api.baseUrl + downsamplingMethod).then(res =>
    res.json()
  )

  return {
    hash: Math.floor(Math.random() * 10000),
    ...result,
  }
}
