import * as AWS from 'aws-sdk'
const s3 = new AWS.S3()

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

export const getTemperatureLog = (event, context, callback) => {
  // TODO: choose file
  const logFile = '20181028_16-52-35-temperature.log'
  s3.getObject(
    {
      Bucket: 'raspi-chill',
      Key: 'logs/' + logFile
    },
    (err, data) => {
      if (err) {
        console.log(err, err.stack)
        callback(err)
      } else {
        const lines = data.Body.toString('ascii')
          .split('\n')
          .filter(line => line.length > 0)

        let minTemp = 100
        let maxTemp = 0

        const points = lines.reduce((acc, current) => {
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
        }, [])

        const lastLines = lines.slice(
          lines.length - Math.min(LAST_LINES_NUMBER, lines.length),
          lines.length
        )

        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            logFile,
            points,
            lastHours: makePoints(lastLines),
            maxTemp,
            minTemp
          }),
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
      }
    }
  )
}
