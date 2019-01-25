import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import Countdown from 'react-countdown-now'

import moment = require('moment')
import { RAW_DATE_FORMAT } from '../config'
import { Point } from '../lib/api'

interface Props {
  metadata?: {
    startDate: string
    lastValue: Point
  }
}

const Overview = (props: Props) => {
  return (
    <Paper style={{ margin: 10, padding: 10 }}>
      <div className="columns is-multiline">
        <div className="column is-half">
          <table className="table">
            <tbody>
              <tr>
                <th>Current</th>
                <td>
                  {props.metadata &&
                    props.metadata.lastValue.temperature +
                      ' (' +
                      moment(
                        props.metadata.lastValue.date,
                        RAW_DATE_FORMAT
                      ).format('DD MMMM - HH:mm') +
                      ')'}
                </td>
              </tr>
              <tr>
                <th>Start</th>
                <td>
                  {props.metadata &&
                    moment(props.metadata.startDate, RAW_DATE_FORMAT).format(
                      'DD MMMM - HH:mm'
                    )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column is-half">
          <table className="table">
            <tbody>
              <tr>
                <th>Bottling countdown</th>
                <td>
                  {props.metadata && (
                    <Countdown
                      date={moment(props.metadata.startDate, RAW_DATE_FORMAT)
                        .add(14, 'days')
                        .toDate()}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th>Tasting countdown</th>
                <td>
                  {props.metadata && (
                    <Countdown
                      date={moment(props.metadata.startDate, RAW_DATE_FORMAT)
                        .add(28, 'days')
                        .toDate()}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Paper>
  )
}

export default Overview
