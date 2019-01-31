import * as React from 'react'

import moment = require('moment')
const Chart = require('chart.js')

import Paper from '@material-ui/core/Paper'

import { Point, findMinMax } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'

interface Props {
  points: Point[]
  hash: number
}

// TODO: make both charts use the same component, code is very similar

class LastHoursChart extends React.Component<Props, never> {
  private chart
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    this.buildChart()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hash !== this.props.hash) {
      if (!this.chart) {
        throw new Error('Cannot update chart, chart not found.')
      }

      const data = nextProps.points.map(point => ({
        x: moment(point.date, RAW_DATE_FORMAT).format('HH:mm:ss'),
        y: point.temperature,
      }))

      const minMax = findMinMax(nextProps.points)

      this.chart.data.datasets[0].data = data
      this.chart.data.labels = data.map(point => point.x)

      this.chart.options.scales.yAxes[0].ticks = {
        suggestedMin: minMax.min - 1,
        suggestedMax: minMax.max + 1,
      }

      this.chart.options.title.text =
        'Latest 300 points ' + data[0].x + ' - ' + data[data.length - 1].x
      this.chart.update()
    }
  }

  private buildChart = () => {
    const ctx = this.context
    if (!ctx) {
      console.error('Cannot render min max chart - canvas not found')
    }

    const data = this.props.points.map(point => ({
      x: moment(point.date, RAW_DATE_FORMAT).format('HH:mm:ss'),
      y: point.temperature,
    }))

    const minMax = findMinMax(this.props.points)

    this.chart = new Chart(ctx, {
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
        maintainAspectRatio: false,
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
              gridLines: {
                color: '#636363',
                drawTicks: true,
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
      <Paper style={{ margin: 10, padding: 10 }}>
        <canvas
          height="400"
          width="800"
          ref={c => (this.context = c && c.getContext('2d'))}
        />
      </Paper>
    )
  }
}

export default LastHoursChart
