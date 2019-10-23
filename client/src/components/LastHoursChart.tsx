import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from 'recharts'
import Title from './Title'
import { getRecentTemperatureLogs } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'
import moment = require('moment')

interface Props {
  logFileName: string
}

interface Point {
  date: string
  temperature: number
}

export default function Chart(props: Props) {
  const [points, setPoints] = React.useState<Point[]>([])

  const getPoints = async (fileName: string) => {
    const rawData = await getRecentTemperatureLogs(fileName)

    const points: Point[] = rawData.points.map(point => ({
      date: moment(point.date, RAW_DATE_FORMAT).format('HH:mm'),
      temperature: point.temperature
    }))

    setPoints(points)
  }

  React.useEffect(() => {
    getPoints(props.logFileName)
  }, [props.logFileName])

  return (
    <React.Fragment>
      <Title>Latest hours</Title>
      <ResponsiveContainer>
        <LineChart
          data={points}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24
          }}
        >
          <XAxis dataKey="date" />
          <YAxis
            unit="°C"
            domain={[
              dataMin => Math.round(dataMin) - 2,
              dataMax => Math.round(dataMax) + 1
            ]}
          >
            <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
              Temp. (°C)
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#556CD6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
