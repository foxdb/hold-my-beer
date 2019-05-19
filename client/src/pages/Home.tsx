import * as React from 'react'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import { Point, getTemperatureLogFiles } from '../lib/api'

import Overview from '../components/Overview'
import LastHoursChart from '../components/LastHoursChart'
import OverallChart from '../components/OverallChart'

interface State {
  metadata?: {
    minTemp: number
    maxTemp: number
    startDate: string
    lastValue: Point
  }
  selectedLogFile: string | undefined
  logFiles: { fileName: string; lastModified: Date }[] // TODO: use lastModified everywhere
}

class Home extends React.Component<{}, State> {
  constructor(props) {
    super(props)

    this.state = {
      logFiles: [],
      selectedLogFile: undefined
    }
  }

  private loadLogFileOptions = async () => {
    const data = await getTemperatureLogFiles()

    const logFiles = data.logFiles
      .map(lf => ({
        fileName: lf.fileName,
        lastModified: new Date(lf.lastModified)
      }))
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

    this.setState({
      logFiles
    })

    return logFiles
  }

  public loadData = async () => {
    // @CleanUp
    const logFileOptions = await this.loadLogFileOptions()

    let loadLogFile = logFileOptions[0].fileName // default

    if (this.state.selectedLogFile) {
      loadLogFile = this.state.selectedLogFile
    }

    this.setState({
      selectedLogFile: loadLogFile
    })
  }

  public async componentDidMount() {
    this.loadData()
  }

  private onLogFileChange = event => {
    this.setState(
      {
        selectedLogFile: event.target.value
      },
      () => {
        this.loadData()
      }
    )
  }

  public render() {
    const LogFileOptions = this.state.logFiles.map((logFile, idx) => (
      <MenuItem key={idx} value={logFile.fileName}>
        {logFile.fileName}
      </MenuItem>
    ))

    return (
      <div
        style={{
          textAlign: 'center',
          marginBottom: '10'
        }}
      >
        <div
          style={{
            display: 'inline-block',
            width: '90%'
          }}
        >
          <Select
            value={this.state.selectedLogFile}
            onChange={this.onLogFileChange}
          >
            {LogFileOptions}
          </Select>

          {this.state.selectedLogFile && (
            <>
              <Overview logFileName={this.state.selectedLogFile} />
              <LastHoursChart logFileName={this.state.selectedLogFile} />
              <OverallChart logFileName={this.state.selectedLogFile} />
            </>
          )}
        </div>
      </div>
    )
  }
}

export default Home
