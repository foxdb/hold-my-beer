import { getFile, getS3 } from '../lib/s3'
import { makeGravityPoints, validatePathParam } from './helpers'
import { getLogFilesList } from './listLogs'

export const getGravityLog = async (event, context) => {
  try {
    let logFilePath: string

    const requestedLogFile = validatePathParam('logFile', event)

    const authorizedLogFiles = await getLogFilesList('gravity')

    const matchingFile = authorizedLogFiles.filter(
      (file) =>
        file.path.replace(process.env.logsPath + '/', '') === requestedLogFile
    )[0]

    if (!matchingFile) {
      throw new Error('Log file not found')
    }

    logFilePath = matchingFile.path

    let logFileContent: string

    const s3 = getS3()
    logFileContent = await getFile(
      s3,
      process.env.logsBucketName as string,
      logFilePath
    )

    const lines = logFileContent.split('\n').filter((line) => line.length > 0)

    // parse points count, should be between 100 and 5000 and default to 500
    let lastPointToTake = lines.length
    let firstPointToTake = 0

    if (event.queryStringParameters && event.queryStringParameters.last) {
      firstPointToTake = Math.max(
        lines.length - Math.min(event.queryStringParameters.last, lines.length),
        0
      )
    }

    if (event.queryStringParameters && event.queryStringParameters.first) {
      lastPointToTake = firstPointToTake + event.queryStringParameters.first
    }

    const { metadata: pointsMetadata, points } = makeGravityPoints(
      lines.slice(firstPointToTake, lastPointToTake)
    )

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        logFile: logFilePath.split('/')[1],
        metadata: {
          ...pointsMetadata,
          downsamplingPointsCount: null,
          downsamplingMethod: null,
        },
        points,
      }),
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
