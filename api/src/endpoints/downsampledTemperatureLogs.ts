import { getFile } from '../lib/s3'
import mockTemperatureLogs from '../testData/mock-temperature'
import { makePoints } from './helpers'
import { LTD, LTTB, LTOB } from 'downsample'

const methodMap = {
  LTD: LTD,
  LTTB: LTTB,
  LTOB: LTOB,
  raw: 'raw'
}

export const downsample = async (event, context) => {
  // parse points count, should be between 100 and 5000 and default to 500
  let pointsCount: number = 500
  if (event.queryStringParameters && event.queryStringParameters.pointsCount) {
    const requestedPointsCount = parseInt(
      event.queryStringParameters.pointsCount
    )
    if (requestedPointsCount >= 100 && requestedPointsCount <= 5000) {
      pointsCount = requestedPointsCount
    }
  }

  let downsamplingMethod: string = 'LTTB'

  if (
    event.queryStringParameters &&
    event.queryStringParameters.downsamplingMethod
  ) {
    const requestedDownsamplingMethod =
      event.queryStringParameters.downsamplingMethod
    if (methodMap[requestedDownsamplingMethod]) {
      downsamplingMethod = requestedDownsamplingMethod
    }
  }

  try {
    let logFile: string
    let logFileName = event.isOffline ? 'mock' : process.env.logFilePath

    if (event.isOffline !== true) {
      logFile = mockTemperatureLogs
    } else {
      logFile = await getFile(
        process.env.logsBucketName as string,
        process.env.logFilePath as string
      )
    }

    const lines = logFile.split('\n').filter(line => line.length > 0)

    if (downsamplingMethod === 'raw') {
      const { metadata: pointsMetadata, points } = makePoints(lines)

      return {
        statusCode: 200,
        body: JSON.stringify({
          logFile: logFileName,
          metadata: {
            ...pointsMetadata,
            downsamplingPointsCount: null,
            downsamplingMethod: null
          },
          points
        }),
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    }

    const { metadata: pointsMetadata, indexedPoints, dateIndex } = makePoints(
      lines,
      true
    )

    const downsamplingFn = methodMap[downsamplingMethod]

    const downsampledData = downsamplingFn(indexedPoints, pointsCount)

    const downsampledPoints = downsampledData.map(point => ({
      date: dateIndex[point.x],
      temperature: point.y
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: logFileName,
        metadata: {
          ...pointsMetadata,
          downsamplingPointsCount: pointsCount,
          downsamplingMethod
        },
        points: downsampledPoints
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
