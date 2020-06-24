import * as React from 'react'
const Emoji = props => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
    style={{ fontSize: '10em' }}
  >
    {props.symbol}
  </span>
)
export default Emoji
