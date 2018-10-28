import * as React from 'react'

import moment = require('moment')
import Chart from 'chart.js'

import Paper from '@material-ui/core/Paper'

import { Point, findMinMax } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'

interface Props {
  points: Point[]
}

class LastHoursChart extends React.Component<Props, never> {
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    this.renderChart()
  }

  private renderChart = () => {
    const ctx = this.context
    if (!ctx) {
      console.error('Cannot render min max chart - canvas not found')
    }
    const data = this.props.points.map(point => ({
      x: moment(point.date, RAW_DATE_FORMAT).format('HH:mm:ss'),
      y: point.temperature,
    }))
    const minMax = findMinMax(this.props.points)

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(point => point.x),
        datasets: [
          {
            label: 'Air temperature',
            data,
            borderWidth: 1,
            fill: false,
            borderColor: '#FF7E9D',
            backgroundColor: '#FFABBF',
          },
        ],
      },
      options: {
        elements: { point: { radius: 0 } },
        responsive: true,
        title: {
          display: true,
          text:
            'Latest 300 points ' + data[0].x + ' - ' + data[data.length - 1].x,
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Temperature',
              },
              ticks: {
                suggestedMin: minMax.min - 1,
                suggestedMax: minMax.max + 1,
              },
            },
          ],
        },
      },
    })
  }

  render() {
    return (
      <Paper style={{ margin: 20, padding: 10 }}>
        <canvas
          ref={c => (this.context = c && c.getContext('2d'))}
          width="400"
          height="200"
        />
      </Paper>
    )
  }
}

export default LastHoursChart
