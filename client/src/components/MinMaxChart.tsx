import * as React from 'react'

import moment = require('moment')
const Chart = require('chart.js')

import Paper from '@material-ui/core/Paper'

import { Point } from '../lib/api'
import { RAW_DATE_FORMAT } from '../config'

interface Props {
  points: Point[]
}

class MinMaxChart extends React.Component<Props, never> {
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
    const data = this.props.points

    let minPoints = []
    let maxPoints = []
    let absoluteMin = 100
    let absoluteMax = 0
    let labels = []

    for (let i = 0; i < data.length; i = i + 100) {
      const subArray = data.slice(i, i + 100)

      let min = {
        x: '',
        y: 100,
      }
      let max = {
        x: '',
        y: 0,
      }

      subArray.map(entry => {
        if (entry.temperature > max.y) {
          max = { x: entry.date, y: entry.temperature }
          if (entry.temperature > absoluteMax) {
            absoluteMax = entry.temperature
          }
        }

        if (entry.temperature < min.y) {
          min = { x: entry.date, y: entry.temperature }
          if (entry.temperature < absoluteMin) {
            absoluteMin = entry.temperature
          }
        }
      })

      minPoints.push(min)
      maxPoints.push(max)
      labels.push(
        moment(subArray[0].date, RAW_DATE_FORMAT).format('MM-DD HH:mm')
      )
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Minimum',
            data: minPoints,
            borderWidth: 1,
            fill: false,
            borderColor: '#4070FF',
            backgroundColor: '#3D8CFF',
          },
          {
            label: 'Maximum',
            data: maxPoints,
            borderWidth: 1,
            fill: false,
            borderColor: '#FF7E9D',
            backgroundColor: '#FFABBF',
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text:
            moment(data[0].date, RAW_DATE_FORMAT).format('D MMMM HH:mm') +
            ' - ' +
            moment(data.slice(-1)[0].date, RAW_DATE_FORMAT).format(
              'D MMMM HH:mm'
            ),
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
          xAxes: [
            {
              ticks: {
                suggestedMin: 0,
                // suggestedMax: 100
              },
              scaleLabel: {
                display: true,
                labelString: 'Time',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                suggestedMin: absoluteMin - 3,
                suggestedMax: absoluteMax + 3,
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Temperature',
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

export default MinMaxChart
