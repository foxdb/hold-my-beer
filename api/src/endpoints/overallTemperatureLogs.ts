import { getFile } from '../lib/s3'
import mockTemperatureLogs from '../testData/mock-temperature'
import { makePoints } from './helpers'
import { LTD, LTTB, LTOB } from 'downsample'

// not in use anymore
export const overallTemperatureLogs = async (event, context) => {
  try {
    let logFile: string

    if (event.isOffline === true) {
      logFile = mockTemperatureLogs
    } else {
      logFile = await getFile(
        process.env.logsBucketName as string,
        process.env.logFilePath as string
      )
    }

    const lines = logFile.split('\n').filter(line => line.length > 0)

    const { metadata, points } = makePoints(lines)

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: event.isOffline ? 'mock' : process.env.logFilePath,
        metadata,
        points
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const downsampledLTD = async (event, context) => {
  try {
    let logFile: string

    if (event.isOffline === true) {
      logFile = mockTemperatureLogs
    } else {
      logFile = await getFile(
        process.env.logsBucketName as string,
        process.env.logFilePath as string
      )
    }

    const lines = logFile.split('\n').filter(line => line.length > 0)

    const { metadata, points } = makePoints(lines)

    const targetNumberOfPoints = Math.round(points.length / 10)

    const XYDataPoints = points.map(point => {
      const date = cutDate(point.date)
      return {
        x: new Date(
          date.years,
          date.months,
          date.days,
          date.hours,
          date.minutes,
          date.seconds
        ),
        y: point.temperature
      }
    })

    const downsampledData = LTD(XYDataPoints, targetNumberOfPoints)
    const downsampledPoints = downsampledData.map(point => ({
      date: point.x,
      temperature: point.y
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: event.isOffline ? 'mock' : process.env.logFilePath,
        metadata,
        points: downsampledPoints
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const downsampledLTTB = async (event, context) => {
  try {
    let logFile: string

    if (event.isOffline === true) {
      logFile = mockTemperatureLogs
    } else {
      logFile = await getFile(
        process.env.logsBucketName as string,
        process.env.logFilePath as string
      )
    }

    const lines = logFile.split('\n').filter(line => line.length > 0)

    const { metadata, points } = makePoints(lines)

    const targetNumberOfPoints = Math.round(points.length / 10)

    const XYDataPoints = points.map(point => {
      const date = cutDate(point.date)
      return {
        x: new Date(
          date.years,
          date.months,
          date.days,
          date.hours,
          date.minutes,
          date.seconds
        ),
        y: point.temperature
      }
    })

    const downsampledData = LTTB(XYDataPoints, targetNumberOfPoints)
    const downsampledPoints = downsampledData.map(point => ({
      date: point.x,
      temperature: point.y
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: event.isOffline ? 'mock' : process.env.logFilePath,
        metadata,
        points: downsampledPoints
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const downsampledLTOB = async (event, context) => {
  try {
    let logFile: string

    if (event.isOffline === true) {
      logFile = mockTemperatureLogs
    } else {
      logFile = await getFile(
        process.env.logsBucketName as string,
        process.env.logFilePath as string
      )
    }

    const lines = logFile.split('\n').filter(line => line.length > 0)

    const { metadata, points } = makePoints(lines)

    const targetNumberOfPoints = Math.round(points.length / 10)

    const XYDataPoints = points.map(point => {
      const date = cutDate(point.date)
      return {
        x: new Date(
          date.years,
          date.months,
          date.days,
          date.hours,
          date.minutes,
          date.seconds
        ),
        y: point.temperature
      }
    })

    const downsampledData = LTOB(XYDataPoints, targetNumberOfPoints)
    const downsampledPoints = downsampledData.map(point => ({
      date: point.x,
      temperature: point.y
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: event.isOffline ? 'mock' : process.env.logFilePath,
        metadata,
        points: downsampledPoints
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const cutDate = (
  dateString: string
): {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
} => {
  return {
    years: parseInt(dateString.substr(0, 4)),
    months: parseInt(dateString.substr(4, 2)) - 1,
    days: parseInt(dateString.substr(6, 2)),
    hours: parseInt(dateString.substr(9, 2)),
    minutes: parseInt(dateString.substr(12, 2)),
    seconds: parseInt(dateString.substr(15, 2))
  }
}
