import * as React from 'react'

import * as localForage from 'localforage'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'

import { Point, getTemperatureLogFiles } from '../lib/api'

import Overview from '../components/Overview'
import LastHoursChart from '../components/LastHoursChart'
import OverallChart from '../components/OverallChart'
import { FormControlLabel } from '@material-ui/core'

interface State {
  metadata?: {
    minTemp: number
    maxTemp: number
    startDate: string
    lastValue: Point
  }
  selectedLogFile: string | undefined
  favoriteLogFile?: string
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
    const logFileOptions = await this.loadLogFileOptions()
    const favoriteProject = await this.getFavoriteProject()

    let initialLogFile

    if (favoriteProject) {
      initialLogFile = favoriteProject
    } else if (this.state.selectedLogFile) {
      initialLogFile = this.state.selectedLogFile
    } else {
      initialLogFile = logFileOptions[0].fileName // default
    }

    this.setState({
      selectedLogFile: initialLogFile
    })
  }

  public componentDidMount() {
    this.loadData()
  }

  private getFavoriteProject = async () => {
    const favoriteProject = await localForage.getItem<string>('favoriteProject')
    if (favoriteProject) {
      this.setState({
        favoriteLogFile: favoriteProject
      })
    }
    return favoriteProject
  }

  private setFavoriteProject = async () => {
    await localForage.setItem('favoriteProject', this.state.selectedLogFile)

    this.setState({
      favoriteLogFile: this.state.selectedLogFile
    })
  }

  private onLogFileChange = event => {
    this.setState({
      selectedLogFile: event.target.value
    })
  }

  private isCurrentProjectFavorite = () => {
    return (
      this.state.favoriteLogFile &&
      this.state.selectedLogFile &&
      this.state.favoriteLogFile === this.state.selectedLogFile
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
          <div className="columns">
            <div className="column is-8">
              <Select
                value={this.state.selectedLogFile}
                onChange={this.onLogFileChange}
              >
                {LogFileOptions}
              </Select>
            </div>
            <div className="column is-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={this.isCurrentProjectFavorite() || false}
                    disabled={this.isCurrentProjectFavorite() || false}
                    onChange={this.setFavoriteProject}
                  />
                }
                label={
                  this.isCurrentProjectFavorite()
                    ? 'Favorite project!'
                    : 'Set as favorite'
                }
              />
            </div>
          </div>

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
