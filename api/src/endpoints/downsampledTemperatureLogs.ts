import { getFile, getS3 } from '../lib/s3'
import { makePoints, validatePathParam } from './helpers'
import { LTD, LTTB, LTOB } from 'downsample'
import { getLogFilesList } from './listLogs'

const methodMap = {
  LTD: LTD,
  LTTB: LTTB,
  LTOB: LTOB,
  raw: 'raw'
}

export const downsample = async (event, context) => {
  try {
    let logFilePath: string

    const requestedLogFile = validatePathParam('logFile', event)

    const authorizedLogFiles = await getLogFilesList('temperature')

    const matchingFile = authorizedLogFiles.filter(
      file =>
        file.path.replace(process.env.logsPath + '/', '') === requestedLogFile
    )[0]

    if (!matchingFile) {
      throw new Error('Log file not found')
    }

    logFilePath = matchingFile.path

    // parse points count, should be between 100 and 5000 and default to 500
    let pointsCount: number = 500
    if (
      event.queryStringParameters &&
      event.queryStringParameters.pointsCount
    ) {
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

    let logFileContent: string

    const s3 = getS3()
    logFileContent = await getFile(
      s3,
      process.env.logsBucketName as string,
      logFilePath
    )

    const lines = logFileContent.split('\n').filter(line => line.length > 0)

    if (downsamplingMethod === 'raw') {
      const { metadata: pointsMetadata, points } = makePoints(lines)

      return {
        statusCode: 200,
        body: JSON.stringify({
          logFile: logFilePath.split('/')[1],
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
        logFile: logFilePath,
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
