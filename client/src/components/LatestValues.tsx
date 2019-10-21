import * as React from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Title from './Title'

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
})

interface Props {
  date: string
  externalTemperature: string
}

export default function LatestValues(props: Props) {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Title>Latest values</Title>
      <Typography component="p" variant="h4">
        {`${props.externalTemperature} °C`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {`on ${props.date}`}
      </Typography>
      <div>
        <Link color="primary" href="">
          Useless link
        </Link>
      </div>
    </React.Fragment>
  )
}
