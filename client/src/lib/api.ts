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

interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export const getProjects = async (): Promise<string[]> => {
  const result = await fetch(`${api.baseUrl}projects`).then(res => res.json())

  const projects: Project[] = result.projects
  return projects.map(p => p.name)
}

export interface Sensor {
  id: string
  externalId: string
  name: string | null
  type: string | null
  createdAt: string
  updatedAt: string
  readings: Reading[]
}

type ReadingType = 'BATTERY' | 'TEMPERATURE' | 'SPECIFIC_GRAVITY'

export interface Reading {
  id: string
  type: ReadingType
  value: number
  unit: string
  raw: any
  createdAt: string
  updatedAt: string
  SensorId: string
}

export const getSensors = async (): Promise<Sensor[]> => {
  const result = await fetch(`${api.baseUrl}admin/sensors`).then(res =>
    res.json()
  )
  return result.sensors
}

interface AvailableSensor {
  id: string
  readingType: ReadingType
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
  ProjectId: string
  SensorId: string
}

interface ProjectWithLogs extends Project {
  logs: string[]
  availableSensors: AvailableSensor[]
}

export const getProject = async (
  projectName: string
): Promise<ProjectWithLogs> => {
  const project = (await fetch(`${api.baseUrl}projects/${projectName}`).then(
    res => res.json()
  )).project
  return project
}

interface ProjectReadingResult {
  type: ReadingType
  value: number
  createdAt: string
}

export const getProjectReadingsByType = async (
  projectName: string,
  readingType: ReadingType
): Promise<ProjectReadingResult[]> => {
  const readings = (await fetch(
    `${api.baseUrl}projects/${projectName}/readings?type=${readingType}`
  ).then(res => res.json())).readings
  return readings
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
