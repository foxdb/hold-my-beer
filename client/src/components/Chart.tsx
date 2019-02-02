import * as React from 'react'

const ChartJS = require('chart.js')

import Paper from '@material-ui/core/Paper'

export interface Data {
  points: { x; y }[]
  label: string
  borderColor?: string
  backgroundColor?: string
} // TODO: colors!

interface Props {
  title: string
  xAxis?: {
    label?: string
  }
  yAxis?: {
    label?: string
    minValue?
    maxValue?
  }
  labels: string[] // an ordered array of strings, going to be used as the xAxis labels
  hash: number // change the hash to force the graph to update
  data: Data[]
  showPoints?: boolean
}

class Chart extends React.Component<Props, never> {
  private chart

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    this.buildChart(this.props)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hash !== this.props.hash) {
      if (!this.chart) {
        throw new Error('Cannot update chart, chart not found.')
      }

      this.updateChart(nextProps)
    }
  }

  private updateChart = (newProps: Props) => {
    // this is an update. some of the chart's attributes won't be updated
    // (example: axis labels)

    this.chart.data.datasets = newProps.data.map(data => ({
      label: data.label,
      data: data.points,
      borderWidth: 1,
      fill: false,
      borderColor: data.borderColor || '#FF7E9D',
      backgroundColor: data.backgroundColor || '#FFABBF'
    }))

    this.chart.data.labels = newProps.labels

    if (newProps.yAxis) {
      if (newProps.yAxis.minValue || newProps.yAxis.maxValue) {
        this.chart.options.scales.yAxes[0].ticks = {
          suggestedMin: newProps.yAxis.minValue,
          suggestedMax: newProps.yAxis.maxValue
        }
      }
    }

    this.chart.options.title.text = newProps.title
    this.chart.update()
  }

  private buildChart = (props: Props) => {
    const ctx = this.context

    if (!ctx) {
      console.error('Cannot render chart - canvas not found')
    }

    this.chart = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: props.labels,
        datasets: props.data.map(data => ({
          label: data.label,
          data: data.points,
          borderWidth: 1,
          fill: false,
          borderColor: data.borderColor || '#FF7E9D',
          backgroundColor: data.backgroundColor || '#FFABBF'
        }))
      },
      options: {
        elements: props.showPoints ? {} : { point: { radius: 0 } },
        maintainAspectRatio: false,
        title: {
          display: true,
          text: props.title
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          yAxes: props.yAxis
            ? [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: props.yAxis.label
                  },
                  gridLines: {
                    color: '#636363',
                    drawTicks: true
                  },
                  ticks: {
                    suggestedMin: props.yAxis.minValue,
                    suggestedMax: props.yAxis.maxValue
                  }
                }
              ]
            : []
        }
      }
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

export default Chart
