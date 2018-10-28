import * as React from 'react'

import { getTemperatureLogs, Point } from '../lib/api'

import Overview from '../components/Overview'
import MinMaxChart from '../components/MinMaxChart'
import LastHoursChart from '../components/LastHoursChart'

interface Props {
  name: string
}

interface State {
  lastHours?: Point[]
  points?: Point[]
  minTemp?: number
  maxTemp?: number
  isLoading: boolean
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: true,
    }
  }

  public async componentDidMount() {
    const data = await getTemperatureLogs()
    this.setState({
      minTemp: data.minTemp,
      maxTemp: data.maxTemp,
      lastHours: data.lastHours,
      points: data.points,
      isLoading: false,
    })
  }

  private refresh = () => {}

  public render() {
    if (this.state.isLoading) {
      return <div />
    }

    if (
      !this.state.minTemp ||
      !this.state.maxTemp ||
      !this.state.lastHours ||
      !this.state.points
    ) {
      return <div />
    }

    const startDate = this.state.points[0].date
    const lastPoint = this.state.points[this.state.points.length - 1]

    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '10',
          marginBottom: '10',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            width: '90%',
          }}
        >
          <Overview
            startDate={startDate}
            lastTemp={lastPoint.temperature}
            lastTempDate={lastPoint.date}
          />
          <MinMaxChart points={this.state.points} />
          <LastHoursChart points={this.state.lastHours} />
        </div>
        `
      </div>
    )
  }
}

export default Home
