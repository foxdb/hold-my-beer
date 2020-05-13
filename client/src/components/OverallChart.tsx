import * as React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import Title from './Title'
import { getTemperatureLogs } from '../lib/api'
import { RAW_DATE_FORMAT, api } from '../config'
import moment = require('moment')
import {
  Slider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core'

interface Props {
  logFileName: string
  title?: string
}

interface Point {
  date: string
  temperature: number
}

export default function NewOverallChart(props: Props) {
  const defaultDsOption = api.selectGetOverallLogs.filter(
    option => option !== 'raw'
  )[0]

  const [points, setPoints] = React.useState<Point[]>([])
  const [isFetching, setFetching] = React.useState<boolean>(false)

  const [selectedDownsamplingOption, setDownsamplingOption] = React.useState<
    string
  >(defaultDsOption)

  const [sliderDataPoints, setSliderDataPoints] = React.useState<number>(
    api.defaultDownsamplingPoints
  )
  const [requiredDataPoints, setRequiredDataPoints] = React.useState<number>(
    api.defaultDownsamplingPoints
  )

  const getPoints = async (
    fileName: string,
    dsOption: string,
    dataPoints: number
  ) => {
    setFetching(true)
    const rawData = await getTemperatureLogs(fileName, dsOption, dataPoints)

    const points: Point[] = rawData.points.map(point => ({
      date: moment(point.date, RAW_DATE_FORMAT).format('YYYY-MM-DD HH:mm'),
      temperature: point.temperature
    }))

    setPoints(points)
    setFetching(false)
  }

  React.useEffect(() => {
    getPoints(props.logFileName, selectedDownsamplingOption, requiredDataPoints)
  }, [props.logFileName, selectedDownsamplingOption, requiredDataPoints])

  const Radios = api.selectGetOverallLogs
    .filter(option => option !== 'raw')
    .map((option, idx) => (
      <FormControlLabel
        key={idx}
        value={option}
        label={option.replace('overallTemperature', '')}
        control={<Radio />}
      />
    ))

  const onRadioChange = event => {
    setDownsamplingOption(event.target.value)
  }

  const onSliderChange = (
    event: React.ChangeEvent<{}>,
    dataPointsNumber: number
  ) => {
    setSliderDataPoints(dataPointsNumber)
  }

  const onSliderChangeCommited = event => {
    setRequiredDataPoints(sliderDataPoints)
  }

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <ResponsiveContainer height={350}>
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
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#556CD6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="columns is-vcentered" style={{ margin: 10 }}>
        <div className="column is-2">
          <span>Downsampling</span>
        </div>
        <div className="column is-4">
          <FormControl
            component="fieldset"
            variant="filled"
            margin="none"
            disabled={isFetching}
          >
            <RadioGroup
              row={true}
              aria-label="downsampling method"
              name="ds1"
              value={selectedDownsamplingOption}
              onChange={onRadioChange}
            >
              {Radios}
            </RadioGroup>
          </FormControl>
        </div>
        <div className="column is-2">
          <span>Number of points: {sliderDataPoints}</span>
        </div>
        <div className="column is-4">
          <Slider
            disabled={isFetching || selectedDownsamplingOption === 'raw'}
            min={100}
            max={1000}
            step={100}
            value={sliderDataPoints}
            onChange={onSliderChange as any}
            onChangeCommitted={onSliderChangeCommited}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
