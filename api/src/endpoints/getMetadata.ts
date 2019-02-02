import { getFile } from '../lib/s3'
import { makePoint } from './helpers'
import { getLogFilesList } from './listTemperatureLogs'

export const getMetadata = async (event, context) => {
  try {
    let logFilePath: string

    if (event.pathParameters && event.pathParameters.logFile) {
      const requestedLogFile = event.pathParameters.logFile
      const authorizedLogFiles = await getLogFilesList()

      const matchingFile = authorizedLogFiles.filter(
        file =>
          file.path.replace(process.env.logsPath + '/', '') === requestedLogFile
      )[0]

      if (!matchingFile) {
        throw new Error('Log file not found')
      }

      logFilePath = matchingFile.path
    } else {
      throw new Error('Missing path param: logFile')
    }

    let logFileContent: string

    logFileContent = await getFile(
      process.env.logsBucketName as string,
      logFilePath
    )

    const lines = logFileContent.split('\n').filter(line => line.length > 0)

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: logFilePath.split('/')[1],
        metadata: {
          start: makePoint(lines[0]),
          last: makePoint(lines[lines.length - 1])
        }
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
