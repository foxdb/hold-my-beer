import * as React from 'react'
import moment = require('moment')

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { RAW_DATE_FORMAT } from '../config'
import { getMetadata, getGravityLog } from '../lib/api'

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
  gravityLogFileName: string | null
}

export default function LatestValues(props: Props) {
  const classes = useStyles()

  const [latestTemperature, setLatestTemperature] = React.useState<
    number | null
  >(null)
  const [latestTemperatureDate, setLatestTemperatureDate] = React.useState<
    string | null
  >(null)
  const [latestGravity, setLatestGravity] = React.useState<number | null>(null)
  const [latestGravityDate, setLatestGravityDate] = React.useState<
    string | null
  >(null)
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

  const loadLatestGravity = async () => {
    if (props.gravityLogFileName) {
      const result = await getGravityLog(props.gravityLogFileName, 1)

      setLatestGravityDate(result.points[0] ? result.points[0].date : null)
      setLatestGravity(result.points[0] ? result.points[0].gravity : null)
    } else {
      setLatestGravityDate(null)
      setLatestGravity(null)
    }
  }

  React.useEffect(() => {
    loadLatestTemperature()
  }, [props.tempLogFileName])

  React.useEffect(() => {
    loadLatestGravity()
  }, [props.gravityLogFileName])

  return (
    <React.Fragment>
      <Typography component="p" variant="h4">
        {`${duration} days`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`started on ${
          startDate
            ? moment(startDate, RAW_DATE_FORMAT).format('DD MMMM - HH:mm')
            : '-'
        }`}
      </Typography>
      <Divider className={classes.divider} />

      <Typography component="p" variant="h4">
        {`${latestTemperature ? latestTemperature : '-'}°C`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`on ${
          latestTemperatureDate
            ? moment(latestTemperatureDate, RAW_DATE_FORMAT).format(
                'DD MMMM - HH:mm'
              )
            : '-'
        }`}
      </Typography>
      <Typography component="p" variant="h4">
        {`SG: ${latestGravity ? latestGravity : '-'}`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`on ${
          latestGravityDate
            ? moment(latestGravityDate, RAW_DATE_FORMAT).format(
                'DD MMMM - HH:mm'
              )
            : '-'
        }`}
      </Typography>
    </React.Fragment>
  )
}
