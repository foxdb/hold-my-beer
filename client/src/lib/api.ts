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

// @CleanUp rename that bit it's confusing with the other metadata
interface MetadataResults {
  metadata: {
    start: Point
    last: Point
  }
}

export const getMetadata = async (fileName: string): Promise<MetadataResults> =>
  fetch(api.baseUrl + api.getMetadata + '/' + fileName).then(res => res.json())

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

export const getTemperatureLogFiles = () =>
  fetch(api.baseUrl + api.logFiles + '/temperature').then(res => res.json())
