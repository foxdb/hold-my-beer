import { getFile } from '../lib/s3'
import mockTemperatureLogs from '../testData/mock-temperature'
import { makePoints } from './helpers'
import { LTD, LTTB, LTOB } from 'downsample'

const downsampleFactory = downsamplingFn => async (event, context) => {
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

    const { metadata, indexedPoints, dateIndex } = makePoints(lines, true)

    const targetNumberOfPoints = Math.max(
      1000,
      Math.round(metadata.validPoints / 10)
    )
    const downsampledData = downsamplingFn(indexedPoints, targetNumberOfPoints)

    const downsampledPoints = downsampledData.map(point => ({
      date: dateIndex[point.x],
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

export const downsampledLTOB = downsampleFactory(LTOB)
export const downsampledLTD = downsampleFactory(LTD)
export const downsampledLTTB = downsampleFactory(LTTB)
