import * as React from 'react'

import { getTemperatureLogs } from '../lib/api'

interface Props {
  name: string
}

class Home extends React.Component<Props, never> {
  constructor(props: Props) {
    super(props)
  }

  public async componentDidMount() {
    const temp = await getTemperatureLogs()
    console.log(temp)
  }

  public render() {
    return <div>{`Oh, hi ${this.props.name}!`}</div>
  }
}

export default Home
