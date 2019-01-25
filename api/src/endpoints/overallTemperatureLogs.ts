import { getFile } from '../lib/s3'
import mockTemperatureLogs from '../testData/mock-temperature'
import { makePoints } from './helpers'

export const overallTemperatureLogs = async (event, context) => {
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

    const { metadata, points } = makePoints(lines)

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile: event.isOffline ? 'mock' : process.env.logFilePath,
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
