import { lsDirectory } from '../lib/s3'
import { validatePathParam } from './helpers'

export const listLogFiles = async (event, context) => {
  try {
    const requestedLogsType = validatePathParam('type', event)

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFiles: (await getLogFilesList(requestedLogsType)).map(logFile => ({
          fileName: logFile.path.replace(process.env.logsPath + '/', ''),
          lastModified: logFile.lastModified
        }))
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getLogFilesList = async (type: string) => {
  const typeMap = {
    temperature: 'temperature.log',
    internalTemperature: 'internal-temperature.log',
    externalTemperature: 'external-temperature.log',
    gravity: 'gravity.log'
    // angle: ''
    // spindel: ''
  }

  const logsDirContent = await lsDirectory(
    process.env.logsBucketName as string,
    process.env.logsPath as string
  )

  return logsDirContent.filter(
    file =>
      file.path &&
      file.path.includes(typeMap[type]) &&
      !file.path.includes('.bak')
  )
}
