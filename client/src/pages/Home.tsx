import * as React from 'react'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Slider from '@material-ui/lab/Slider'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import {
  Point,
  getRecentTemperatureLogs,
  getTemperatureLogs,
  getLogFiles,
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
  selectedLogFile: string | undefined
  dataPointsNumber: number
  isFetching: boolean
  logFiles: { fileName: string; lastModified: Date }[] // TODO: use lastModified everywhere
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      overallHash: 123456,
      selectedDownsamplingOption: api.defaultGetOverallLogs,
      dataPointsNumber: 2500,
      isFetching: false,
      logFiles: [],
      selectedLogFile: undefined,
    }
  }

  private loadRecentPoints = async (fileName: string) => {
    const data = await getRecentTemperatureLogs(fileName)
    this.setState({
      recentPoints: data.points,
    })
  }

  private loadOverallPoints = async (
    fileName: string,
    downsamplingOption,
    dataPointsNumber
  ) => {
    const data = await getTemperatureLogs(
      fileName,
      downsamplingOption,
      dataPointsNumber
    )
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

  private loadLogFileOptions = async () => {
    const data = await getLogFiles()
    console.log(data)
    this.setState({
      logFiles: data.logFiles
        .map(lf => ({
          fileName: lf.fileName,
          lastModified: new Date(lf.lastModified),
        }))
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()),
    })
  }

  public loadData = async () => {
    this.setState(
      {
        isFetching: true,
      },
      async () => {
        await this.loadLogFileOptions()
        // TODO: clean up in there
        let loadLogFile = this.state.logFiles[0].fileName // default
        if (this.state.selectedLogFile) {
          loadLogFile = this.state.selectedLogFile
        }
        await Promise.all([
          this.loadRecentPoints(loadLogFile),
          this.loadOverallPoints(
            loadLogFile,
            this.state.selectedDownsamplingOption,
            this.state.dataPointsNumber
          ),
        ])
        this.setState({
          isFetching: false,
          selectedLogFile: loadLogFile,
        })
      }
    )
  }

  public async componentDidMount() {
    this.loadData()
  }

  public refresh = async () => {
    this.loadData()
  }

  private handleRadioChange = event => {
    this.setState({ selectedDownsamplingOption: event.target.value }, () => {
      this.refresh()
    })
  }

  private onDataPointsNumberChange = (event, dataPointsNumber: number) => {
    this.setState({
      dataPointsNumber,
    })
  }
  private onDataPointsNumberChangeEnd = event => {
    console.log('fire!', this.state.dataPointsNumber)
    this.loadData()
  }

  private onLogFileChange = event => {
    this.setState(
      {
        selectedLogFile: event.target.value,
      },
      () => {
        this.loadData()
      }
    )
  }

  public render() {
    const Radios = api.selectGetOverallLogs.map((option, idx) => (
      <FormControlLabel
        key={idx}
        value={option}
        label={option.replace('overallTemperature', '')}
        control={<Radio />}
      />
    ))

    const LogFileOptions = this.state.logFiles.map((logFile, idx) => (
      <MenuItem key={idx} value={logFile.fileName}>
        {logFile.fileName}
      </MenuItem>
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
          <Select
            value={this.state.selectedLogFile}
            onChange={this.onLogFileChange}
          >
            {LogFileOptions}
          </Select>

          {this.state.recentPoints && (
            <LastHoursChart points={this.state.recentPoints} />
          )}

          {this.state.overallPoints && (
            <MinMaxChart
              points={this.state.overallPoints}
              hash={this.state.overallHash}
            />
          )}
          <div className="columns is-vcentered" style={{ width: '100%' }}>
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
        </div>
      </div>
    )
  }
}

export default Home
