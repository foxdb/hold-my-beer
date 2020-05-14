import * as React from 'react'

import Typography from '@material-ui/core/Typography'

export default function() {
  // https://github.com/foxdb/hold-my-beer
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ marginBottom: 30 }}
    >
      {'Copyright © '}
      Hold My Beer {new Date().getFullYear()}
      {'  '}
      <a href=" https://github.com/foxdb/hold-my-beer">Github</a>
    </Typography>
  )
}
