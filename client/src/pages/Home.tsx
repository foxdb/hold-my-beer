import * as React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

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

  private loadData = async () => {
    const data = await getTemperatureLogs()
    this.setState({
      minTemp: data.minTemp,
      maxTemp: data.maxTemp,
      lastHours: data.lastHours,
      points: data.points,
      isLoading: false,
    })
  }

  public async componentDidMount() {
    this.loadData()
  }

  public refresh = async () => {
    this.setState({ isLoading: true }, () => this.loadData())
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <div
          style={{
            textAlign: 'center',
            backgroundColor: 'white',
            margin: 0,
            position: 'absolute',
            top: 'calc(50% - 25px)',
            left: 'calc(50% - 25px)',
            transform: 'translateY(-50%)',
          }}
        >
          <CircularProgress size={50} />
        </div>
      )
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

          <Button
            variant="contained"
            color="primary"
            onClick={this.refresh}
            disabled={this.state.isLoading}
            style={{ margin: 10, padding: 10 }}
          >
            Refresh
          </Button>

          <MinMaxChart points={this.state.points} />
          <LastHoursChart points={this.state.lastHours} />
        </div>
        `
      </div>
    )
  }
}

export default Home
