import { getFile } from '../lib/s3'
import { makePoints } from './helpers'
import { getLogFilesList } from './listTemperatureLogs'

const LAST_LINES_NUMBER = 300

export const recentTemperatureLogs = async (event, context) => {
  try {
    let logFilePath: string

    if (event.pathParameters && event.pathParameters.logFile) {
      const requestedLogFile = event.pathParameters.logFile
      const authorizedLogFiles = await getLogFilesList()

      const matchingFile = authorizedLogFiles.filter(
        file =>
          file.path === requestedLogFile.replace(process.env.logsPath + '/', '')
      )[0]

      if (!matchingFile) {
        throw new Error('Log file not found')
      }

      logFilePath = matchingFile.path
    } else {
      throw new Error('Missing path param: logFile')
    }

    let logFileContent: string

    // if (event.isOffline === true) {
    //   logFileContent = mockTemperatureLogs
    //   logFilePath = 'mock'
    // } else {
    logFileContent = await getFile(
      process.env.logsBucketName as string,
      logFilePath
    )
    // }

    const lines = logFileContent.split('\n').filter(line => line.length > 0)

    const lastLines = lines.slice(
      lines.length - Math.min(LAST_LINES_NUMBER, lines.length),
      lines.length
    )

    const { metadata, points } = makePoints(lastLines)

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: logFilePath.split('/')[1],
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
