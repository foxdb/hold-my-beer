import { api } from '../config'

export interface ApiResult {
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
    max
  }
}

export const getRecentTemperatureLogs = async (
  fileName: string
): Promise<ApiResult> => {
  const result = await fetch(
    api.baseUrl + api.recentLogs + '/' + fileName
  ).then(res => res.json())
  return {
    ...result,
    hash: Math.floor(Math.random() * 10000)
  }
}

export const getTemperatureLogs = async (
  fileName: string,
  downsamplingMethod: string = api.defaultGetOverallLogs,
  pointsCount: number = 500
): Promise<ApiResult> => {
  const result = await fetch(
    api.baseUrl +
      'temperature/' +
      fileName +
      '?downsamplingMethod=' +
      downsamplingMethod +
      '&pointsCount=' +
      pointsCount
  ).then(res => res.json())

  return {
    hash: Math.floor(Math.random() * 10000),
    ...result
  }
}

export const getLogFiles = () =>
  fetch(api.baseUrl + api.logFiles).then(res => res.json())
