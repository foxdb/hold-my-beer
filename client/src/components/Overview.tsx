import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import Countdown from 'react-countdown-now'

import moment = require('moment')
import { RAW_DATE_FORMAT } from '../config'
import requestPromise = require('request-promise')

interface Props {
  startDate: string
  lastTemp: number
  lastTempDate: string
}

const Overview = (props: Props) => {
  const bottlingDate = moment(props.startDate, RAW_DATE_FORMAT).add(14, 'days')
  const tastingDate = moment(props.startDate, RAW_DATE_FORMAT).add(28, 'days')

  const startDate = moment(props.startDate, RAW_DATE_FORMAT).format(
    'DD MMMM - HH:mm'
  )

  return (
    <Paper style={{ margin: 20, padding: 10 }}>
      <div className="columns is-mobile is-gapless">
        <div className="column is-half">
          <table className="table">
            <tbody>
              <tr>
                <th>Last measure</th>
                <td>
                  {props.lastTemp} (
                  {moment(props.lastTempDate, RAW_DATE_FORMAT).format(
                    'DD MMMM - HH:mm'
                  )}
                  )
                </td>
              </tr>
              <tr>
                <th>Fermentation start</th>
                <td>{startDate}</td>
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
                  <Countdown date={bottlingDate.toDate()} />
                </td>
              </tr>
              <tr>
                <th>Tasting countdown</th>
                <td>
                  <Countdown date={tastingDate.toDate()} />
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
