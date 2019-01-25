interface Metadata {
  minTemp: number
  maxTemp: number
  inputLines: number
  validPoints: number
}

interface Point {
  temperature: number
  date: string
}

export const makePoints = (
  lines: string[],
  withIndex: boolean = false
): {
  metadata: Metadata
  points: Point[]
  indexedPoints: { x: number; y: number }[]
  dateIndex: { [index: number]: number }
} => {
  let minTemp = 50000
  let maxTemp = -50000

  let dateIndex = {}
  const indexedPoints: { x: number; y: number }[] = []

  const points = lines.reduce(
    (acc, current, index) => {
      const temp = parseFloat(current.split(',')[1])

      if (temp === null || isNaN(temp)) {
        return acc
      }

      minTemp = Math.min(minTemp, temp)
      maxTemp = Math.max(maxTemp, temp)

      const date = current.split(',')[0]

      if (withIndex) {
        dateIndex[index] = date
        indexedPoints.push({ x: index, y: temp })
      }

      acc.push({
        date,
        temperature: temp
      })

      return acc
    },
    [] as Point[]
  )

  return {
    metadata: {
      minTemp,
      maxTemp,
      inputLines: lines.length,
      validPoints: points.length
    },
    points,
    indexedPoints,
    dateIndex
  }
}
