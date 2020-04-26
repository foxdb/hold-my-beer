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
import { getGravityLog } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'
import moment = require('moment')

interface Props {
  logFileName: string
}

interface Point {
  date: string
  gravity: number
}

export default function Chart(props: Props) {
  const [points, setPoints] = React.useState<Point[]>([])

  const getPoints = async (fileName: string) => {
    const rawData = await getGravityLog(fileName)

    const points: Point[] = rawData.points.map(point => ({
      date: moment(point.date, RAW_DATE_FORMAT).format('HH:mm'),
      gravity: point.gravity
    }))

    setPoints(points)
  }

  React.useEffect(() => {
    getPoints(props.logFileName)
  }, [props.logFileName])

  return (
    <React.Fragment>
      <Title>Specific Gravity</Title>
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
            unit=""
            domain={[
              dataMin => Math.round(dataMin) - 0.1,
              dataMax => Math.round(dataMax) + 0.1
            ]}
          >
            <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
              SG
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="gravity"
            stroke="#556CD6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
