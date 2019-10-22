import * as React from 'react'
import moment = require('moment')
import Chart, { Data } from './Chart'
import { getTemperatureLogs } from '../lib/api'
import { RAW_DATE_FORMAT, api } from '../config'
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl
} from '@material-ui/core'

import { Slider } from '@material-ui/core'

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
  selectedDownsamplingOption: string
  dataPointsNumber: number
  isFetching: boolean
}

class OverallChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: null,
      labels: null,
      hash: 123456,
      metadata: null,
      selectedDownsamplingOption: api.defaultGetOverallLogs,
      dataPointsNumber: 200,
      isFetching: false
    }
  }

  componentDidMount() {
    this.loadData(
      this.props.logFileName,
      this.state.selectedDownsamplingOption,
      this.state.dataPointsNumber
    )
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.logFileName !== this.props.logFileName) {
      this.loadData(
        nextProps.logFileName,
        this.state.selectedDownsamplingOption,
        this.state.dataPointsNumber
      )
    }
  }

  private loadData = async (
    fileName: string,
    downsamplingOption: string,
    dataPointsNumber: number
  ) => {
    this.setState(
      {
        isFetching: true
      },
      async () => {
        const rawData = await getTemperatureLogs(
          fileName,
          downsamplingOption,
          dataPointsNumber
        )

        const points = rawData.points.map(point => ({
          x: moment(point.date, RAW_DATE_FORMAT).format('HH:mm:ss'),
          y: point.temperature
        }))

        this.setState({
          data: [
            {
              points: points,
              label: 'Temperature'
              // borderColor: '#4070FF',
              // backgroundColor: '#3D8CFF'
            }
          ],
          hash: rawData.hash,
          labels: points.map(point => point.x),
          metadata: rawData.metadata,
          isFetching: false
        })
      }
    )
  }

  private handleRadioChange = event => {
    this.setState({ selectedDownsamplingOption: event.target.value }, () => {
      this.loadData(
        this.props.logFileName,
        this.state.selectedDownsamplingOption,
        this.state.dataPointsNumber
      )
    })
  }

  private onDataPointsNumberChange = (
    event: React.ChangeEvent<{}>,
    dataPointsNumber: number
  ) => {
    this.setState({
      dataPointsNumber
    })
  }
  private onDataPointsNumberChangeEnd = event => {
    console.log('fire!', this.state.dataPointsNumber)
    this.loadData(
      this.props.logFileName,
      this.state.selectedDownsamplingOption,
      this.state.dataPointsNumber
    )
  }

  render() {
    if (!this.state.data || !this.state.labels || !this.state.metadata) {
      return null
    }

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

    return (
      <>
        <Chart
          data={this.state.data}
          labels={this.state.labels}
          showPoints={false}
          title={'Overall temperature (downsampled)'}
          hash={this.state.hash}
          yAxis={{
            label: 'Temperature',
            maxValue: this.state.metadata.maxTemp + 3,
            minValue: this.state.metadata.minTemp - 3
          }}
        />
        <div className="columns is-vcentered" style={{ margin: 10 }}>
          <div className="column is-2">
            <span>Downsampling algorithm</span>
          </div>
          <div className="column is-4">
            <FormControl
              component="fieldset"
              variant="filled"
              margin="none"
              disabled={this.state.isFetching}
            >
              <RadioGroup
                row={true}
                aria-label="downsampling method"
                name="ds1"
                value={this.state.selectedDownsamplingOption}
                onChange={this.handleRadioChange}
              >
                {Radios}
              </RadioGroup>
            </FormControl>
          </div>
          <div className="column is-2">
            <span>Number of points: {this.state.dataPointsNumber}</span>
          </div>
          <div className="column is-4">
            <Slider
              disabled={
                this.state.isFetching ||
                this.state.selectedDownsamplingOption === 'raw'
              }
              min={100}
              max={1000}
              step={100}
              value={this.state.dataPointsNumber}
              onChange={this.onDataPointsNumberChange as any}
              onChangeCommitted={this.onDataPointsNumberChangeEnd}
            />
          </div>
        </div>
      </>
    )
  }
}

export default OverallChart
