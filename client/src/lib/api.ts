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

export const getRecentTemperatureLogs = async (): Promise<ApiResult> =>
  fetch(api.baseUrl + api.recentLogs).then(res => res.json())

export const getTemperatureLogs = async (
  downsamplingMethod: string = api.defaultGetOverallLogs,
  pointsCount: number = 500
): Promise<OverallApiResult> => {
  const result = await fetch(
    api.baseUrl +
      'temperature' +
      '?downsamplingMethod=' +
      downsamplingMethod +
      '&pointsCount=' +
      pointsCount
  ).then(res => res.json())

  return {
    hash: Math.floor(Math.random() * 10000),
    ...result,
  }
}
