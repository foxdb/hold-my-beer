import * as React from 'react'
import moment = require('moment')

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { RAW_DATE_FORMAT } from '../config'
import { getMetadata } from '../lib/api'
import { round } from '../lib/numbers'

const useStyles = makeStyles({
  divider: {
    marginTop: 5,
    marginBottom: 5
  },
  depositContext: {
    flex: 1
  }
})

interface Props {
  tempLogFileName: string | null
  internalTempLogFileName: string | null
  hash?: number
}

export default function LatestValues(props: Props) {
  const classes = useStyles()

  const [latestTemperature, setLatestTemperature] = React.useState<
    number | null
  >(null)
  const [latestTemperatureDate, setLatestTemperatureDate] = React.useState<
    string | null
  >(null)
  const [
    latestInternalTemperature,
    setLatestInternalTemperature
  ] = React.useState<number | null>(null)
  const [
    latestInternalTemperatureDate,
    setLatestInternalTemperatureDate
  ] = React.useState<string | null>(null)
  const [startDate, setStartDate] = React.useState<string | null>(null)

  const duration =
    startDate && latestTemperatureDate
      ? moment
          .duration(
            moment(latestTemperatureDate, RAW_DATE_FORMAT).diff(
              moment(startDate, RAW_DATE_FORMAT)
            )
          )
          .asDays()
          .toFixed(2)
      : 0

  const loadLatestTemperature = async () => {
    if (props.tempLogFileName) {
      const result = await getMetadata(props.tempLogFileName)

      setStartDate(result.metadata.start.date)
      setLatestTemperatureDate(result.metadata.last.date)
      setLatestTemperature(result.metadata.last.temperature)
    } else {
      setStartDate(null)
      setLatestTemperatureDate(null)
      setLatestTemperature(null)
    }
  }

  const loadLatestInternalTemperature = async () => {
    if (props.internalTempLogFileName) {
      const result = await getMetadata(props.internalTempLogFileName)

      setLatestInternalTemperatureDate(result.metadata.last.date)
      setLatestInternalTemperature(result.metadata.last.temperature)
    } else {
      setStartDate(null)
      setLatestInternalTemperatureDate(null)
      setLatestInternalTemperature(null)
    }
  }

  React.useEffect(() => {
    loadLatestTemperature()
  }, [props.tempLogFileName, props.hash])
  React.useEffect(() => {
    loadLatestInternalTemperature()
  }, [props.internalTempLogFileName, props.hash])

  return (
    <React.Fragment>
      <Typography component="p" variant="h5">
        {`${duration} days`}
      </Typography>
      <Typography
        color="textSecondary"
        variant="overline"
        className={classes.depositContext}
      >
        {`started on ${
          startDate
            ? moment(startDate, RAW_DATE_FORMAT).format('DD MMMM - HH:mm')
            : '-'
        }`}
      </Typography>
      <Divider className={classes.divider} />

      <Typography component="p" variant="h5">
        {`${latestTemperature ? round(latestTemperature, 1) : '-'}°C`}
      </Typography>
      <Typography
        color="textSecondary"
        variant="overline"
        className={classes.depositContext}
      >
        {`ext. temp. on ${
          latestTemperatureDate
            ? moment(latestTemperatureDate, RAW_DATE_FORMAT).format(
                'DD MMMM - HH:mm'
              )
            : '-'
        }`}
      </Typography>
      <Typography component="p" variant="h5">
        {`${
          latestInternalTemperature ? round(latestInternalTemperature, 1) : '-'
        }°C`}
      </Typography>
      <Typography
        color="textSecondary"
        variant="overline"
        className={classes.depositContext}
      >
        {`int. temp. on ${
          latestInternalTemperatureDate
            ? moment(latestInternalTemperatureDate, RAW_DATE_FORMAT).format(
                'DD MMMM - HH:mm'
              )
            : '-'
        }`}
      </Typography>
    </React.Fragment>
  )
}
