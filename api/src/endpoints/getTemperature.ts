import { getFile } from '../lib/s3'
import mockTemperatureLogs from '../testData/mock-temperature'
const LAST_LINES_NUMBER = 300

const makePoints = lines => {
  return lines.reduce((acc, current) => {
    acc.push({
      temperature: parseFloat(current.split(',')[1]),
      date: current.split(',')[0]
    })

    return acc
  }, [])
}

export const getTemperatureLog = async (event, context) => {
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

    let minTemp = 100
    let maxTemp = 0

    const points = lines.reduce(
      (acc, current) => {
        const temp = parseFloat(current.split(',')[1])

        if (temp === null || isNaN(temp)) {
          return acc
        }

        minTemp = Math.min(minTemp, temp)
        maxTemp = Math.max(maxTemp, temp)

        acc.push({
          date: current.split(',')[0],
          temperature: temp
        })

        return acc
      },
      [] as any
    )

    const lastLines = lines.slice(
      lines.length - Math.min(LAST_LINES_NUMBER, lines.length),
      lines.length
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        logFile,
        points,
        lastHours: makePoints(lastLines),
        maxTemp,
        minTemp
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
