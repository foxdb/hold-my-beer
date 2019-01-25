import * as React from 'react'

// import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'

import {
  Point,
  getRecentTemperatureLogs,
  getOverallTemperatureLogs,
} from '../lib/api'

import Overview from '../components/Overview'
import MinMaxChart from '../components/MinMaxChart'
import LastHoursChart from '../components/LastHoursChart'
import { api } from '../config'

interface Props {
  name: string
}

interface State {
  recentPoints?: Point[]
  overallPoints?: Point[]
  overallHash: number
  metadata?: {
    minTemp: number
    maxTemp: number
    startDate: string
    lastValue: Point
  }
  selectedDownsamplingOption: string
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      overallHash: 123456,
      selectedDownsamplingOption: api.defaultGetOverallLogs,
    }
  }

  private loadRecentPoints = async () => {
    const data = await getRecentTemperatureLogs()
    this.setState({
      recentPoints: data.points,
    })
  }

  private loadOverallPoints = async downsamplingOption => {
    const data = await getOverallTemperatureLogs(downsamplingOption)
    this.setState({
      metadata: {
        minTemp: data.metadata.minTemp,
        maxTemp: data.metadata.maxTemp,
        startDate: data.points[0].date,
        lastValue: data.points[data.points.length - 1],
      },
      overallPoints: data.points,
      overallHash: data.hash,
    })
  }

  public loadData = async downsamplingOption => {
    await Promise.all([
      this.loadRecentPoints(),
      this.loadOverallPoints(downsamplingOption),
    ])
  }

  public async componentDidMount() {
    this.loadData(this.state.selectedDownsamplingOption)
  }

  public refresh = async () => {
    this.loadData(this.state.selectedDownsamplingOption)
  }

  private handleRadioChange = event => {
    this.setState({ selectedDownsamplingOption: event.target.value }, () => {
      this.refresh()
    })
  }

  public render() {
    // if (this.state.isLoading) {
    //   return (
    //     <div
    //       style={{
    //         textAlign: 'center',
    //         backgroundColor: 'white',
    //         margin: 0,
    //         position: 'absolute',
    //         top: 'calc(50% - 25px)',
    //         left: 'calc(50% - 25px)',
    //         transform: 'translateY(-50%)',
    //       }}
    //     >
    //       <CircularProgress size={50} />
    //       <br />
    //       {this.state.overallPoints && (
    //         <span>Datapoints: {this.state.overallPoints.length}</span>
    //       )}
    //     </div>
    //   )
    // }

    const Radios = api.selectGetOverallLogs.map((option, idx) => (
      <Radio
        key={idx}
        value={option}
        name={option}
        checked={this.state.selectedDownsamplingOption === option}
        onChange={this.handleRadioChange}
      />
    ))

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
          <Overview metadata={this.state.metadata} />

          <Button
            variant="contained"
            color="primary"
            onClick={this.refresh}
            // disabled={this.state.isLoading}
            style={{ margin: 10, padding: 10 }}
          >
            Refresh
          </Button>

          {this.state.recentPoints && (
            <LastHoursChart points={this.state.recentPoints} />
          )}

          <div>{Radios}</div>
          {this.state.overallPoints && (
            <MinMaxChart
              points={this.state.overallPoints}
              hash={this.state.overallHash}
            />
          )}
        </div>
      </div>
    )
  }
}

export default Home
