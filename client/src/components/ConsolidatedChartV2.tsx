import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import { getProjectReadingsByType } from '../lib/api'
import moment = require('moment')

interface Props {
  projectName: string
  hash?: number
}

interface Point {
  date: string
  gravity?: number
  temperature?: number
}

export default function Chart(props: Props) {
  const [points, setPoints] = React.useState<Point[]>([])

  const getPoints = async (projectName: string) => {
    // truncate dates and keep only seconds precision
    const rawGravityReadings = (await getProjectReadingsByType(
      projectName,
      'SPECIFIC_GRAVITY'
    )).map(reading => ({
      ...reading,
      createdAt: reading.createdAt.split('.')[0]
    }))
    const rawTempReadings = (await getProjectReadingsByType(
      projectName,
      'TEMPERATURE'
    )).map(reading => ({
      ...reading,
      createdAt: reading.createdAt.split('.')[0]
    }))

    // create a date axis containing all dates
    const mergedDates = rawGravityReadings
      .map(grReading => grReading.createdAt)
      .concat(rawTempReadings.map(tempReading => tempReading.createdAt))

    const uniqueDates = mergedDates
      .filter((item, index) => mergedDates.indexOf(item) === index)
      .sort((dateA, dateB) => {
        if (dateA > dateB) {
          return 1
        } else {
          return -1
        }
      })

    // create data points with date and gravity/temperature if available
    const points: Point[] = uniqueDates.reduce(
      (points, currentDate) => {
        let currentPoint: Point = {
          date: moment(currentDate).format('MMMM DD HH:mm')
        }

        const gravityPoint = rawGravityReadings.find(
          point => point.createdAt === currentDate
        )
        const tempPoint = rawTempReadings.find(
          point => point.createdAt === currentDate
        )

        if (gravityPoint) {
          currentPoint.gravity = gravityPoint.value
        }

        if (tempPoint) {
          currentPoint.temperature = tempPoint.value
        }

        points.push(currentPoint)

        return points
      },
      [] as Point[]
    )

    setPoints(points)
  }

  React.useEffect(() => {
    getPoints(props.projectName)
  }, [props.projectName, props.hash])

  return (
    <React.Fragment>
      {points && points.length > 1 && (
        <ResponsiveContainer>
          <LineChart
            data={points}
            margin={{
              top: 5,
              right: 16,
              bottom: 5,
              left: 24
            }}
          >
            <XAxis dataKey="date" />
            <YAxis
              orientation="right"
              yAxisId="gravity"
              unit=""
              domain={[
                dataMin => 1.0,
                // dataMin =>  Math.floor(dataMin * 100) / 100
                // dataMax => 1.13
                // max: max reading rounded to the next 0.01
                dataMax => Math.ceil(dataMax * 100) / 100
              ]}
            >
              <Label
                position="right"
                angle={90}
                style={{ textAnchor: 'middle' }}
              >
                Gravity
              </Label>
            </YAxis>
            <YAxis
              yAxisId="temperature"
              unit="°C"
              domain={[
                0,
                40
                // dataMin => Math.floor(dataMin) - 2,
                // dataMax => Math.ceil(dataMax) + 2
              ]}
            >
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: 'middle' }}
              >
                Temperature
              </Label>
            </YAxis>
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="1 1" />
            <Legend />
            <Line
              yAxisId="gravity"
              type="monotone"
              dataKey="gravity"
              stroke="#00bf5f"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              stroke="#556CD6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  )
}
