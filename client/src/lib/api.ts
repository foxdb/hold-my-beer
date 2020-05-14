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

export const getProjects = async (): Promise<string[]> => {
  const result = await fetch(`${api.baseUrl}projects`).then(res => res.json())
  return result.projects
}

export const getProject = async (
  projectName: string
): Promise<{
  name: string
  logs: string[]
}> => {
  const project = (await fetch(`${api.baseUrl}projects/${projectName}`).then(
    res => res.json()
  )).project
  return project
}

const validateFilename = fileName => {
  if (!fileName) {
    throw new Error(`api connector: invalid filename:  ${fileName}`)
  }
}

export const getMetadata = async (
  fileName: string
): Promise<MetadataResults> => {
  validateFilename(fileName)
  return fetch(api.baseUrl + api.getMetadata + '/' + fileName).then(res =>
    res.json()
  )
}

export const getRecentTemperatureLogs = async (
  fileName: string
): Promise<ApiResult> => {
  validateFilename(fileName)

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
  validateFilename(fileName)

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

interface GravityPoint {
  gravity: number
  date: string
}

export interface GenericApiResult {
  metadata: {
    min: number
    max: number
  }
  points: GravityPoint[]
  hash: number
}

export const getGravityLog = async (
  fileName: string,
  options?: {
    last?: number
    first?: number
  }
): Promise<GenericApiResult> => {
  validateFilename(fileName)

  if (options && (options.first !== undefined && options.last !== undefined)) {
    throw new Error('Cannot specific first AND last for data fetching')
  }

  const result = await fetch(
    `${api.baseUrl}gravity/${fileName}${
      options && options.last ? `?last=${options.last}` : ''
    }${options && options.first ? `?first=${options.first}` : ''}`
  ).then(res => res.json())

  return {
    hash: Math.floor(Math.random() * 10000),
    ...result
  }
}

export const getTemperatureLogFiles = () =>
  fetch(api.baseUrl + api.logFiles + '/temperature').then(res => res.json())
