import { lsDirectory } from '../lib/s3'

export const listLogFiles = async (event, context) => {
  try {
    const logsDirContent = await lsDirectory(
      process.env.logsBucketName as string,
      process.env.logFilePath as string
    )

    const logFilesOfInterest = logsDirContent.filter(
      file =>
        file.path &&
        file.path.includes('temperature.log') &&
        !file.path.includes('.bak')
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFiles: logFilesOfInterest
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
