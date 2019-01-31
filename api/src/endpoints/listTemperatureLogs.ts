import { lsDirectory } from '../lib/s3'

export const listLogFiles = async (event, context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        logFiles: (await getLogFilesList()).map(logFile => ({
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

export const getLogFilesList = async () => {
  const logsDirContent = await lsDirectory(
    process.env.logsBucketName as string,
    process.env.logsPath as string
  )

  return logsDirContent.filter(
    file =>
      file.path &&
      file.path.includes('temperature.log') &&
      !file.path.includes('.bak')
  )
}
