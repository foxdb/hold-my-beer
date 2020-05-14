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
import { getGravityLog, getTemperatureLogs } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'
import moment = require('moment')

interface Props {
  gravityLogFileName?: string
  internalTemperatureLogFileName?: string
  hash?: number
}

interface Point {
  date: string
  gravity?: number
  temperature?: number
}

export default function Chart(props: Props) {
  const [points, setPoints] = React.useState<Point[]>([])

  const getPoints = async (
    fileName: string | null,
    internalTempFileName: string | null
  ) => {
    const rawGravityDataPoints =
      fileName !== null ? (await getGravityLog(fileName)).points : []
    const rawTempDataPoints =
      internalTempFileName !== null
        ? (await getTemperatureLogs(internalTempFileName)).points
        : []

    // create a date axis containing all dates
    const mergedDates = rawGravityDataPoints
      .map(grPoint => grPoint.date)
      .concat(rawTempDataPoints.map(tempPoint => tempPoint.date))

    const uniqueDates = mergedDates.filter(
      (item, index) => mergedDates.indexOf(item) === index
    )

    // create data points with date and gravity/temperature if available
    const points: Point[] = uniqueDates.reduce(
      (points, currentDate) => {
        let currentPoint: Point = {
          date: moment(currentDate, RAW_DATE_FORMAT).format('HH:mm')
        }

        // TODO: this is rather resource intensive...
        const gravityPoint = rawGravityDataPoints.find(
          point => point.date === currentDate
        )
        const tempPoint = rawTempDataPoints.find(
          point => point.date === currentDate
        )

        if (gravityPoint) {
          currentPoint.gravity = gravityPoint.gravity
        }

        if (tempPoint) {
          currentPoint.temperature = tempPoint.temperature
        }

        points.push(currentPoint)

        return points
      },
      [] as Point[]
    )

    setPoints(points)
  }

  React.useEffect(() => {
    getPoints(
      props.gravityLogFileName || null,
      props.internalTemperatureLogFileName || null
    )
  }, [
    props.gravityLogFileName,
    props.internalTemperatureLogFileName,
    props.hash
  ])

  return (
    <React.Fragment>
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
              //   // dataMin => Math.round(dataMin) - 0.1,
              //   // dataMax => Math.round(dataMax) + 0.1
              dataMin => 1.0,
              dataMax => 1.09
            ]}
          >
            <Label position="right" angle={90} style={{ textAnchor: 'middle' }}>
              Gravity
            </Label>
          </YAxis>
          <YAxis
            yAxisId="temperature"
            unit="°C"
            domain={[
              0,
              40
              // dataMin => Math.round(dataMin) - 5,
              // dataMax => Math.round(dataMax) + 5
              // dataMin => 1.0,
              // dataMax => 1.09
            ]}
          >
            <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
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
    </React.Fragment>
  )
}
