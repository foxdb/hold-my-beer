import * as React from 'react'
import moment = require('moment')

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { RAW_DATE_FORMAT } from '../config'
import { getGravityLog } from '../lib/api'
import { round, roundAndFormat } from '../lib/numbers'

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
  gravityLogFileName?: string
  hash?: number
}

export default function GravitySummary(props: Props) {
  const classes = useStyles()

  const [latestGravity, setLatestGravity] = React.useState<number | null>(null)
  const [firstGravity, setFirstGravity] = React.useState<number | null>(null)
  const [latestGravityDate, setLatestGravityDate] = React.useState<
    string | null
  >(null)
  const [firstGravityDate, setFirstGravityDate] = React.useState<string | null>(
    null
  )

  const loadLatestGravity = async () => {
    if (props.gravityLogFileName) {
      const lastResult = await getGravityLog(props.gravityLogFileName, {
        last: 1
      })
      const firstResult = await getGravityLog(props.gravityLogFileName, {
        first: 1
      })

      setLatestGravityDate(
        lastResult.points[0] ? lastResult.points[0].date : null
      )
      setLatestGravity(
        lastResult.points[0] ? lastResult.points[0].gravity : null
      )
      setFirstGravityDate(
        firstResult.points[0] ? firstResult.points[0].date : null
      )
      setFirstGravity(
        firstResult.points[0] ? firstResult.points[0].gravity : null
      )
    } else {
      setLatestGravityDate(null)
      setLatestGravity(null)
      setFirstGravityDate(null)
      setFirstGravity(null)
    }
  }

  React.useEffect(() => {
    loadLatestGravity()
  }, [props.gravityLogFileName, props.hash])

  const firstGravityDateText = firstGravityDate
    ? moment(firstGravityDate, RAW_DATE_FORMAT).format('DD MMMM - HH:mm')
    : '-'

  const latestGravityDateText = latestGravityDate
    ? moment(latestGravityDate, RAW_DATE_FORMAT).format('DD MMMM - HH:mm')
    : '-'

  const attenuation =
    firstGravity &&
    latestGravity &&
    round(((firstGravity - latestGravity) / (firstGravity - 1)) * 100, 1)

  const currentAbv =
    firstGravity &&
    latestGravity &&
    round((firstGravity - latestGravity) * 131.25, 1)

  return (
    <React.Fragment>
      <Typography component="p" variant="h5">
        {`${latestGravity ? roundAndFormat(latestGravity, 3) : '-'}`}
      </Typography>
      <Typography
        color="textSecondary"
        variant="overline"
        className={classes.depositContext}
      >
        {`sg on ${latestGravityDateText}`}
      </Typography>
      <Divider className={classes.divider} />
      <Typography component="p" variant="h5">
        {`${firstGravity ? roundAndFormat(firstGravity, 3) : '-'}`}
      </Typography>
      <Typography
        color="textSecondary"
        variant="overline"
        className={classes.depositContext}
      >
        {`og on ${firstGravityDateText}`}
      </Typography>

      <Typography component="p" variant="h5">
        {attenuation ? `${attenuation} %` : '-'}
        {` / `}
        {currentAbv ? `${currentAbv} %` : '-'}
      </Typography>
      <Typography
        color="textSecondary"
        variant="overline"
        className={classes.depositContext}
      >
        {`current attenuation / est. ABV`}
      </Typography>
    </React.Fragment>
  )
}
