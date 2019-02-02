import * as React from 'react'
import moment = require('moment')
import Chart, { Data } from './Chart'
import { getRecentTemperatureLogs } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'

interface Props {
  logFileName: string
}

interface State {
  data: Data[] | null
  labels: string[] | null
  hash: number
  metadata: {
    minTemp: number
    maxTemp: number
  } | null
}

class NewLastHoursChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: null,
      labels: null,
      hash: 123456,
      metadata: null
    }
  }

  componentDidMount() {
    this.loadData(this.props.logFileName)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.logFileName !== this.props.logFileName) {
      this.loadData(nextProps.logFileName)
    }
  }

  private loadData = async fileName => {
    const rawData = await getRecentTemperatureLogs(fileName)

    const points = rawData.points.map(point => ({
      x: moment(point.date, RAW_DATE_FORMAT).format('HH:mm:ss'),
      y: point.temperature
    }))

    this.setState({
      data: [
        {
          points,
          label: 'Temperature'
        }
      ],
      hash: rawData.hash,
      labels: points.map(point => point.x),
      metadata: rawData.metadata
    })
  }

  render() {
    if (!this.state.data || !this.state.labels || !this.state.metadata) {
      return null
    }

    return (
      <Chart
        data={this.state.data}
        labels={this.state.labels}
        title={'Latest 300 points'}
        hash={this.state.hash}
        yAxis={{
          label: 'Temperature',
          maxValue: this.state.metadata.maxTemp + 1,
          minValue: this.state.metadata.minTemp - 1
        }}
      />
    )
  }
}

export default NewLastHoursChart
