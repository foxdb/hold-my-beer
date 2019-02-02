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
import Slider from '@material-ui/lab/Slider'

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
      dataPointsNumber: 2500,
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

        let minPoints: any = []
        let maxPoints: any = []
        let absoluteMin = 100
        let absoluteMax = 0
        let labels: any = []

        for (let i = 0; i < rawData.points.length; i = i + 100) {
          const subArray = rawData.points.slice(i, i + 100)

          let min = {
            x: '',
            y: 100
          }
          let max = {
            x: '',
            y: 0
          }

          subArray.map(entry => {
            if (entry.temperature > max.y) {
              max = { x: entry.date, y: entry.temperature }
              if (entry.temperature > absoluteMax) {
                absoluteMax = entry.temperature
              }
            }

            if (entry.temperature < min.y) {
              min = { x: entry.date, y: entry.temperature }
              if (entry.temperature < absoluteMin) {
                absoluteMin = entry.temperature
              }
            }
          })

          minPoints.push(min)
          maxPoints.push(max)
          labels.push(
            moment(subArray[0].date, RAW_DATE_FORMAT).format('MM-DD HH:mm')
          )
        }

        this.setState({
          data: [
            {
              points: minPoints,
              label: 'Min',
              borderColor: '#4070FF',
              backgroundColor: '#3D8CFF'
            },
            {
              points: maxPoints,
              label: 'Max',
              borderColor: '#FF7E9D',
              backgroundColor: '#FFABBF'
            }
          ],
          hash: rawData.hash,
          labels,
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

  private onDataPointsNumberChange = (event, dataPointsNumber: number) => {
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

    const Radios = api.selectGetOverallLogs.map((option, idx) => (
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
          showPoints={true}
          title={'Overall temperature min/max'}
          hash={this.state.hash}
          yAxis={{
            label: 'Temperature',
            maxValue: this.state.metadata.maxTemp + 3,
            minValue: this.state.metadata.minTemp - 3
          }}
        />
        <div className="columns is-vcentered" style={{ margin: 10 }}>
          <div className="column is-half">
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
          <div className="column is-half">
            <Slider
              disabled={
                this.state.isFetching ||
                this.state.selectedDownsamplingOption === 'raw'
              }
              min={100}
              max={5000}
              step={100}
              value={this.state.dataPointsNumber}
              onChange={this.onDataPointsNumberChange}
              onDragEnd={this.onDataPointsNumberChangeEnd}
            />
          </div>
        </div>
      </>
    )
  }
}

export default OverallChart
