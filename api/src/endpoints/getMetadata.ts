import { getFile, getS3 } from '../lib/s3'
import { makePoint } from './helpers'
import { getLogFilesList } from './listLogs'
import { validatePathParam } from './helpers'

export const getMetadata = async (event, context) => {
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

    let logFileContent: string

    const s3 = getS3()
    logFileContent = await getFile(
      s3,
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
