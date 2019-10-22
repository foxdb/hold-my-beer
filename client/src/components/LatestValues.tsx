import * as React from 'react'
import moment = require('moment')

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import Title from './Title'

import { RAW_DATE_FORMAT } from '../config'
import { getMetadata } from '../lib/api'

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
  logFileName: string
}

export default function LatestValues(props: Props) {
  const classes = useStyles()

  const [latestTemperature, setLatestTemperature] = React.useState<
    number | null
  >(null)
  const [latestDate, setLatestDate] = React.useState<string | null>(null)
  const [startDate, setStartDate] = React.useState<string | null>(null)

  const duration = startDate
    ? moment
        .duration(moment(new Date()).diff(moment(startDate, RAW_DATE_FORMAT)))
        .asDays()
        .toFixed(2)
    : 0

  const loadLogMetadata = async () => {
    const result = await getMetadata(props.logFileName)

    setStartDate(result.metadata.start.date)
    setLatestDate(result.metadata.last.date)
    setLatestTemperature(result.metadata.last.temperature)
  }

  React.useEffect(() => {
    loadLogMetadata()
  }, [props.logFileName])

  return (
    <React.Fragment>
      <Title>Total duration</Title>
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

      <Title>Latest reading</Title>
      <Typography component="p" variant="h4">
        {`${latestTemperature ? latestTemperature : '-'}°C`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`on ${
          latestDate
            ? moment(latestDate, RAW_DATE_FORMAT).format('DD MMMM - HH:mm')
            : '-'
        }`}
      </Typography>
    </React.Fragment>
  )
}
