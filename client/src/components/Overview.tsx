import * as React from 'react'

import Paper from '@material-ui/core/Paper'
// import Countdown from 'react-countdown-now'

import moment = require('moment')
import { RAW_DATE_FORMAT } from '../config'
import { Point, getMetadata } from '../lib/api'

interface Props {
  logFileName: string
}

interface State {
  metadata?: {
    start: Point
    last: Point
  }
}

class Overview extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.loadData(this.props.logFileName)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.logFileName !== this.props.logFileName) {
      this.loadData(nextProps.logFileName)
    }
  }

  private loadData = async logFileName => {
    const result = await getMetadata(logFileName)
    this.setState({
      metadata: {
        start: result.metadata.start,
        last: result.metadata.last
      }
    })
  }

  render() {
    return (
      <Paper style={{ margin: 10, padding: 10 }}>
        <div className="columns is-multiline">
          <div className="column is-6">
            <table className="table">
              <tbody>
                <tr>
                  <th>Start</th>
                  <td>
                    {this.state.metadata &&
                      moment(
                        this.state.metadata.start.date,
                        RAW_DATE_FORMAT
                      ).format('DD MMMM - HH:mm') +
                        ' @ ' +
                        this.state.metadata.start.temperature +
                        ' °C'}
                  </td>
                </tr>
                <tr>
                  <th>Last</th>
                  <td>
                    {this.state.metadata &&
                      moment(
                        this.state.metadata.last.date,
                        RAW_DATE_FORMAT
                      ).format('DD MMMM - HH:mm') +
                        ' @ ' +
                        this.state.metadata.last.temperature +
                        ' °C'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {
            <div className="column is-6">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Started </th>
                    <td>
                      {this.state.metadata &&
                        moment
                          .duration(
                            moment(new Date()).diff(
                              moment(
                                this.state.metadata.start.date,
                                RAW_DATE_FORMAT
                              )
                            )
                          )
                          .asDays()
                          .toFixed(2) + ' days ago'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
          {/* <div className="column is-4">
            <table className="table">
              <tbody>
                <tr>
                  <th>Bottling countdown</th>
                  <td>
                    {this.state.metadata && (
                      <Countdown
                        date={moment(
                          this.state.metadata.start.date,
                          RAW_DATE_FORMAT
                        )
                          .add(14, 'days')
                          .toDate()}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Tasting countdown</th>
                  <td>
                    {this.state.metadata && (
                      <Countdown
                        date={moment(
                          this.state.metadata.start.date,
                          RAW_DATE_FORMAT
                        )
                          .add(28, 'days')
                          .toDate()}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </Paper>
    )
  }
}

export default Overview
